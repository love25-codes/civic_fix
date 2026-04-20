import React, { useState, useEffect } from "react";
import { login, signup } from "../services/authService";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Lock, User, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AuthModal({ open, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear fields when modal closes/opens
 useEffect(() => {
  if (!open) {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setIsSubmitting(false); // ✅ IMPORTANT FIX
    setIsLogin(true);       // reset mode on close
  }
}, [open]);

  if (!open) return null;
const handleAuth = async (e) => {
  if (e) e.preventDefault();
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    if (isLogin) {
      await login(email, password);
      toast.success("Welcome back!");
    } else {
      await signup(name, email, password);
      toast.success("Account created successfully!");
    }

    // ✅ reset FIRST, then close modal
    setIsSubmitting(false);
    onClose();

  } catch (err) {
    toast.error(err?.message || "Something went wrong");
    setIsSubmitting(false);
  }
};
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center w-full h-screen overflow-hidden p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity"
        onClick={onClose} 
      />

      <div className="relative z-[1001] w-full max-w-[420px] bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />

        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400 fill-current" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Auth Shield</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                {isLogin ? "Sign In" : "Join Up"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400" />
                <input
                  required
                  type="text"
                  value={name}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black/40 border border-white/5 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400" />
              <input
                required
                type="email"
                value={email}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-black/40 border border-white/5 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                className="w-full pl-14 pr-14 py-4 rounded-2xl bg-black/40 border border-white/5 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-6 flex items-center justify-center gap-3 bg-blue-600 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : isLogin ? "Verify Identity" : "Create Account"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest hover:text-white"
            >
              {isLogin ? "Need Access? " : "Already Registered? "}
              <span className="text-blue-400 ml-1 underline underline-offset-8">
                {isLogin ? "Register" : "Login"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}