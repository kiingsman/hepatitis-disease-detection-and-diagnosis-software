const express = require('express');
const { createPatient, getPatients, getPatientById } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', requireFields(['fullname', 'age', 'gender']), createPatient);

module.exports = router;
