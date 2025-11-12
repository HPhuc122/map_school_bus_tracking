// frontend/src/services/api/studentService.ts
import axios from "axios";

export type Student = {
    ma_hoc_sinh: number;
    name: string;
    grade: string;
    busId: number;
};

export const studentService = {
    getStudentById: (id: string): Promise<Student> =>
        axios.get(`/api/students/${id}`).then(res => res.data),

    getStudentsByParent: (parentId: string): Promise<Student[]> =>
        axios.get(`/api/parents/${parentId}/students`).then(res => res.data),

    getAllStudents: (): Promise<Student[]> =>
        axios.get("/api/students").then(res => res.data),
};
