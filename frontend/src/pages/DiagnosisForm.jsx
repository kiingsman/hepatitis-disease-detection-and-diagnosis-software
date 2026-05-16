import { Activity, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import api from '../services/api.js';

const symptomFields = [
  ['fever', 'Fever'],
  ['fatigue', 'Fatigue'],
  ['jaundice', 'Jaundice'],
  ['abdominal_pain', 'Abdominal pain'],
  ['dark_urine', 'Dark urine'],
  ['nausea', 'Nausea']
];

function DiagnosisForm() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [symptoms, setSymptoms] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/patients').then(({ data }) => setPatients(data)).catch(() => {});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    try {
      const { data } = await api.post('/diagnoses', {
        patient_id: patientId,
        ...symptoms
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save diagnosis');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Symptom Diagnosis</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Select observed symptoms to generate a preliminary hepatitis screening result.</p>

      <form onSubmit={handleSubmit} className="mt-6 rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <Alert message={error} />

        <label className="block text-sm font-medium">
          Patient
          <select required value={patientId} onChange={(event) => setPatientId(event.target.value)} className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950">
            <option value="" disabled>Select patient</option>
            {patients.map((patient) => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {patient.fullname} ({patient.age}, {patient.gender})
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {symptomFields.map(([key, label]) => (
            <label key={key} className="flex min-h-14 items-center gap-3 rounded border border-zinc-200 px-4 dark:border-zinc-700">
              <input
                type="checkbox"
                checked={Boolean(symptoms[key])}
                onChange={(event) => setSymptoms({ ...symptoms, [key]: event.target.checked })}
                className="h-4 w-4 accent-clinic-green"
              />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>

        <button className="mt-5 flex h-11 items-center gap-2 rounded bg-clinic-green px-4 font-semibold text-white">
          <Activity size={18} /> Analyze Symptoms
        </button>
      </form>

      {result && (
        <section className="mt-5 rounded border border-clinic-green/25 bg-white p-5 shadow-sm dark:border-emerald-800 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 text-clinic-green" size={22} />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Screening result</p>
              <h2 className="mt-1 text-xl font-bold">{result.result}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{result.recommendation}</p>
              <p className="mt-3 text-sm font-medium">Symptom score: {result.score}/6</p>
              <Link to={`/reports/${result.diagnosisId}`} className="mt-4 inline-flex h-10 items-center rounded bg-clinic-ink px-4 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
                Open Report
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default DiagnosisForm;
