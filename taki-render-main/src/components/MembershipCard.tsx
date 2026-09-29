import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Sparkles, 
  CheckCircle, 
  RotateCw, 
  User, 
  MapPin, 
  Calendar, 
  QrCode, 
  Shield, 
  Award, 
  FileCheck 
} from 'lucide-react';
import { UserProfile, MembershipStatus } from '../types';

interface MembershipCardProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function MembershipCard({ user, isOpen, onClose }: MembershipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || !user) return null;

  // Generate a premium membership ID
  const membershipId = `TBAAK-${user?.batchYear || '2008'}-${user?.rollNumber || user?.id?.slice(0, 4)?.toUpperCase() || 'GUEST'}`;
  
  // Date of issue (e.g. mock registration date based on batch/current year)
  const issueDate = `04/03/2026`; // School foundation day is 4th March
  const expiryDate = user?.membershipExpiry || "Lifetime (No Expiry)";

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto" id="membership-card-modal">
        
        {/* CSS Print Styles to isolate and print only the card */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            /* Hide entire page structure */
            body * {
              visibility: hidden !important;
            }
            /* Show only the modal print target */
            #print-target-container, #print-target-container * {
              visibility: visible !important;
            }
            #print-target-container {
              position: absolute !important;
              left: 50% !important;
              top: 5% !important;
              transform: translateX(-50%) !important;
              width: 500px !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background: transparent !important;
            }
            /* Hide utility buttons from printing */
            #print-target-container .print-hide {
              display: none !important;
            }
          }
        `}} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          className="relative bg-white border-2 border-[#0D5230] max-w-2xl w-full p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(13,82,48,0.2)] rounded-none flex flex-col md:flex-row gap-6 items-stretch"
          id="print-target-container"
        >
          {/* Close button - hidden during print */}
          <button 
            onClick={onClose}
            className="print-hide absolute top-4 right-4 p-1 text-[#0D5230] hover:bg-green-50 border border-transparent hover:border-[#0D5230]/20 transition-colors cursor-pointer"
            title="Close Card View"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Interactive Digital Card Container */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            
            {/* Interactive Card Stage with 3D perspective */}
            <div className="perspective-1000 w-full max-w-[360px] h-[225px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <motion.div 
                className="relative w-full h-full duration-500 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                
                {/* 💳 CARD FRONT VIEW */}
                <div className={`absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-[#0D5230] via-[#093E23] to-[#052816] text-white border-2 border-amber-400 p-4 shadow-lg flex flex-col justify-between overflow-hidden`}>
                  
                  {/* Subtle seal background pattern */}
                  <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-amber-400/5 rounded-full border border-amber-400/10 pointer-events-none flex items-center justify-center">
                    <Sparkles className="h-24 w-24 text-amber-400/10" />
                  </div>

                  {/* Top: Association Banner */}
                  <div className="flex items-center gap-2 border-b border-amber-400/20 pb-2 relative z-10">
                    <div className="p-1 bg-amber-400 text-emerald-950 rounded-sm">
                      <Shield className="h-4 w-4 fill-emerald-950 text-emerald-950" />
                    </div>
                    <div className="text-left font-sans">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-300">Taki Boys Alumni Association</h4>
                      <p className="text-[7px] text-green-200 tracking-widest uppercase">Kolkata | Registered Society Act 2010</p>
                    </div>
                  </div>

                  {/* Middle Section: Avatar, Name, and Quick Info */}
                  <div className="flex gap-4 items-center my-2 relative z-10">
                    
                    {/* Alumnus Avatar Photo with Premium Border */}
                    <div className="shrink-0 relative">
                      <img 
                        src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"} 
                        alt={user.name} 
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover border-2 border-amber-400 bg-[#0A4025]"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-amber-400 text-[#0D5230] p-0.5 rounded-full border border-white">
                        <Award className="h-2.5 w-2.5 fill-[#0D5230]" />
                      </div>
                    </div>

                    {/* Alumnus Name, Class and Batch Details */}
                    <div className="text-left font-sans">
                      <span className="text-[7px] text-amber-400/80 font-black uppercase tracking-widest block">ALUMNUS MEMBER</span>
                      <h3 className="text-sm font-serif font-black tracking-tight text-white line-clamp-1">
                        {user.name}
                      </h3>
                      
                      <div className="mt-1 space-y-0.5 text-[9px] text-green-100">
                        <p><span className="text-amber-300/80">Batch:</span> Class of {user.batchYear}</p>
                        <p><span className="text-amber-300/80">Reg No:</span> {membershipId}</p>
                        <p className="text-[8px] flex items-center gap-1">
                          <span className="text-amber-300/80">Status:</span>
                          <span className="bg-emerald-800 text-green-300 border border-green-600 px-1 py-px rounded-sm font-black uppercase text-[7px] tracking-wide inline-block">
                            {user.membershipStatus === MembershipStatus.ACTIVE ? 'GOOD STANDING' : user.membershipStatus}
                          </span>
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Bar: Metallic Tier Badge & Digital ID */}
                  <div className="flex justify-between items-center border-t border-amber-400/20 pt-1.5 relative z-10">
                    <span className="text-[8px] font-mono font-bold text-amber-300 tracking-wider">
                      {membershipId}
                    </span>
                    <span className="bg-amber-400 text-emerald-950 font-black uppercase tracking-widest text-[8px] px-2 py-0.5 border border-white shadow-sm font-sans">
                      👑 {user.membershipTier}
                    </span>
                  </div>

                </div>

                {/* 💳 CARD BACK VIEW */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#072415] text-white border-2 border-amber-400 p-4 shadow-lg flex flex-col justify-between overflow-hidden`}>
                  
                  {/* Subtle watermarked seal */}
                  <div className="absolute left-[-20px] top-[-20px] w-32 h-32 bg-amber-400/[0.02] rounded-full pointer-events-none" />

                  {/* Rules of usage */}
                  <div className="text-left font-sans space-y-1">
                    <h5 className="text-[8px] font-black uppercase text-amber-300 tracking-wider border-b border-amber-400/20 pb-0.5">Rules & Certification</h5>
                    <p className="text-[7px] text-slate-300 leading-tight">
                      1. This card certifies active enrollment in the Taki House Govt. Spon. High School Alumni network.
                    </p>
                    <p className="text-[7px] text-slate-300 leading-tight">
                      2. Present this card for priority entry, library access, and reunions in Sealdah.
                    </p>
                    <p className="text-[7px] text-slate-300 leading-tight">
                      3. Non-transferable. Misuse is subject to cancellation by Executive Board.
                    </p>
                  </div>

                  {/* Signatures & Mock QR Grid */}
                  <div className="flex items-end justify-between gap-4 font-sans my-1.5">
                    
                    {/* Signatures */}
                    <div className="flex-1 grid grid-cols-2 gap-2 text-center text-[6px]">
                      <div className="border-t border-slate-400/40 pt-1 flex flex-col items-center">
                        <span className="italic font-serif text-[7px] text-amber-300/80 font-bold block">P. K. Nandi</span>
                        <span className="text-slate-400 uppercase tracking-widest block mt-0.5">PRESIDENT</span>
                      </div>
                      <div className="border-t border-slate-400/40 pt-1 flex flex-col items-center">
                        <span className="italic font-serif text-[7px] text-amber-300/80 font-bold block">S. Bose</span>
                        <span className="text-slate-400 uppercase tracking-widest block mt-0.5">GEN SECRETARY</span>
                      </div>
                    </div>

                    {/* QR Code Graphic Mockup */}
                    <div className="shrink-0 p-1 bg-white border border-amber-400 shadow-sm flex items-center justify-center">
                      <QrCode className="h-9 w-9 text-[#072415]" />
                    </div>

                  </div>

                  {/* Contact info footer */}
                  <div className="border-t border-amber-400/20 pt-1 flex justify-between text-[6px] text-slate-400 font-mono">
                    <span>Issued: {issueDate}</span>
                    <span>Valid: {expiryDate}</span>
                    <span className="text-amber-400/80">Kolkata, IN</span>
                  </div>

                </div>

              </motion.div>
            </div>

            {/* Tap Instructions - hidden during print */}
            <button 
              onClick={() => setIsFlipped(!isFlipped)}
              className="print-hide text-xs text-slate-500 hover:text-[#0D5230] font-sans font-bold flex items-center gap-1.5 py-1 px-3 bg-slate-50 border border-slate-200/60 rounded-full hover:border-[#0D5230]/30 transition-all cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5 text-[#0D5230]" />
              <span>Tap card to view {isFlipped ? "Front" : "Back"} Side</span>
            </button>

          </div>

          {/* Right Column: Information, Instructions & Downloads */}
          <div className="flex-1 flex flex-col justify-between text-left space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-100 border border-emerald-800/20 text-[#0D5230] rounded">
                  <FileCheck className="h-4 w-4" />
                </div>
                <h3 className="text-md sm:text-lg font-serif font-black text-[#0D5230] uppercase tracking-tight">
                  Official Alumni Digital ID
                </h3>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Your credentials are secure on our digital register. This digital Membership Card can be saved as a high-fidelity PDF, which you can print, laminate, and keep in your wallet.
              </p>

              {/* Data checklist */}
              <div className="p-3 bg-[#F0F7F4]/50 border border-[#0D5230]/10 text-xs space-y-2 font-sans rounded-none">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Holder Name:</span>
                  <span className="font-bold text-slate-800">{user.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Graduation Year:</span>
                  <span className="font-mono text-slate-800 font-bold">{user.batchYear}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Membership Tier:</span>
                  <span className="font-bold text-[#0D5230]">{user.membershipTier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Credential ID:</span>
                  <span className="font-mono font-bold text-slate-700">{membershipId}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="print-hide space-y-3 pt-4 border-t border-slate-100">
              <button
                onClick={handlePrint}
                className="w-full bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-3 px-4 rounded-none text-xs flex items-center justify-center gap-2 uppercase tracking-widest transition-all cursor-pointer border border-[#0D5230]"
              >
                <Download className="h-4 w-4" />
                <span>Download Card (Save as PDF)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-900 font-bold py-2 px-4 rounded-none text-xs text-center uppercase tracking-wider transition-all cursor-pointer"
              >
                Done / Return to Portal
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
