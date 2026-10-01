import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Star, Users, UserCheck, GraduationCap, Calendar, Compass, BookOpen, Trophy, Palette, RefreshCw } from 'lucide-react';
import { CommitteeMember } from '../types';

export default function Committee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommittee = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/committee');
      if (res.ok) {
        const data = await res.json();
        if (data.committeeMembers && Array.isArray(data.committeeMembers)) {
          setMembers(data.committeeMembers);
        }
      }
    } catch (err) {
      console.error('Failed to load committee members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  // Group dynamic members
  const dynamicExecLeadership = members.filter(m => m.committeeType === 'executive' && m.category === 'officer_leadership');
  const dynamicExecPortfolios = members.filter(m => m.committeeType === 'executive' && m.category === 'officer_portfolio');
  const dynamicExecMembers = members.filter(m => m.committeeType === 'executive' && m.category === 'executive_member');
  const dynamicCoOpt = members.filter(m => m.committeeType === 'executive' && m.category === 'co_opt_member');
  const dynamicAdvisory = members.filter(m => m.committeeType === 'advisory');

  const executiveTerm = "2026-2027";
  const advisoryTerm = "2025-2027";


  return (
    <div className="space-y-10 text-left" id="committee-page-container">
      
      {/* Cover Header - Modern 3D Glassmorphism Showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-dark rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(13,82,48,0.25)]"
      >
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Shield className="h-72 w-72 text-white" />
        </div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-amber-400/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-amber-400 text-slate-950 font-sans font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Official Board & Trust
            </span>
            <span className="text-[10px] bg-white/15 backdrop-blur-md text-emerald-200 border border-white/20 font-sans font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>Session Active • {executiveTerm}</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black uppercase tracking-tight text-white drop-shadow-md">
            Association Leadership & Committees
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl drop-shadow-xs">
            Meet the dedicated ex-students of Taki House Government Sponsored High School for Boys elected to steer organizational growth, academic sponsorships, reunions, and campus heritage maintenance.
          </p>
        </div>
      </motion.div>

      {/* Main Grid: Executive & Advisory Committees */}
      <div className="space-y-10">
        
        {/* SECTION 1: EXECUTIVE COMMITTEE */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0D5230]/20 pb-4 gap-2">
            <h3 className="text-xl font-serif font-black text-[#0D5230] uppercase tracking-tight flex items-center gap-2.5">
              <Shield className="h-6 w-6" />
              <span>Executive Committee</span>
              <span className="text-[#0D5230] font-sans font-bold text-xs bg-emerald-100/80 border border-emerald-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                {executiveTerm}
              </span>
            </h3>
            <p className="text-slate-500 text-xs font-sans italic">
              Governing structure & primary operational office
            </p>
          </div>

          {/* Empty state notice */}
          {members.length === 0 && !loading && (
            <div className="glass-panel border border-white/60 p-8 text-center rounded-2xl space-y-2 my-4">
              <Shield className="h-10 w-10 text-[#0D5230]/40 mx-auto" />
              <h4 className="font-serif font-black text-[#0D5230] text-base">Executive Board & Advisory Committee</h4>
              <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
                No board members listed yet. Executive board officers and advisory trustees will appear here once published by the administration from the Admin Panel.
              </p>
            </div>
          )}

          {/* Core Leadership Cards (President, Mentor, Convenor, Working President, Gen Sec) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dynamicExecLeadership.map((leader, idx) => (
              <div 
                key={leader.id || idx}
                className="card-3d glass-panel-elevated p-6 rounded-2xl border border-white/80 shadow-[0_8px_25px_rgba(13,82,48,0.06)] flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-[#0D5230]/5 rounded-bl-full flex items-start justify-end p-2.5">
                  <Award className="h-4 w-4 text-[#0D5230]" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[9px] uppercase tracking-wider bg-emerald-100 text-[#0D5230] px-2.5 py-0.5 font-sans font-black inline-block rounded-full">
                    {leader.roleTitle}
                  </span>
                  <h4 className="font-serif font-black text-[#1A1A1A] text-lg group-hover:text-[#0D5230] transition-colors leading-tight">
                    {leader.name}
                  </h4>
                  {leader.batchYear && (
                    <span className="text-xs text-slate-500 font-sans font-bold block">
                      {leader.batchYear === 'Headmistress' ? '🏫 Headmistress' : `🎓 Batch: ${leader.batchYear}`}
                    </span>
                  )}
                  {leader.description && (
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed pt-2 border-t border-dashed border-slate-200">
                      {leader.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Section: Secondary Portfolios (SVP, VP, AGS, Treasurer, Maintainance, Office Sec, Asst Sec) */}
          {dynamicExecPortfolios.length > 0 && (
            <div className="bg-slate-50 p-6 border-2 border-dashed border-[#0D5230]/20 space-y-6">
              <h4 className="text-xs font-sans font-black uppercase text-[#0D5230] tracking-wider border-b border-[#0D5230]/15 pb-2 flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Office Bearers & Portfolio Leads</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(
                  dynamicExecPortfolios.reduce((acc, m) => {
                    if (!acc[m.roleTitle]) acc[m.roleTitle] = [];
                    acc[m.roleTitle].push(m);
                    return acc;
                  }, {} as Record<string, CommitteeMember[]>)
                ).map(([roleTitle, items], idx) => {
                  const memberItems = items as CommitteeMember[];
                  return (
                    <div key={idx} className="space-y-2">
                      <span className="text-[10px] uppercase font-sans font-extrabold text-slate-500 tracking-wider block">
                        ♦️ {roleTitle}
                      </span>
                      <div className="space-y-1.5">
                        {memberItems.map((item, i) => (
                          <div 
                            key={item.id || i}
                            className="bg-white p-2.5 border border-slate-200 hover:border-[#0D5230] transition-colors flex items-center justify-between"
                          >
                            <span className="font-serif font-bold text-xs text-slate-800">{item.name}</span>
                            {item.batchYear && (
                              <span className="text-[10px] font-mono font-bold text-[#0D5230] bg-[#0D5230]/5 px-2 py-0.5 uppercase">
                                Class {item.batchYear}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Members & Co-opt Members */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Committee Members */}
            <div className="lg:col-span-1 space-y-4">
              <h4 className="text-xs font-sans font-black uppercase text-slate-700 tracking-wider pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[#0D5230]" />
                <span>Executive Committee Members</span>
              </h4>

              <div className="space-y-2">
                {dynamicExecMembers.map((m, idx) => (
                  <div key={m.id || idx} className="bg-white p-3 border border-slate-200 hover:border-[#0D5230] flex items-center justify-between font-sans transition-all">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold text-xs">{idx + 15})</span>
                      <span className="font-serif font-bold text-xs text-slate-800">{m.name}</span>
                    </div>
                    {m.batchYear && (
                      <span className="text-[10px] font-mono font-bold text-[#0D5230] bg-[#0D5230]/5 px-2 py-0.5 uppercase">
                        Class {m.batchYear}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Co-opted Members */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-sans font-black uppercase text-slate-700 tracking-wider pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <span>Co-Opted Board Members (Co. Opt.)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dynamicCoOpt.map((m, idx) => (
                  <div key={m.id || idx} className="bg-white p-3 border border-slate-200 hover:border-emerald-600 flex items-center gap-2 font-sans transition-all">
                    <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 uppercase tracking-wide">
                      Co-Opt {idx + 1}
                    </span>
                    <span className="font-serif font-bold text-xs text-slate-800">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: ADVISORY COMMITTEE */}
        <div className="space-y-6 pt-6 border-t-2 border-dashed border-[#0D5230]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-amber-600 pb-3 gap-2">
            <h3 className="text-xl font-serif font-black text-amber-900 uppercase tracking-tight flex items-center gap-2.5">
              <GraduationCap className="h-6 w-6 text-amber-600" />
              <span>Advisory Committee</span>
              <span className="text-amber-800 font-sans font-bold text-sm bg-amber-100 border border-amber-200 px-2.5 py-0.5 uppercase tracking-wide">
                {advisoryTerm}
              </span>
            </h3>
            <p className="text-slate-500 text-xs font-sans italic">
              Senior stalwarts guiding organizational vision
            </p>
          </div>

          <p className="text-slate-600 font-serif italic text-xs max-w-3xl leading-relaxed">
            The Advisory Committee represents the foundational wisdom of Taki House. Comprising senior ex-students across legacy batches, their insights preserve the original spirit of scholastic leadership, ethical governance, and strategic planning.
          </p>

          {/* Advisory Members Grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dynamicAdvisory.map((m, idx) => {
              const isSpecial = m.specialTag;
              
              return (
                <div 
                  key={m.id || idx}
                  className={`p-3 border transition-all flex items-center gap-3 shadow-2xs relative overflow-hidden group ${
                    isSpecial === 'sports'
                      ? 'bg-gradient-to-br from-green-50/70 to-emerald-50/40 border-emerald-500 hover:border-[#0D5230] hover:shadow-[3px_3px_0px_0px_rgba(16,185,129,0.2)]'
                      : isSpecial === 'cultural'
                      ? 'bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-amber-500 hover:border-amber-600 hover:shadow-[3px_3px_0px_0px_rgba(245,158,11,0.2)]'
                      : 'bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/20'
                  }`}
                >
                  {isSpecial && (
                    <div className={`absolute top-0 right-0 h-8 w-8 rounded-bl-full flex items-start justify-end p-1 ${
                      isSpecial === 'sports' ? 'bg-emerald-100/60' : 'bg-amber-100/60'
                    }`}>
                      {isSpecial === 'sports' ? (
                        <Trophy className="h-3 w-3 text-emerald-700" />
                      ) : (
                        <Palette className="h-3 w-3 text-amber-700" />
                      )}
                    </div>
                  )}

                  <div className={`h-6 w-6 shrink-0 font-sans font-bold text-[10px] rounded-full flex items-center justify-center ${
                    isSpecial === 'sports'
                      ? 'bg-emerald-200 text-emerald-900'
                      : isSpecial === 'cultural'
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="truncate text-left">
                    <span className="font-serif font-black text-xs text-slate-900 block truncate group-hover:text-[#0D5230] transition-colors">{m.name}</span>
                    <span className={`text-[8px] font-sans uppercase font-bold block tracking-wider ${
                      isSpecial === 'sports'
                        ? 'text-emerald-700'
                        : isSpecial === 'cultural'
                        ? 'text-amber-800'
                        : 'text-slate-400'
                    }`}>
                      {m.roleTitle || "Advisory Trustee"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* SECTION 3: SPECIALIZED ACTIVITY SPACES (Sports & Cultural) */}
        <div className="space-y-6 pt-8 border-t-2 border-dashed border-[#0D5230]/20">
          <div className="flex items-center gap-2.5 border-b-2 border-[#0D5230] pb-3">
            <Trophy className="h-6 w-6 text-emerald-700" />
            <h3 className="text-xl font-serif font-black text-[#0D5230] uppercase tracking-tight">
              Specialized Activity Spaces
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sports Space Box */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 border-2 border-[#0D5230] p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-700" />
                    <h4 className="font-serif font-black text-sm uppercase tracking-wider text-emerald-950">
                      Sports & Athletics Space
                    </h4>
                  </div>
                  <span className="text-[9px] font-sans font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 uppercase tracking-wider border border-emerald-300">
                    Active Sub-Wing
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Steered by our Sports Advisory team to maintain the robust sporting heritage of Taki House. We promote athletic excellence, health, and friendly competition among legacy alumni and current students.
                </p>

                <div className="space-y-2 border-t border-dashed border-emerald-600/20 pt-4">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Annual Alumni Cricket Tournament:</strong> An inter-batch league bringing together vintage and recent class passouts on the school grounds.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Friendly Football Face-offs:</strong> Legacy matches organized to foster deep camaraderie and mentorship with current school team players.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Coaching & Kit Sponsorships:</strong> Donating professional athletic gears, boots, and funding professional weekend coaches for Taki Boys.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between bg-emerald-100/40 p-3">
                <div className="text-left">
                  <span className="text-[8px] uppercase font-sans font-black text-emerald-700 tracking-wider block">Sports Lead</span>
                  <span className="font-serif font-black text-xs text-slate-900">Mr. Sayantan Roy</span>
                </div>
                <span className="text-[10px] font-sans font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                  Sports Advisory
                </span>
              </div>
            </div>

            {/* Cultural Space Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border-2 border-amber-600 p-6 shadow-[4px_4px_0px_0px_rgba(217,119,6,0.15)] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-amber-700" />
                    <h4 className="font-serif font-black text-sm uppercase tracking-wider text-amber-950">
                      Cultural & Literary Space
                    </h4>
                  </div>
                  <span className="text-[9px] font-sans font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 uppercase tracking-wider border border-amber-300">
                    Active Sub-Wing
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Led by our Cultural Advisory board to celebrate and preserve Bengal’s rich literary, theatrical, and artistic legacy. We bridge generations through reunions, musical soirées, and publications.
                </p>

                <div className="space-y-2 border-t border-dashed border-amber-600/20 pt-4">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Reunion Cultural Gala (Sammilani):</strong> Hosting high-grade musical, dramatic, and poetic performances starring both professional alumni artists and student groups.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Milon Patrika Souvenir:</strong> Sponsoring and publishing our premium annual literary magazine, featuring nostalgic columns, art, and poetry.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Heritage Festivals:</strong> Active support and celebrations during Saraswati Puja, Rabindra Jayanti, and school foundation milestones.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between bg-amber-50 p-3">
                <div className="text-left">
                  <span className="text-[8px] uppercase font-sans font-black text-amber-700 tracking-wider block">Cultural Lead</span>
                  <span className="font-serif font-black text-xs text-slate-900">Mr. Sayanu Chandra</span>
                </div>
                <span className="text-[10px] font-sans font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  Cultural Advisory
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Footer Badge */}
      <div className="p-6 bg-slate-50 border border-slate-200 text-center space-y-1 font-sans">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Institutional Seal</span>
        <h4 className="text-xs font-serif font-bold text-[#0D5230]">Taki House Government Sponsored High School for Boys Alumni Trust</h4>
        <p className="text-[10px] text-slate-500 max-w-md mx-auto leading-relaxed">
          The names and positions listed above represent the formal executive ledger duly verified for the ongoing academic term. For changes or queries, reach out to the General Secretariat.
        </p>
      </div>

    </div>
  );
}
