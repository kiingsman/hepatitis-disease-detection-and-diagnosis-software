function StatCard({ label, value, tone = 'green' }) {
  const tones = {
    green: 'border-clinic-green/20 bg-clinic-mint text-clinic-green',
    coral: 'border-clinic-coral/20 bg-red-50 text-clinic-coral',
    gold: 'border-clinic-gold/20 bg-amber-50 text-clinic-gold'
  };

  return (
    <div className="rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <div className={`mt-4 h-2 rounded ${tones[tone]}`} />
    </div>
  );
}

export default StatCard;
