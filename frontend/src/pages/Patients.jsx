import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get('/patients').then(({ data }) => setPatients(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Registered patient records.</p>
        </div>
        <Link to="/patients/new" className="flex h-10 items-center gap-2 rounded bg-clinic-green px-3 text-sm font-semibold text-white">
          <Plus size={17} /> New
        </Link>
      </div>

      <div className="overflow-hidden rounded border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Diagnoses</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.patient_id} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3 font-medium">{patient.fullname}</td>
                  <td className="px-4 py-3">{patient.age}</td>
                  <td className="px-4 py-3">{patient.gender}</td>
                  <td className="px-4 py-3">{patient.phone || '-'}</td>
                  <td className="px-4 py-3">{patient.diagnosis_count}</td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-zinc-500">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Patients;
