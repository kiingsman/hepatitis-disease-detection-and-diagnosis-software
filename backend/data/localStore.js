const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataFile = path.join(__dirname, 'localDb.json');

const defaultData = {
  users: [],
  patients: [],
  diagnosis: [],
  counters: {
    users: 1,
    patients: 1,
    diagnosis: 1
  }
};

async function readData() {
  try {
    const contents = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;

    const password = await bcrypt.hash('password123', 10);
    const data = {
      ...defaultData,
      users: [
        {
          id: 1,
          fullname: 'System Administrator',
          email: 'admin@hospital.test',
          password,
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ],
      counters: {
        users: 2,
        patients: 1,
        diagnosis: 1
      }
    };
    await writeData(data);
    return data;
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

async function findUserByEmail(email) {
  const data = await readData();
  return data.users.find((user) => user.email === email);
}

async function createUser({ fullname, email, password, role }) {
  const data = await readData();

  if (data.users.some((user) => user.email === email)) {
    const error = new Error('Email already exists');
    error.code = 'ER_DUP_ENTRY';
    throw error;
  }

  const user = {
    id: data.counters.users++,
    fullname,
    email,
    password,
    role,
    created_at: new Date().toISOString()
  };

  data.users.push(user);
  await writeData(data);
  return user.id;
}

async function createPatient(patient) {
  const data = await readData();
  const record = {
    patient_id: data.counters.patients++,
    fullname: patient.fullname,
    age: Number(patient.age),
    gender: patient.gender,
    phone: patient.phone || '',
    address: patient.address || '',
    created_at: new Date().toISOString()
  };

  data.patients.push(record);
  await writeData(data);
  return record.patient_id;
}

async function getPatients() {
  const data = await readData();
  return [...data.patients]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((patient) => ({
      ...patient,
      diagnosis_count: data.diagnosis.filter((item) => item.patient_id === patient.patient_id).length
    }));
}

async function getPatientById(patientId) {
  const data = await readData();
  return data.patients.find((patient) => patient.patient_id === Number(patientId));
}

async function createDiagnosis(record) {
  const data = await readData();
  const patientExists = data.patients.some((patient) => patient.patient_id === Number(record.patient_id));

  if (!patientExists) {
    return null;
  }

  const diagnosis = {
    diagnosis_id: data.counters.diagnosis++,
    patient_id: Number(record.patient_id),
    fever: Boolean(record.fever),
    fatigue: Boolean(record.fatigue),
    jaundice: Boolean(record.jaundice),
    abdominal_pain: Boolean(record.abdominal_pain),
    dark_urine: Boolean(record.dark_urine),
    nausea: Boolean(record.nausea),
    result: record.result,
    recommendation: record.recommendation,
    score: record.score,
    created_at: new Date().toISOString()
  };

  data.diagnosis.push(diagnosis);
  await writeData(data);
  return diagnosis.diagnosis_id;
}

function withPatient(diagnosis, patients) {
  const patient = patients.find((item) => item.patient_id === diagnosis.patient_id) || {};

  return {
    ...diagnosis,
    patient_name: patient.fullname,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    address: patient.address
  };
}

async function getDiagnoses() {
  const data = await readData();
  return [...data.diagnosis]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((diagnosis) => withPatient(diagnosis, data.patients));
}

async function getDiagnosisById(diagnosisId) {
  const data = await readData();
  const diagnosis = data.diagnosis.find((item) => item.diagnosis_id === Number(diagnosisId));
  return diagnosis ? withPatient(diagnosis, data.patients) : null;
}

async function getDashboard() {
  const data = await readData();
  const diagnoses = await getDiagnoses();

  return {
    totalPatients: data.patients.length,
    totalDiagnoses: data.diagnosis.length,
    positiveCases: data.diagnosis.filter((item) => item.result === 'Possible Hepatitis Infection').length,
    recentPatients: [...data.patients].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    recentDiagnoses: diagnoses.slice(0, 5)
  };
}

module.exports = {
  findUserByEmail,
  createUser,
  createPatient,
  getPatients,
  getPatientById,
  createDiagnosis,
  getDiagnoses,
  getDiagnosisById,
  getDashboard
};
