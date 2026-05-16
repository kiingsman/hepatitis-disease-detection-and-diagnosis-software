import { Activity, ClipboardList, Plus, Printer, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import api from '../services/api.js';

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalPatients: 0,
    totalDiagnoses: 0,
    positiveCases: 0,
    recentPatients: [],
    recentDiagnoses: []
  });

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setDashboard(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Patient screening, history, and report activity.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/patients/new" className="flex h-10 items-center gap-2 rounded bg-clinic-green px-3 text-sm font-semibold text-white">
            <Plus size={17} /> Patient
          </Link>
          <Link to="/diagnosis/new" className="flex h-10 items-center gap-2 rounded bg-clinic-ink px-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
            <Activity size={17} /> Diagnose
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Patients" value={dashboard.totalPatients} />
        <StatCard label="Total Diagnoses" value={dashboard.totalDiagnoses} tone="gold" />
        <StatCard label="Possible Cases" value={dashboard.positiveCases} tone="coral" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <Users size={18} />
            <h2 className="font-semibold">Recent Patients</h2>
          </div>
          <div className="space-y-3">
            {dashboard.recentPatients.length === 0 && <p className="text-sm text-zinc-500">No patients registered yet.</p>}
            {dashboard.recentPatients.map((patient) => (
              <div key={patient.patient_id} className="flex items-center justify-between border-b border-zinc-100 pb-3 text-sm last:border-0 last:pb-0 dark:border-zinc-800">
                <span className="font-medium">{patient.fullname}</span>
                <span className="text-zinc-500">{patient.gender}, {patient.age}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList size={18} />
            <h2 className="font-semibold">Recent Diagnoses</h2>
          </div>
          <div className="space-y-3">
            {dashboard.recentDiagnoses.length === 0 && <p className="text-sm text-zinc-500">No diagnoses recorded yet.</p>}
            {dashboard.recentDiagnoses.map((item) => (
              <div key={item.diagnosis_id} className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 text-sm last:border-0 last:pb-0 dark:border-zinc-800">
                <div>
                  <p className="font-medium">{item.patient_name}</p>
                  <p className="text-zinc-500">{item.result}</p>
                </div>
                <Link to={`/reports/${item.diagnosis_id}`} title="Open report" className="flex h-9 w-9 items-center justify-center rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                  <Printer size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
