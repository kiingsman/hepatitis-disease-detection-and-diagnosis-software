const db = require('../config/db');
const localStore = require('./localStore');

function useLocalDb() {
  return process.env.USE_LOCAL_DB === 'true';
}

function isConnectionError(error) {
  return ['ECONNREFUSED', 'ENOTFOUND', 'ER_BAD_DB_ERROR', 'ER_ACCESS_DENIED_ERROR'].includes(error.code);
}

async function run(mysqlAction, localAction) {
  if (useLocalDb()) {
    return localAction();
  }

  try {
    return await mysqlAction();
  } catch (error) {
    if (isConnectionError(error)) {
      error.status = 503;
      error.message = `Database unavailable (${error.code}). Check MySQL connection variables or set USE_LOCAL_DB=true for demo mode.`;
    }
    throw error;
  }
}

async function findUserByEmail(email) {
  return run(
    async () => {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    },
    () => localStore.findUserByEmail(email)
  );
}

async function createUser(user) {
  return run(
    async () => {
      const [result] = await db.execute(
        'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
        [user.fullname, user.email, user.password, user.role]
      );
      return result.insertId;
    },
    () => localStore.createUser(user)
  );
}

async function createPatient(patient) {
  return run(
    async () => {
      const [result] = await db.execute(
        'INSERT INTO patients (fullname, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)',
        [patient.fullname, patient.age, patient.gender, patient.phone, patient.address]
      );
      return result.insertId;
    },
    () => localStore.createPatient(patient)
  );
}

async function getPatients() {
  return run(
    async () => {
      const [rows] = await db.execute(
        `SELECT p.*, COUNT(d.diagnosis_id) AS diagnosis_count
         FROM patients p
         LEFT JOIN diagnosis d ON p.patient_id = d.patient_id
         GROUP BY p.patient_id
         ORDER BY p.created_at DESC`
      );
      return rows;
    },
    () => localStore.getPatients()
  );
}

async function getPatientById(patientId) {
  return run(
    async () => {
      const [rows] = await db.execute('SELECT * FROM patients WHERE patient_id = ?', [patientId]);
      return rows[0];
    },
    () => localStore.getPatientById(patientId)
  );
}

async function createDiagnosis(record) {
  return run(
    async () => {
      const [patients] = await db.execute('SELECT patient_id FROM patients WHERE patient_id = ?', [record.patient_id]);

      if (!patients[0]) {
        return null;
      }

      const [result] = await db.execute(
        `INSERT INTO diagnosis
         (patient_id, fever, fatigue, jaundice, abdominal_pain, dark_urine, nausea, result, recommendation, score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.patient_id,
          record.fever,
          record.fatigue,
          record.jaundice,
          record.abdominal_pain,
          record.dark_urine,
          record.nausea,
          record.result,
          record.recommendation,
          record.score
        ]
      );
      return result.insertId;
    },
    () => localStore.createDiagnosis(record)
  );
}

async function getDiagnoses() {
  return run(
    async () => {
      const [rows] = await db.execute(
        `SELECT d.*, p.fullname AS patient_name, p.age, p.gender, p.phone
         FROM diagnosis d
         JOIN patients p ON d.patient_id = p.patient_id
         ORDER BY d.created_at DESC`
      );
      return rows;
    },
    () => localStore.getDiagnoses()
  );
}

async function getDiagnosisById(diagnosisId) {
  return run(
    async () => {
      const [rows] = await db.execute(
        `SELECT d.*, p.fullname AS patient_name, p.age, p.gender, p.phone, p.address
         FROM diagnosis d
         JOIN patients p ON d.patient_id = p.patient_id
         WHERE d.diagnosis_id = ?`,
        [diagnosisId]
      );
      return rows[0];
    },
    () => localStore.getDiagnosisById(diagnosisId)
  );
}

async function getDashboard() {
  return run(
    async () => {
      const [[patientCount]] = await db.execute('SELECT COUNT(*) AS totalPatients FROM patients');
      const [[diagnosisCount]] = await db.execute('SELECT COUNT(*) AS totalDiagnoses FROM diagnosis');
      const [[positiveCount]] = await db.execute(
        "SELECT COUNT(*) AS positiveCases FROM diagnosis WHERE result = 'Possible Hepatitis Infection'"
      );
      const [recentPatients] = await db.execute('SELECT * FROM patients ORDER BY created_at DESC LIMIT 5');
      const [recentDiagnoses] = await db.execute(
        `SELECT d.*, p.fullname AS patient_name
         FROM diagnosis d
         JOIN patients p ON d.patient_id = p.patient_id
         ORDER BY d.created_at DESC
         LIMIT 5`
      );

      return {
        totalPatients: patientCount.totalPatients,
        totalDiagnoses: diagnosisCount.totalDiagnoses,
        positiveCases: positiveCount.positiveCases,
        recentPatients,
        recentDiagnoses
      };
    },
    () => localStore.getDashboard()
  );
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
