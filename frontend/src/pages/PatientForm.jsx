import { Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import api from '../services/api.js';

function PatientForm() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    fullname: '',
    age: '',
    gender: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setPatient({ ...patient, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.post('/patients', patient);
      setMessage('Patient registered successfully');
      setTimeout(() => navigate('/patients'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save patient');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Register Patient</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create a patient profile before running symptom screening.</p>

      <form onSubmit={handleSubmit} className="mt-6 rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="space-y-4">
          <Alert message={message} type="success" />
          <Alert message={error} />
          <label className="block text-sm font-medium">
            Full Name
            <input name="fullname" required className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950" onChange={handleChange} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Age
              <input name="age" type="number" min="0" required className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950" onChange={handleChange} />
            </label>
            <label className="block text-sm font-medium">
              Gender
              <select name="gender" required className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950" onChange={handleChange} defaultValue="">
                <option value="" disabled>Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium">
            Phone Number
            <input name="phone" className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950" onChange={handleChange} />
          </label>
          <label className="block text-sm font-medium">
            Address
            <textarea name="address" rows="4" className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950" onChange={handleChange} />
          </label>
        </div>
        <button className="mt-5 flex h-11 items-center gap-2 rounded bg-clinic-green px-4 font-semibold text-white">
          <Save size={18} /> Save Patient
        </button>
      </form>
    </div>
  );
}

export default PatientForm;
