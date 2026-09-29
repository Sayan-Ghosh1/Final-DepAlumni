import { useState, useEffect } from 'react';
import { Search, GraduationCap, MapPin, Briefcase, Award, Shield, UserCheck } from 'lucide-react';
import { AlumniDirectoryEntry } from '../types';

export default function AlumniDirectory() {
  const [directory, setDirectory] = useState<AlumniDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/alumni/directory');
      if (response.ok) {
        const data = await response.json();
        setDirectory(data.directory);
      }
    } catch (err) {
      console.warn('Alumni directory sync paused or connection offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  // Filter list
  const filteredDirectory = directory.filter((entry) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      entry.name.toLowerCase().includes(q) ||
      entry.occupation.toLowerCase().includes(q) ||
      entry.location.toLowerCase().includes(q);

    const matchBatch = selectedBatch === 'All' || entry.batchYear.toString() === selectedBatch;

    return matchSearch && matchBatch;
  });

  // Get unique batch years in the system
  const batches = ['All', ...Array.from(new Set(directory.map(d => d.batchYear.toString()))).sort((a: string, b: string) => b.localeCompare(a))];

  return (
    <div className="space-y-8" id="alumni-directory">
      
      {/* Directory Introduction Cover */}
      <div className="border-2 border-[#0D5230] p-6 sm:p-8 bg-white shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D5230] block mb-2">Public Archives</span>
        <h2 className="text-3xl font-serif italic mb-2 leading-none text-[#0D5230]">The Central Alumni Registry</h2>
        <p className="font-sans text-xs text-slate-700 max-w-xl leading-relaxed">
          Search the certified membership registry of the Taki House Alumni Association. Find and reconnect with boys across different generations, from pre-independence batches to our youngest ex-students.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-2 border-[#0D5230] bg-[#F0F7F4] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
        
        {/* Keyword Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#0D5230]/60" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ex-students by name, occupation, or town..."
            className="w-full bg-white border border-[#0D5230]/40 py-2 pl-9 pr-4 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#0D5230] text-[#1A1A1A] placeholder:italic"
          />
        </div>

        {/* Batch Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0D5230] shrink-0">Filter Batch:</span>
          <select 
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full sm:w-36 bg-white border border-[#0D5230]/40 py-2 px-3 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#0D5230]"
          >
            {batches.map((b) => (
              <option key={b} value={b}>{b === 'All' ? 'All Batches' : `Class of ${b}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table / Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="inline-block h-6 w-6 border-2 border-[#0D5230] border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : filteredDirectory.length === 0 ? (
        <div className="p-12 border-2 border-[#0D5230]/20 bg-white text-center space-y-3 shadow-sm">
          <GraduationCap className="h-10 w-10 mx-auto text-[#0D5230]/50" />
          <p className="font-serif italic text-lg text-slate-600">No Alumni matched your criteria</p>
          <p className="font-sans text-xs text-slate-400 max-w-sm mx-auto">Try clearing search terms or selecting 'All Batches' to fetch the whole Kolkata directory listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDirectory.map((entry) => (
            <div 
              key={entry.id}
              className="p-5 border-2 border-slate-200 hover:border-[#0D5230] bg-white flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-[3px_3px_0px_0px_rgba(13,82,48,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(13,82,48,0.2)] relative overflow-hidden"
            >
              {/* Premium Badge Ribbon for Patron & Life Members */}
              {(entry.membershipTier === 'Patron' || entry.membershipTier === 'Life Member') && (
                <div className="absolute right-0 top-0 bg-[#0D5230] text-white text-[9px] font-sans font-bold uppercase py-1 px-3.5 tracking-wider rounded-bl">
                  {entry.membershipTier === 'Patron' ? 'Patron' : 'Life'}
                </div>
              )}

              <div className="space-y-4">
                {/* Profile header */}
                <div className="flex items-center gap-3">
                  {entry.avatarUrl ? (
                    <img 
                      src={entry.avatarUrl} 
                      alt={entry.name} 
                      className="h-12 w-12 rounded-full border-2 border-[#0D5230]/40 object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-[#F0F7F4] border-2 border-[#0D5230]/40 flex items-center justify-center font-bold text-[#0D5230]">
                      {entry.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif font-black text-md text-[#1A1A1A] leading-tight hover:underline cursor-pointer hover:text-[#0D5230]">
                      {entry.name}
                    </h4>
                    <span className="font-sans text-[10px] font-bold text-[#0D5230] uppercase tracking-wider block mt-0.5">
                      Batch of {entry.batchYear}
                    </span>
                  </div>
                </div>

                {/* Professional & Location detail */}
                <div className="space-y-2 border-t border-dashed border-[#0D5230]/20 pt-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-sans">
                    <Briefcase className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{entry.occupation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-sans">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{entry.location}</span>
                  </div>
                </div>
              </div>

              {/* Verified member footer label */}
              <div className="mt-4 pt-3 border-t border-[#0D5230]/10 flex items-center justify-between text-[10px] font-sans">
                <span className="text-slate-400 font-mono">Registry ID: {entry.id.toUpperCase()}</span>
                <span className="text-[#0D5230] font-bold uppercase tracking-wider flex items-center gap-0.5">
                  <UserCheck className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
