import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Home, 
  MessageSquare, 
  CreditCard, 
  Users, 
  Compass, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  MapPin,
  Clock,
  Camera,
  Shield,
  Phone,
  Info,
  Megaphone,
  Facebook,
  Youtube
} from 'lucide-react';

import { UserProfile, MembershipStatus, MembershipTier } from './types';
import { supabase } from './lib/supabase';
import TbaakLogo from './components/TbaakLogo';
import Login from './components/Login';
import DashboardHome from './components/DashboardHome';
import CommunityChat from './components/CommunityChat';
import AlumniRenewal from './components/AlumniRenewal';
import AlumniDirectory from './components/AlumniDirectory';
import SchoolHeritage from './components/SchoolHeritage';
import MediaGallery from './components/MediaGallery';
import Committee from './components/Committee';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import NoticeBoard from './components/NoticeBoard';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'alumni_login' | 'alumni_register' | 'admin_login'>('alumni_login');
  const [stats, setStats] = useState({
    totalAlumni: 4,
    activeChats: 3,
    upcomingEvents: 3
  });

  // Load user session on startup & verify Supabase Auth admin sessions
  useEffect(() => {
    const initAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if authenticated Supabase Auth user is an authorized admin in public.admins
          let { data: adminRecord } = await supabase
            .from('admins')
            .select('id, name, email, role, auth_user_id')
            .eq('auth_user_id', session.user.id)
            .eq('role', 'admin')
            .limit(1)
            .maybeSingle();

          // Fallback: Check by email if auth_user_id is not yet populated
          if (!adminRecord && session.user.email) {
            const { data: fallbackRecord } = await supabase
              .from('admins')
              .select('id, name, email, role, auth_user_id')
              .eq('email', session.user.email.toLowerCase())
              .eq('role', 'admin')
              .limit(1)
              .maybeSingle();

            if (fallbackRecord) {
              adminRecord = fallbackRecord;
              if (!fallbackRecord.auth_user_id) {
                await supabase
                  .from('admins')
                  .update({ auth_user_id: session.user.id })
                  .eq('id', fallbackRecord.id);
              }
            }
          }

          if (adminRecord) {
            const adminUser: UserProfile = {
              id: String(adminRecord.id || session.user.id),
              email: adminRecord.email || session.user.email || 'takialumni@gmail.com',
              name: adminRecord.name || 'Portal Administrator',
              batchYear: 1988,
              phone: '+91 98300 00000',
              occupation: 'Association Administrator',
              location: 'TBAAK Headquarters, Kolkata',
              membershipStatus: MembershipStatus.ACTIVE,
              membershipTier: MembershipTier.PATRON,
              membershipExpiry: 'Lifetime',
              rollNumber: 'ADM-' + (adminRecord.id || '001'),
              avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              role: 'admin'
            };
            setCurrentUser(adminUser);
            sessionStorage.setItem('taki_alumni_user', JSON.stringify(adminUser));
            setActiveTab('admin');
            return;
          } else {
            // User authenticated in Supabase Auth but NOT authorized as admin
            await supabase.auth.signOut();
            const savedUser = sessionStorage.getItem('taki_alumni_user');
            if (savedUser) {
              const u = JSON.parse(savedUser);
              if (u?.role === 'admin') {
                setCurrentUser(null);
                sessionStorage.removeItem('taki_alumni_user');
                setActiveTab('dashboard');
              } else {
                setCurrentUser(u);
                setActiveTab('dashboard');
              }
            }
            return;
          }
        } else {
          // No active Supabase Auth session
          const savedUser = sessionStorage.getItem('taki_alumni_user');
          if (savedUser) {
            try {
              const u = JSON.parse(savedUser);
              if (u?.role === 'admin') {
                // Admin must have an active Supabase Auth session
                setCurrentUser(null);
                sessionStorage.removeItem('taki_alumni_user');
                setActiveTab('dashboard');
              } else {
                // Normal alumni user
                setCurrentUser(u);
                setActiveTab('dashboard');
              }
            } catch (err) {
              console.error('Failed to parse user session', err);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      }
    };

    initAuthSession();

    // Listen for auth state changes (e.g. sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        const savedUser = sessionStorage.getItem('taki_alumni_user');
        if (savedUser) {
          try {
            const u = JSON.parse(savedUser);
            if (u?.role === 'admin') {
              setCurrentUser(null);
              sessionStorage.removeItem('taki_alumni_user');
              setActiveTab('dashboard');
            }
          } catch (err) {
            // ignore
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    sessionStorage.setItem('taki_alumni_user', JSON.stringify(user));
    if (user?.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setCurrentUser(null);
    sessionStorage.removeItem('taki_alumni_user');
    setActiveTab('dashboard');
  };

  const handleRenewalSuccess = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    sessionStorage.setItem('taki_alumni_user', JSON.stringify(updatedUser));
    // Increment total registered alumni in stats if they just registered and paid, or update stats
    setStats(prev => ({
      ...prev,
      totalAlumni: Math.max(prev.totalAlumni, 5)
    }));
  };

  // Dynamically update total chat counts and directory sizes in stats
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchStats = async () => {
      try {
        const chatsRes = await fetch('/api/chat/messages');
        const directoryRes = await fetch('/api/alumni/directory');
        if (chatsRes.ok && directoryRes.ok) {
          const chatsData = await chatsRes.json();
          const directoryData = await directoryRes.json();
          setStats({
            totalAlumni: directoryData.directory.length,
            activeChats: chatsData.messages.length,
            upcomingEvents: 3
          });
        }
      } catch (err) {
        // Handle transient network errors during server startup gracefully
        console.warn('Global stats sync paused or server starting up.');
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Navigation tabs config - Available for alumni and guests (Admins see only Admin Panel Badge)
  const navTabs: Array<{ id: string; label: string; icon: any; badge?: number; alert?: boolean }> = currentUser?.role === 'admin' ? [] : [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notices', label: 'Notice Board', icon: Megaphone },
    { id: 'about', label: 'About TBAAK', icon: Info },
    { id: 'gallery', label: 'Media Gallery', icon: Camera },
    { id: 'committee', label: 'Executive Board', icon: Shield },
    ...(currentUser ? [{ id: 'renewal', label: 'Alumni Renewal', icon: CreditCard, alert: currentUser?.membershipStatus === MembershipStatus.EXPIRED }] : []),
    { id: 'contact', label: 'Contact Us', icon: Phone },
  ];

  const renderContent = () => {
    // Admins are locked exclusively to the Admin Panel
    if (currentUser?.role === 'admin') {
      return <AdminPanel currentUser={currentUser} />;
    }

    // Regular Alumni & Guest Navigation
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome user={currentUser} onNavigate={setActiveTab} stats={stats} />;
      case 'notices':
        return <NoticeBoard currentUser={currentUser} />;
      case 'about':
        return <AboutUs />;
      case 'chat':
        return <CommunityChat currentUser={currentUser} />;
      case 'gallery':
        return <MediaGallery currentUser={currentUser} />;
      case 'committee':
        return <Committee />;
      case 'renewal':
        return currentUser ? <AlumniRenewal user={currentUser} onRenewalSuccess={handleRenewalSuccess} /> : <DashboardHome user={currentUser} onNavigate={setActiveTab} stats={stats} />;
      case 'directory':
        return <AlumniDirectory />;
      case 'heritage':
        return <SchoolHeritage />;
      case 'contact':
        return <ContactUs currentUser={currentUser} />;
      default:
        return <DashboardHome user={currentUser} onNavigate={setActiveTab} stats={stats} />;
    }
  };

  const openAuth = (mode: 'alumni_login' | 'alumni_register' | 'admin_login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] text-[#1A1A1A] font-sans flex flex-col justify-between relative selection:bg-[#0D5230] selection:text-white" id="portal-app">
      
      {/* Modern Ambient Dynamic Background Layer with Authentic Campus Imagery */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Real Taki Campus Building Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.28] scale-105 filter blur-[0.6px] transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/taki-building.jpg')` }}
        />
        {/* Soft Glassy Gradient Wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F7F4]/72 via-[#F0F7F4]/62 to-[#E8F4EE]/80 backdrop-blur-[1px]" />
        
        {/* Ambient 3D Glowing Color Orbs */}
        <div className="glow-orb-emerald -top-24 -left-24 animate-float-slow" />
        <div className="glow-orb-amber top-1/3 -right-20 animate-float-reverse" />
        <div className="glow-orb-emerald bottom-10 left-1/4 animate-pulse-glow" />

        {/* Subtle modern geometric dot matrix */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#0D5230 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top Main Navigation Header - Modern Glassmorphic Nav */}
      <header className="sticky top-0 z-50 glass-nav px-4 sm:px-6 py-3.5 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)]" id="portal-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* School Crest Logo Title with 3D feel */}
          <div 
            className="flex items-center gap-3 cursor-pointer group transition-transform duration-200 hover:scale-[1.02]" 
            onClick={() => currentUser?.role === 'admin' ? setActiveTab('admin') : setActiveTab('dashboard')}
          >
            <div className="relative p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md group-hover:border-white/40 transition-all">
              <TbaakLogo size="sm" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none uppercase text-white font-serif drop-shadow-xs">
                Taki Boys' Alumni
              </h1>
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-emerald-200 block mt-1 font-medium">
                Association Kolkata | Est. 2008
              </span>
            </div>
          </div>

          {/* Navigation Bar */}
          {currentUser?.role === 'admin' ? (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0D5230] text-[11px] font-sans font-extrabold uppercase tracking-widest rounded-full shadow-[0_4px_14px_rgba(245,158,11,0.35)] border border-amber-300">
              <Shield className="h-4 w-4 text-[#0D5230]" />
              <span>ADMIN PANEL ACTIVE</span>
            </div>
          ) : (
            <nav className="hidden lg:flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider bg-black/15 p-1 rounded-full border border-white/10 backdrop-blur-md">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-white text-[#0D5230] shadow-[0_4px_12px_rgba(0,0,0,0.15)] font-extrabold scale-100' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{tab.label}</span>
                    
                    {tab.badge && (
                      <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full ${
                        isActive ? 'bg-[#0D5230] text-white' : 'bg-white/20 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                    {tab.alert && (
                      <span className="inline-block h-2 w-2 rounded-full bg-red-400 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Header Controls: Profile Status or Sign-in/Register/Admin buttons */}
          <div className="hidden sm:flex items-center gap-3 lg:border-l lg:border-white/15 lg:pl-4">
            {currentUser ? (
              <>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block leading-tight truncate max-w-[140px]">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-bold font-sans uppercase tracking-wider block mt-0.5 ${
                    currentUser?.role === 'admin' ? 'text-amber-300' : currentUser?.membershipStatus === MembershipStatus.ACTIVE ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {currentUser?.role === 'admin' ? 'ADMINISTRATOR' : currentUser?.membershipStatus}
                  </span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-lg font-sans text-xs uppercase tracking-wider font-bold cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-sm flex items-center gap-1.5"
                  title="Sign Out of Portal"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={() => openAuth('alumni_login')}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm rounded-lg hover:scale-[1.02]"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => openAuth('alumni_register')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0D5230] hover:from-amber-300 hover:to-amber-400 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.3)] rounded-lg hover:scale-[1.03] shine-hover"
                >
                  REGISTER
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser?.membershipStatus === MembershipStatus.EXPIRED && currentUser?.role !== 'admin' && (
              <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" title="Membership Renewal Required"></span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/15 text-white border border-white/20 backdrop-blur-md font-sans text-xs uppercase tracking-wider font-bold cursor-pointer transition-all"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu - Modern Glassy Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-white/15 bg-[#0D5230]/95 backdrop-blur-xl overflow-hidden relative z-40"
            id="mobile-navigation"
          >
            <div className="px-6 py-6 space-y-3 font-sans text-[11px] font-bold uppercase tracking-widest text-white">
              {currentUser?.role === 'admin' ? (
                <div className="p-3 bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-serif rounded-lg backdrop-blur-md">
                  <Shield className="h-4 w-4 inline mr-2 text-amber-300" />
                  <span>Logged in as System Administrator ({currentUser.name})</span>
                </div>
              ) : (
                navTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full py-2.5 px-3 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'bg-white text-[#0D5230] font-black' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {tab.badge && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full ${
                            isActive ? 'bg-[#0D5230] text-white' : 'bg-white/20 text-white'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                        {tab.alert && (
                          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}

              <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                {currentUser ? (
                  <>
                    <div className="text-left font-serif">
                      <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                      <span className="text-[10px] text-emerald-200 italic block mt-0.5">Batch Year: {currentUser.batchYear}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-3.5 py-1.5 bg-white text-[#0D5230] rounded-md text-[10px] font-bold tracking-wider cursor-pointer shadow-sm hover:bg-white/90"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center gap-2 pt-1">
                    <button
                      onClick={() => { setMobileMenuOpen(false); openAuth('alumni_login'); }}
                      className="flex-1 py-2.5 bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-wider text-center rounded-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); openAuth('alumni_register'); }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0D5230] font-black text-xs uppercase tracking-wider text-center rounded-lg shadow-sm"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Content with High-Tech Frosted Depth */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            id="tab-content-wrapper"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer bar - Modern Dark Glass Theme */}
      <footer className="glass-card-dark text-white py-5 px-6 rounded-t-3xl border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 mt-12 text-center md:text-left relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]" id="app-footer">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-lg bg-white/10 backdrop-blur-md">
            <TbaakLogo size="sm" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/90 font-sans font-bold block">
              © {new Date().getFullYear()} Taki Boys' Alumni Association Kolkata
            </span>
            <span className="text-[10px] text-emerald-300 font-sans block">
              Regd. under West Bengal Societies Registration Act | Est. 2008
            </span>
          </div>
        </div>
        
        <div className="text-xs text-emerald-100 font-medium font-sans bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          Created with pride by <span className="text-amber-300 font-bold tracking-wide">Sayantan Roy</span> & <span className="text-amber-300 font-bold tracking-wide">Sayan Ghosh</span>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-5 font-sans text-xs">
          <a
            href="https://www.facebook.com/TBAAK4ALL/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 hover:scale-105"
            id="facebook-footer-link"
          >
            <Facebook className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] font-bold">Facebook</span>
          </a>
          <a
            href="https://youtube.com/@takiboysalumniassociationk5481?si=MhouEslNXcpjjj__"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 hover:scale-105"
            id="youtube-footer-link"
          >
            <Youtube className="h-3.5 w-3.5 text-red-400" />
            <span className="text-[11px] font-bold">YouTube</span>
          </a>
          <span className="hidden lg:inline text-[9px] uppercase tracking-[0.2em] text-white/50 border-l border-white/20 pl-4 font-mono">
            v3.2.0 • Secured
          </span>
        </div>
      </footer>

      {/* Auth Modal Popup Overlay */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl my-auto"
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-[#0D5230] text-white hover:bg-red-700 transition-colors shadow-lg rounded-full cursor-pointer"
                title="Close Window"
              >
                <X className="h-6 w-6" />
              </button>
              <Login 
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authModalMode}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
