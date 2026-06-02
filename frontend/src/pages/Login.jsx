import { Activity } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import api from '../services/api.js';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      if (err.response?.status === 503) {
        setError('Database unavailable. Please contact the system administrator.');
      } else {
        setError(err.response?.data?.message || 'Unable to log in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-clinic-paper px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-clinic-green text-white">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">HepatoCare Login</h1>
            <p className="text-sm text-zinc-500">Secure doctor access</p>
          </div>
        </div>

        <Alert message={error} />

        <label className="mt-5 block text-sm font-medium">
          Email
          <input
            type="email"
            value={form.email}
            required
            className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 outline-none focus:border-clinic-green"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            type="password"
            value={form.password}
            required
            className="mt-2 w-full rounded border border-zinc-300 px-3 py-3 outline-none focus:border-clinic-green"
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-clinic-green px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
