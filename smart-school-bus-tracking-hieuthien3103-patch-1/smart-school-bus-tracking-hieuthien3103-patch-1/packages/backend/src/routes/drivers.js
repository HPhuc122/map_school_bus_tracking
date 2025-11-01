const express = require('express');
const router = express.Router();
const driversController = require('../controllers/driversController');

router.get('/', driversController.getAll);
router.get('/:id', driversController.getById);
router.post('/', driversController.create);
router.put('/:id', driversController.update);
router.delete('/:id', driversController.delete);

module.exports = router;
