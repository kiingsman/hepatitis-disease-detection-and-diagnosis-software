const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function initializeDatabase() {
  if (process.env.USE_LOCAL_DB === 'true' || process.env.AUTO_MIGRATE !== 'true') {
    return;
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'doctor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS patients (
      patient_id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(100) NOT NULL,
      age INT NOT NULL,
      gender VARCHAR(10) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS diagnosis (
      diagnosis_id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      fever BOOLEAN DEFAULT FALSE,
      fatigue BOOLEAN DEFAULT FALSE,
      jaundice BOOLEAN DEFAULT FALSE,
      abdominal_pain BOOLEAN DEFAULT FALSE,
      dark_urine BOOLEAN DEFAULT FALSE,
      nausea BOOLEAN DEFAULT FALSE,
      result VARCHAR(100) NOT NULL,
      recommendation TEXT,
      score INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
    )
  `);

  const email = process.env.ADMIN_EMAIL || 'admin@hospital.test';
  const password = process.env.ADMIN_PASSWORD || 'password123';
  const fullname = process.env.ADMIN_FULLNAME || 'System Administrator';

  const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

  if (existing.length === 0) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
      [fullname, email, hashedPassword, 'admin']
    );
  }
}

module.exports = { initializeDatabase };
