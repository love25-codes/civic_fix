import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { 
  Plus, Clock, CheckCircle2, RotateCw, 
  MapPin, AlertCircle, Loader2, ArrowUp, Trash2, X, Edit3, Save, Navigation,
  LockKeyhole, Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, resolved: 0 });
  const [fetching, setFetching] = useState(true);
  
  const [filter, setFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

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
  const handleDelete = async (e, reportId) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDoc(doc(db, "reports", reportId));
        if (selectedReport?.id === reportId) setSelectedReport(null);
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const reportRef = doc(db, "reports", selectedReport.id);
      await updateDoc(reportRef, editData);
      setIsEditing(false);
      setSelectedReport(null); 
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setEditData(report);
    setIsEditing(false);
  };

  // --- STYLE HELPERS ---
  const getPriorityStyles = (priority) => {
    const p = priority?.toLowerCase();
    switch (p) {
      case 'high': return { text: "text-red-500", bg: "bg-red-950", border: "border-red-500/10" };
      case 'medium': return { text: "text-yellow-500", bg: "bg-yellow-600/30", border: "border-yellow-500/10" };
      case 'low': return { text: "text-emerald-500", bg: "bg-emerald-600/20", border: "border-emerald-500/10" };
      default: return { text: "text-zinc-400", bg: "bg-zinc-900/50", border: "border-zinc-800" };
    }
  };

  const getCategoryPill = (category) => {
    const c = category?.toLowerCase();
    const map = {
      water: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      electricity: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      roads: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      garbage: "bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/20",
      cyber: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      safety: "bg-red-500/10 text-red-400 border-red-500/20",
      infrastructure: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      other: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };
    return map[c] || "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === 'resolved') return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (s === 'pending') return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (s === 'in progress') return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  if (authLoading) {
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
                <p className="text-zinc-400 text-sm">Please authenticate to access the dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const username = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Citizen";

  const filteredReports = reports.filter(r => {
    const isResolved = r.status?.toLowerCase() === 'resolved';
    if (filter === "resolved") return isResolved;
    if (filter === "all") return !isResolved; 
    return r.priority?.toLowerCase() === filter && !isResolved; 
  });

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
            <div className="mt-3 pl-4 border-l-2 border-blue-600/30">
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-md bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                Your voice matters. Track your reported issues and help improve our community.
              </p>
            </div>
          </div>
          <Link to="/report">
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 px-6 flex items-center font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Plus className="w-5 h-5 mr-2" /> Report Issue
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Reports", value: stats.total, icon: AlertCircle, color: "text-zinc-300" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
            { label: "In Progress", value: stats.progress, icon: RotateCw, color: "text-blue-400" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-400" },
          ].map((c, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{c.label}</span>
                <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
              </div>
              <div className="text-3xl font-bold text-white">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
             <h2 className="text-lg font-bold text-white uppercase tracking-widest whitespace-nowrap">My complaints</h2>
             <div className="h-[1px] flex-1 bg-zinc-800"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {['all', 'high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-tighter rounded-lg transition-all ${
                    filter === p 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilter("resolved")}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border transition-all flex items-center gap-2 ${
                filter === "resolved"
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
              }`}
            >
              <CheckCircle2 size={12} /> Resolved
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            const priorityStyle = getPriorityStyles(report.priority);
            return (
              <div 
                key={report.id} 
                onClick={() => openModal(report)}
                className={`${priorityStyle.bg} ${priorityStyle.border} border rounded-2xl p-5 transition-all hover:scale-[1.01] flex flex-col cursor-pointer group`}
              >
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
                    <div className="w-1 h-1 rounded-full bg-current" />
                    {report.status || 'Pending'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-100 mb-1 group-hover:text-white line-clamp-1">{report.title}</h3>
                <p className="text-zinc-500 text-sm font-medium mb-6 line-clamp-2">{report.description}</p>

                <div className="mt-auto flex items-center justify-between text-zinc-600 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUp size={14} /> <span className="font-bold">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs truncate max-w-[100px]">
                      <MapPin size={14} /> <span className="truncate">{report.area || "Location"}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, report.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- MODAL --- */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="h-1.5 w-full bg-blue-600" />
              <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${getCategoryPill(selectedReport.category)}`}>
                    {selectedReport.category}
                  </span>
                  <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Title</label>
                      <input 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                        value={editData.title}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Description</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 resize-none"
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Status</label>
                      <select 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                        value={editData.status?.toLowerCase()}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18} /> SAVE</button>
                      <button onClick={() => setIsEditing(false)} className="px-6 border border-zinc-700 text-zinc-300 py-3 rounded-xl font-bold">CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white uppercase italic">{selectedReport.title}</h2>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Reported by you</p>
                    </div>

                    <p className="text-zinc-400 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800/50 leading-relaxed">{selectedReport.description}</p>
                    
                    {/* --- LOCATION DETAILS --- */}
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                       <div className="flex items-center gap-2 text-blue-500 mb-1">
                          <Navigation size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Location Details</span>
                       </div>
                       <div className="grid grid-cols-1 gap-2">
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500 text-xs">State</span>
                             <span className="text-zinc-200 font-semibold">{selectedReport.state || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500 text-xs">City</span>
                             <span className="text-zinc-200 font-semibold">{selectedReport.city || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-zinc-500 text-xs">Area</span>
                             <span className="text-zinc-200 font-semibold">{selectedReport.area || "N/A"}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Priority</span>
                        <span className={`text-sm font-bold ${getPriorityStyles(selectedReport.priority).text}`}>{selectedReport.priority}</span>
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Status</span>
                        <span className="text-sm font-bold text-white italic">{selectedReport.status}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={() => setIsEditing(true)} className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                        <Edit3 size={18} /> EDIT REPORT
                      </button>
                      <button onClick={(e) => handleDelete(e, selectedReport.id)} className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}