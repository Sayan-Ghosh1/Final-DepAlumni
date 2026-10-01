import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Check, 
  Compass, 
  Building2, 
  ExternalLink,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

interface ContactUsProps {
  currentUser: UserProfile | null;
}

export default function ContactUs({ currentUser }: ContactUsProps) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    batchYear: currentUser?.batchYear ? currentUser.batchYear.toString() : '',
    subject: 'Membership Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        batchYear: currentUser?.batchYear ? currentUser.batchYear.toString() : '',
        subject: 'Membership Inquiry',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const faqs = [
    {
      q: "How can I verify my lifetime/patron membership status?",
      a: "Once you register on our portal and complete the renewal or verification form, the Executive Office verifies your school records. You will receive an email confirmation and see a 'Life Member' or 'Patron' digital badge on your dashboard."
    },
    {
      q: "Can I contribute old photographs or heritage archives?",
      a: "Yes! Navigate to our 'Media Gallery' tab and use the 'Contribute a Photo' feature. You can select the 'School Heritage' or 'Cultural Events' categories and write a short nostalgic description."
    },
    {
      q: "Where do the alumni association fees and donations go?",
      a: "All funds are managed securely under the Taki Boys Alumni Trust. Funds directly sponsor mid-day meals, distribute uniforms to underprivileged students, support school infrastructure upgrades, and sponsor annual prizes."
    }
  ];

  return (
    <div className="space-y-10" id="contact-us-page">
      
      {/* 1. Header Hero Segment */}
      <div className="border-b border-[#0D5230]/30 pb-5 space-y-1 text-left">
        <h2 className="text-2xl font-serif font-black text-[#0D5230] uppercase tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <span>Contact Alumni Secretariat</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-sans">
          Have queries about membership certificates, donation receipts, or reunion invitations? Reach out to our executive board office.
        </p>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left 3 Columns: Contact Form with Glassmorphism */}
        <div className="lg:col-span-3 glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.08)] text-left">
          <div className="flex items-center gap-2.5 border-b border-[#0D5230]/20 pb-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-800">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-serif font-black text-lg text-[#0D5230]">Send an Official Inquiry</h3>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center bg-emerald-50/80 border border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center space-y-3"
            >
              <div className="p-3 bg-[#0D5230] rounded-full text-white shadow-md">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#0D5230]">Inquiry Dispatched!</h4>
              <p className="text-xs text-slate-600 font-sans max-w-md">
                Your message has been logged in our general secretariat ledger. A member of the executive board will review and respond to your email shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-[#0D5230] uppercase text-[10px] tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sayantan Roy"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0D5230] focus:ring-2 focus:ring-[#0D5230]/15 focus:outline-none text-sm bg-white/70 backdrop-blur-xs transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D5230] uppercase text-[10px] tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. sayantan@gmail.com"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0D5230] focus:ring-2 focus:ring-[#0D5230]/15 focus:outline-none text-sm bg-white/70 backdrop-blur-xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-[#0D5230] uppercase text-[10px] tracking-wider">Passout Batch Year</label>
                  <input
                    type="number"
                    name="batchYear"
                    value={formData.batchYear}
                    onChange={handleChange}
                    placeholder="e.g. 2012"
                    min="1940"
                    max="2030"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0D5230] focus:ring-2 focus:ring-[#0D5230]/15 focus:outline-none text-sm bg-white/70 backdrop-blur-xs transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0D5230] uppercase text-[10px] tracking-wider">Nature of Inquiry *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0D5230] focus:ring-2 focus:ring-[#0D5230]/15 focus:outline-none font-bold text-slate-700 bg-white/70 backdrop-blur-xs cursor-pointer text-xs transition-all"
                  >
                    <option value="Membership Inquiry">🎖️ Membership & badge Verification</option>
                    <option value="Donation & CSR">💰 Sponsorship & Trust Donations</option>
                    <option value="Event Participation">🎪 Reunion & Annual Social Passes</option>
                    <option value="Heritage Archive">🏛️ Heritage Wall & Archival Submissions</option>
                    <option value="Other Assistance">💡 General Technical Assistance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0D5230] uppercase text-[10px] tracking-wider">Detailed Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Draft your query here..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#0D5230] focus:ring-2 focus:ring-[#0D5230]/15 focus:outline-none text-sm font-sans bg-white/70 backdrop-blur-xs transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !formData.message.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#0D5230] to-[#0A4025] hover:from-[#0A4025] hover:to-[#072a18] text-white font-bold uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2 rounded-xl active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_4px_14px_rgba(13,82,48,0.25)] shine-hover"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Transmitting Inquiries...' : 'Submit Message'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Right 2 Columns: Directory Contact Information Card */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Main Headquarters Address Box with Glassmorphism */}
          <div className="glass-panel-elevated rounded-3xl p-6 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.08)] space-y-4">
            <span className="text-[10px] font-sans font-bold text-[#0D5230] uppercase tracking-wider block border-b border-[#0D5230]/20 pb-2.5 flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span>Headquarters Location</span>
            </span>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-[#0D5230] shrink-0 h-fit">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-serif font-black text-slate-900 block text-sm">Taki House Alumni Office</span>
                  <p className="text-slate-600 leading-relaxed">
                    299/B, Acharya Prafulla Chandra Road, Kolkata 700 009, INDIA
                  </p>
                  <p className="text-[10px] text-emerald-800 italic font-medium">
                    (Within Taki House Govt. Spons. High School for Boys campus, Rajabazar)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-200/60 pt-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-[#0D5230] shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Email Communication</span>
                  <span className="font-mono font-bold text-[#0D5230]">takiboys.alumni@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-200/60 pt-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-[#0D5230] shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Secretariat Hotline Contacts</span>
                  <p className="font-mono text-slate-800 font-bold block">+91 89816 09498 <span className="text-xs font-sans text-slate-500 font-normal">(General Secretary)</span></p>
                  <p className="font-mono text-slate-800 font-bold block">+91 72788 10888 <span className="text-xs font-sans text-slate-500 font-normal">(Asst. General Secretary)</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-200/60 pt-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-[#0D5230] shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Alumni Room Hours</span>
                  <p className="text-slate-600">Saturdays & Sundays: <span className="font-bold text-slate-800">4:00 PM – 7:30 PM</span></p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Taki+House+Government+Sponsored+High+School+for+Boys"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-white/80 hover:bg-white border border-[#0D5230]/20 hover:border-[#0D5230] text-[#0D5230] text-xs py-2.5 rounded-xl text-center font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick FAQ / Assistance Accordion card */}
          <div className="bg-white border-2 border-slate-200 p-5 space-y-4">
            <span className="text-[10px] font-sans font-bold text-[#0D5230] uppercase tracking-wider block border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              <span>Immediate Assistance</span>
            </span>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <h4 className="font-serif font-black text-slate-900 leading-tight flex items-start gap-1.5">
                    <span className="text-[#0D5230] shrink-0">Q.</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 pl-4 font-sans leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
