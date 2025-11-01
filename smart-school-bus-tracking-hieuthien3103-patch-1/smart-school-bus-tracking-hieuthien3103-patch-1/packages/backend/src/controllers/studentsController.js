const Student = require('../models/Student');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// Lấy danh sách học sinh
exports.getAll = asyncHandler(async (req, res) => {
  const students = await Student.getAll();
  successResponse(res, students, 'Lấy danh sách học sinh thành công');
});

// Lấy học sinh theo ID
exports.getById = asyncHandler(async (req, res) => {
  const student = await Student.getById(req.params.id);
  if (!student) return errorResponse(res, 'Không tìm thấy học sinh', 404);
  successResponse(res, student, 'Lấy thông tin học sinh thành công');
});

// Tạo học sinh mới
exports.create = asyncHandler(async (req, res) => {
  const newStudent = await Student.create(req.body);
  successResponse(res, newStudent, 'Thêm học sinh thành công', 201);
});

// Cập nhật học sinh
exports.update = asyncHandler(async (req, res) => {
  const updatedStudent = await Student.update(req.params.id, req.body);
  successResponse(res, updatedStudent, 'Cập nhật học sinh thành công');
});

// Xóa học sinh
exports.delete = asyncHandler(async (req, res) => {
  const result = await Student.delete(req.params.id);
  successResponse(res, result, 'Xóa học sinh thành công');
});
