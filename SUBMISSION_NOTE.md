# Project Submission Note

## Project Title

Detection and Diagnosis of Hepatitis Disease Using Software

## Summary

This project is a web-based medical diagnosis support system that helps healthcare practitioners register patients, collect hepatitis-related symptoms, generate preliminary risk results, store patient records, and print diagnosis reports.

## Main Features

- Secure doctor/admin login with JWT authentication
- Patient registration and patient list management
- Symptom collection form
- Rule-based hepatitis screening engine
- Dashboard statistics for patients, diagnoses, and possible cases
- Patient diagnosis history
- Printable diagnosis report
- MySQL schema for production database use
- Local demo mode for easy presentation without MySQL setup

## Technology Stack

- Frontend: React.js, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express.js, JWT, bcrypt
- Database: MySQL
- Demo Storage: Local JSON file when `USE_LOCAL_DB=true`

## Demo Login

- Email: `admin@hospital.test`
- Password: `password123`

## How To Run

1. Install Node.js.
2. Open a terminal in the project folder.
3. Run `npm install`.
4. Start backend: `npm run backend:dev`.
5. Start frontend in another terminal: `npm run frontend:dev`.
6. Open `http://127.0.0.1:5173`.

## Database

The MySQL database schema is located at:

`backend/database/schema.sql`

For quick demonstration, local demo mode is already supported using `USE_LOCAL_DB=true` in `backend/.env.example`.

## Medical Disclaimer

This system provides preliminary symptom-based screening only. Hepatitis diagnosis must be confirmed by qualified healthcare professionals using laboratory tests and clinical evaluation.
