import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`;

export const Navbar = ({ isAuthed, onLogout }) => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <Link to="/" className="text-lg font-semibold text-white">
        DSA Compass
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
      </nav>
      <div className="flex items-center gap-3">
        {isAuthed ? (
          <>
            <Button variant="ghost" onClick={onLogout}>Logout</Button>
            <Button asChild>
              <Link to="/dashboard">Launch</Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  </header>
);
