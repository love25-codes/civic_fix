import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { 
  Plus, Clock, CheckCircle2, RotateCw, 
  MapPin, AlertCircle, Loader2, ArrowUp, LockKeyhole, Zap, Trash2 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, resolved: 0 });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    const q = query(
      collection(db, "reports"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setReports(docs);

      const s = { total: docs.length, pending: 0, progress: 0, resolved: 0 };
      docs.forEach(d => {
        const currentStatus = d.status?.toLowerCase();
        if (currentStatus === 'pending') s.pending++;
        else if (currentStatus === 'in progress') s.progress++;
        else if (currentStatus === 'resolved') s.resolved++;
      });
      
      setStats(s);
      setFetching(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setFetching(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- ACTIONS ---
  const handleDelete = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDoc(doc(db, "reports", reportId));
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  // --- STYLE HELPERS ---
  const getPriorityStyles = (priority) => {
    const p = priority?.toLowerCase();
    switch (p) {
      case 'high': return { text: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/10" };
      case 'medium': return { text: "text-yellow-500", bg: "bg-yellow-500/5", border: "border-yellow-500/10" };
      case 'low': return { text: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/10" };
      default: return { text: "text-zinc-400", bg: "bg-zinc-900/50", border: "border-zinc-800" };
    }
  };

  const getCategoryPill = (category) => {
    const c = category?.toLowerCase();
    const map = {
      water: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "public electricity": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      electricity: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      roads: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      garbage: "bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/20",
      cyber: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      "public safety": "bg-red-500/10 text-red-400 border-red-500/20",
      infrastructure: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      other: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };
    return map[c] || "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resolved') return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (s === 'pending') return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  if (authLoading || fetching) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#09090b]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

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
                <p className="text-zinc-400 text-sm">Please authenticate to access your dashboard.</p>
              </div>
              <Link to="/login" className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const username = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Citizen";

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="relative">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-blue-500/50"></span>
              Verified Session
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase italic">
              Hi, {username}
            </h1>
            {/* Styled Sub-heading */}
            <div className="mt-3 pl-4 border-l-2 border-blue-600/30">
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-md bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                Your voice matters. Track your reported issues and help make 
                <span className="text-blue-400/80 mx-1">our community</span> 
                a better place to live.
              </p>
            </div>
          </div>
          <Link to="/report">
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 px-6 flex items-center font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]">
              <Plus className="w-5 h-5 mr-2" /> NEW REPORT
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Reports", value: stats.total, icon: AlertCircle, color: "text-zinc-300" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
            { label: "In Progress", value: stats.progress, icon: RotateCw, color: "text-blue-400" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-400" },
          ].map((c, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 group hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{c.label}</span>
                <c.icon className={`w-3.5 h-3.5 ${c.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-3xl font-bold text-white">{c.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
           <h2 className="text-lg font-bold text-white uppercase tracking-widest">My complaints</h2>
           <div className="h-[1px] flex-1 bg-zinc-800"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => {
            const priorityStyle = getPriorityStyles(report.priority);
            return (
              <div 
                key={report.id} 
                className={`${priorityStyle.bg} ${priorityStyle.border} border rounded-2xl p-5 transition-all hover:scale-[1.01] hover:brightness-110 flex flex-col`}
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase flex items-center gap-1.5 ${getCategoryPill(report.category)}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {report.category || 'OTHER'}
                    </span>
                    <span className={`${priorityStyle.text} text-[10px] font-black uppercase tracking-widest`}>
                      {report.priority || 'MEDIUM'}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 ${getStatusPill(report.status)}`}>
                    <div className={`w-1 h-1 rounded-full bg-current`} />
                    {report.status || 'Pending'}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold text-zinc-100 mb-1 leading-snug">
                  {report.title}
                </h3>
                <p className="text-zinc-500 text-sm font-medium mb-6 line-clamp-2">
                  {report.description}
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between text-zinc-600 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUp size={14} className="text-zinc-500" />
                      <span className="font-bold">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs max-w-[80px] truncate">
                      <MapPin size={14} className="text-zinc-500" />
                      <span className="truncate">{report.area || "Location"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium opacity-60">
                      {report.createdAt?.toDate() 
                        ? report.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : "Just now"}
                    </span>
                    <button 
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}