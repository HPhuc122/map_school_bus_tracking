// src/routes/schedules.js
const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedulesController'); // ← CHECK PATH
// const { authenticate, authorize } = require('../middleware/auth'); // Tạm comment nếu chưa có

// Routes
router.get('/', schedulesController.getAll);
router.get('/:id', schedulesController.getById);
router.get('/:id/students', schedulesController.getStudents);
router.post('/', schedulesController.create);
router.put('/:id', schedulesController.update);
router.patch('/:id/status', schedulesController.updateStatus);
router.post('/:id/assign-students', schedulesController.assignStudents);
router.delete('/:id', schedulesController.delete);

module.exports = router;