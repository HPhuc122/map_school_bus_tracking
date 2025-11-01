import { useState, useEffect, useCallback } from "react";
import type { Student } from "../types";
import studentService, {
  type StudentFilters,
  type CreateStudentDto,
  type UpdateStudentDto,
} from "../services/api/studentService";

interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  pagination:
    | {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }
    | null;

  // Actions
  fetchStudents: (filters?: StudentFilters) => Promise<void>;
  createStudent: (data: CreateStudentDto) => Promise<Student | null>;
  updateStudent: (ma_hs: number, data: UpdateStudentDto) => Promise<Student | null>;
  deleteStudent: (ma_hs: number) => Promise<boolean>;
  updateStudentStatus: (ma_hs: number, status: string) => Promise<Student | null>;
  refreshStudents: () => Promise<void>;
}

export const useStudents = (initialFilters?: StudentFilters): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const [currentFilters, setCurrentFilters] = useState<StudentFilters | undefined>(initialFilters);

  const fetchStudents = useCallback(
    async (filters?: StudentFilters) => {
      try {
        setLoading(true);
        setError(null);

        const filtersToUse = filters || currentFilters;
        setCurrentFilters(filtersToUse);

        const response = await studentService.getStudents(filtersToUse);
        // response expected shape: { data: Student[], pagination: {...} }
        setStudents(response.data ?? []);
        setPagination(response.pagination ?? null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch students");
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentFilters]
  );

  const createStudent = useCallback(
    async (data: CreateStudentDto): Promise<Student | null> => {
      try {
        setError(null);
        const newStudent = await studentService.createStudent(data);

        // Add to local state
        setStudents((prev) => [newStudent, ...prev]);

        return newStudent;
      } catch (err: any) {
        setError(err.message || "Failed to create student");
        console.error("Failed to create student:", err);
        return null;
      }
    },
    []
  );

  const updateStudent = useCallback(
    async (ma_hs: number, data: UpdateStudentDto): Promise<Student | null> => {
      try {
        setError(null);
        const updatedStudent = await studentService.updateStudent(ma_hs, data);

        // Update local state (compare by ma_hs)
        setStudents((prev) =>
          prev.map((student) => (student.ma_hs === ma_hs ? updatedStudent : student))
        );

        return updatedStudent;
      } catch (err: any) {
        setError(err.message || "Failed to update student");
        console.error("Failed to update student:", err);
        return null;
      }
    },
    []
  );

  const deleteStudent = useCallback(
    async (ma_hs: number): Promise<boolean> => {
      try {
        setError(null);
        await studentService.deleteStudent(ma_hs);

        // Remove from local state (compare by ma_hs)
        setStudents((prev) => prev.filter((student) => student.ma_hs !== ma_hs));

        return true;
      } catch (err: any) {
        setError(err.message || "Failed to delete student");
        console.error("Failed to delete student:", err);
        return false;
      }
    },
    []
  );

  const updateStudentStatus = useCallback(
    async (ma_hs: number, status: string): Promise<Student | null> => {
      try {
        setError(null);
        const updatedStudent = await studentService.updateStudentStatus(ma_hs, status);

        // Update local state (compare by ma_hs)
        setStudents((prev) =>
          prev.map((student) => (student.ma_hs === ma_hs ? updatedStudent : student))
        );

        return updatedStudent;
      } catch (err: any) {
        setError(err.message || "Failed to update student status");
        console.error("Failed to update student status:", err);
        return null;
      }
    },
    []
  );

  const refreshStudents = useCallback(async () => {
    await fetchStudents(currentFilters);
  }, [fetchStudents, currentFilters]);

  // Initial fetch
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    updateStudentStatus,
    refreshStudents,
  };
};

// Hook for real-time student updates
export const useRealtimeStudents = (busId?: number) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/students${busId ? `?busId=${busId}` : ""}`
    );

    ws.onopen = () => {
      setConnected(true);
      console.log("Connected to real-time student updates");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "student_update":
          setStudents((prev) =>
            prev.map((student) =>
              student.ma_hs === message.data.ma_hs ? message.data : student
            )
          );
          break;

        case "student_status_change":
          setStudents((prev) =>
            prev.map((student) =>
              student.ma_hs === message.data.ma_hs
                ? { ...student, trang_thai: message.data.status ?? student.trang_thai }
                : student
            )
          );
          break;

        case "students_list":
          setStudents(message.data ?? []);
          break;

        default:
          // unknown message type
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("Disconnected from real-time student updates");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [busId]);

  return { students, connected };
};