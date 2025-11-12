// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

type Role = "parent" | "driver" | "admin";

interface User {
  id: number;
  name: string;
  phone?: string;
  role: Role;
  token?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (savedUser && token) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  /**
   * login(username, password, role)
   * role: 'parent' | 'driver' | 'admin'
   */
  const login = async (username: string, password: string, role: Role = "parent"): Promise<boolean> => {
    try {
      // map role -> endpoint
      let loginUrl = "http://localhost:5000/api/parents/login";
      if (role === "driver") loginUrl = "http://localhost:5000/api/driver/login";
      if (role === "admin") loginUrl = "http://localhost:5000/api/admin/login";

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          role === "parent"
            ? { tai_khoan: username, mat_khau: password }
            : role === "driver"
              ? { tai_khoan: username, mat_khau: password }
              : { tai_khoan: username, mat_khau: password }
        ),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn("Login failed", data);
        return false;
      }

      // Expect data to contain token and user-like object; adapt according to backend shape
      // For parents backend we expect { token, parent: { ma_phu_huynh, ho_ten, so_dien_thoai } }
      // For drivers maybe { token, driver: {...} } or similar. We'll handle common shapes.
      const token = data.token || data.accessToken || null;

      let parsedUser: User | null = null;

      if (role === "parent" && data.parent) {
        parsedUser = {
          id: data.parent.ma_phu_huynh,
          name: data.parent.ho_ten,
          phone: data.parent.so_dien_thoai,
          role: "parent",
          token,
        };
      } else if (role === "driver" && data.driver) {
        parsedUser = {
          id: data.driver.ma_tai_xe,
          name: data.driver.ho_ten,
          phone: data.driver.so_dien_thoai,
          role: "driver",
          token,
        };
      } else if (role === "admin" && data.admin) {
        parsedUser = {
          id: data.admin.ma_ql,
          name: data.admin.ho_ten,
          phone: data.admin.so_dien_thoai,
          role: "admin",
          token,
        };
      } else {
        // Fallback try to detect object
        const rawUser =
          data.parent || data.driver || data.admin || data.user || data;
        if (rawUser && (rawUser.ma_phu_huynh || rawUser.ma_tai_xe || rawUser.ma_ql)) {
          parsedUser = {
            id: rawUser.ma_phu_huynh || rawUser.ma_tai_xe || rawUser.ma_ql || rawUser.id,
            name: rawUser.ho_ten || rawUser.name || "Người dùng",
            phone: rawUser.so_dien_thoai || rawUser.phone,
            role,
            token,
          };
        } else if (token) {
          parsedUser = {
            id: -1,
            name: "Người dùng",
            role,
            token,
          };
        }
      }

      if (!token || !parsedUser) {
        console.warn("Login succeeded but response shape unexpected", data);
        // treat as failure
        return false;
      }

      // Save
      setUser(parsedUser);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(parsedUser));
      return true;
    } catch (err) {
      console.error("Login error", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
}
