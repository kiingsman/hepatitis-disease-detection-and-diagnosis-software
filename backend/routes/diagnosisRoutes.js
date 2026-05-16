const express = require('express');
const { createDiagnosis, getDiagnoses, getDiagnosisById } = require('../controllers/diagnosisController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/', getDiagnoses);
router.get('/:id', getDiagnosisById);
router.post('/', requireFields(['patient_id']), createDiagnosis);

module.exports = router;
