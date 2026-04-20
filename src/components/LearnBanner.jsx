import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Megaphone, ArrowRight, ShieldCheck, Zap, Droplets, ShieldAlert, Construction, Lightbulb, Car, Trash2, Siren, Plus } from 'lucide-react';

function LearnBanner() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = ["a pothole.", "trash piles.", "water leaks.", "cyber fraud.", "waste piles."];
  const bgImage = "https://i.pinimg.com/1200x/03/2d/f8/032df87f6225ddb4188f4c3a502c68de.jpg";

  // Domain Categories with specific brand colors
  const domains = [
    { label: "Water", icon: Droplets, color: "text-cyan-400" },
    { label: "Cyber", icon: ShieldAlert, color: "text-red-500" },
    { label: "Structure", icon: Construction, color: "text-orange-400" },
    { label: "Electric", icon: Lightbulb, color: "text-yellow-400" },
    { label: "Roads", icon: Car, color: "text-blue-400" },
    { label: "Garbage", icon: Trash2, color: "text-green-400" },
    { label: "Safety", icon: Siren, color: "text-purple-400" },
    { label: "Other", icon: Plus, color: "text-zinc-400" },
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentFullText = phrases[loopIndex % phrases.length];
      const updatedText = isDeleting 
        ? currentFullText.substring(0, displayText.length - 1)
        : currentFullText.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === currentFullText) {
        setTimeout(() => setIsDeleting(true), 2000); 
        setTypingSpeed(100);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopIndex(loopIndex + 1);
        setTypingSpeed(150);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopIndex, typingSpeed]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-black overflow-hidden flex items-center">
      
      {/* Background Layer: Adjusted for full-screen visibility */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${bgImage})`,
          backgroundBlendMode: 'overlay'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        
        {/* Left Side: Content */}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em]">
            <Zap className="w-3 h-3 fill-current" />
            Citizen Empowerment Platform
          </div>

          {/* Headline - Fixed min-height to prevent layout jump */}
          <div className="space-y-2 min-h-[160px] md:min-h-[200px]">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight">
              REPORT <br />
              <span className="text-blue-600 italic">{displayText}</span>
              <span className="inline-block w-2 h-12 md:h-20 bg-white ml-3 align-middle animate-pulse"></span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-600 tracking-tighter uppercase italic">
              Fix your city.
            </h2>
          </div>

          <p className="max-w-md text-zinc-400 text-lg leading-relaxed font-medium">
            CivicFix is the <span className="text-white">exclusive digital bridge</span> for citizens. 
            Directly notify authorities and track every resolution in real-time.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <NavLink to="/report" className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
              <Megaphone className="w-4 h-4" />
              Report Now
            </NavLink>
            <NavLink to="/dashboard" className="group flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-800 text-zinc-400 rounded-full font-black text-sm uppercase tracking-widest hover:border-white hover:text-white transition-all">
              Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>

        {/* Right Side: Tech Card */}
        <div className="hidden lg:block relative group">
          <div className="absolute -inset-10 bg-blue-600/10 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl p-4 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 ">
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-tight">Citizens' Portal</h3>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Verification</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              </div>

              {/* Enhanced Domain Grid with Colors */}
              <div className="grid grid-cols-2 gap-3">
                {domains.map((domain, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col gap-3 p-5 rounded-2xl bg-black/40 border border-zinc-800/50 transition-all duration-300  hover:border-blue-500/30 group/item"
                  >
                    <domain.icon className={`w-6 h-6 ${domain.color} transition-transform group-hover/item:scale-110`} />
                    <span className="text-zinc-400 group-hover/item:text-white text-xs font-black uppercase tracking-widest transition-colors">
                      {domain.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-2 pt-2 border-t border-zinc-900 text-center">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                  Encrypted Reporting Enabled
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Horizontal Bar */}
      <div className="absolute bottom-10 w-full flex justify-center opacity-30">
         <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
         <p className="mx-8 text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
           Universal Citizen Gateway
         </p>
         <div className="h-[1px] w-1/4 bg-gradient-to-r from-zinc-500 via-zinc-500 to-transparent" />
      </div>
    </div>
  );
}

export default LearnBanner;