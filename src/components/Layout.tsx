
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Newspaper, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useMockDB } from '../lib/store';

export default function Layout() {
  const { currentUser, logout } = useMockDB();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-primary text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-accent rounded-lg p-1.5 group-hover:scale-105 transition-transform">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                Zorzal Diario<span className="text-accent">.</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/validator" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition">
                    <UserIcon className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium truncate max-w-[100px]">{currentUser.email.split('@')[0]}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors" title="Cerrar sesión">
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Zorzal Diario. Periodismo independiente de San Martín.</p>
        </div>
      </footer>
    </div>
  );
}
