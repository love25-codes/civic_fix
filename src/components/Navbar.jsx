import { Link, useLocation } from "react-router-dom";
import { Shield, MapPin, LayoutDashboard, BarChart3, Plus, BookOpen, User } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Learn", icon: BookOpen },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/map", label: "Map", icon: MapPin },
    { to: "/report", label: "Report", icon: Plus },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 transition-transform active:scale-95">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            CIVIC <span className="text-blue-500 not-italic">FIX</span>
          </span>
        </Link>

        {/* Desktop Nav - Clean Edge-to-Edge Style */}
        <nav className="hidden md:flex items-center h-full gap-8">
          {navLinks.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative flex items-center gap-2 text-sm font-medium transition-colors h-full border-b-2 ${
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

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block px-5 py-2 text-xs font-bold uppercase tracking-widest text-white bg-zinc-700 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 active:scale-95">
  Log In
</button>
          <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center cursor-pointer hover:border-zinc-700 transition-colors">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Mobile Nav - Minimalist Horizontal */}
      <div className="md:hidden border-t border-zinc-900 bg-black overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 px-4 py-3">
          {navLinks.map((n) => {
            const active = location.pathname === n.to;
            const Icon = n.icon;

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-500 active:bg-zinc-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};