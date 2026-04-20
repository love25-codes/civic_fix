import React from "react";
import { useAuth } from "../context/AuthContext";
import { FileText, ClipboardCheck, Loader2 } from "lucide-react";
import ReportForm from "../components/ReportForm";

export default function Report() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#020617]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">
          Establishing Secure Link...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-x-hidden bg-[#020617]">
      {/* Dark Mode Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[800px]">
        {!user ? (
          /* Locked State UI - Dark Version */
          <div className="relative group w-full max-w-[500px] mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-[#0f172a] border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
              <div className="p-10 text-center">
                <div className="relative mx-auto w-20 h-20 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-3xl rotate-12" />
                  <div className="relative bg-[#1e293b] border border-slate-700 p-5 rounded-3xl shadow-xl">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                      Access Restricted
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                    Report <br /> Issue
                  </h1>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed px-2">
                    Authorization required. Please sign in to the CivicFix terminal to proceed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Render the form - The form itself is already dark, now it fits the page */
          <div className="w-full">
            <ReportForm user={user} />
          </div>
        )}
      </div>
    </div>
  );
}