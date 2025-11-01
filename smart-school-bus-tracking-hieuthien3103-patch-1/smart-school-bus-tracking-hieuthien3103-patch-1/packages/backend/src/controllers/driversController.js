const Driver = require('../models/Driver');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const drivers = await Driver.getAll();
  successResponse(res, drivers, 'Lấy danh sách tài xế thành công');
});

exports.getById = asyncHandler(async (req, res) => {
  const driver = await Driver.getById(req.params.id);
  if (!driver) return errorResponse(res, 'Không tìm thấy tài xế', 404);
  successResponse(res, driver, 'Lấy chi tiết tài xế thành công');
});

exports.create = asyncHandler(async (req, res) => {
  const newDriver = await Driver.create(req.body);
  successResponse(res, newDriver, 'Thêm tài xế thành công', 201);
});

exports.update = asyncHandler(async (req, res) => {
  const updatedDriver = await Driver.update(req.params.id, req.body);
  successResponse(res, updatedDriver, 'Cập nhật tài xế thành công');
});

exports.delete = asyncHandler(async (req, res) => {
  const result = await Driver.delete(req.params.id);
  successResponse(res, result, 'Xóa tài xế thành công');
});
