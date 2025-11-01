const { successResponse, errorResponse } = require('../utils/response');
const Report = require('../models/Report');

// GET /api/reports/overview
exports.getOverview = async (req, res) => {
  try {
    const data = await Report.getOverview();
    return successResponse(res, data, 'Lấy báo cáo tổng quan thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/reports/schedules?start_date=...&end_date=...
exports.getScheduleReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const data = await Report.getScheduleReport(start_date, end_date);
    return successResponse(res, data, 'Lấy báo cáo lịch trình thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/reports/drivers
exports.getDriverPerformance = async (req, res) => {
  try {
    const data = await Report.getDriverPerformance();
    return successResponse(res, data, 'Lấy hiệu suất tài xế thành công');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
