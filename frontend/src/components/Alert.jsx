function Alert({ message, type = 'error' }) {
  if (!message) return null;

  const classes = type === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : 'border-red-200 bg-red-50 text-red-800';

  return (
    <div className={`rounded border px-4 py-3 text-sm ${classes}`}>
      {message}
    </div>
  );
}

export default Alert;
