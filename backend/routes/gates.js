// routes/gates.js
// Gate REST Routes mapping

const express = require('express');
const router = express.Router();
const gateController = require('../controllers/gateController');

router.get('/', gateController.getAllGates);
router.get('/:id', gateController.getGateById);
router.post('/', gateController.createGate);
router.put('/:id', gateController.updateGate);
router.delete('/:id', gateController.deleteGate);

module.exports = router;
