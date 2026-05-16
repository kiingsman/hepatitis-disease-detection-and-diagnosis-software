const repository = require('../data/repository');

async function createPatient(req, res, next) {
  try {
    const { fullname, age, gender, phone = '', address = '' } = req.body;

    const patientId = await repository.createPatient({ fullname, age, gender, phone, address });

    res.status(201).json({
      message: 'Patient registered successfully',
      patientId
    });
  } catch (error) {
    next(error);
  }
}

async function getPatients(req, res, next) {
  try {
    res.json(await repository.getPatients());
  } catch (error) {
    next(error);
  }
}

async function getPatientById(req, res, next) {
  try {
    const patient = await repository.getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
}

module.exports = { createPatient, getPatients, getPatientById };
