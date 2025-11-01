const express = require('express');
const router = express.Router();
const busesController = require('../controllers/busesController');

router.get('/', busesController.getAll);
router.get('/:id', busesController.getById);
router.post('/', busesController.create);
router.put('/:id', busesController.update);
router.delete('/:id', busesController.delete);

module.exports = router;
