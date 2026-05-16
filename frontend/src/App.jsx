import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DiagnosisForm from './pages/DiagnosisForm.jsx';
import History from './pages/History.jsx';
import Login from './pages/Login.jsx';
import PatientForm from './pages/PatientForm.jsx';
import Patients from './pages/Patients.jsx';
import Report from './pages/Report.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/diagnosis/new" element={<DiagnosisForm />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports/:id" element={<Report />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
