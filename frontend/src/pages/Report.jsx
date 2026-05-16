import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';

const symptoms = [
  ['fever', 'Fever'],
  ['fatigue', 'Fatigue'],
  ['jaundice', 'Jaundice'],
  ['abdominal_pain', 'Abdominal pain'],
  ['dark_urine', 'Dark urine'],
  ['nausea', 'Nausea']
];

function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/diagnoses/${id}`).then(({ data }) => setReport(data)).catch(() => {});
  }, [id]);

  if (!report) {
    return <p className="text-sm text-zinc-500">Loading report...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="no-print mb-5 flex justify-end">
        <button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded bg-clinic-green px-4 text-sm font-semibold text-white">
          <Printer size={17} /> Print
        </button>
      </div>

      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-700">
        <p className="text-sm font-semibold text-clinic-green">HepatoCare Medical Center</p>
        <h1 className="mt-2 text-2xl font-bold">Hepatitis Screening Report</h1>
        <p className="mt-1 text-sm text-zinc-500">Report ID: #{report.diagnosis_id}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-zinc-500">Patient Name</p>
          <p className="font-semibold">{report.patient_name}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-zinc-500">Age / Gender</p>
          <p className="font-semibold">{report.age} / {report.gender}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-zinc-500">Phone</p>
          <p className="font-semibold">{report.phone || '-'}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-zinc-500">Date</p>
          <p className="font-semibold">{new Date(report.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Symptoms Collected</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {symptoms.map(([key, label]) => (
            <div key={key} className="rounded border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
              <span className="font-medium">{label}:</span> {report[key] ? 'Yes' : 'No'}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded border border-clinic-green/25 bg-clinic-mint/50 p-4 text-clinic-ink">
        <p className="text-xs uppercase">Diagnosis Result</p>
        <h2 className="mt-1 text-xl font-bold">{report.result}</h2>
        <p className="mt-2 text-sm leading-6">{report.recommendation}</p>
        <p className="mt-3 text-sm font-semibold">Score: {report.score}/6</p>
      </div>

      <p className="mt-6 text-xs leading-5 text-zinc-500">
        This report is a preliminary symptom-based screening aid. Final diagnosis requires laboratory confirmation and clinical evaluation by a qualified healthcare professional.
      </p>
    </div>
  );
}

export default Report;
