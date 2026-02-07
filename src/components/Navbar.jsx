import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`;

export const Navbar = ({ isAuthed, onLogout }) => (
  <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
    <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl shadow-lg shadow-black/10 transition-all duration-300 hover:border-white/20 hover:shadow-glow/20">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
            <span className="text-white font-bold font-display text-xl">D</span>
          </div>
          <span className="text-xl font-bold font-display text-white tracking-tight group-hover:text-blue-100 transition-colors">DSA Compass</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <Button variant="ghost" onClick={onLogout} className="hover:bg-white/5 data-[state=open]:bg-transparent text-slate-300 hover:text-white">Logout</Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 border border-blue-400/20">
                <Link to="/dashboard">Launch App</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/5">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-white text-navy-900 hover:bg-blue-50 shadow-lg shadow-white/10 transition-all hover:scale-105">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
);
