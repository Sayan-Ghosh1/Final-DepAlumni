import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { UserProfile, MembershipStatus, AlumniNotice, Announcement, RenewalSubmission } from '../types';
import FormattedText from './FormattedText';
import { 
  Award, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Heart,
  Phone,
  CreditCard,
  Megaphone,
  Pin,
  Trash2,
  XCircle,
  ShieldAlert,
  RotateCcw,
  KeyRound,
  Eye,
  EyeOff,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import MembershipCard from './MembershipCard';

interface DashboardHomeProps {
  user?: UserProfile | null;
  onNavigate: (tab: string) => void;
  stats: {
    totalAlumni: number;
    activeChats: number;
    upcomingEvents: number;
  };
}

export default function DashboardHome({ user, onNavigate, stats }: DashboardHomeProps) {
  const isExpired = user ? (user.membershipStatus === MembershipStatus.EXPIRED || user.membershipStatus === MembershipStatus.NOT_MEMBER) : false;
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [notices, setNotices] = useState<AlumniNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const [latestRenewal, setLatestRenewal] = useState<RenewalSubmission | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (!user?.email) {
      setPwdError('You must be signed in to change password.');
      return;
    }
    if (!oldPassword.trim()) {
      setPwdError('Please enter your current (old) password.');
      return;
    }
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdError(data.error || 'Failed to update password.');
      } else {
        setPwdSuccess('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPwdSuccess('');
        }, 1800);
      }
    } catch (err) {
      setPwdError('An error occurred while communicating with the server.');
    } finally {
      setPwdLoading(false);
    }
  };

  useEffect(() => {
    const fetchNoticesAndAnnouncements = async () => {
      try {
        const emailParam = user?.email ? encodeURIComponent(user.email) : '';
        const [noticesRes, annRes, renewalsRes] = await Promise.all([
          fetch('/api/notices').catch(err => {
            console.warn('Could not fetch notices:', err);
            return null;
          }),
          fetch('/api/announcements').catch(err => {
            console.warn('Could not fetch announcements:', err);
            return null;
          }),
          emailParam ? fetch(`/api/membership/my-renewals?email=${emailParam}`).catch(err => {
            console.warn('Could not fetch user renewals:', err);
            return null;
          }) : Promise.resolve(null)
        ]);

        if (noticesRes && noticesRes.ok) {
          const data = await noticesRes.json().catch(() => null);
          if (data && Array.isArray(data.notices)) {
            setNotices(data.notices);
          }
        }
        if (annRes && annRes.ok) {
          const data = await annRes.json().catch(() => null);
          if (data && Array.isArray(data.announcements)) {
            setAnnouncements(data.announcements);
          }
        }
        if (renewalsRes && renewalsRes.ok) {
          const data = await renewalsRes.json().catch(() => null);
          if (data && Array.isArray(data.renewals) && data.renewals.length > 0) {
            setLatestRenewal(data.renewals[0]);
          }
        }
      } catch (err) {
        console.error('Error loading notices/announcements on home:', err);
      } finally {
        setNoticesLoading(false);
        setAnnouncementsLoading(false);
      }
    };
    fetchNoticesAndAnnouncements();
  }, [user?.email]);

  const handleDeleteAnnouncement = async (annId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    try {
      const response = await fetch(`/api/announcements/${annId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': user?.role === 'admin' ? 'admin' : '',
          'x-user-email': user?.email || ''
        }
      });

      if (response.ok) {
        setAnnouncements(prev => prev.filter(a => String(a.id) !== String(annId)));
      } else {
        const data = await response.json().catch(() => ({}));
        console.warn(data.error || "Failed to delete announcement.");
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  return (
    <div className="space-y-8" id="dashboard-home">
      
      {/* 1. Welcoming Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white border-2 border-[#0D5230] p-6 sm:p-8 overflow-hidden shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]"
        id="dashboard-welcome-banner"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(13,82,48,0.06),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/30">Roll: {user?.rollNumber || "GUEST"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D5230] uppercase tracking-tight">
              Welcome back, {user?.name || "ESTEEMED ALUMNUS"}!
            </h2>
            <p className="text-slate-700 max-w-xl text-sm sm:text-base font-sans leading-relaxed">
              You are recognized as part of the esteemed <strong className="text-[#0D5230] font-bold">Class of {user?.batchYear || "Alumni"}</strong>. This digital portal helps you keep in touch with the historical times and values of Taki House.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {latestRenewal?.status === 'rejected' ? (
              <div className="p-4 bg-red-50 border-2 border-red-800 flex items-center gap-3.5 max-w-sm text-[#1A1A1A] shadow-xs">
                <XCircle className="h-7 w-7 text-red-700 shrink-0" />
                <div className="text-left font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-red-800 uppercase tracking-wider block">Renewal Status</span>
                    <span className="px-1.5 py-0.2 bg-red-700 text-white text-[9px] font-bold uppercase rounded font-mono">Rejected</span>
                  </div>
                  <span className="text-xs font-bold text-red-900 block mt-0.5">Admin Rejected Application</span>
                  <p className="text-[10px] text-slate-700 line-clamp-1 mt-0.5">{latestRenewal.rejectionReason || 'Details unverified.'}</p>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-red-800 hover:underline font-bold mt-1.5 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>View Reason & Resubmit</span>
                  </button>
                </div>
              </div>
            ) : latestRenewal?.status === 'pending' ? (
              <div className="p-4 bg-amber-50 border-2 border-amber-600 flex items-center gap-3.5 max-w-xs text-[#1A1A1A] shadow-xs">
                <Clock className="h-6 w-6 text-amber-700 shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-amber-800 block uppercase tracking-wider">Renewal Status</span>
                  <span className="text-sm font-bold text-amber-900">Pending Admin Approval</span>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-amber-800 hover:underline font-bold mt-1 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Check Status & Receipt</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : isExpired ? (
              <div className="p-4 bg-red-50 border-2 border-red-800/80 flex items-center gap-3.5 max-w-xs text-[#1A1A1A]">
                <AlertTriangle className="h-6 w-6 text-red-800 shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-red-800 block uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-bold text-slate-800">Expired ({user?.membershipTier || 'GUEST'})</span>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-green-800 hover:underline font-bold mt-1 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Renew Standing Membership</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border-2 border-[#0D5230] flex items-center gap-3.5 max-w-xs text-[#1A1A1A]">
                <CheckCircle className="h-6 w-6 text-[#0D5230] shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-[#0D5230] block uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-bold text-slate-800">{user ? `Active (${user.membershipTier})` : 'Guest / Visitor'}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{user?.membershipExpiry ? `Expiry: ${user.membershipExpiry}` : 'Sign in to access benefits'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News & Announcements & Events (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-10" id="announcements-section">

          {/* Real-time Notice Board Circulars */}
          <div className="space-y-6" id="realtime-noticeboard-widget">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0D5230]/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 border border-amber-500/20 text-amber-800 rounded">
                  <Megaphone className="h-4.5 w-4.5 text-[#0D5230] animate-bounce" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-[#0D5230] font-serif uppercase tracking-tight">
                    Live Notice Board & Community Circulars
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Real-time requests and official boards updated by the alumni.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('notices')}
                className="self-start sm:self-auto text-xs font-bold text-[#0D5230] hover:text-[#0A4025] hover:underline flex items-center gap-1 font-sans cursor-pointer bg-green-50 border border-[#0D5230]/20 px-3 py-1.5"
              >
                <span>View Full Board</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {noticesLoading ? (
              <div className="py-8 text-center bg-white border border-slate-200">
                <span className="text-xs text-slate-400 font-mono">Updating community circulars...</span>
              </div>
            ) : notices.length === 0 ? (
              <div className="p-6 bg-white border-2 border-[#0D5230]/10 text-center font-sans">
                <p className="text-xs text-slate-400 italic">No notices posted yet. Be the first to publish a circular!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.slice(0, 2).map((notice) => {
                  const isUrgent = notice.category === 'Urgent';
                  return (
                    <div 
                      key={notice.id}
                      onClick={() => onNavigate('notices')}
                      className={`p-4 border-2 text-left cursor-pointer transition-all hover:scale-[1.01] ${
                        notice.isPinned
                          ? 'bg-amber-50/50 border-amber-400 shadow-[2px_2px_0px_0px_rgba(245,158,11,0.15)]'
                          : isUrgent
                          ? 'bg-red-50/40 border-red-400 shadow-[2px_2px_0px_0px_rgba(220,38,38,0.1)]'
                          : 'bg-white border-slate-200 hover:border-[#0D5230]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 text-[8px] font-sans font-black uppercase tracking-wider border ${
                          notice.isPinned
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : isUrgent
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {notice.isPinned && <Pin className="h-2 w-2 inline mr-0.5 fill-amber-800" />}
                          {notice.category}
                        </span>
                        
                        <span className="text-[9px] font-mono text-slate-400">
                          {new Date(notice.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold font-serif text-slate-900 leading-tight line-clamp-1">
                        {notice.title}
                      </h4>
                      
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed mt-1 line-clamp-2">
                        <FormattedText text={notice.content} />
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[9px] text-slate-400 font-sans">
                        <span className="font-bold text-slate-600 truncate max-w-[100px]">{notice.postedBy?.name || "TBAAK Admin"}</span>
                        <span>•</span>
                        <span>Class of {notice.postedBy?.batchYear || "2008"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Announcements sub-section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
                <BookOpen className="h-5 w-5 text-[#0D5230]" />
                <span>Announcements & School Updates</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">Updated today</span>
            </div>

            <div className="space-y-4">
              {announcementsLoading ? (
                <div className="p-4 text-center border-2 border-dashed border-slate-200 text-slate-400 text-xs">
                  Loading announcements...
                </div>
              ) : announcements.length === 0 ? (
                <div className="p-4 text-center border-2 border-dashed border-slate-200 text-slate-400 text-xs">
                  No announcements published yet.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    className={`p-5 border-2 transition-all ${
                      ann.isHighlight 
                        ? "bg-green-50/50 border-[#0D5230] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]" 
                        : "bg-white border-slate-300 hover:border-[#0D5230] hover:bg-green-50/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
                        ann.isHighlight 
                          ? "bg-[#0D5230] text-white" 
                          : "bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/20"
                      }`}>
                        {ann.tag}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {ann.date}
                        </span>
                        {user?.role === 'admin' && (
                          <button
                            onClick={(e) => handleDeleteAnnouncement(ann.id, e)}
                            className="p-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer rounded"
                            title="Delete announcement"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h4 className="text-md font-bold text-[#1A1A1A] hover:text-[#0D5230] transition-colors cursor-pointer font-serif">
                      {ann.title}
                    </h4>
                    <p className="text-slate-600 text-sm mt-1.5 leading-relaxed font-sans">
                      <FormattedText text={ann.desc} />
                    </p>
                    {ann.isHighlight && (
                      <div className="mt-4 pt-3 border-t border-dashed border-[#0D5230]/20 flex justify-end">
                        <button 
                          onClick={() => onNavigate('chat')}
                          className="text-xs font-bold text-[#0D5230] hover:text-[#0A4025] hover:underline flex items-center gap-1 cursor-pointer font-sans"
                        >
                          <span>Discuss with batchmates in chat</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Editorial Events List removed as requested */}
        </div>

        {/* Sidebar: Heritage & Quick Profile (Right 1 column) */}
        <div className="space-y-6" id="dashboard-sidebar">
          
          {/* Quick Profile Overview */}
          <div className="bg-white border-2 border-[#0D5230] p-5 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider mb-4 border-b border-[#0D5230]/30 pb-2 font-sans">
              My Alumnus Profile
            </h4>
            
            <div className="flex items-center gap-3.5 mb-4">
              <img 
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                alt={user?.name || "Guest Visitor"} 
                className="h-12 w-12 rounded-full border-2 border-[#0D5230] object-cover bg-slate-100"
              />
              <div>
                <span className="font-serif font-black text-md text-[#1A1A1A] block leading-tight">{user?.name || "Guest Visitor"}</span>
                <span className="text-xs text-slate-500 font-sans block mt-0.5">Class of {user?.batchYear || "---"} • {user?.occupation || "Alumnus Visitor"}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300">
                <span className="text-slate-500">Official Email:</span>
                <span className="text-slate-800 font-mono font-bold">{user?.email || "Not Signed In"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="text-slate-800 font-bold">{user?.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300">
                <span className="text-slate-500">Current Base:</span>
                <span className="text-slate-800 font-bold flex items-center gap-0.5">
                  <MapPin className="h-3 w-3 text-red-600" />
                  {user?.location || "Kolkata"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Tier Status:</span>
                <span className="text-[#0D5230] font-bold uppercase tracking-wider">{user?.membershipTier || "GUEST"}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsCardOpen(true)}
              className="w-full mt-4 bg-[#0D5230] hover:bg-[#0A4025] text-white text-xs py-2.5 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CreditCard className="h-4 w-4 text-amber-300" />
              <span>Digital Membership Card</span>
            </button>

            <button 
              onClick={() => {
                setOldPassword('');
                setNewPassword('');
                setPwdError('');
                setPwdSuccess('');
                setIsPasswordModalOpen(true);
              }}
              className="w-full mt-2.5 bg-white hover:bg-[#0D5230]/5 text-[#0D5230] border-2 border-[#0D5230] text-xs py-2.5 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <KeyRound className="h-4 w-4 text-[#0D5230]" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Executive Committee Board Spotlight */}
          <div className="bg-white border-2 border-[#0D5230] p-5 space-y-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#0D5230]" />
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Executive Committee
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Meet the active elected members of the Taki Boys Alumni Executive Committee & Advisory Committee presiding over the current session.
            </p>

            <button 
              onClick={() => onNavigate('committee')}
              className="w-full border-2 border-[#0D5230] hover:bg-[#0D5230]/5 text-[#0D5230] text-xs py-2 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Executive Board</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>



          {/* Contact us hotline spotlight */}
          <div className="bg-white border-2 border-[#0D5230] p-5 space-y-4 shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#0D5230]" />
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Contact Secretariat
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Have queries about lifetime memberships, certificates, or donation receipts? Get in touch with our board or locate us in Kolkata.
            </p>

            <div className="text-[11px] font-sans text-slate-500 space-y-1 bg-slate-50 p-2.5 border border-dashed border-[#0D5230]/20">
              <p>📍 <span className="font-bold">Address:</span> 299/B, A.P.C. Road</p>
              <p>📧 <span className="font-bold">Email:</span> takiboys.alumni@gmail.com</p>
              <p>📞 <span className="font-bold">Gen Sec:</span> +91 89816 09498</p>
            </div>

            <button 
              onClick={() => onNavigate('contact')}
              className="w-full border-2 border-[#0D5230] hover:bg-[#0D5230]/5 text-[#0D5230] text-xs py-2 text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Get in Touch</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      <MembershipCard user={user} isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border-2 border-[#0D5230] max-w-md w-full p-6 shadow-[8px_8px_0px_0px_rgba(13,82,48,0.3)] relative text-left"
          >
            <button 
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors p-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b-2 border-[#0D5230] pb-3 mb-5">
              <div className="h-10 w-10 bg-[#0D5230] text-white flex items-center justify-center shrink-0">
                <KeyRound className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#0D5230] uppercase tracking-tight">
                  Change Password
                </h3>
                <p className="text-xs text-slate-600">
                  Update credentials for <span className="font-mono font-bold text-slate-800">{user.email}</span>
                </p>
              </div>
            </div>

            {pwdError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs font-medium flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 text-xs font-medium flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Old Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 focus:border-[#0D5230] focus:bg-white text-sm font-sans outline-none pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 focus:border-[#0D5230] focus:bg-white text-sm font-sans outline-none pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="px-5 py-2 bg-[#0D5230] hover:bg-[#0A4025] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-colors disabled:opacity-60"
                >
                  {pwdLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
