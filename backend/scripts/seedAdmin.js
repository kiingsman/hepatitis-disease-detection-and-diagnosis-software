const bcrypt = require('bcryptjs');
const db = require('../config/db');
const repository = require('../data/repository');

async function seedAdmin() {
  const fullname = 'System Administrator';
  const email = 'admin@hospital.test';
  const password = 'password123';
  const role = 'admin';

  if (process.env.USE_LOCAL_DB === 'true') {
    const existing = await repository.findUserByEmail(email);

    if (existing) {
      console.log('Demo admin already exists in local demo database');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await repository.createUser({ fullname, email, password: hashedPassword, role });
    console.log(`Demo admin created in local demo database: ${email} / ${password}`);
    return;
  }

  const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

  if (existing.length > 0) {
    console.log('Demo admin already exists');
    await db.end();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.execute(
    'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
    [fullname, email, hashedPassword, role]
  );

  console.log(`Demo admin created: ${email} / ${password}`);
  await db.end();
}

seedAdmin().catch(async (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.error(
      [
        'Unable to connect to MySQL on the configured host/port.',
        'Make sure MySQL is running, then confirm backend/.env has the correct DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.',
        'Default expected connection: localhost:3306, database hepatitis_system.'
      ].join('\n')
    );
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.error('Database not found. Create it first by running backend/database/schema.sql in MySQL.');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('MySQL access denied. Check DB_USER and DB_PASSWORD in backend/.env.');
  } else {
    console.error(error);
  }
  await db.end().catch(() => {});
  process.exit(1);
});
