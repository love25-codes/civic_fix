import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import {
  Shield,
  MapPin,
  LayoutDashboard,
  BarChart3,
  Plus,
  BookOpen,
} from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Learn", icon: BookOpen },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/report", label: "Report", icon: Plus },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/95 backdrop-blur-md">
      
      {/* Auth Modal */}
      <AuthModal open={open} onClose={() => setOpen(false)} />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            CIVIC <span className="text-blue-500">FIX</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center h-full gap-8">
          {navLinks.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 text-sm font-medium transition-colors h-full border-b-2 ${
                  active
                    ? "border-blue-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-blue-500" : ""}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* AUTH SECTION (FIXED - NO LOADING LOGIC HERE) */}
        <div className="flex items-center">

          {user ? (
            <div className="flex items-center gap-4">

              <span className="text-zinc-400 text-xs font-bold uppercase hidden sm:block">
                Hi, {user.name?.split(" ")[0]}
              </span>

              <button
                onClick={logout}
                className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-red-600 rounded-full hover:bg-red-500 transition-all active:scale-95"
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              Sign In
            </button>
          )}

        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-zinc-900 bg-black overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 px-4 py-3">
          {navLinks.map((n) => {
            const active = location.pathname === n.to;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-500 active:bg-zinc-900"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};