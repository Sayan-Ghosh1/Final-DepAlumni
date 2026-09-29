import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Calendar, MapPin, Briefcase, GraduationCap, ArrowRight, ShieldAlert, CheckCircle2, Smartphone, Sparkles, Download, X, Info, Check, Database, Copy, Facebook, Youtube, Eye, EyeOff } from 'lucide-react';
import { UserProfile, MembershipStatus, MembershipTier } from '../types';
import { supabase } from '../lib/supabase';
import TbaakLogo from './TbaakLogo';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
  onClose?: () => void;
  initialMode?: 'alumni_login' | 'alumni_register' | 'admin_login';
}

export default function Login({ onLoginSuccess, onClose, initialMode }: LoginProps) {
  const [isRegister, setIsRegister] = useState(initialMode === 'alumni_register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration fields
  const [name, setName] = useState('');
  const [batchYear, setBatchYear] = useState('2015');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('Kolkata');
  const [rollNumber, setRollNumber] = useState('');

  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showGooglePopup, setShowGooglePopup] = useState(false);

  // Admin Login States
  const [showAdminModal, setShowAdminModal] = useState(initialMode === 'admin_login');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminButtonStatus, setAdminButtonStatus] = useState<'idle' | 'authenticating' | 'success'>('idle');

  React.useEffect(() => {
    if (initialMode === 'alumni_register') {
      setIsRegister(true);
      setShowAdminModal(false);
    } else if (initialMode === 'admin_login') {
      setIsRegister(false);
      setShowAdminModal(true);
    } else if (initialMode === 'alumni_login') {
      setIsRegister(false);
      setShowAdminModal(false);
    }
  }, [initialMode]);

  const handleSuccessAndClose = (user: UserProfile) => {
    onLoginSuccess(user);
    if (onClose) onClose();
  };

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminError('Please provide both email and password.');
      return;
    }

    setAdminLoading(true);
    setAdminButtonStatus('authenticating');

    try {
      // Authenticate using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });

      if (error || !data.user) {
        setAdminError('Invalid administrator email or password.');
        setAdminLoading(false);
        setAdminButtonStatus('idle');
        return;
      }

      const userId = data.user.id;
      const userEmail = (data.user.email || adminEmail).toLowerCase().trim();

      // Query existing public.admins table
      let { data: adminRecord } = await supabase
        .from('admins')
        .select('id, name, email, role, auth_user_id')
        .eq('auth_user_id', userId)
        .eq('role', 'admin')
        .limit(1)
        .maybeSingle();

      // Fallback: Check by email if auth_user_id is not yet linked
      if (!adminRecord && userEmail) {
        const { data: fallbackRecord } = await supabase
          .from('admins')
          .select('id, name, email, role, auth_user_id')
          .eq('email', userEmail)
          .eq('role', 'admin')
          .limit(1)
          .maybeSingle();

        if (fallbackRecord) {
          adminRecord = fallbackRecord;
          // Link auth_user_id in public.admins
          if (!fallbackRecord.auth_user_id) {
            await supabase
              .from('admins')
              .update({ auth_user_id: userId })
              .eq('id', fallbackRecord.id);
          }
        }
      }

      if (!adminRecord) {
        await supabase.auth.signOut();
        setAdminError('Access denied. This account is not authorized as an administrator.');
        setAdminLoading(false);
        setAdminButtonStatus('idle');
        return;
      }

      setAdminButtonStatus('success');

      const adminUser: UserProfile = {
        id: String(adminRecord.id || userId),
        email: adminRecord.email || userEmail,
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

      setTimeout(() => {
        setShowAdminModal(false);
        setAdminButtonStatus('idle');
        setAdminLoading(false);
        handleSuccessAndClose(adminUser);
      }, 600);

    } catch (err: any) {
      setAdminError(err.message || 'Invalid administrator email or password.');
      setAdminLoading(false);
      setAdminButtonStatus('idle');
    }
  };

  const sqlSchemaScript = `-- SQL Schema for Taki Boys Alumni Association Portal
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    batch_year INTEGER,
    phone TEXT,
    occupation TEXT,
    location TEXT,
    membership_status TEXT DEFAULT 'NOT_MEMBER',
    membership_tier TEXT DEFAULT 'ANNUAL',
    membership_expiry TEXT,
    roll_number TEXT,
    avatar_url TEXT,
    password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    sender_name TEXT,
    sender_email TEXT,
    sender_batch INTEGER,
    text TEXT,
    timestamp TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    category TEXT,
    posted_by JSONB,
    posted_at TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS public.renewals (
    id TEXT PRIMARY KEY,
    email TEXT,
    tier TEXT,
    amount NUMERIC,
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT,
    submitted_at TEXT,
    billing_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    tag TEXT,
    title TEXT,
    "desc" TEXT,
    date TEXT,
    is_highlight BOOLEAN DEFAULT FALSE,
    is_live BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    description TEXT,
    tag TEXT,
    media_type TEXT DEFAULT 'image',
    uploaded_by JSONB,
    uploaded_at TEXT,
    likes JSONB DEFAULT '[]'::jsonb,
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon access users" ON public.users;
DROP POLICY IF EXISTS "Allow anon access chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow anon access notices" ON public.notices;
DROP POLICY IF EXISTS "Allow anon access announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow anon access gallery" ON public.gallery_photos;
DROP POLICY IF EXISTS "Allow anon access renewals" ON public.renewals;

CREATE POLICY "Allow anon access users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access chat" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access gallery" ON public.gallery_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon access renewals" ON public.renewals FOR ALL USING (true) WITH CHECK (true);`;
  const [showAppStoreModal, setShowAppStoreModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('sayantanroy58581@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState('Sayantan Roy');
  const [simulatedInstallProgress, setSimulatedInstallProgress] = useState<'idle' | 'installing' | 'installed'>('idle');

  const handleGoogleSignInSubmit = async (selectedEmail: string, selectedName: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setShowGooglePopup(false);
    
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          name: selectedName,
          avatarUrl: selectedEmail === 'sayantanroy58581@gmail.com' 
            ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
            : undefined
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      handleSuccessAndClose(data.user);
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setEmail(demoEmail);
    setPassword('password123');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      handleSuccessAndClose(data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        // Validate password length (minimum 6 characters)
        if (!password || password.trim().length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        // Validate phone number (must be a valid 10-digit number)
        const phoneDigits = phone.replace(/\D/g, '');
        if (!phone.trim() || phoneDigits.length < 10) {
          setError('Phone number must be a valid 10-digit mobile number (e.g. 9876543210).');
          setLoading(false);
          return;
        }

        // Validate roll number (must be provided and non-empty)
        if (!rollNumber || !rollNumber.trim()) {
          setError('Roll number is required and must be unique.');
          setLoading(false);
          return;
        }

        // Register flow
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            batchYear,
            phone,
            occupation,
            location,
            rollNumber
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Try direct Supabase insertion as well
        const { error: sbError } = await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          batch_year: data.user.batchYear,
          phone: data.user.phone,
          occupation: data.user.occupation,
          location: data.user.location,
          membership_status: data.user.membershipStatus,
          membership_tier: data.user.membershipTier,
          roll_number: data.user.rollNumber,
          avatar_url: data.user.avatarUrl,
          password: password
        });

        if (sbError) {
          console.warn('Supabase client insert:', sbError);
          setSuccess('Registered successfully! Redirecting to dashboard...');
        } else {
          setSuccess('Registered successfully! Redirecting to dashboard...');
        }

        setTimeout(() => {
          handleSuccessAndClose(data.user);
        }, 1800);
      } else {
        // Login flow
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        handleSuccessAndClose(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={onClose ? "bg-transparent font-serif relative" : "min-h-screen bg-[#F0F7F4] text-[#1A1A1A] font-serif flex flex-col justify-between relative"} id="login-container">
      
      <main className={onClose ? "w-full max-w-xl mx-auto p-0 flex items-center justify-center relative z-10" : "flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10"}>
        
        {/* Left Side: School Branding & Pride (Forest Green & White Theme) */}
        {!onClose && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center lg:text-left space-y-6"
            id="school-info-section"
          >
            {/* TBAAK Official Logo */}
            <div className="flex justify-center lg:justify-start" id="school-logo-wrapper">
              <TbaakLogo size="lg" />
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase text-[#0D5230]">
                Taki Boys<br />
                <span className="italic font-normal font-serif text-[#1A1A1A]">Alumni Association Kolkata</span>
              </h1>

              <div 
                className="inline-flex items-center gap-2 px-3 py-1 border border-[#0D5230] bg-white font-sans font-bold uppercase tracking-wider text-[#0D5230] mt-4"
                style={{ height: "45px", width: "250.203px", fontSize: "14px", textAlign: "left", lineHeight: "15px" }}
              >
                <span>ESTABLISHED 2008 • KOLKATA</span>
              </div>
            </div>
            
            <p className="font-serif text-base text-slate-800 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to the digital portal for the ex-students of Taki Govt. Sponsored High School for Boys, Kolkata. Connect with batchmates, participate in community chats, and keep your membership active in school colors of green and white.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 pt-4 font-sans text-xs">
              <div className="p-4 border-2 border-[#0D5230] bg-white text-left shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
                <span className="font-serif italic text-2xl font-bold block leading-none mb-1 text-[#0D5230]">90+ Yrs</span>
                <span className="uppercase tracking-wider font-bold opacity-60 text-[9px] text-[#1A1A1A]">Educational Legacy</span>
              </div>
              <div className="p-4 border-2 border-[#0D5230] bg-white text-left shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
                <span className="font-serif italic text-2xl font-bold block leading-none mb-1 text-[#0D5230]">5000+</span>
                <span className="uppercase tracking-wider font-bold opacity-60 text-[9px] text-[#1A1A1A]">Global Alumni Network</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Side: Interactive Forms & Demo Accounts (Forest Green & White Theme) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md flex flex-col gap-6 font-sans"
          id="auth-form-section"
        >
          {/* Card Frame - Forest Green Border, White BG */}
          <div className="bg-white border-2 border-[#0D5230] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(13,82,48,0.2)]">
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#0D5230]">
                {isRegister ? "Join the Association" : "Alumni Access"}
              </h2>
              <p className="font-serif italic text-sm text-slate-600 mt-1">
                {isRegister ? "Register your details to create an alumnus profile" : "Enter credentials to securely sign into the archives"}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 border border-red-600 bg-red-50 text-red-700 text-xs flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 mb-4 border border-green-600 bg-green-50 text-green-700 text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {isRegister && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sayantan Roy"
                        className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Passout Batch</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                        <input 
                          type="number" 
                          required
                          min="1940"
                          max="2026"
                          value={batchYear}
                          onChange={(e) => setBatchYear(e.target.value)}
                          placeholder="e.g. 2012"
                          className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                        Roll No (Unique Required)
                      </label>
                      <input 
                        type="text" 
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. 11 or Batch15-089"
                        className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 px-3 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Occupation</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                        <input 
                          type="text" 
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="Developer / Doctor"
                          className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Kolkata / Delhi"
                          className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                      Phone Number (10 Digits Required)
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 px-3 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block font-serif italic">Must be a valid 10-digit mobile number</span>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amit.sen@taki.alumni"
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                  Access Password {isRegister ? '(Min. 6 characters)' : ''}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    minLength={isRegister ? 6 : 1}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-10 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#0D5230]/60 hover:text-[#0D5230] p-1 cursor-pointer transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isRegister && (
                  <span className="text-[9px] text-slate-500 mt-0.5 block font-serif italic">Minimum 6 characters required</span>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-3 px-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-px"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isRegister ? "Register Ex-Student" : "Secure Log In"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>


            </form>

            <div className="mt-5 text-center text-xs">
              {isRegister ? (
                <button onClick={() => setIsRegister(false)} className="text-[#0D5230] hover:underline font-bold uppercase tracking-wider text-[10px]">
                  Already registered? Sign in here
                </button>
              ) : (
                <button onClick={() => setIsRegister(true)} className="text-[#0D5230] hover:underline font-bold uppercase tracking-wider text-[10px]">
                  New here? Register Alumni Profile
                </button>
              )}
            </div>

            {/* ADMIN LOGIN BUTTON (Matched to screenshot) */}
            <div className="mt-6 pt-5 border-t border-[#0D5230]/20 text-center">
              <div className="relative flex py-1 items-center justify-center mb-4">
                <div className="flex-grow border-t border-dashed border-[#0D5230]/30"></div>
                <span className="shrink-0 mx-2 text-[9px] font-extrabold uppercase tracking-widest text-[#0D5230]">
                  PORTAL MANAGEMENT ACCESS
                </span>
                <div className="flex-grow border-t border-dashed border-[#0D5230]/30"></div>
              </div>

              <div className="flex justify-center my-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminError('');
                    setShowAdminModal(true);
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#062E19] via-[#0A4222] to-[#062E19] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-[0_0_22px_rgba(16,185,129,0.4)] ring-4 ring-emerald-500/25 border border-emerald-400/50 hover:scale-[1.04] active:scale-[0.96] transition-all cursor-pointer"
                  id="admin-login-button"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white shrink-0">
                    <Lock className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-sans font-black text-xs tracking-widest text-white">ADMIN LOGIN</span>
                  <ArrowRight className="h-4 w-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* App Store / Google Play Companion Card */}
          <div className="bg-white border-2 border-[#0D5230] p-5 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="h-4 w-4 text-[#0D5230]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D5230]">Taki Alumni Mobile Companion</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-serif">
              Access digital identity cards, fast-entry QR codes, and push notifications for winter reunions.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                type="button"
                onClick={() => setShowAppStoreModal(true)}
                className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] py-1.5 px-3 border border-slate-700 flex items-center gap-2 transition-all rounded shadow-sm cursor-pointer active:translate-y-px"
              >
                <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.2.12.3.12.87 0 1.96-.54 2.52-1.45z" />
                </svg>
                <div className="text-left leading-none font-sans">
                  <span className="text-[7px] text-slate-300 block">Download on the</span>
                  <span className="font-bold text-[10px]">App Store</span>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setShowAppStoreModal(true)}
                className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] py-1.5 px-3 border border-slate-700 flex items-center gap-2 transition-all rounded shadow-sm cursor-pointer active:translate-y-px"
              >
                <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M3 5.27v13.46c0 .59.35 1.13.88 1.34l7.15-7.15L3.88 3.93C3.35 4.14 3 4.68 3 5.27zm14.77 4.9L13.1 7.42l-3.32 3.32 3.32 3.32 4.67-2.75c1.1-.65 1.1-1.71 0-2.34zM10.95 11.9l-7.07 7.07c.2.08.41.12.63.12.48 0 .93-.24 1.19-.65l5.25-3.09-3-3.45zm0-1.06L7.95 7.4 2.7 4.31c-.26-.41-.71-.65-1.19-.65-.22 0-.43.04-.63.12l7.07 7.06z" />
                </svg>
                <div className="text-left leading-none font-sans">
                  <span className="text-[7px] text-slate-300 block">GET IT ON</span>
                  <span className="font-bold text-[10px]">Google Play</span>
                </div>
              </button>
            </div>
          </div>


        </motion.div>
      </main>

      {/* Google Sign-In Simulated Portal Popup */}
      <AnimatePresence>
        {showGooglePopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-[#0D5230] shadow-[6px_6px_0px_0px_rgba(13,82,48,0.25)] max-w-sm w-full overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sign in with Google</span>
                </div>
                <button 
                  onClick={() => setShowGooglePopup(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="font-serif font-black text-md text-[#1A1A1A] uppercase tracking-tight">Choose Google Account</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">to securely authenticate and link with Taki House Ex-Student Digital Registry.</p>
                </div>

                <div className="space-y-2">
                  {/* Account choice 1: Sayantan Roy */}
                  <button 
                    type="button"
                    onClick={() => handleGoogleSignInSubmit('sayantanroy58581@gmail.com', 'Sayantan Roy')}
                    className="w-full p-3 border border-slate-200 hover:border-[#0D5230] hover:bg-[#F4F9F6] text-left transition-all flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" alt="Sayantan Roy" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors">Sayantan Roy</span>
                      <span className="block text-[10px] text-slate-500 truncate">sayantanroy58581@gmail.com</span>
                    </div>
                    <span className="text-[8px] bg-green-100 text-green-800 px-1.5 py-0.5 font-bold uppercase shrink-0">Default</span>
                  </button>

                  {/* Account choice 2: Amit Sen */}
                  <button 
                    type="button"
                    onClick={() => handleGoogleSignInSubmit('amit.sen@taki.alumni', 'Amit Sen')}
                    className="w-full p-3 border border-slate-200 hover:border-[#0D5230] hover:bg-[#F4F9F6] text-left transition-all flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Amit Sen" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors">Amit Sen</span>
                      <span className="block text-[10px] text-slate-500 truncate font-mono">amit.sen@taki.alumni</span>
                    </div>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Or enter any custom Google email</span>
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="e.g. custom.student@gmail.com"
                      className="flex-1 bg-[#F4F9F6] border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:border-[#0D5230] font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => handleGoogleSignInSubmit(googleEmailInput, googleNameInput || "Google Alumnus")}
                      className="bg-[#0D5230] text-white px-3 text-[10px] uppercase font-bold tracking-wider hover:bg-[#0A4025] transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="Display Name (optional)"
                      className="flex-1 bg-[#F4F9F6] border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:border-[#0D5230]"
                    />
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-normal text-center">
                  To continue, Google will share your name, email address, language preference, and profile picture with the Taki Boys Alumni network database.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Store Download Portal Popup */}
      <AnimatePresence>
        {showAppStoreModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-[#0D5230] shadow-[6px_6px_0px_0px_rgba(13,82,48,0.25)] max-w-lg w-full overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="h-5 w-5 text-[#0D5230]" />
                  <span className="text-xs font-bold text-[#0D5230] uppercase tracking-wider">Taki Boys Alumni Store Beta</span>
                </div>
                <button 
                  onClick={() => setShowAppStoreModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Left: Mock Smartphone Screen */}
                  <div className="w-full sm:w-48 shrink-0 bg-slate-900 border-4 border-slate-800 p-2.5 rounded-[20px] shadow-lg flex flex-col justify-between h-72 text-white text-center font-sans">
                    {/* Phone Top Notch */}
                    <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    {/* Alumnus Digital ID Screen */}
                    <div className="flex-1 bg-gradient-to-br from-[#0D5230] to-[#0A4025] p-3 flex flex-col justify-between items-center text-left relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                      
                      <div className="w-full">
                        <span className="text-[6px] tracking-wider font-bold uppercase opacity-80 block text-center border-b border-white/20 pb-1">Taki House Govt. Sponsored High School</span>
                        <span className="text-[5px] uppercase tracking-widest text-center block mt-0.5">Alumnus Digital ID</span>
                      </div>

                      {/* Profile Mock */}
                      <div className="flex items-center gap-2 w-full mt-2 bg-white/10 p-1.5">
                        <div className="h-7 w-7 rounded-full bg-slate-200 border border-white/20 shrink-0 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" alt="Sayantan" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] font-bold leading-tight truncate">Sayantan Roy</span>
                          <span className="block text-[6px] opacity-75">Batch of 2015</span>
                        </div>
                      </div>

                      {/* QR Code Placeholder */}
                      <div className="bg-white p-1 rounded-sm flex flex-col items-center">
                        {/* Interactive QR representation */}
                        <div className="grid grid-cols-4 gap-0.5 bg-slate-950 p-1">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className={`h-2.5 w-2.5 ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`} />
                          ))}
                        </div>
                        <span className="text-[4px] text-slate-800 font-bold uppercase tracking-wider mt-0.5">Active Member Pass</span>
                      </div>

                      <div className="text-center w-full">
                        <span className="text-[5px] text-green-300 uppercase tracking-widest block">Authorized Campus Pass</span>
                        <span className="text-[4px] opacity-60 font-mono">ID: TA-2015-8122</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Info and Sim Install */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-serif font-black text-lg text-[#0D5230] uppercase tracking-tight">Taki Boys Alumni Hub App</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Stay connected with your roots on iOS & Android. The companion app offers high-fidelity ex-student utilities.
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs font-sans">
                      <div className="flex items-start gap-2 text-slate-700">
                        <div className="p-1 bg-green-50 text-[#0D5230] border border-[#0D5230]/20 rounded shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight"><strong>Digital Alumni ID Card:</strong> Instant pass with dynamic QR codes for campus visits.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <div className="p-1 bg-green-50 text-[#0D5230] border border-[#0D5230]/20 rounded shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight"><strong>Offline Heritage Timelines:</strong> Access milestone histories without data connections.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <div className="p-1 bg-green-50 text-[#0D5230] border border-[#0D5230]/20 rounded shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight"><strong>Push Notifications:</strong> Immediate alerts for winter dinners, reunions, and emergencies.</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                      {simulatedInstallProgress === 'idle' && (
                        <button 
                          type="button"
                          onClick={() => {
                            setSimulatedInstallProgress('installing');
                            setTimeout(() => {
                              setSimulatedInstallProgress('installed');
                            }, 1800);
                          }}
                          className="w-full sm:w-auto bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-2.5 px-5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Simulate App Install</span>
                        </button>
                      )}

                      {simulatedInstallProgress === 'installing' && (
                        <div className="w-full flex items-center gap-2.5">
                          <div className="h-4 w-4 border-2 border-[#0D5230] border-t-transparent rounded-full animate-spin shrink-0" />
                          <span className="text-xs font-bold text-slate-600 font-sans">Connecting to TestFlight / Play Console...</span>
                        </div>
                      )}

                      {simulatedInstallProgress === 'installed' && (
                        <div className="w-full flex items-center gap-2 bg-green-50 border border-[#0D5230]/30 p-2.5 text-xs text-[#0D5230] font-sans">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0D5230]" />
                          <span><strong>Beta App Profile Active!</strong> Simulated installation complete. Real-time notifications and offline ID sync enabled.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2 font-serif">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
                  <span>
                    Note: Direct App Store & Play Store publishing is pending the 94th reunion administrative verification. You can simulate beta onboarding using the tool above.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supabase SQL Setup Modal */}
      <AnimatePresence>
        {showSqlModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#0D5230] max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-[#0D5230]">
                  <Database className="h-5 w-5" />
                  <h3 className="text-base font-bold uppercase tracking-wider">Supabase Table Schema Setup</h3>
                </div>
                <button 
                  onClick={() => setShowSqlModal(false)}
                  className="p-1 hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-serif">
                To enable persistent row storage in your Supabase project (<strong>taki alumni</strong>), paste the SQL below into your 
                <a 
                  href="https://supabase.com/dashboard/project/rivtbicquoxnrtkjclvk/sql/new" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-700 underline font-bold ml-1"
                >
                  Supabase SQL Editor
                </a> and click <strong>RUN</strong>. This will create the <code>users</code>, <code>chat_messages</code>, <code>notices</code>, and <code>renewals</code> tables with public read/write permissions.
              </p>

              <div className="relative">
                <pre className="bg-slate-900 text-emerald-300 p-4 rounded text-[11px] font-mono overflow-x-auto max-h-60 leading-tight">
                  {sqlSchemaScript}
                </pre>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(sqlSchemaScript);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2500);
                  }}
                  className="absolute top-3 right-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 text-xs flex items-center gap-1.5 rounded cursor-pointer shadow-md"
                >
                  {copiedSql ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSql ? "Copied SQL!" : "Copy SQL Script"}</span>
                </button>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <a 
                  href="https://supabase.com/dashboard/project/rivtbicquoxnrtkjclvk/sql/new" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#0D5230] text-white font-bold py-2 px-4 rounded hover:bg-[#0A4025]"
                >
                  Open Supabase SQL Editor
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>

                <button 
                  onClick={() => setShowSqlModal(false)}
                  className="py-2 px-4 border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Auth Modal (Login) */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans" id="admin-auth-modal-backdrop">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-[#0D5230] shadow-[8px_8px_0px_0px_rgba(13,82,48,0.25)] max-w-md w-full overflow-hidden text-left rounded-lg"
              id="admin-auth-modal"
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#0D5230] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/10 rounded-full">
                    <Lock className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-200 block leading-none mb-0.5">
                      TBAAK PORTAL MANAGEMENT
                    </span>
                    <h3 className="font-bold text-sm tracking-wide">
                      Admin Sign In
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAdminModal(false)}
                  className="p-1.5 hover:bg-white/15 rounded text-white/80 hover:text-white transition-colors cursor-pointer"
                  id="close-admin-modal-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {adminError && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs flex items-start gap-2 rounded-r">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}

                <p className="text-xs text-slate-600 font-serif leading-relaxed">
                  Enter your administrator email and password to log in and manage the portal.
                </p>

                <form onSubmit={handleAdminSubmit} className="space-y-4" id="admin-auth-form">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                      <input 
                        type="email" 
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@taki.alumni"
                        className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-4 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-serif rounded-sm"
                        id="admin-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0D5230] mb-1">
                      Access Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/50" />
                      <input 
                        type={showAdminPassword ? "text" : "password"} 
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F4F9F6] border border-[#0D5230]/30 py-2.5 pl-10 pr-10 text-sm text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#0D5230] transition-colors font-mono rounded-sm"
                        id="admin-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-2.5 text-[#0D5230]/60 hover:text-[#0D5230] p-1 cursor-pointer transition-colors"
                        title={showAdminPassword ? "Hide password" : "Show password"}
                        aria-label={showAdminPassword ? "Hide password" : "Show password"}
                      >
                        {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={adminLoading}
                    className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-3 px-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-px rounded shadow-sm disabled:opacity-80"
                    id="submit-admin-auth-btn"
                  >
                    {adminButtonStatus === 'authenticating' ? (
                      <>
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>AUTHENTICATING...</span>
                      </>
                    ) : adminButtonStatus === 'success' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        <span>LOGIN SUCCESSFUL...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In as Admin</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!onClose && (
        <footer className="bg-[#0A4025] text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left" id="login-footer">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-80 font-sans">
            © {new Date().getFullYear()} Taki Boys' Alumni Association Kolkata
          </span>
          <div className="text-xs text-emerald-100 font-medium font-sans">
            Created by <span className="text-amber-300 font-extrabold tracking-wide">Sayantan Roy</span> and <span className="text-amber-300 font-extrabold tracking-wide">Sayan Ghosh</span>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-6 font-sans text-xs">
            <a
              href="https://www.facebook.com/TBAAK4ALL/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-300 transition-colors text-white/90 hover:text-white font-medium"
              id="login-facebook-footer-link"
            >
              <Facebook className="h-4 w-4 text-emerald-300" />
              <span>Facebook</span>
            </a>
            <a
              href="https://youtube.com/@takiboysalumniassociationk5481?si=MhouEslNXcpjjj__"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-300 transition-colors text-white/90 hover:text-white font-medium"
              id="login-youtube-footer-link"
            >
              <Youtube className="h-4 w-4 text-red-400" />
              <span>YouTube</span>
            </a>
            <span className="hidden lg:inline text-[9px] uppercase tracking-[0.2em] opacity-60 border-l border-white/20 pl-4">
              Secure Portal v3.2.0
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
