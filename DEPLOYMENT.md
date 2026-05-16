# Live Deployment Guide

## Recommended Hosting

- Backend API: Railway
- Database: Railway MySQL
- Frontend: Vercel

This keeps the MySQL-backed API and React frontend on services designed for each job.

## 1. Prepare GitHub

Create a new GitHub repository for only this project folder. Do not push the parent `C:\Users\afric` folder.

Important files included:

- `backend/server.js`
- `backend/database/schema.sql`
- `frontend/src`
- `frontend/vercel.json`
- `railway.json`
- `.env.example`

Do not commit:

- `.env`
- `node_modules`
- `dist`
- `backend/data/localDb.json`
- `*.log`

## 2. Deploy Backend On Railway

1. Create a Railway project.
2. Add a MySQL database service.
3. Add a Node.js service from the GitHub repository.
4. Use these backend environment variables:

```env
NODE_ENV=production
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
USE_LOCAL_DB=false
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Railway MySQL normally provides variables such as `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, and `MYSQLDATABASE`. The backend supports those automatically.

5. After Railway deploys, open the backend public URL and confirm `/api/health` returns healthy JSON.

## 3. Create Database Tables

Open Railway MySQL query console or connect with a MySQL client, then run:

```sql
SOURCE backend/database/schema.sql;
```

If the console does not support `SOURCE`, paste the contents of `backend/database/schema.sql` directly.

Then seed the admin user from Railway shell or locally with Railway variables:

```bash
npm run backend:seed
```

Demo login:

- Email: `admin@hospital.test`
- Password: `password123`

## 4. Deploy Frontend On Vercel

1. Import the same GitHub repository into Vercel.
2. Set the Vercel project root directory to `frontend`.
3. Use:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

4. Add this frontend environment variable:

```env
VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
```

5. Deploy.

## 5. Final Backend CORS Update

After Vercel gives the final frontend URL, update Railway backend variable:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Redeploy the backend after changing it.

## 6. Final Test

1. Open the Vercel frontend URL.
2. Login with the demo admin.
3. Register a patient.
4. Run diagnosis.
5. Open history and print report.

## Notes

For class demonstration only, `USE_LOCAL_DB=true` can run without MySQL. For a real live deployment, use `USE_LOCAL_DB=false` with Railway MySQL.
