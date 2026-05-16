const repository = require('../data/repository');
const { detectHepatitis, toBoolean } = require('../utils/diagnosisEngine');

async function createDiagnosis(req, res, next) {
  try {
    const { patient_id } = req.body;

    const symptoms = {
      fever: toBoolean(req.body.fever),
      fatigue: toBoolean(req.body.fatigue),
      jaundice: toBoolean(req.body.jaundice),
      abdominal_pain: toBoolean(req.body.abdominal_pain),
      dark_urine: toBoolean(req.body.dark_urine),
      nausea: toBoolean(req.body.nausea)
    };
    const diagnosis = detectHepatitis(symptoms);

    const diagnosisId = await repository.createDiagnosis({
      patient_id,
      ...symptoms,
      result: diagnosis.result,
      recommendation: diagnosis.recommendation,
      score: diagnosis.score
    });

    if (!diagnosisId) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(201).json({
      message: 'Diagnosis saved successfully',
      diagnosisId,
      ...diagnosis
    });
  } catch (error) {
    next(error);
  }
}

async function getDiagnoses(req, res, next) {
  try {
    res.json(await repository.getDiagnoses());
  } catch (error) {
    next(error);
  }
}

async function getDiagnosisById(req, res, next) {
  try {
    const diagnosis = await repository.getDiagnosisById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }

    res.json(diagnosis);
  } catch (error) {
    next(error);
  }
}

module.exports = { createDiagnosis, getDiagnoses, getDiagnosisById };
