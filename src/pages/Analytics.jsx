import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, TrendingUp, Zap,
  AlertOctagon, CheckCircle2, LockKeyhole, ShieldAlert
} from "lucide-react";

const CATEGORIES = [
  { label: "Water", value: "water", color: "#38bdf8" },
  { label: "Electricity", value: "electricity", color: "#fbbf24" },
  { label: "Roads", value: "roads", color: "#f97316" },
  { label: "Garbage", value: "garbage", color: "#84cc16" },
  { label: "Cyber", value: "cyber", color: "#9a37f7" },
  { label: "Safety", value: "safety", color: "#ef4444" },
  { label: "Infrastructure", value: "infrastructure", color: "#328391" },
  { label: "Other", value: "other", color: "#3f3f46" },
];

export default function Analytics() {
  const { user, loading } = useAuth();

  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      setData(null);
      setFetching(false);
      return;
    }

    setFetching(true);

    const q = query(
      collection(db, "reports"),
      where("userId", "==", user.uid) // 🔥 IMPORTANT FILTER
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());

      const summary = {
        total: docs.length,
        by_status: { pending: 0, resolved: 0, "in progress": 0 },
        by_category: {},
        by_priority: { low: 0, medium: 0, high: 0, urgent: 0 },
      };

      docs.forEach(d => {
        const s = d.status?.toLowerCase() || "pending";
        if (summary.by_status[s] !== undefined) summary.by_status[s]++;

        const c = d.category?.toLowerCase() || "other";
        summary.by_category[c] = (summary.by_category[c] || 0) + 1;

        const p = d.priority?.toLowerCase() || "medium";
        if (summary.by_priority[p] !== undefined) summary.by_priority[p]++;
      });

      setData(summary);
      setFetching(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ GLOBAL LOADING STATE
  if (loading || fetching) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#09090b]">
        <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">
          Syncing Neural Data...
        </p>
      </div>
    );
  }

  // 🔒 NOT LOGGED IN
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
                <p className="text-zinc-400 text-sm">Please authenticate to access the analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🛡️ DATA SAFETY (prevents crash)
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-zinc-500">
        Preparing analytics...
      </div>
    );
  }

  // 📊 DATA PREP
  const catData = CATEGORIES.map((c) => ({
    name: c.label,
    value: data.by_category[c.value] || 0,
    color: c.color
  }));

  const statusData = [
    { name: "Pending", value: data.by_status.pending, color: "#f59e0b" },
    { name: "In Progress", value: data.by_status["in progress"], color: "#3b82f6" },
    { name: "Resolved", value: data.by_status.resolved, color: "#10b981" },
  ];

  const priorityData = [
    { name: "Low", value: data.by_priority.low, color: "#04d651" },
    { name: "Medium", value: data.by_priority.medium, color: "#dbd011" },
    { name: "High", value: data.by_priority.high, color: "#fc1500" },
    
  ];

  const kpis = [
    { label: "Total Reports", value: data.total, icon: TrendingUp, color: "text-blue-400" },
    { label: "Pending", value: data.by_status.pending, icon: AlertOctagon, color: "text-amber-400" },
    { label: "In Progress", value: data.by_status["in progress"], icon: Activity, color: "text-blue-500" },
    { label: "Resolved", value: data.by_status.resolved, icon: CheckCircle2, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white mb-10 uppercase">
          City Analytics
        </h1>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <span className="text-xs text-zinc-500">{k.label}</span>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">

          {/* CATEGORY */}
          <div className="lg:col-span-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-white mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={catData}>
                <CartesianGrid stroke="#27272a" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, "auto"]} /> {/* ✅ FIXED */}
                <Tooltip />
                <Bar dataKey="value">
                  {catData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        {/* STATUS WIDGET */}
<div className="lg:col-span-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-zinc-100 font-medium">System Status</h3>
    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Live</span>
  </div>

  <div className="flex flex-col sm:flex-row items-center gap-4">
    {/* Chart Container */}
    <div className="relative w-full sm:w-1/2" style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            cornerRadius={4}
            stroke="none"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} className="focus:outline-none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-white">
          {statusData.reduce((acc, curr) => acc + curr.value, 0)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Total</span>
      </div>
    </div>

    {/* Custom Legend */}
    <div className="w-full sm:w-1/2 space-y-3">
      {statusData.map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-zinc-400">{item.name}</span>
          </div>
          <span className="text-sm font-semibold text-zinc-200">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
</div>

          {/* PRIORITY */}
          <div className="lg:col-span-12 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-blue-500" size={16} />
              <h3 className="text-white">Priority</h3>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={priorityData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="value">
                  {priorityData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}