import React from "react";
import { useAuth } from "../context/AuthContext";
import { FileText, ClipboardCheck, Loader2, LockKeyhole, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ReportForm from "../components/ReportForm";

export default function Report() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#09090b]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">
          Establishing Secure Link...
        </p>
      </div>
    );
  }

  // Locked State UI - Styled for logged out users
  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 bg-[#09090b]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="relative w-full max-w-[400px]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
            <div className="p-10 text-center">
              <div className="bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-700">
                <LockKeyhole className="w-8 h-8 text-blue-500" />
              </div>
              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  <Zap size={12} className="fill-current" /> Security Layer Alpha
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Identity Required</h1>
                <p className="text-zinc-400 text-sm">Please authenticate to access the reporting terminal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State - Render Report Form
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-x-hidden bg-[#09090b]">
      {/* Dark Mode Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[800px]">
        <div className="w-full">
          <ReportForm user={user} />
        </div>
      </div>
    </div>
  );
}