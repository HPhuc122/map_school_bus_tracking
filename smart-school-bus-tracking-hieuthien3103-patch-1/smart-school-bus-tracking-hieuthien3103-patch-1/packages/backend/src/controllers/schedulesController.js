// src/controllers/scheduleController.js
const Schedule = require('../models/Schedule');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/schedules
exports.getAll = async (req, res) => {
  try {
    const filters = req.query;
    const schedules = await Schedule.getAll(filters);
    return successResponse(res, schedules, 'Lấy danh sách lịch trình thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/schedules/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.getById(id);
    
    if (!schedule) {
      return errorResponse(res, 'Không tìm thấy lịch trình', 404);
    }
    
    return successResponse(res, schedule, 'Lấy chi tiết lịch trình thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/schedules/:id/students
exports.getStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await Schedule.getStudents(id);
    return successResponse(res, students, 'Lấy danh sách học sinh thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /api/schedules
exports.create = async (req, res) => {
  try {
    const data = req.body;
    const schedule = await Schedule.create(data);
    return successResponse(res, schedule, 'Tạo lịch trình thành công', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// PUT /api/schedules/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const schedule = await Schedule.update(id, data);
    return successResponse(res, schedule, 'Cập nhật lịch trình thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// PATCH /api/schedules/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;
    
    const schedule = await Schedule.update(id, { trang_thai });
    return successResponse(res, schedule, 'Cập nhật trạng thái thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /api/schedules/:id/assign-students
exports.assignStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_ids } = req.body;
    
    // TODO: Implement student assignment logic
    return successResponse(res, { message: 'Đã phân công học sinh' }, 'Phân công học sinh thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// DELETE /api/schedules/:id
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Schedule.delete(id);
    return successResponse(res, result, 'Xóa lịch trình thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/schedules/statistics
exports.getStatistics = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
  // TODO: Implement statistics logic from database
  const statistics = await getScheduleStatisticsFromDB(start_date, end_date); // Implement this function
  return successResponse(res, statistics, 'Lấy thống kê thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};