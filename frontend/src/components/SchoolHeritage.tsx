import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, BookOpen, Clock, Heart, Award, Sparkles, MapPin, Building, X, ChevronRight } from 'lucide-react';

export default function SchoolHeritage() {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    title: string;
    tag: string;
    bengali: string;
    desc: string;
  } | null>(null);

  const milestones = [
    {
      year: "1961",
      title: "School Establishment & Foundation Stone",
      desc: "Govt. Sponsored Multipurpose School (Boys) Taki House officially established at 299, Acharya Prafulla Chandra Road, Kolkata, under the guardianship of first National Teacher Kanailal Mukhopadhyay."
    },
    {
      year: "1965",
      title: "Historic Commencement & Dedicated Campus",
      desc: "Classroom teaching and academic curriculum initiated with faculty drawn from prestigious institutions like Hindu and Hare schools."
    },
    {
      year: "1979",
      title: "Campus Segregation & Girls Section Division",
      desc: "Distinct building constructed for the girls wing, defining the current expansive boys school quadrangle and main building."
    },
    {
      year: "2008 - 2009",
      title: "Birth of TBAAK (Taki Boys Alumni Association Kolkata)",
      desc: "Under the leadership of Headmaster Dr. Paresh Kumar Nanda and administrator Sanat Kumar Ghosh, TBAAK was established and inaugurated the first grand reunion on Feb 1, 2009."
    },
    {
      year: "2010",
      title: "Rabindra Library & Modern Laboratories Inauguration",
      desc: "Official registration of TBAAK under West Bengal Societies Act 2010. Inauguration of the 50-seater Rabindra Library and Acharya J.C. Bose Biology Laboratory on the 4th floor."
    },
    {
      year: "Present",
      title: "Modern Digital Era & Global Brotherhood",
      desc: "Connecting thousands of alumni spread across India, Europe, USA, and beyond through modern digital portals and active welfare initiatives."
    }
  ];

  const authenticHeritagePhotos = [
    {
      url: "/images/taki-building.jpg",
      title: "Main Classroom Campus Building",
      bengali: "ঐতিহ্যবাহী ৪-তলা মূল ভবন",
      tag: "School Grounds",
      desc: "The multi-storey school building under Kolkata's Sealdah skies where generations studied and forged lifelong memories."
    },
    {
      url: "/images/taki-heritage-stone.jpg",
      title: "Historic 1961 Foundation Stone Plaque",
      bengali: "স্থাপিত ১৯৬১ - সরকারি স্মারক ফলক",
      tag: "Heritage Plaque",
      desc: "The authentic foundation marble stone of Govt. Sponsored Multipurpose School (Boys) Taki House at 299, A.P.C. Road."
    },
    {
      url: "/images/taki-entrance-quote.jpg",
      title: "Gateway of Eternal Inspiration",
      bengali: "আমাদের অনুপ্রেরণা - রবীন্দ্র ও বিবেকানন্দ বাণী",
      tag: "Campus Gateway",
      desc: "'All power is within you' — the timeless wisdom of Swami Vivekananda and Rabindranath Tagore at the school portal."
    },
    {
      url: "/images/taki-alumni-quadrangle.jpg",
      title: "TBAAK Reunion in School Quadrangle",
      bengali: "টিব্যাক মিলনোৎসব প্রাঙ্গণ",
      tag: "Alumni Gathering",
      desc: "The historic school courtyard festooned with grand TBAAK banners during joyous reunions and brotherhood."
    }
  ];

  return (
    <div className="space-y-10 text-left" id="school-heritage-page">
      
      {/* 1. Heritage Cover Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(13,82,48,0.22)] border border-white/20 group perspective-1000"
      >
        <img 
          src="/images/taki-building.jpg" 
          alt="Taki House Campus" 
          className="w-full h-full object-cover filter brightness-[0.38] transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a18] via-[#0D5230]/70 to-transparent" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-400/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-sans font-bold text-white bg-emerald-800/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              Ex-Student Archives
            </span>
            <span className="text-[10px] font-sans font-bold text-amber-300 bg-amber-400/20 backdrop-blur-md border border-amber-300/40 px-3 py-1 rounded-full uppercase tracking-wider">
              স্থাপিত ১৯৬১
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white uppercase tracking-tight drop-shadow-md">
            Our Heritage & Legacy
          </h2>
          <p className="text-emerald-100 text-xs sm:text-base max-w-2xl font-sans leading-relaxed drop-shadow-xs">
            Tracing our roots back to 1961. Discover the historical milestones, iconic campus architecture, and foundational ethos of Taki House Boys in Kolkata.
          </p>
        </div>
      </motion.div>

      {/* 2. Authentic Nostalgia Photo Wall (User Uploaded Images) */}
      <div className="space-y-4 font-sans" id="nostalgia-photo-wall">
        <div className="flex items-center justify-between border-b border-[#0D5230]/20 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0D5230] animate-pulse" />
            <h3 className="text-xl font-bold text-[#0D5230] font-serif uppercase tracking-tight">
              স্মৃতির অ্যালবাম • Authentic School Photo Gallery
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Real Campus Glimpses</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {authenticHeritagePhotos.map((photo, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedPhoto(photo)}
              className="card-3d glass-panel rounded-2xl overflow-hidden group cursor-pointer border border-white/70 shadow-[0_10px_25px_rgba(13,82,48,0.08)] flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 bg-[#0D5230]/90 backdrop-blur-md border border-white/20 text-[9px] font-sans font-bold text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {photo.tag}
                </span>
              </div>
              <div className="p-3.5 bg-white/40 backdrop-blur-xs flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">{photo.bengali}</span>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D5230] transition-colors font-serif mt-0.5">
                    {photo.title}
                  </h4>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#0D5230] font-bold">
                  <span>View Full Photo</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. The Legacy Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.08)] space-y-6">
            <h3 className="text-xl font-bold text-[#0D5230] flex items-center gap-2.5 font-serif uppercase tracking-tight border-b border-[#0D5230]/20 pb-4">
              <Clock className="h-5 w-5 text-[#0D5230]" />
              <span>Timeline of Academic Glory & Heritage</span>
            </h3>

            <div className="relative border-l-2 border-[#0D5230]/30 pl-6 ml-3 space-y-8">
              {milestones.map((ms, idx) => (
                <div key={idx} className="relative">
                  {/* Year Marker Ball */}
                  <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-white border-2 border-[#0D5230] flex items-center justify-center shadow-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0D5230] animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <span className="font-serif text-base font-extrabold text-[#0D5230] italic block">{ms.year}</span>
                    <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base">{ms.title}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">{ms.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 col: Core Values & Facts */}
        <div className="space-y-6">
          
          <div className="glass-panel-elevated rounded-3xl p-6 border border-white/80 space-y-4 shadow-[0_12px_35px_rgba(13,82,48,0.08)]">
            <h3 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider pb-3 border-b border-[#0D5230]/20 flex items-center gap-2 font-sans">
              <Award className="h-5 w-5 text-[#0D5230]" />
              <span>Core Institutional Ethos</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-700 font-sans">
              <div className="space-y-1 p-3 rounded-2xl bg-white/50 border border-white/60">
                <span className="font-serif font-bold text-[#0D5230] block text-sm">🎓 Academic Rigor</span>
                <p className="text-slate-600 leading-relaxed">Consistently producing top ranks in the West Bengal Board Secondary (Madhyamik) and Higher Secondary examinations.</p>
              </div>

              <div className="space-y-1 p-3 rounded-2xl bg-white/50 border border-white/60">
                <span className="font-serif font-bold text-[#0D5230] block text-sm">⚽ Athletic Prowess</span>
                <p className="text-slate-600 leading-relaxed">Famous for football tournaments, athletics, and inter-school cricket champions in Kolkata districts.</p>
              </div>

              <div className="space-y-1 p-3 rounded-2xl bg-white/50 border border-white/60">
                <span className="font-serif font-bold text-[#0D5230] block text-sm">🤝 Lifelong Fraternity</span>
                <p className="text-slate-600 leading-relaxed">The bond among ex-students transcending generations. Senior alumni mentoring juniors toward career and academic excellence.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/70 space-y-3 text-center shadow-sm">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-[#0D5230] inline-block mx-auto">
              <Building className="h-8 w-8" />
            </div>
            <div className="space-y-1 font-sans">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">School Location</span>
              <span className="text-sm font-serif font-bold text-[#0D5230] block">Taki House Boys School Campus</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                299, Acharya Prafulla Chandra Rd, Rajabazar, Sealdah, Kolkata, West Bengal 700009
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal for Full Image Inspection */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-3xl w-full glass-card-dark text-white rounded-3xl overflow-hidden border border-white/25 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer backdrop-blur-md border border-white/20"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="max-h-[60vh] overflow-hidden bg-black/50 flex items-center justify-center">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title}
                  className="max-h-[60vh] w-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-sans font-bold uppercase tracking-wider">
                    {photoTagText(selectedPhoto.tag)}
                  </span>
                  <span className="text-xs text-emerald-300 font-sans font-bold">
                    {selectedPhoto.bengali}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-emerald-100/90 font-sans leading-relaxed">
                  {selectedPhoto.desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function photoTagText(tag: string) {
  return tag || 'Archive';
}
