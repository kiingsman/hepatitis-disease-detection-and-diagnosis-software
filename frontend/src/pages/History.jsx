import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

function History() {
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    api.get('/diagnoses').then(({ data }) => setDiagnoses(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Patient History</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Diagnosis records and printable reports.</p>
      </div>

      <div className="overflow-hidden rounded border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Report</th>
              </tr>
            </thead>
            <tbody>
              {diagnoses.map((item) => (
                <tr key={item.diagnosis_id} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3 font-medium">{item.patient_name}</td>
                  <td className="px-4 py-3">{item.result}</td>
                  <td className="px-4 py-3">{item.score}/6</td>
                  <td className="px-4 py-3">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Link to={`/reports/${item.diagnosis_id}`} title="Open report" className="flex h-9 w-9 items-center justify-center rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                      <Printer size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {diagnoses.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-zinc-500">No diagnosis history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;
