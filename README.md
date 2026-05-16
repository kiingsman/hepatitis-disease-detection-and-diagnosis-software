# Hepatitis Disease Detection and Diagnosis Software

Web-based medical diagnosis support system for registering patients, collecting symptoms, generating preliminary hepatitis risk results, and managing diagnosis history.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express.js, MySQL, JWT
- Database: MySQL

## Quick Start

1. Create a MySQL database and tables:

```sql
SOURCE backend/database/schema.sql;
```

If you use XAMPP or WAMP, start MySQL from its control panel first. If your MySQL root account has a password, put it in `backend/.env` as `DB_PASSWORD=your_password`.

2. Install dependencies from the project root:

```bash
npm install
```

3. Configure backend environment and create the demo admin:

```bash
cd backend
copy .env.example .env
npm run seed
npm run dev
```

4. Configure and run frontend:

```bash
cd frontend
npm run dev
```

You can also run from the project root with `npm run backend:dev` and `npm run frontend:dev`.

For a fast demo without MySQL, set `USE_LOCAL_DB=true` in `backend/.env`. The backend will store demo records in `backend/data/localDb.json`.

The frontend expects the API at `http://localhost:5000/api` by default.

## Demo Login

After running the schema seed, use:

- Email: `admin@hospital.test`
- Password: `password123`

## Medical Disclaimer

This software provides preliminary symptom-based screening support only. Hepatitis diagnosis must be confirmed by qualified health professionals using laboratory tests and clinical evaluation.
