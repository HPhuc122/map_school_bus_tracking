const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/overview', reportsController.getOverview);
router.get('/schedules', reportsController.getScheduleReport);
router.get('/drivers', reportsController.getDriverPerformance);

module.exports = router;
