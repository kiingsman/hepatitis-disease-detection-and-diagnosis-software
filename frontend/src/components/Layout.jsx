import { Activity, ClipboardList, FileText, LayoutDashboard, LogOut, Moon, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/patients/new', label: 'Register', icon: Plus },
  { to: '/diagnosis/new', label: 'Diagnosis', icon: Activity },
  { to: '/history', label: 'History', icon: ClipboardList }
];

function Layout() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-clinic-paper text-clinic-ink dark:bg-zinc-950 dark:text-zinc-100">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-white px-4 py-5 dark:border-white/10 dark:bg-zinc-900 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-clinic-green text-white">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">HepatoCare</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Clinical screening</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-clinic-mint text-clinic-green dark:bg-emerald-950 dark:text-emerald-200'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-20 border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-900/90 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{user.fullname || 'Doctor'}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Medical diagnosis support system</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Toggle dark mode"
                onClick={() => setDark((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded border border-black/10 bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <Moon size={18} />
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex h-10 items-center gap-2 rounded bg-clinic-ink px-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-3 grid grid-cols-5 gap-1 lg:hidden">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex h-12 flex-col items-center justify-center rounded text-[11px] ${
                    isActive ? 'bg-clinic-green text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
