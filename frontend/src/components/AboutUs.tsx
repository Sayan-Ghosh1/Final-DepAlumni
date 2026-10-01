import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Heart, 
  Sparkles, 
  Building, 
  Calendar, 
  Globe, 
  Users,
  Compass,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="space-y-10 text-left" id="about-us-page">
      
      {/* 1. Hero Banner Cover with Real Campus Building */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(13,82,48,0.22)] border border-white/20 group perspective-1000"
      >
        <img 
          src="/images/taki-building.jpg" 
          alt="Taki Boys Campus Building" 
          className="w-full h-full object-cover filter brightness-[0.38] transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a18] via-[#0D5230]/70 to-transparent" />
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-400/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-sans font-black text-white bg-emerald-800/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              আমাদের সম্পর্কে (About Us)
            </span>
            <span className="text-[10px] font-sans font-bold text-amber-300 bg-amber-400/20 backdrop-blur-md border border-amber-300/40 px-3 py-1 rounded-full uppercase tracking-wider">
              স্থাপিত ১৯৬১ • Regd. 2010
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white uppercase tracking-tight drop-shadow-md">
            টাকী বয়েজ অ্যালুমনি অ্যাসোসিয়েশন
          </h2>
          <p className="text-emerald-100 text-xs sm:text-base max-w-2xl font-sans leading-relaxed italic drop-shadow-xs">
            "আসল নামটি অনেক বড়, তবে কিনা পরিচয়ের জন্য এটুকুই যথেষ্ট। টাকী বয়েজ মানেই গৌরব, টাকী বয়েজ মানেই চিরন্তন আবেগ।"
          </p>
        </div>
      </motion.div>

      {/* 2. Intro Quote Panel & Vision/Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* About TBAAK Core Text */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.08)] space-y-6">
            <div className="flex items-center gap-3 border-b border-[#0D5230]/20 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-800">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-[#0D5230] uppercase tracking-tight">
                  আমাদের মিশন ও লক্ষ্য (Our Mission & Vision)
                </h3>
                <span className="text-xs text-slate-500 font-sans block mt-0.5">The Heart & Spirit of TBAAK Fraternity</span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-sans text-justify">
              সময়ের হাত ধরে এগিয়েছে জীবনের পথ। দশকের পর দশক একরাশ ঝকঝকে কুঁড়ি ফুল হয়ে ফুটে ওঠার প্রস্তুতি নিয়েছে। 
              ছাত্র, শিক্ষক-শিক্ষিকা, শিক্ষাকর্মীদের প্রাণের সঙ্গে জড়িয়ে টাকী বয়েজ। আজ কলকাতায়, বাংলায়, ভারতবর্ষে, এমনকি বিশ্বজুড়ে যারা নানা পেশায় প্রতিষ্ঠিত, তাদের কাছে আজও আলাদা আবেগের নাম টাকী বয়েজ। বাঙালি মধ্যবিত্ত ঘরানার স্কুল, যেখানে বাল্য, কৈশোর কাটিয়ে আজ সবাই জীবনের কক্ষপথে সাবলীল যাত্রী।
            </p>

            <p className="text-sm text-slate-700 leading-relaxed font-sans text-justify">
              এই প্রাক্তণীদেরই একমেবদ্বিতীয়ম সংগঠন <strong className="text-emerald-950 font-bold">“টাকী বয়েজ অ্যালুমনি অ্যাসোসিয়েশন কলকাতা”</strong> , সংক্ষেপে <strong className="text-[#0D5230] font-extrabold">“টিব্যাক” (TBAAK)</strong>। সংগঠন প্রাক্তন ছাত্রদের। আত্মিক সেতুবন্ধন স্কুলের সঙ্গে। সোসাইটি অ্যাক্ট অনুযায়ী সরকারি নথিভুক্ত সংগঠন, যার দপ্তর স্কুলেই। পদাধিকারবলে সভাপতি স্কুলের প্রধানশিক্ষক মহাশয়। ২০০৮-এর শেষদিক থেকে প্রস্তুতি শুরু। ২০০৯ এ মিলনোৎসবে আত্মপ্রকাশ। তখন থেকেই অবিরাম যাত্রা। 
            </p>

            <div className="bg-emerald-50/70 border-l-4 border-[#0D5230] p-4.5 rounded-r-2xl italic text-xs text-emerald-900 font-sans leading-relaxed shadow-xs">
              "টিব্যাক একটু অন্যরকম। নিশ্চয়ই টিব্যাক প্রাক্তণীদের, কিন্তু শুধু প্রাক্তণীদের জন্য নয়। বার্ষিক মিলনোৎসব অবশ্যই হয়, কিন্তু সেটাই একমাত্র কর্মসূচি নয়।"
            </div>

            {/* Inspiration Gateway Feature Card with real uploaded entrance photo */}
            <div className="card-3d glass-panel rounded-2xl overflow-hidden border border-white/70 p-4 space-y-3">
              <div className="relative h-56 rounded-xl overflow-hidden">
                <img 
                  src="/images/taki-entrance-quote.jpg" 
                  alt="Taki School Entrance Gate" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-[#0D5230]/90 backdrop-blur-md text-white text-[9px] font-sans font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  School Gate & Inscription
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-serif font-black text-sm">
                    "OUR INSPIRATION" — Swami Vivekananda & Rabindranath Tagore
                  </h4>
                  <p className="text-[10px] text-emerald-200 font-sans">
                    "All power is within you, you can do anything & everything"
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                স্কুলের প্রবেশদ্বারে খোদাই করা এই মহান বাণীগুলো প্রতিদিন ছাত্রদের মধ্যে সাহস ও আত্মবিশ্বাসের সঞ্চার করে। এই চেতনাকেই অন্তরে ধারণ করে টিব্যাক এগিয়ে চলেছে।
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Organization Card */}
        <div className="space-y-6">
          <div className="glass-panel-elevated rounded-3xl p-6 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.08)] space-y-4">
            <h4 className="text-xs font-sans font-black uppercase text-[#0D5230] tracking-wider flex items-center gap-2 border-b border-[#0D5230]/20 pb-2.5">
              <Building className="h-4 w-4 text-[#0D5230]" />
              <span>টিব্যাক সংক্ষেপ (Quick Facts)</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs font-sans space-y-3 pt-2">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">প্রতিষ্ঠা বছর</span>
                <span className="font-bold text-slate-900">২০০৯ (১ ফেব্রুয়ারি)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">নথিভুক্তি ধরন</span>
                <span className="font-bold text-slate-900">সোসাইটি অ্যাক্ট ২০১০</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">প্রধান কার্যালয়</span>
                <span className="font-bold text-slate-900">টাকী স্কুল ভবন, কলকাতা</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">সভাপতি (পদাধিকারবলে)</span>
                <span className="font-bold text-slate-900">প্রধানশিক্ষক মহাশয়</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">অফিসিয়াল সংক্ষিপ্ত নাম</span>
                <span className="font-bold text-emerald-800">TBAAK (টিব্যাক)</span>
              </div>
            </div>
          </div>

          <div className="glass-card-dark text-white p-6 rounded-3xl border border-white/20 shadow-xl space-y-3">
            <Heart className="h-6 w-6 text-emerald-300 fill-emerald-300 animate-pulse" />
            <h4 className="font-serif font-black text-md">সেতুবন্ধন ও সেবা</h4>
            <p className="text-[11px] font-sans text-emerald-100/90 leading-relaxed">
              স্কুলের সৌন্দর্যায়ন, শিক্ষামূলক কর্মশালা, ও প্রাক্তনীদের পারস্পরিক সংযোগ স্থাপনে টিব্যাক নিরলসভাবে কাজ করে চলেছে। আমরা আমাদের গৌরবময় অতীতকে সাথে নিয়ে উজ্জ্বল ভবিষ্যৎ গড়তে অঙ্গীকারবদ্ধ।
            </p>
          </div>

          {/* Authentic Foundation Stone Card */}
          <div className="card-3d glass-panel rounded-3xl overflow-hidden border border-white/70 p-4 space-y-3 text-left">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
              <img 
                src="/images/taki-heritage-stone.jpg" 
                alt="Foundation Stone Plaque 1961" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-2 left-2 bg-[#0D5230]/90 backdrop-blur-md text-[9px] font-sans font-bold text-white px-2 py-0.5 rounded-full uppercase">
                Foundation Plaque
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 block">স্থাপিত :- ১৯৬১</span>
              <h5 className="font-serif font-bold text-xs text-slate-900">গভঃ স্পনসর্ড মাল্টিপারপাস স্কুল (বয়েজ) তাকী হাউস</h5>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">২৯৯, বি, পি, সি রোড, কলকাতা - ৯</p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. History Timeline Section */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_12px_35px_rgba(13,82,48,0.08)] space-y-8">
        <div className="flex items-center gap-3 border-b border-[#0D5230]/20 pb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-800">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black text-[#0D5230] uppercase tracking-tight">
              ইতিহাস ও গোড়ার কথা (History Archive)
            </h3>
            <span className="text-xs text-slate-500 font-sans block mt-0.5">Journey of Taki House and TBAAK across generations</span>
          </div>
        </div>

        {/* Narrative Chapters */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-sans text-justify">
          
          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">১. সূচনা পর্ব ও জাতীয় শিক্ষকের আভিভাবকত্ব</h4>
            <p>
              উত্তর চব্বিশ পরগণার টাকী-র বর্ধিষ্ণু জমিদার-দের রাজ্য সরকার-কে দান করা (যদিও শোনা যায় এক টাকার বিনিময়ে হস্তান্তরিত) জমিতে একটি সরকার পোষিত স্কুলের পথ চলার শুরু ১৯৬৫ সালের ৪ মার্চ থেকে। রাজাবাজার থেকে দক্ষিণমুখে (ট্রাম ডিপোর পরে) পূর্বদিকের জমিতে ঈশ্বরচন্দ্র পাঠভবন ও ই. এস. আই. হাসপাতাল-এর মধ্যবর্তী স্থানটিতে স্থাপিত হয়েছিল “গভর্ণমেন্ট স্পনসর্ড মাল্টিপারপাস স্কুল ফর বয়েজ টাকী হাউজ”, ওরফে “টাকী স্কুল” বা “টাকী বয়েজ”। হিন্দুস্কুলের তৎকালীন প্রধান শিক্ষক, অসংখ্য ছাত্র তৈরীর কারিগর ও ‘জাতীয় শিক্ষক’ (প্রথম) সম্মানে ভূষিত কানাইলাল মুখোপাধ্যায় টাকী স্কুল-এর প্রধান শিক্ষকের দ্বায়িত্ব পেলেন। তাঁর সার্বিক আভিভাবকত্বে স্কুলের এগিয়ে চলা।
            </p>
            <p className="text-xs text-slate-500 italic">
              সেসময়ে প্রথম মাসে স্কুলে জল ও বিদ্যুৎ ছিল না। স্কুলের অফিস ঘর ছিল হিন্দুস্কুল-এ। শিক্ষক-শিক্ষিকাদের ওখানেই যেতে হ’ত সই করতে। তবে কয়েকমাসের মধ্যেই অবশ্য স্কুলের নিজস্ব অফিসঘর তৈরী হ’য়ে গেল।
            </p>
          </div>

          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">২. গার্লস স্কুলের বিভাজন ও প্রাতঃকালীন বিভাগ</h4>
            <p>
              প্রথমে একই ভবনের তৃতীয়তলে বয়েজ স্কুলের সাথে সম্পুর্ণ আলাদা পরিচালনায় চালু হয় টাকী গার্লস্ স্কুল- পরে অবশ্য ১৯৭৯-এ বয়েজ স্কুলের পেছনের জমিতে গড়ে ওঠে গার্লস্ স্কুলের আলাদা ভবন এবং একটি পাঁচিলের মাধ্যমে আলাদা করা হয় স্কুল-দুটির পরিসীমা। ফলে বয়েজ স্কুলের আকর্ষণীয় সুবিস্তৃত মাঠের বেশ কিছুটা অংশ বাদ যায়।
            </p>
            <p>
              প্রাতঃকালীন বিভাগের দায়িত্ব অর্পিত হয় শিখা বন্দ্যোপাধ্যায়-এর ওপর। শোনা যায়, কানাইবাবু-ই শিখাদির মতন ব্যক্তিত্ব সম্পন্ন শিক্ষয়ত্রী-কে ‘বড়দি’-র পদে নিয়ে এসেছিলেন। কানাইবাবুর আন্তরিকতা, অদম্য ইচ্ছাক্ষমতা ও অসামান্য দক্ষতায় টাকী স্কুল প্রতিষ্ঠিত হওয়ার স্বল্পকালের মধ্যেই গুণগত মানে বৈশিষ্ঠ্য অর্জন করেছিল। খুঁজে খুঁজে আগ্রহী, নিষ্ঠাবান্ তরুণ-তরুণীদের নিয়ে এসেছিলেন তিনি-স্কুলের শিক্ষক-শিক্ষিকা হিসেবে। পাশাপাশি হিন্দু ও হেয়ার স্কুল থেকেও নিয়ে এসেছিলেন বিভিন্ন বিষয়ের দক্ষ-অভিজ্ঞ শিক্ষকদের। 
            </p>
            <p>
              এমনকী, ছাত্রদের ভর্তি করার সময়ও তিনি ছিলেন তীক্ষ্ণ দৃষ্টি সম্পন্ন। কানাইবাবু হিন্দু-হেয়ার স্কুল থেকে বহু কৃতি ছাত্রদের এমনকী অনুত্তীর্ণ কয়েকজন ছাত্রকেও নতুন এই স্কুল-এ নিয়ে এসেছিলেন- দ্বায়িত্ব দিয়েছিলেন নতুন উদ্যমী শিক্ষক-শিক্ষিকাদের যাতে তারা একদিন অন্য স্কুলের কৃতি ছাত্রদের সমকক্ষ হয়ে উঠতে পারে, এবং বলাই বাহুল্য, সেই কাজে কানাইবাবুর নির্দেশনায় স্কুলের শিক্ষক-শিক্ষিকারা সফলও হয়েছিলেন।
            </p>
          </div>

          <div className="border-l-4 border-amber-600 pl-4 space-y-2 bg-amber-50/40 p-4 rounded-r-2xl">
            <h4 className="text-base font-serif font-black text-slate-900">৩. স্নেহ-কঠোরতা আর যৌথ পরিবার</h4>
            <p className="italic">
              রাশভারী এই মানুষটি কিন্তু ছিলেন কাঠিন্য ও কোমলতার আধার। ছাত্রবৎসল মানুষটির মন-প্রাণ ছিল টাকী স্কুল। তাঁর অভিজ্ঞতার ভাণ্ডার উজার ক’রে স্নেহ-কঠোরতা আর দ্বায়িত্বশীল অভিভাবকত্বে স্কুল-কে ক’রে তুলেছিলেন আদর্শস্থানীয়। সহশিক্ষক ও অশিক্ষক কর্মচারী থেকে শুরু ক’রে ছাত্ররা-কানাইবাবুর সহৃদয় মহত্বে সবাই এক নিবিড় বন্ধনে বাঁধা পড়েছিল-স্কুল ছিল এক যৌথ পরিবারের মতো। ইঁট-কাঠ-চেয়ার-টেবিল-ব্ল্যাকবোর্ড-দরজা-জানলা-মাঠ-গাছ- এই সবকিছু নিয়ে ছাত্র আর মাস্টারমশাইদের আন্তরিক সম্পর্ক এক পুর্ণাঙ্গ রূপ পেয়েছিল, যার প্রতিফলিত প্রভাব পরবর্তী সময়ে স্কুলকে প্রাণিত করেছিল।
            </p>
            <p className="text-xs text-slate-500 font-bold">
              কানাইবাবুর অবসর গ্রহণের পর স্কুলের দ্বায়িত্ব গ্রহণ করেন রসায়নের শিক্ষক বীরেন্দ্রনাথ ভট্টাচার্য (বীরেন বাবু)। কানাইবাবুই তাঁকে নিয়ে এসেছিলেন হিন্দু স্কুল থেকে।
            </p>
          </div>

          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">৪. শিক্ষামানচিত্রে জয়যাত্রা ও মাঠের সবুজ স্মৃতি</h4>
            <p>
              স্কুল এগোতে থাকে তার স্বকীয় ধারাবাহিকতায়। বোর্ড-এর বিভিন্ন পরীক্ষায় ছাত্ররা সাফল্য অর্জন করছে, প্রথম সারিতে স্থানার্জন করছে, সর্বোপরি জীবনের বিভিন্ন ক্ষেত্রে প্রতিষ্ঠিত হচ্ছে। কানাইবাবুর সময় থেকেই এই জয়যাত্রার শুরু। আজকের দিনে এধরণের পরীক্ষায় সাফল্যের বিষয়টি হয়ত ঠিকভাবে বুঝে ওঠা যাবে না। একটি সদ্য প্রতিষ্ঠিত স্কুল তার শৈশবেই রাজ্যের শিক্ষামানচিত্রে যে স্থান অর্জন করতে পেরেছিল, তার গুরুত্ব দেশের আর্থ-সামাজিক পরিসরে অপরিসীম। 
            </p>
            <p>
              অনেক স্কুলের ছাত্ররাই বিভিন্ন পরীক্ষায় সফল হয়, জীবনে প্রতিষ্ঠিতও হয়- কিন্তু টাকী স্কুল-এর পরিবেশ, তার সীমাবদ্ধতা সত্ত্বেও সামগ্রিকভাবে ছাত্রদের মানসিকতা গঠন ও সার্বিক শিক্ষার মানোন্নয়নের ক্ষেত্রে এক অসাধারণ ভূমিকা পালন করেছিল। স্কুলে ছাত্রদের পারস্পরিক সম্পর্ক চার দেওয়ালে আটকে না থেকে ছড়িয়ে পড়তে পেরেছিল মাঠের সবুজ প্রাণপ্রাচুর্যে, হৃদয়ের রক্তিম নির্ভরতায়, টিফিন-এর সময়ে নারানদার ঝালমুড়ি কিংবা আচার, ঘুগনি-স্যারের প্রশ্রয়ে যাবতীয় দুষ্টুমি ও দৌড়াত্মকে ক্ষমা ক’রে দেওয়া শাসনের আশ্রয়ে।
            </p>
          </div>

          {/* Reunion Milestone Card with Authentic Quadrangle Gathering Image */}
          <div className="card-3d glass-panel rounded-2xl overflow-hidden border border-white/70 p-4 space-y-3">
            <div className="relative h-60 rounded-xl overflow-hidden">
              <img 
                src="/images/taki-alumni-quadrangle.jpg" 
                alt="TBAAK Reunion Quadrangle" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <span className="absolute top-3 left-3 bg-[#0D5230]/90 backdrop-blur-md text-white text-[9px] font-sans font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Historic Reunion in Quadrangle
              </span>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-serif font-black text-sm">
                  টিব্যাক মিলনোৎসব প্রাঙ্গণ • TBAAK Grand Quadrangle Gathering
                </h4>
                <p className="text-[10px] text-emerald-200 font-sans">
                  The iconic courtyard where alumni gather under the TBAAK festival banners
                </p>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">৫. পুনর্মিলন উৎসব ও 'টিব্যাক' এর আত্মপ্রকাশ (২০০৮ - ২০০৯)</h4>
            <p>
              এ হেন স্কুলের ছড়িয়ে থাকা প্রাক্তনীদের স্বাভাবিক অন্তরেচ্ছা ছিল একটি পুনর্মিলন উৎসবের। স্কুলের রজত জয়ন্তী (২৫ বছর) উদ্যাপনের সময়ে সে উদ্যোগ একবার দানা বেঁধেও সম্পূর্ণতা পায়নি। শেষপর্যন্ত বহুপ্রতীক্ষিত পুনর্মিলন উৎসব আয়োজনের উদ্যোগ নিলেন স্কুলের বর্তমান প্রধান শিক্ষক ডঃ পরেশ কুমার নন্দ- ২০০৮-এর ১৮ ডিসেম্বর আহুত হ’ল প্রথম সভা। পরবর্তী সভা ১১ জানুয়ারি ২০০৯-এ। সেখানে সর্বসম্মতিক্রমে প্রাক্তনী সংগঠনের নামকরণ হ’লো <strong className="text-emerald-950 font-bold">“টাকী বয়েজ অ্যালাম্নাই অ্যাসোসিয়েশন কোলকাতা”</strong> ওরফে <strong className="text-[#0D5230] font-bold">“টিব্যাক” (“TBAAK”)</strong>। 
            </p>
            <p>
              স্কুলের প্রশাসক সনৎ কুমার ঘোষ-এর তত্ত্বাবধানে, প্রধান শিক্ষক সহ একাধিক শিক্ষক-শিক্ষিকাদের সক্রিয় সহযোগিতায় পালিত হ’ল প্রথম পুনর্মিলন উৎসব ২০০৯ সালের ১ ফেব্রুয়ারি। সেদিন বিকেলে সে এক অদ্ভুত মিলন মেলা স্কুলের মাঠে। প্রাক্তন শিক্ষক-শিক্ষিকা ও অশিক্ষক কর্মীদের অপরিশোধ্য ঋণের কথা ম’নে প’ড়ে গেল সকলের। প্রাক্তনীরা স্মারক সংবর্ধনা জানালেন তাঁদের। নানান্ স্মৃতির ভিড় ঠেলে উজ্জ্বল হয়ে উঠল নানান্ মুখ। অবশেষে অনুষ্ঠানের পরিসমাপ্তি ঘটল প্রাক্তন ছাত্র ও সুগায়ক সুমন পান্থী-র রবীন্দ্রগানে।
            </p>
          </div>

          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">৬. দ্বিতীয় মিলনোৎসব ও মিঠুন চক্রবর্তীর উপস্থিতি (২০১০)</h4>
            <p>
              প্রথম পুনর্মিলন উৎসবের সাফল্যের প্রত্যাশিত ধারা ব্যাহত হ’য়েছিল কিছু অকর্তব্যে। দ্বিতীয় পুনর্মিলন উৎসব হয়ে পড়েছিল অনিশ্চিত। সেই ত্রুটি সংশোধন ক’রে সংগঠন-কে পুনর্গঠিত করা হ’লো ২০১০ সালের গোড়ায়। এর মধ্যেই স্বল্পসময়ে “টাকী হাউস বয়েজ রিইউনিয়ন কমিটি” নামক একটি কমিটি গঠন ক’রে উদ্যাপিত হ’লো দ্বিতীয় পুনর্মিলন উৎসব ১৭ জানুয়ারি ২০১০-এ। প্রাক্তনীদের উৎসবে, অনুষ্ঠানের প্রথমার্ধে স্কুলের বর্তমান ছাত্রদের ভবিষ্যৎ বিষয়ে উৎসাহিত করতে উপস্থিত ছিলেন প্রখ্যাত চিত্রাভিনেতা <strong className="font-bold text-slate-900">মিঠুন চক্রবর্তী</strong>।
            </p>
          </div>

          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">৭. টিব্যাকের স্থায়ী রূপ ও রবীন্দ্র গ্রন্থাগারের উদ্বোধন (২০১০)</h4>
            <p>
              এরপরে ২০১০-এর ২৭ জুলাই নিবন্ধীকৃত হ’লো ‘টিব্যাক’। ব্যাঙ্ক অ্যাকাউন্ট খোলা হ’লো। ওদিকে চলতে থাকল সারাবছরব্যাপী নানান্ কর্মসূচী। টিব্যাক ও টাকী স্কুলের যৌথ উদ্যোগে বাচিক ইংরাজি প্রশিক্ষণের ব্যাবস্থা গ্রহণ, আচার্য প্রফুল্ল চন্দ্র রায়ের জন্মসার্ধশতবর্ষ উপলক্ষে আলোচনা সভা, চিকিৎসক দিবসে স্বাস্থ্য বিষয়ক সচেতনতা শিবির ও কর্মশালা- এসব যেমন হয়েছে তেমনি টিব্যাক সামিল হয়েছিল স্কুলের সৌন্দর্যায়ন ও উন্নয়নমূলক নানান্ কর্মোদ্যোগে।
            </p>
            <p>
              যার মধ্যে উল্লেখযোগ্য প্রতি বছর ৪ মার্চ টাকী স্কুল বিদ্যালয় ভবনটিকে আলোকমালায় সুসজ্জিত ক’রে স্কুলের জন্মদিনটিকে উদ্যাপন করা, ২০১০-এর ১০ ডিসেম্বর স্কুলের নবনির্মিত চতুর্থতলে কানাইলাল স্মৃতি সভাগৃহ ও আচার্য জগদীশ চন্দ্র বসু বিক্ষণাগার (জীববিদ্যা-র ল্যাবরেটরি) এবং ১৪ ডিসেম্বর ৫০-জনের আসন বিশিষ্ট একটি উন্নতমানের লাইব্রেরী “রবীন্দ্র গ্রন্থাগার”-এর শুভ উদ্বোধন। উদ্বোধন করেছিলেন যথাক্রমে তৎকালীন বিদ্যালয় শিক্ষামন্ত্রী পার্থ দে, স্কুল প্রশাসক সনৎ কুমার ঘোষ এবং তৎকালীন গ্রন্থাগারমন্ত্রী তপন রায়। এছাড়াও রয়েছে স্কুলের দেওয়ালে ছত্রে ছত্রে বিভিন্ন মনীষীদের বাণী প্রচারের প্রয়াস ও বিদ্যালয়ের প্রতিটি ঘরের শ্রেণীকক্ষের নামকরণ।
            </p>
          </div>

          <div className="border-l-4 border-emerald-700 pl-4 space-y-2">
            <h4 className="text-base font-serif font-black text-slate-900">৮. ডিজিটাল যুগে প্রবেশ ও হারিয়ে যাওয়া বন্ধুদের সন্ধান (২০১১)</h4>
            <p>
              ২০১১-র ৯ জানুয়ারি তৃতীয় পুনর্মিলন উৎসব পালন করে টিব্যাক। অনুষ্ঠানের প্রথমার্ধে বর্তমান ছাত্রদের উদ্দীপিত করতে সরাসরি আলাপচারিতায় অংশগ্রহণ করেছিলেন তৎকালীন নগরপাল গৌতম মোহন চক্রবর্ত্তী। টিব্যাকের এই ওয়েবসাইট-টির আনুষ্ঠানিক উদ্বোধনও তিনি করেন ঐদিন। পরবর্তীকালে কয়েকদিনের মধ্যেই ওয়েবসাইট-টিকে আরও উন্নতমানের ক’রে তোলা হয়। যাতে সারা পৃথিবী ব্যাপী ছড়িয়ে থাকা প্রাক্তনী-রা এই ওয়েবসাইট-এর মাধ্যমে সহজেই খুঁজে নিতে পারে তার হারিয়ে যাওয়া স্কুলের কোন বন্ধুকে। 
            </p>
            <p>
              এরপর ৩১ জুলাই ২০১১-এ প্রকাশিত হয় টিব্যাকের প্রথম স্মারক সংকলন। তাতে প্রাক্তনীদের রোমন্থনের সঙ্গে রয়েছে স্কুলের ম্যাগাজিন ‘মনীষা’ থেকে আহৃত “উজ্জ্বল উদ্ধার”- স্কুলের প্রাক্তন শিক্ষকদের বৈচিত্র্যপূর্ণ চিন্তাভাবনা ও মননের প্রতিফলন হিসেবে সেই লেখাগুলো ফিরে পড়ার।
            </p>
            <p className="font-bold text-[#0D5230] pt-2">
              এইভাবে ক্রমশঃ নিজস্ব ছন্দে স্কুলের সাথে তাল মিলিয়ে এগিয়ে চলে টিব্যাক, হ’য়ে ওঠে একে অপরের পরিপূরক। উভয় উভয়ের সুখ-দুঃখের সাথী হয়ে টিব্যাক ও টাকী স্কুল একাত্ম হয়ে যায় কিছুদিনের মধ্যেই।
            </p>
          </div>

        </div>
      </div>

      {/* Legacy Footer Badge */}
      <div className="glass-panel rounded-2xl p-6 text-center space-y-1.5 border border-white/70 shadow-xs">
        <span className="font-serif font-black text-lg text-[#0D5230] block">টাকী বয়েজ অ্যালুমনি অ্যাসোসিয়েশন কলকাতা (টিব্যাক)</span>
        <p className="text-xs text-slate-600 font-sans">
          নিবন্ধীকৃত সোসাইটি অ্যাক্ট ২০১০ | ২৯৯/বি, আচার্য প্রফুল্ল চন্দ্র রোড, রাজাবাজার, কলকাতা ৭০০ ০০৯, ভারত
        </p>
      </div>

    </div>
  );
}
