const Bus = require('../models/Bus');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
  const buses = await Bus.getAll();
  successResponse(res, buses, 'Lấy danh sách xe buýt thành công');
});

exports.getById = asyncHandler(async (req, res) => {
  const bus = await Bus.getById(req.params.id);
  if (!bus) return errorResponse(res, 'Không tìm thấy xe buýt', 404);
  successResponse(res, bus, 'Lấy chi tiết xe buýt thành công');
});

exports.create = asyncHandler(async (req, res) => {
  const newBus = await Bus.create(req.body);
  successResponse(res, newBus, 'Thêm xe buýt thành công', 201);
});

exports.update = asyncHandler(async (req, res) => {
  const updatedBus = await Bus.update(req.params.id, req.body);
  successResponse(res, updatedBus, 'Cập nhật xe buýt thành công');
});

exports.delete = asyncHandler(async (req, res) => {
  const result = await Bus.delete(req.params.id);
  successResponse(res, result, 'Xóa xe buýt thành công');
});
