import type { Student } from '../../types';
import { apiClient, type PaginatedResponse } from './client';
import { ENDPOINTS } from './config';

// Student DTOs
export interface CreateStudentDto {
  name: string;
  grade: string;
  school_id: number;
  route_id?: number;
  pickup_stop_id?: number;
  dropoff_stop_id?: number;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  emergency_contact?: string;
  medical_notes?: string;
  status?: 'active' | 'inactive' | 'transferred';
}

export interface UpdateStudentDto {
  name?: string;
  grade?: string;
  school_id?: number;
  route_id?: number;
  pickup_stop_id?: number;
  dropoff_stop_id?: number;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  medical_notes?: string;
  status?: 'active' | 'inactive' | 'transferred';
}

export interface StudentFilters {
  schoolId?: number;
  routeId?: number;
  busId?: number;
  grade?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class StudentService {
  // Get all students with optional filters
  async getStudents(filters?: StudentFilters): Promise<PaginatedResponse<Student>> {
    return apiClient.getPaginated<Student>(ENDPOINTS.STUDENTS.BASE, filters);
  }

  // Get student by ID
  async getStudentById(id: number): Promise<Student> {
    return apiClient.get<Student>(ENDPOINTS.STUDENTS.BY_ID(id));
  }

  // Get students by route
  async getStudentsByRoute(routeId: number): Promise<Student[]> {
    return apiClient.get<Student[]>(ENDPOINTS.STUDENTS.BY_ROUTE(routeId));
  }

  // Get students by school
  async getStudentsBySchool(schoolId: number): Promise<Student[]> {
    return apiClient.get<Student[]>(ENDPOINTS.STUDENTS.BY_SCHOOL(schoolId));
  }

  // Get students by bus
  async getStudentsByBus(busId: number): Promise<Student[]> {
    return apiClient.get<Student[]>(ENDPOINTS.STUDENTS.BY_BUS(busId));
  }

  // Get students by driver
  async getStudentsByDriver(driverId: number): Promise<Student[]> {
    return apiClient.get<Student[]>(ENDPOINTS.STUDENTS.BY_DRIVER(driverId));
  }

  // Create new student
  async createStudent(studentData: CreateStudentDto): Promise<Student> {
    return apiClient.post<Student>(ENDPOINTS.STUDENTS.BASE, studentData);
  }

  // Update student
  async updateStudent(id: number, updates: UpdateStudentDto): Promise<Student> {
    return apiClient.put<Student>(ENDPOINTS.STUDENTS.BY_ID(id), updates);
  }

  // Update student status (for check-in/check-out)
  async updateStudentStatus(id: number, status: string): Promise<Student> {
    return apiClient.patch<Student>(
      `${ENDPOINTS.STUDENTS.BY_ID(id)}/status`, 
      { status }
    );
  }

  // Delete student
  async deleteStudent(id: number): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.STUDENTS.BY_ID(id));
  }

  // Assign student to route
  async assignStudentToRoute(studentId: number, routeId: number, pickupStopId: number, dropoffStopId: number): Promise<Student> {
    return apiClient.post<Student>(
      `${ENDPOINTS.STUDENTS.BY_ID(studentId)}/assign-route`,
      { routeId, pickupStopId, dropoffStopId }
    );
  }

  // Unassign student from route
  async unassignStudentFromRoute(studentId: number): Promise<Student> {
    return apiClient.delete<Student>(`${ENDPOINTS.STUDENTS.BY_ID(studentId)}/unassign-route`);
  }

  // Search students
  async searchStudents(query: string, filters?: Omit<StudentFilters, 'search'>): Promise<Student[]> {
    const searchFilters = { ...filters, search: query };
    const response = await this.getStudents(searchFilters);
    return response.data;
  }

  // Bulk operations
  async bulkUpdateStatus(studentIds: number[], status: string): Promise<Student[]> {
    return apiClient.post<Student[]>(
      `${ENDPOINTS.STUDENTS.BASE}/bulk-status`, 
      { studentIds, status }
    );
  }

  // Import students from CSV/Excel
  async importStudents(file: File, onProgress?: (progress: number) => void): Promise<{ 
    created: number; 
    updated: number; 
    errors: string[]; 
  }> {
    return apiClient.uploadFile<{ 
      created: number; 
      updated: number; 
      errors: string[]; 
    }>(`${ENDPOINTS.STUDENTS.BASE}/import`, file, onProgress);
  }

  // Export students to CSV
  async exportStudents(filters?: StudentFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    // Use apiClient for proper authentication handling
    const response = await apiClient.get<Blob>(
      `${ENDPOINTS.STUDENTS.BASE}/export?${params}`,
      { responseType: 'blob' }
    );
    
    return response;
  }

  // Get student attendance history
  async getAttendanceHistory(
    studentId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<{
    date: string;
    status: string;
    checkInTime?: string;
    checkOutTime?: string;
  }[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return apiClient.get<{
      date: string;
      status: string;
      checkInTime?: string;
      checkOutTime?: string;
    }[]>(`${ENDPOINTS.STUDENTS.BY_ID(studentId)}/attendance?${params}`);
  }
}

// Create singleton instance
export const studentService = new StudentService();
export default studentService;