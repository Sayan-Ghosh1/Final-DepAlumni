import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { UserProfile, MembershipStatus, AlumniNotice, Announcement, RenewalSubmission } from '../types';
import FormattedText from './FormattedText';
import { 
  Award, 
  Users, 
  MessageSquare, 
  Sparkles,
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

  // Campus & Heritage Visual Showcase data using the 4 uploaded authentic images
  const campusHeritageItems = [
    {
      title: "Main Campus Building",
      bengali: "ঐতিহ্যবাহী ৪-তলা মূল ভবন",
      tag: "School Grounds",
      imgUrl: "/images/taki-building.jpg",
      desc: "The multi-storey school building under Kolkata's Sealdah skies where generations studied and grew."
    },
    {
      title: "1961 Foundation Plaque",
      bengali: "স্থাপিত ১৯৬১ - সরকারি স্মারক ফলক",
      tag: "Heritage Stone",
      imgUrl: "/images/taki-heritage-stone.jpg",
      desc: "Historic marble plaque of Govt. Sponsored Multipurpose School (Boys) Taki House at 299, A.P.C. Road."
    },
    {
      title: "Gate of Eternal Inspiration",
      bengali: "আমাদের অনুপ্রেরণা - রবীন্দ্র ও বিবেকানন্দ বাণী",
      tag: "Inspiration",
      imgUrl: "/images/taki-entrance-quote.jpg",
      desc: "'All power is within you' — the guiding philosophical ethos welcoming students and alumni alike."
    },
    {
      title: "TBAAK Alumni Quadrangle",
      bengali: "টিব্যাক মিলনোৎসব প্রাঙ্গণ",
      tag: "Alumni Gathering",
      imgUrl: "/images/taki-alumni-quadrangle.jpg",
      desc: "The historic school courtyard festooned with TBAAK banners during joyous reunions and brotherhood."
    }
  ];

  const [selectedShowcasePhoto, setSelectedShowcasePhoto] = useState<typeof campusHeritageItems[0] | null>(null);

  return (
    <div className="space-y-10" id="dashboard-home">
      
      {/* 1. Welcoming Hero Banner - Modern 3D Glassmorphism Showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(13,82,48,0.22)] border border-white/20 group perspective-1000"
        id="dashboard-welcome-banner"
      >
        {/* Background Building Image with Modern Gradient Wash */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('/images/taki-building.jpg')` }}
        />
        {/* Rich Multi-Layer Gradient Overlays for Readability and Vibrancy */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07301c]/95 via-[#0D5230]/90 to-[#0D5230]/70 backdrop-blur-[2px]" />
        
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left text-white">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-sans font-bold px-3 py-1 rounded-full bg-white/15 border border-white/25 text-emerald-200 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                <span>Roll: {user?.rollNumber || "GUEST VISITOR"}</span>
              </span>
              <span className="text-[10px] font-sans font-bold px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 backdrop-blur-md">
                Class of {user?.batchYear || "All Batches"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-md">
              Welcome back, <span className="text-amber-300 font-extrabold">{user?.name || "ESTEEMED ALUMNUS"}</span>!
            </h2>
            
            <p className="text-emerald-100/90 text-sm sm:text-base font-sans leading-relaxed drop-shadow-xs max-w-xl">
              Honor the legacy of Taki House Government Sponsored Multipurpose School for Boys. Connect with batchmates, browse circulars, and celebrate our shared brotherhood.
            </p>

            {/* Quick Hero Floating Statistics */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5 shadow-sm">
                <Users className="h-4 w-4 text-emerald-300" />
                <div>
                  <div className="text-base font-black font-sans leading-none text-white">{stats.totalAlumni}</div>
                  <div className="text-[9px] uppercase font-bold text-emerald-200 tracking-wider">Registered Alumni</div>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5 shadow-sm">
                <MessageSquare className="h-4 w-4 text-amber-300" />
                <div>
                  <div className="text-base font-black font-sans leading-none text-white">{stats.activeChats}</div>
                  <div className="text-[9px] uppercase font-bold text-amber-200 tracking-wider">Community Messages</div>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2.5 shadow-sm">
                <Award className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="text-base font-black font-sans leading-none text-white">1961</div>
                  <div className="text-[9px] uppercase font-bold text-emerald-200 tracking-wider">Alma Mater Heritage</div>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Status Badge / Quick Action */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {latestRenewal?.status === 'rejected' ? (
              <div className="p-4 bg-red-950/60 backdrop-blur-md border border-red-500/50 rounded-2xl flex items-center gap-3.5 max-w-sm text-white shadow-lg">
                <XCircle className="h-7 w-7 text-red-400 shrink-0" />
                <div className="text-left font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-red-300 uppercase tracking-wider block">Renewal Status</span>
                    <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold uppercase rounded font-mono">Rejected</span>
                  </div>
                  <span className="text-xs font-bold text-white block mt-0.5">Admin Rejected Application</span>
                  <p className="text-[10px] text-red-200 line-clamp-1 mt-0.5">{latestRenewal.rejectionReason || 'Details unverified.'}</p>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-amber-300 hover:underline font-bold mt-1.5 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>View Reason & Resubmit</span>
                  </button>
                </div>
              </div>
            ) : latestRenewal?.status === 'pending' ? (
              <div className="p-4 bg-amber-950/60 backdrop-blur-md border border-amber-500/50 rounded-2xl flex items-center gap-3.5 max-w-xs text-white shadow-lg">
                <Clock className="h-6 w-6 text-amber-400 shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-amber-300 block uppercase tracking-wider">Renewal Status</span>
                  <span className="text-sm font-bold text-white">Pending Admin Approval</span>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-amber-300 hover:underline font-bold mt-1 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Check Status & Receipt</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : isExpired ? (
              <div className="p-4 bg-red-950/60 backdrop-blur-md border border-red-500/50 rounded-2xl flex items-center gap-3.5 max-w-xs text-white shadow-lg">
                <AlertTriangle className="h-6 w-6 text-red-400 shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-red-300 block uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-bold text-white">Expired ({user?.membershipTier || 'GUEST'})</span>
                  <button 
                    onClick={() => onNavigate('renewal')}
                    className="text-xs text-amber-300 hover:underline font-bold mt-1 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Renew Standing Membership</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3.5 max-w-xs text-white shadow-lg">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-left font-sans">
                  <span className="text-[9px] font-bold text-emerald-200 block uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-bold text-white">{user ? `Active (${user.membershipTier})` : 'Guest / Visitor'}</span>
                  <span className="text-[10px] text-emerald-200/80 block mt-0.5">{user?.membershipExpiry ? `Expiry: ${user.membershipExpiry}` : 'Sign in to access benefits'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Authentic Campus & Heritage 3D Showcase (User Uploaded Images) */}
      <div className="space-y-4" id="campus-heritage-showcase">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-700 animate-pulse" />
              <h3 className="text-xl font-bold font-serif text-[#0D5230] uppercase tracking-tight">
                আমাদের ঐতিহ্য ও প্রাঙ্গণ • Campus Heritage Highlights
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Explore authentic glimpses of Taki House campus, historic foundation plaque, and joyful reunions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('heritage')}
            className="self-start sm:self-auto text-xs font-bold text-[#0D5230] hover:text-[#0A4025] hover:underline flex items-center gap-1 font-sans cursor-pointer bg-white/80 backdrop-blur-md border border-emerald-800/20 px-3.5 py-1.5 rounded-full shadow-2xs hover:scale-105 transition-transform"
          >
            <span>Explore Archives</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 4 Stunning 3D Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {campusHeritageItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedShowcasePhoto(item)}
              className="card-3d glass-panel rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between border border-white/70 shadow-[0_10px_25px_rgba(13,82,48,0.08)]"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src={item.imgUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                {/* Floating Glass Tag */}
                <span className="absolute top-3 left-3 bg-[#0D5230]/85 backdrop-blur-md border border-white/20 text-[9px] font-sans font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {item.tag}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[11px] font-medium text-amber-300 font-sans block leading-tight">
                    {item.bengali}
                  </span>
                  <h4 className="text-sm font-bold text-white font-serif leading-tight mt-0.5">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="p-3.5 text-left flex-1 flex flex-col justify-between bg-white/40 backdrop-blur-xs">
                <p className="text-[11px] text-slate-600 font-sans leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-[#0D5230]">
                  <span>Click to inspect</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News & Announcements & Events (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-10" id="announcements-section">

          {/* Real-time Notice Board Circulars */}
          <div className="space-y-5" id="realtime-noticeboard-widget">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0D5230]/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-xl">
                  <Megaphone className="h-5 w-5 text-[#0D5230] animate-bounce" />
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
                className="self-start sm:self-auto text-xs font-bold text-[#0D5230] hover:text-[#0A4025] hover:underline flex items-center gap-1 font-sans cursor-pointer bg-white/80 backdrop-blur-md border border-[#0D5230]/20 px-3.5 py-1.5 rounded-full shadow-2xs hover:scale-105 transition-transform"
              >
                <span>View Full Board</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {noticesLoading ? (
              <div className="py-8 text-center glass-panel rounded-2xl border border-white/60">
                <span className="text-xs text-slate-400 font-mono">Updating community circulars...</span>
              </div>
            ) : notices.length === 0 ? (
              <div className="p-6 glass-panel rounded-2xl border border-white/60 text-center font-sans">
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
                      className={`p-5 rounded-2xl border text-left cursor-pointer card-3d-subtle transition-all ${
                        notice.isPinned
                          ? 'bg-amber-50/70 border-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.12)]'
                          : isUrgent
                          ? 'bg-red-50/60 border-red-300 shadow-[0_4px_16px_rgba(220,38,38,0.1)]'
                          : 'glass-panel border-white/80 hover:border-[#0D5230]/40 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`px-2.5 py-0.5 text-[8px] font-sans font-black uppercase tracking-wider rounded-full border ${
                          notice.isPinned
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : isUrgent
                            ? 'bg-red-100 text-red-900 border-red-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
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
                      
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed mt-1.5 line-clamp-2">
                        <FormattedText text={notice.content} />
                      </p>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-200/50 flex items-center gap-1.5 text-[9px] text-slate-400 font-sans">
                        <span className="font-bold text-slate-700 truncate max-w-[120px]">{notice.postedBy?.name || "TBAAK Admin"}</span>
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
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#0D5230]/20 pb-4">
              <h3 className="text-xl font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
                <BookOpen className="h-5 w-5 text-[#0D5230]" />
                <span>Announcements & School Updates</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">Official updates</span>
            </div>

            <div className="space-y-4">
              {announcementsLoading ? (
                <div className="p-6 text-center glass-panel rounded-2xl text-slate-400 text-xs">
                  Loading announcements...
                </div>
              ) : announcements.length === 0 ? (
                <div className="p-6 text-center glass-panel rounded-2xl text-slate-400 text-xs">
                  No announcements published yet.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    className={`p-5 rounded-2xl border transition-all card-3d-subtle ${
                      ann.isHighlight 
                        ? "glass-panel-elevated border-emerald-500/40 shadow-[0_10px_30px_rgba(13,82,48,0.12)] bg-gradient-to-br from-emerald-50/90 to-white/90" 
                        : "glass-panel border-white/70 hover:border-[#0D5230]/30 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-sans font-extrabold uppercase tracking-wider ${
                        ann.isHighlight 
                          ? "bg-[#0D5230] text-white shadow-xs" 
                          : "bg-emerald-100/70 text-[#0D5230] border border-[#0D5230]/20"
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
                            className="p-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer rounded-lg"
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

        </div>

        {/* Sidebar: Heritage & Quick Profile (Right 1 column) */}
        <div className="space-y-6" id="dashboard-sidebar">
          
          {/* Quick Profile Overview with Modern Glassmorphism */}
          <div className="glass-panel-elevated rounded-3xl p-6 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.1)] text-left">
            <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider mb-4 border-b border-[#0D5230]/20 pb-2.5 font-sans flex items-center justify-between">
              <span>My Alumnus Profile</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#0D5230] font-mono">PORTAL</span>
            </h4>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img 
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                  alt={user?.name || "Guest Visitor"} 
                  className="h-14 w-14 rounded-2xl border-2 border-[#0D5230] object-cover bg-slate-100 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <span className="font-serif font-black text-md text-[#1A1A1A] block leading-tight">{user?.name || "Guest Visitor"}</span>
                <span className="text-xs text-slate-500 font-sans block mt-1">Class of {user?.batchYear || "---"} • {user?.occupation || "Alumnus Visitor"}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-sans bg-white/50 backdrop-blur-xs p-3 rounded-2xl border border-white/60">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">Official Email:</span>
                <span className="text-slate-800 font-mono font-bold truncate max-w-[150px]">{user?.email || "Not Signed In"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="text-slate-800 font-bold">{user?.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">Current Base:</span>
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-red-600" />
                  {user?.location || "Kolkata"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Tier Status:</span>
                <span className="text-[#0D5230] font-extrabold uppercase tracking-wider">{user?.membershipTier || "GUEST"}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsCardOpen(true)}
              className="w-full mt-4 bg-gradient-to-r from-[#0D5230] to-[#0A4025] hover:from-[#0A4025] hover:to-[#072a18] text-white text-xs py-3 rounded-xl text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(13,82,48,0.25)] hover:scale-[1.02] shine-hover"
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
              className="w-full mt-2.5 bg-white/80 hover:bg-white text-[#0D5230] border border-[#0D5230]/30 text-xs py-2.5 rounded-xl text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
            >
              <KeyRound className="h-4 w-4 text-[#0D5230]" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Executive Committee Board Spotlight */}
          <div className="glass-panel rounded-2xl p-5 space-y-3.5 border border-white/60 text-left shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-[#0D5230]">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Executive Committee
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Meet the active elected members of the Taki Boys Alumni Executive Committee & Advisory Committee presiding over the current session.
            </p>

            <button 
              onClick={() => onNavigate('committee')}
              className="w-full bg-white/80 hover:bg-white border border-[#0D5230]/20 text-[#0D5230] text-xs py-2.5 rounded-xl text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
            >
              <span>View Executive Board</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Contact us hotline spotlight */}
          <div className="glass-panel rounded-2xl p-5 space-y-3.5 border border-white/60 text-left shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                <Phone className="h-5 w-5 text-[#0D5230]" />
              </div>
              <h4 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider font-sans">
                Contact Secretariat
              </h4>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Have queries about lifetime memberships, certificates, or donation receipts? Get in touch with our board or locate us in Kolkata.
            </p>

            <div className="text-[11px] font-sans text-slate-600 space-y-1.5 bg-white/50 backdrop-blur-xs p-3 rounded-xl border border-dashed border-[#0D5230]/20">
              <p>📍 <span className="font-bold">Address:</span> 299/B, A.P.C. Road, Kolkata - 9</p>
              <p>📧 <span className="font-bold">Email:</span> takiboys.alumni@gmail.com</p>
              <p>📞 <span className="font-bold">Gen Sec:</span> +91 89816 09498</p>
            </div>

            <button 
              onClick={() => onNavigate('contact')}
              className="w-full bg-white/80 hover:bg-white border border-[#0D5230]/20 text-[#0D5230] text-xs py-2.5 rounded-xl text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
            >
              <span>Get in Touch</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      <MembershipCard user={user} isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />

      {/* Campus Heritage Showcase Lightbox Modal */}
      <AnimatePresence>
        {selectedShowcasePhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-3xl w-full glass-card-dark text-white rounded-3xl overflow-hidden border border-white/25 shadow-2xl"
            >
              <button
                onClick={() => setSelectedShowcasePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer backdrop-blur-md border border-white/20"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="max-h-[60vh] overflow-hidden bg-black/50 flex items-center justify-center">
                <img 
                  src={selectedShowcasePhoto.imgUrl} 
                  alt={selectedShowcasePhoto.title}
                  className="max-h-[60vh] w-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-sans font-bold uppercase tracking-wider">
                    {selectedShowcasePhoto.tag}
                  </span>
                  <span className="text-xs text-emerald-300 font-sans font-bold">
                    {selectedShowcasePhoto.bengali}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-white">
                  {selectedShowcasePhoto.title}
                </h3>
                <p className="text-sm text-emerald-100/90 font-sans leading-relaxed">
                  {selectedShowcasePhoto.desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
