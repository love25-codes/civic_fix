import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, User } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();

  // optional: avoid flicker during initial auth check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-zinc-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      
      {/* NOT LOGGED IN STATE */}
      {!user ? (
        <div className="text-center max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-10">
          <ShieldAlert className="mx-auto w-10 h-10 text-blue-500 mb-4" />

          <h1 className="text-xl font-bold text-white mb-2">
            Login Required
          </h1>

          <p className="text-zinc-400 text-sm">
            Please log in to access your dashboard and view your data.
          </p>
        </div>
      ) : (
        
        /* LOGGED IN STATE */
        <div className="text-center max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-10">
          
          <User className="mx-auto w-10 h-10 text-blue-500 mb-4" />

          <h1 className="text-2xl font-black text-white">
            Hi, {user.name}
          </h1>

          <p className="text-zinc-400 mt-2 text-sm">
            Welcome to your dashboard.
          </p>
        </div>
      )}

    </div>
  );
}