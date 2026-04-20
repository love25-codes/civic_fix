import React from "react";
import { useAuth } from "../context/AuthContext";
import { Activity, TrendingUp, Zap, PieChart, Target } from "lucide-react";

export default function Analytics() {
  const { user, loading } = useAuth();

  // Loading State - Matches your system identity
  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] animate-pulse">
          Parsing Neural Data...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 overflow-hidden bg-slate-50">
      
      {/* Dynamic Background Blobs - Data & Intelligence Palette */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-violet-50/60 rounded-full blur-[130px] animate-pulse duration-[8000ms]" />

      {/* Main Content Area - Strictly Centered */}
      <div className="relative z-10 w-full max-w-[400px]">
        
        {!user ? (
          /* 1. RESTRICTED ANALYTICS STATE */
          <div className="relative group w-full">
            {/* Soft Outer Glow */}
            <div className="absolute -inset-4 bg-blue-500/5 rounded-[3rem] blur-3xl group-hover:bg-blue-500/10 transition-all duration-1000" />
            
            {/* The Main Box */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-[0_32px_64px_rgba(0,0,0,0.06)]">
              
              {/* Top Accent Line - Analytics Gradient */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-violet-400 to-blue-600 animate-gradient-x" />
              
              <div className="p-10 text-center">
                {/* Icon Section */}
                <div className="relative mx-auto w-20 h-20 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-100/50 rounded-full animate-ping opacity-20" />
                  <div className="relative bg-white border border-slate-100 p-5 rounded-3xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Insights Encrypted</span>
                  </div>
                  
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                    Issues <br /> Metrics
                  </h1>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
                    Real-time trend analysis and performance metrics are only available to verified users.
                  </p>
                </div>

                {/* Decorative Bottom Element */}
                <div className="mt-10 pt-6 border-t border-slate-50 flex justify-center">
                   <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-violet-300 transition-colors duration-500" />
                    ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          /* 2. LOGGED IN ANALYTICS STATE */
          <div className="group text-center bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2">
            <div className="bg-violet-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-violet-100 shadow-inner group-hover:rotate-[360deg] transition-transform duration-[1500ms]">
              <PieChart className="w-10 h-10 text-violet-600" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Live Metrics
            </h1>

            <p className="text-blue-600 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">
              Intelligence Stream Active
            </p>
          </div>
        )}
      </div>
    </div>
  );
}