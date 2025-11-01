import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../shared/Form';
import { useParents } from '../../hooks/useParents';
import type { Student } from '../../types';

const StudentManagement = () => {
  // --- Hooks (tất cả khai báo ở đây) ---
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const parentsHook = useParents();

  const [stops, setStops] = useState<{ value: number; label: string }[]>([]);
  const [stopsLoading, setStopsLoading] = useState(false);
  const [stopsError, setStopsError] = useState<string | null>(null);

  // --- Helpers ---
  const normalizeStudents = (raw: any[]): Student[] =>
    (raw || []).map((s: any) => {
      const ma_hs = s.ma_hs ?? s.ma_hoc_sinh ?? s.id ?? s.maHocSinh;
      const ho_ten = s.ho_ten ?? s.hoTen ?? s.name ?? '';
      return { ...s, ma_hs, ho_ten };
    });

  // Prepare parents options defensively
  const parentsOptions: { value: any; label: string }[] =
    parentsHook && Array.isArray(parentsHook.parents)
      ? parentsHook.parents.map((p: any) => ({ value: p.ma_phu_huynh ?? p.id, label: p.ho_ten ?? p.name }))
      : [];

  // --- Effects / Data fetchers ---
  useEffect(() => {
    const fetchStops = async () => {
      setStopsLoading(true);
      setStopsError(null);
      try {
        const res = await axios.get('/api/stops');
        const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setStops(raw.map((stop: any) => ({ value: stop.ma_tram ?? stop.id, label: stop.ten_tram ?? stop.name })));
      } catch (err: any) {
        setStopsError(err?.message ?? 'Không thể lấy danh sách trạm xe');
      } finally {
        setStopsLoading(false);
      }
    };

    fetchStops();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/students');
        const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setStudents(normalizeStudents(raw));
      } catch (err: any) {
        setError(err?.message ?? 'Không thể lấy danh sách học sinh');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // --- Actions ---
  const handleSubmit = async (data: any) => {
    try {
      await axios.post('/api/students', data);
      // refresh
      const res = await axios.get('/api/students');
      const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setStudents(normalizeStudents(raw));
      setShowModal(false);
    } catch (err: any) {
      alert('Lỗi thêm học sinh: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleEdit = async (student: Student) => {
    try {
      const id = student.ma_hs ?? (student as any).id;
      if (!id) throw new Error('ID học sinh không xác định');
      await axios.put(`/api/students/${id}`, student);
      const res = await axios.get('/api/students');
      const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setStudents(normalizeStudents(raw));
    } catch (err: any) {
      alert('Lỗi sửa học sinh: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (ma_hs: number) => {
    try {
      await axios.delete(`/api/students/${ma_hs}`);
      const res = await axios.get('/api/students');
      const raw = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setStudents(normalizeStudents(raw));
    } catch (err: any) {
      alert('Lỗi xóa học sinh: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleAdd = () => setShowModal(true);
  const handleCancel = () => setShowModal(false);

  // --- Build UI state (single return) ---
  // Optional debug logs - uncomment if needed
  // console.log('StudentManagement states', { loading, error, stopsLoading, stopsError, parentsHook });

  let content = null;

  if (loading) {
    content = <div className="p-8 text-center text-lg">Đang tải dữ liệu học sinh...</div>;
  } else if (error) {
    content = <div className="p-8 text-center text-red-600">Lỗi: {error}</div>;
  } else if (stopsLoading || parentsHook?.loading) {
    // show combined loading if any global data still loading
    content = <div className="p-8 text-center text-lg">Đang tải dữ liệu hệ thống...</div>;
  } else if (stopsError || parentsHook?.error) {
    content = <div className="p-8 text-center text-red-600">Lỗi hệ thống: {stopsError ?? parentsHook?.error}</div>;
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Học sinh</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm học sinh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học sinh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuyến</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có học sinh nào</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.ma_hs ?? String((student as any).id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.ma_hs}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.ho_ten}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(student as any).lop}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (student as any).trang_thai === 'hoat_dong' ? 'bg-blue-100 text-blue-800' :
                          (student as any).trang_thai === 'nghi' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(student as any).trang_thai === 'hoat_dong' ? 'Hoạt động' : (student as any).trang_thai === 'nghi' ? 'Nghỉ' : (student as any).trang_thai}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Chỉnh sửa thông tin học sinh"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.ma_hs ?? (student as any).id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <Form
                fields={[
                  { name: 'ho_ten', type: 'text', placeholder: 'Tên học sinh', required: true },
                  { name: 'lop', type: 'text', placeholder: 'Lớp', required: true },
                  { name: 'ma_phu_huynh', type: 'select', placeholder: 'Chọn phụ huynh', options: parentsOptions, required: true },
                  { name: 'ma_diem_don', type: 'select', placeholder: 'Chọn trạm đón', options: stops, required: true },
                  { name: 'ma_diem_tra', type: 'select', placeholder: 'Chọn trạm trả', options: stops, required: true },
                  { name: 'trang_thai', type: 'select', options: [{ value: 'hoat_dong', label: 'Hoạt động' }, { value: 'nghi', label: 'Nghỉ' }], required: true },
                ]}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Thêm học sinh"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Single return point
  return <div className="p-4">{content}</div>;
};

export default StudentManagement;