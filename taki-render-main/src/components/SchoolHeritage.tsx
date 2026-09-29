import { motion } from 'motion/react';
import { Compass, BookOpen, Clock, Heart, Award, Sparkles, MapPin, Building } from 'lucide-react';

export default function SchoolHeritage() {
  const milestones = [
    {
      year: "1932",
      title: "Foundation",
      desc: "Taki House Govt. Sponsored High School for Boys was founded in the heart of Kolkata, dedicated to nurturing brilliant minds from diverse backgrounds."
    },
    {
      year: "1958",
      title: "Government Sponsorship",
      desc: "Recognizing its academic excellence, the Government of West Bengal officially sponsored the school, adding new wings and sports facilities."
    },
    {
      year: "1982",
      title: "Golden Jubilee Celebration",
      desc: "Celebrated 50 years of education with the establishment of the school's central library and modern science laboratories."
    },
    {
      year: "2012",
      title: "80 Years Anniversary",
      desc: "Inaugurated the advanced computer center and established the Taki Boys Alumni Association official executive board."
    },
    {
      year: "2022",
      title: "90-Year Landmark",
      desc: "Renovation of the primary campus facade and expansion of scholastic and athletic training programs."
    }
  ];

  const nostalgicPhotos = [
    {
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600",
      title: "Main Classroom Building",
      tag: "School Campus"
    },
    {
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
      title: "The Historical Central Library",
      tag: "Knowledge Hub"
    },
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600",
      title: "Annual Sports Ground",
      tag: "Athletics & Pride"
    },
    {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
      title: "Golden Batch Reunions",
      tag: "Alumni Gathering"
    }
  ];

  return (
    <div className="space-y-10" id="school-heritage-page">
      
      {/* Heritage Cover Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden border-2 border-[#0D5230] rounded-none shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200" 
          alt="Taki House Campus" 
          className="w-full h-full object-cover filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d5230]/90 via-[#0d5230]/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <span className="text-[10px] font-sans font-bold text-white bg-[#0D5230] border border-[#0A4025]/40 px-2.5 py-1 uppercase tracking-wider">
            Ex-Student Archives
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-white uppercase tracking-tight">Our Heritage & Legacy</h2>
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            Tracing our roots back to 1932. Discover the timelines, architecture, and core ethos that define Taki House Government Sponsored High School for Boys in Kolkata.
          </p>
        </div>
      </div>

      {/* The Legacy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
            <Clock className="h-5 w-5 text-[#0D5230]" />
            <span>Timeline of Academic Glory</span>
          </h3>

          <div className="relative border-l-2 border-[#0D5230]/30 pl-6 ml-3 space-y-8">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative">
                {/* Year Marker Ball */}
                <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-white border-2 border-[#0D5230] flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0D5230] animate-pulse" />
                </div>

                <div className="space-y-1">
                  <span className="font-serif text-md font-extrabold text-[#0D5230] italic block">{ms.year}</span>
                  <h4 className="font-serif font-bold text-[#1A1A1A] text-md">{ms.title}</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 col: Core Values & Facts */}
        <div className="space-y-6">
          
          <div className="bg-white border-2 border-[#0D5230]/30 p-5 space-y-4 rounded-none shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <h3 className="text-xs font-bold text-[#0D5230] uppercase tracking-wider pb-2 border-b border-[#0D5230]/10 flex items-center gap-2 font-sans">
              <Award className="h-4.5 w-4.5 text-[#0D5230]" />
              <span>Core Institutional Ethos</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-700 font-sans">
              <div className="space-y-1">
                <span className="font-serif font-bold text-[#0D5230] block text-sm">🎓 Academic Rigor</span>
                <p className="text-slate-600 leading-relaxed">Consistently producing top ranks in the West Bengal Board Secondary (Madhyamik) and Higher Secondary examinations.</p>
              </div>

              <div className="space-y-1">
                <span className="font-serif font-bold text-[#0D5230] block text-sm">⚽ Athletic Prowess</span>
                <p className="text-slate-600 leading-relaxed">Famous for football tournaments and inter-school cricket champions in Kolkata districts.</p>
              </div>

              <div className="space-y-1">
                <span className="font-serif font-bold text-[#0D5230] block text-sm">🤝 Strong Fraternity</span>
                <p className="text-slate-600 leading-relaxed">The bond among ex-students transcending generations. Senior alumni guiding juniors towards career excellence.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-[#0D5230]/30 p-5 space-y-4 text-center rounded-none shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
            <Building className="h-8 w-8 text-[#0D5230] mx-auto" />
            <div className="space-y-1 font-sans">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">School Location</span>
              <span className="text-sm font-serif font-bold text-[#0D5230] block">Taki House Boys School Campus</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                299, Acharya Prafulla Chandra Rd, Rajabazar, Sealdah, Kolkata, West Bengal 700009
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Nostalgia Photo Wall */}
      <div className="space-y-6 font-sans">
        <h3 className="text-lg font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
          <Sparkles className="h-5 w-5 text-[#0D5230]" />
          <span>Nostalgia Photo Wall</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nostalgicPhotos.map((photo, idx) => (
            <div 
              key={idx}
              className="bg-white border-2 border-[#0D5230]/20 overflow-hidden group hover:scale-[1.01] hover:border-[#0D5230] transition-all rounded-none shadow-sm"
            >
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-[#0D5230] border border-[#0A4025] text-[9px] font-sans font-bold text-white px-2 py-0.5 rounded-none">
                  {photo.tag}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors font-serif">
                  {photo.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
