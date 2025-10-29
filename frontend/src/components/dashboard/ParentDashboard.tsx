// src/components/apps/ParentDashboard.tsx
import React, { useState, useEffect } from "react";
import { MapPin, Clock, User, Bus, Route, Phone, AlertCircle } from "lucide-react";
import MapViews from "../map/MapViews"; // sửa đường dẫn nếu cần

// --- Types (match DB fields where possible)
interface StudentAPI {
  ma_hs: number;
  ho_ten: string;
  lop?: string;
  ma_phu_huynh?: number;
  ma_diem_don?: number;
  ma_diem_tra?: number;
  trang_thai?: string; // 'hoat_dong' | 'nghi'
  ten_diem_don?: string; // nếu backend join
  ten_diem_tra?: string; // nếu backend join
  bien_so?: string; // nếu backend trả
  status_text?: string; // fallback
}

interface BusLocationAPI {
  bien_so?: string;
  vi_do?: number;
  kinh_do?: number;
  toc_do?: number;
  thoi_gian?: string;
  route?: string;
  driverName?: string;
  driverPhone?: string;
  trang_thai?: string;
}

// Local shaped data used by UI
interface StudentInfo {
  id: number;
  name: string;
  grade?: string;
  busNumber?: string;
  driverName?: string;
  driverPhone?: string;
  pickupStop?: string;
  dropoffStop?: string;
  pickupTime?: string;
  dropoffTime?: string;
  status: "at_home" | "waiting_pickup" | "on_bus" | "at_school" | "going_home";
}

