import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Globe, ChevronDown, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Path adjusted to your folder structure
import { db, storage } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CATEGORIES = [
    { label: "Water", value: "water", color: "#38bdf8" },
    { label: "Electricity", value: "electricity", color: "#fbbf24" },
    { label: "Roads", value: "roads", color: "#f97316" },
    { label: "Garbage", value: "garbage", color: "#84cc16" },
    { label: "Cyber", value: "cyber", color: "#a855f7" },
    { label: "Public Safety", value: "safety", color: "#ef4444" },
    { label: "Infrastructure", value: "infrastructure", color: "#06b6d4" },
    { label: "Other", value: "other", color: "#64748b" },
];

const PRIORITIES = [
    { label: "Low", value: "low", color: "#22c55e" },
    { label: "Medium", value: "medium", color: "#eab308" },
    { label: "High", value: "high", color: "#ef4444" },
];

const INITIAL_STATE = {
    title: "",
    description: "",
    category: "",
    priority: "medium",
    state: "",
    city: "",
    area: "",
    location_text: "",
};

export default function ReportForm({ user }) {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(INITIAL_STATE);

    useEffect(() => {
        if (!file) return setPreview(null);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !user) {
            toast.error(user ? "Title is required" : "Please log in first");
            return;
        }

        setSubmitting(true);
        console.log("Starting upload for user:", user.uid); // Debugging line

        try {
            let imageUrl = null;

            // Only try to upload if a file exists AND storage is ready
            if (file) {
                try {
                    const fileRef = ref(storage, `reports/${user.uid}/${Date.now()}_${file.name}`);
                    const uploadResult = await uploadBytes(fileRef, file);
                    imageUrl = await getDownloadURL(uploadResult.ref);
                } catch (storageErr) {
                    console.error("Storage Error:", storageErr);
                    toast.error("Image upload failed, but we'll try to save the text.");
                }
            }

            // Save to Firestore
            await addDoc(collection(db, "reports"), {
                ...form,
                userId: user.uid,
                userEmail: user.email,
                imageUrl: imageUrl, // This will be null if image failed, but data still saves!
                status: "pending",
                createdAt: serverTimestamp(),
            });

            toast.success("Activity Logged!");

            // RESET FORM
            setForm(INITIAL_STATE);
            setFile(null);
            setPreview(null);

        } catch (error) {
            console.error("Database Error Details:", error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setForm(INITIAL_STATE);
        setFile(null);
        setPreview(null);
        toast.success("Form cleared");
    };
    const inputStyle = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 transition-all";
    const labelStyle = "text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-widest";

    return (
        <div className="w-full text-slate-200 p-4 min-h-screen bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
                        Database Uplink Active
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
                        Submit Civic <span className="text-blue-500">Report</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8 shadow-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className={labelStyle}>Issue Title <span className="text-red-500">*</span></label>
                            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Summary..." className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>Detailed Description <span className="text-red-500">*</span></label>
                            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Explain the issue in detail..." rows={4} className={inputStyle} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>Categorization</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORIES.find(c => c.value === form.category)?.color || '#334155' }} />
                                </div>
                                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={`${inputStyle} appearance-none pl-10`}>
                                    <option value="" disabled className="bg-[#111]">Select Category</option>
                                    {CATEGORIES.map((c) => (<option key={c.value} value={c.value} className="bg-[#111]">{c.label}</option>))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Priority Level</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRIORITIES.find(p => p.value === form.priority)?.color || '#334155' }} />
                                </div>
                                <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={`${inputStyle} appearance-none pl-10`}>
                                    {PRIORITIES.map((p) => (<option key={p.value} value={p.value} className="bg-[#111]">{p.label}</option>))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                            <Globe className="w-4 h-4 text-blue-500" /> Location Details
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} className={`${inputStyle} text-sm`} />
                            <input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} className={`${inputStyle} text-sm`} />
                            <input placeholder="Area" value={form.area} onChange={(e) => set("area", e.target.value)} className={`${inputStyle} text-sm`} />
                        </div>
                    </div>
                    {/* 
          <div>
            <label className={labelStyle}>Visual Evidence</label>
            {!preview ? (
              <div className="relative border border-dashed border-white/10 rounded-2xl p-10 text-center bg-black/20 hover:border-blue-500/50 group cursor-pointer">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                <Upload className="w-8 h-8 text-slate-700 mx-auto mb-2 group-hover:text-blue-500" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Attach Evidence</p>
              </div>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-video max-h-64">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <button type="button" onClick={() => setFile(null)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase">Remove</button>
                </div>
              </div>
            )}
          </div> */}

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 text-slate-500 text-xs font-black uppercase hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase shadow-lg disabled:opacity-50 flex items-center gap-3">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finalize Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}