const ParentDashboard: React.FC = () => {
  const [studentsData, setStudentsData] = useState<StudentAPI[]>([]);
  const [busLocation, setBusLocation] = useState<BusLocationAPI | null>(null);
  const [scheduleData, setScheduleData] = useState<any[]>([]); // nếu cần
  const [driversData, setDriversData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch students for this parent
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("Người dùng chưa đăng nhập");
      return;
    }

    const abortController = new AbortController();

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try API that frontend expects
        const res = await fetch(`http://localhost:5000/api/parents/${user.id}/students`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: abortController.signal,
        });

        const data = await res.json().catch(() => null);

        if (res.ok && Array.isArray(data)) {
          setStudentsData(data);
        } else {
          // Fallback: try generic endpoint /api/students?parentId=...
          const r2 = await fetch(`http://localhost:5000/api/students?parentId=${user.id}`, {
            headers: { "Content-Type": "application/json" },
            signal: abortController.signal,
          });
          const d2 = await r2.json().catch(() => null);
          if (r2.ok && Array.isArray(d2)) setStudentsData(d2);
          else {
            setStudentsData([]); // empty
            console.warn("students endpoint returned unexpected:", data, d2);
          }
        }
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error(err);
        setError("Không thể tải danh sách học sinh.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    return () => abortController.abort();
  }, [user?.id, token]);

  // When studentsData available, fetch bus location for the first child
  useEffect(() => {
    if (!studentsData || studentsData.length === 0) return;

    let mounted = true;
    const first = studentsData[0];
    const fetchBusForStudent = async () => {
      try {
        // Try endpoint that returns latest vitrixe for student's assigned bus:
        const res = await fetch(`http://localhost:5000/api/students/${first.ma_hs}/location`, {
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const d = await res.json().catch(() => null);
        if (res.ok && d) {
          if (mounted) setBusLocation(d);
          return;
        }

        // Fallback 1: If student entry includes bien_so or ma_xe
        if (first.bien_so) {
          // try to get latest position by bus number
          const r2 = await fetch(`http://localhost:5000/api/vehicles/position?bien_so=${encodeURIComponent(first.bien_so)}`, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          });
          const d2 = await r2.json().catch(() => null);
          if (r2.ok && d2) {
            if (mounted) setBusLocation(d2);
            return;
          }
        }

        // Fallback 2: call route API to get assigned vehicle
        const r3 = await fetch(`http://localhost:5000/api/students/${first.ma_hs}/route`, {
          headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const d3 = await r3.json().catch(() => null);
        if (r3.ok && d3?.bus) {
          if (mounted) setBusLocation(d3.bus);
          return;
        }

        // If reached here, no detailed bus info available -> leave null
        if (mounted) setBusLocation(null);
      } catch (err) {
        console.warn("Không tải được vị trí xe cho học sinh:", err);
      }
    };

    fetchBusForStudent();
    return () => { mounted = false; };
  }, [studentsData, token]);

  // small helper to map student's status to our ui enum
  const mapStatus = (s?: string) => {
    if (!s) return "at_home";
    if (s === "hoat_dong") return "at_school";
    if (s === "nghi") return "at_home";
    // if backend provides textual statuses, try to map
    if (s.toLowerCase().includes("da len") || s.toLowerCase().includes("on")) return "on_bus";
    if (s.toLowerCase().includes("cho")) return "waiting_pickup";
    return "at_home";
  };

  // build displayStudentInfo for UI (use first child for now)
  const currentStudentRaw = studentsData[0] || null;
  const displayStudentInfo: StudentInfo = currentStudentRaw
    ? {
        id: currentStudentRaw.ma_hs,
        name: currentStudentRaw.ho_ten,
        grade: currentStudentRaw.lop || "",
        busNumber: currentStudentRaw.bien_so || (busLocation && busLocation.bien_so) || "---",
        driverName: busLocation?.driverName || (currentStudentRaw as any).tai_xe || "N/A",
        driverPhone: busLocation?.driverPhone || (currentStudentRaw as any).so_dien_thoai || "0123456789",
        pickupStop: currentStudentRaw.ten_diem_don || "Chưa có",
        dropoffStop: currentStudentRaw.ten_diem_tra || "Chưa có",
        pickupTime: (scheduleData[0]?.gio_bat_dau) || "07:15",
        dropoffTime: (scheduleData[0]?.gio_ket_thuc) || "16:30",
        status: mapStatus(currentStudentRaw.trang_thai),
      }
    : {
        id: 0,
        name: "Chưa có thông tin",
        grade: "---",
        busNumber: "---",
        driverName: "---",
        driverPhone: "N/A",
        pickupStop: "---",
        dropoffStop: "---",
        pickupTime: "--:--",
        dropoffTime: "--:--",
        status: "at_home",
      };

  // busLocation UI shaping
  const displayBusLocation = busLocation
    ? {
        busNumber: busLocation.bien_so || "N/A",
        currentLocation: busLocation.route || `${busLocation.vi_do ?? ""}, ${busLocation.kinh_do ?? ""}`,
        distanceToPickup: 0.8, // can compute via geolocation later
        distanceToDropoff: 5.2,
        estimatedPickupTime: "≈ 7:15",
        estimatedDropoffTime: "≈ 16:30",
        isOnRoute: (busLocation.trang_thai || "").toLowerCase().includes("di") || true,
        lastUpdated: busLocation.thoi_gian ? new Date(busLocation.thoi_gian).toLocaleString() : "Chưa cập nhật",
      }
    : {
        busNumber: "---",
        currentLocation: "Chưa có thông tin vị trí",
        distanceToPickup: 0,
        distanceToDropoff: 0,
        estimatedPickupTime: "--:--",
        estimatedDropoffTime: "--:--",
        isOnRoute: false,
        lastUpdated: "Chưa cập nhật",
      };

  // alert rules
  const shouldShowPickupAlert = displayBusLocation.distanceToPickup <= 1 && displayBusLocation.distanceToPickup > 0;
  const shouldShowDropoffAlert = displayBusLocation.distanceToDropoff <= 1 && displayBusLocation.distanceToDropoff > 0;

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3 rounded-full"></div>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Chào mừng, Phụ huynh! 👋</h1>
        <p className="text-blue-100">Theo dõi hành trình đến trường của con bạn</p>
      </div>

      {/* Alert Notifications */}
      {shouldShowPickupAlert && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-medium">🚌 Xe buýt sắp đến điểm đón!</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Xe {displayBusLocation.busNumber} cách điểm đón {displayBusLocation.distanceToPickup.toFixed(1)}km,
                dự kiến đến lúc {displayBusLocation.estimatedPickupTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {shouldShowDropoffAlert && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h3 className="text-green-800 font-medium">🏫 Xe buýt sắp đến trường!</h3>
              <p className="text-green-700 text-sm mt-1">
                Xe {displayBusLocation.busNumber} cách trường {displayBusLocation.distanceToDropoff.toFixed(1)}km,
                dự kiến đến lúc {displayBusLocation.estimatedDropoffTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{displayStudentInfo.name}</h2>
                <p className="text-gray-600">{displayStudentInfo.grade}</p>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${displayStudentInfo.status === 'on_bus' ? 'text-blue-600 bg-blue-100' : displayStudentInfo.status === 'waiting_pickup' ? 'text-yellow-600 bg-yellow-100' : displayStudentInfo.status === 'at_school' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}>
              {displayStudentInfo.status === 'on_bus' ? <Bus className="h-4 w-4" /> : displayStudentInfo.status === 'waiting_pickup' ? <Clock className="h-4 w-4" /> : <User className="h-4 w-4" />}
              <span>{displayStudentInfo.status === 'on_bus' ? 'Đang trên xe' : displayStudentInfo.status === 'waiting_pickup' ? 'Chờ xe đón' : displayStudentInfo.status === 'at_school' ? 'Đã đến trường' : 'Đang ở nhà'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bus Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Bus className="h-5 w-5 mr-2 text-blue-600" />
              Thông tin xe buýt
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số xe:</span>
                <span className="font-medium text-gray-900">{displayStudentInfo.busNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tài xế:</span>
                <span className="font-medium text-gray-900">{displayStudentInfo.driverName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Điện thoại:</span>
                <a
                  href={`tel:${displayStudentInfo.driverPhone}`}
                  className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  {displayStudentInfo.driverPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Route className="h-5 w-5 mr-2 text-green-600" />
              Lộ trình
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Điểm đón:</span>
                  <span className="text-xs text-gray-500">{displayStudentInfo.pickupTime}</span>
                </div>
                <p className="font-medium text-gray-900">{displayStudentInfo.pickupStop}</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Điểm trả:</span>
                  <span className="text-xs text-gray-500">{displayStudentInfo.dropoffTime}</span>
                </div>
                <p className="font-medium text-gray-900">{displayStudentInfo.dropoffStop}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracking */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              Vị trí xe buýt (Real-time)
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">{displayBusLocation.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Vị trí hiện tại:</span>
              <span className="font-medium text-gray-900">{displayBusLocation.currentLocation}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Cách điểm đón:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {displayBusLocation.distanceToPickup.toFixed(1)} km
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(10, 100 - (displayBusLocation.distanceToPickup * 20))}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Dự kiến: {displayBusLocation.estimatedPickupTime}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Cách điểm trả:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {displayBusLocation.distanceToDropoff.toFixed(1)} km
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(10, 100 - (displayBusLocation.distanceToDropoff * 10))}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Dự kiến: {displayBusLocation.estimatedDropoffTime}</p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-600" />
                  Bản đồ theo dõi xe buýt
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Cập nhật mới nhất</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
                <MapViews />
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-500 text-sm mb-4">
                  Hiển thị vị trí xe buýt và lộ trình di chuyển real-time
                </p>
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Xe buýt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Điểm đón/trả</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Vị trí hiện tại</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
