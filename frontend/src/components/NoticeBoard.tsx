import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FormattedText from './FormattedText';
import { 
  Megaphone, 
  Pin, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  User, 
  Loader2, 
  CheckCircle, 
  GraduationCap, 
  HeartHandshake,
  Calendar,
  X,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { UserProfile, AlumniNotice } from '../types';

interface NoticeBoardProps {
  currentUser: UserProfile | null;
}

export default function NoticeBoard({ currentUser }: NoticeBoardProps) {
  const [notices, setNotices] = useState<AlumniNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Notice form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'General' | 'Event' | 'Urgent' | 'Academic' | 'Donation'>('General');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Fetch notices
  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices || []);
      } else {
        setError('Failed to load notices from alumni register.');
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError('Connection error while updating the notice board.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    // Poll every 10 seconds for real-time notice board updates
    const interval = setInterval(fetchNotices, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') {
      setError('Only administrators are authorized to create notices.');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      setError('Please provide both a title and details for the notice.');
      return;
    }

    setFormSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin',
          'x-user-email': currentUser?.email || ''
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
          postedByEmail: currentUser?.email || '',
          isPublished: true
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(prev => [data.notice, ...prev]);
        setNewTitle('');
        setNewContent('');
        setNewCategory('General');
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 3000);
        setIsFormOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to publish notice.');
      }
    } catch (err) {
      console.error('Error publishing notice:', err);
      setError('Failed to connect and publish notice.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteNotice = async (noticeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (currentUser?.role !== 'admin') {
      alert('Only administrators are authorized to delete notices.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': 'admin',
          'x-user-email': currentUser?.email || ''
        }
      });

      if (response.ok) {
        setNotices(prev => prev.filter(n => String(n.id) !== String(noticeId)));
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Failed to delete notice.");
      }
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Urgent':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          badge: 'bg-red-600 text-white',
          border: 'border-red-600',
          shadow: 'shadow-[4px_4px_0px_0px_rgba(220,38,38,0.15)]',
          icon: AlertTriangle
        };
      case 'Academic':
        return {
          bg: 'bg-emerald-50/50 text-emerald-950 border-emerald-200',
          badge: 'bg-emerald-700 text-white',
          border: 'border-emerald-700/60',
          shadow: 'shadow-[4px_4px_0px_0px_rgba(4,120,87,0.1)]',
          icon: GraduationCap
        };
      case 'Event':
        return {
          bg: 'bg-indigo-50/50 text-indigo-950 border-indigo-200',
          badge: 'bg-indigo-700 text-white',
          border: 'border-indigo-700/60',
          shadow: 'shadow-[4px_4px_0px_0px_rgba(67,56,202,0.1)]',
          icon: Calendar
        };
      case 'Donation':
        return {
          bg: 'bg-teal-50/50 text-teal-950 border-teal-200',
          badge: 'bg-teal-700 text-white',
          border: 'border-teal-700/60',
          shadow: 'shadow-[4px_4px_0px_0px_rgba(15,118,110,0.1)]',
          icon: HeartHandshake
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          badge: 'bg-slate-600 text-white',
          border: 'border-slate-300',
          shadow: 'shadow-[4px_4px_0px_0px_rgba(100,116,139,0.08)]',
          icon: Megaphone
        };
    }
  };

  const categories = ['All', 'General', 'Event', 'Urgent', 'Academic', 'Donation'];

  // Filter & Search logic
  const filteredNotices = notices.filter(notice => {
    const matchesCategory = categoryFilter === 'All' || notice.category === categoryFilter;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.postedBy?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);
  const sortedFilteredNotices = [...pinnedNotices, ...regularNotices];

  return (
    <div className="space-y-6 text-left" id="notice-board-section">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0D5230]/30 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0D5230] uppercase tracking-tight flex items-center gap-2.5">
            <Megaphone className="h-6 w-6 text-[#0D5230]" />
            <span>Alumni Notice Board</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-sans leading-relaxed">
            Real-time circulars, urgent announcements, benevolence notices, and administrative requests for TBAAK.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-[#0D5230] hover:bg-[#0A4025] text-white text-xs font-bold py-2.5 px-4 flex items-center gap-2 uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
          >
            {isFormOpen ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            <span>{isFormOpen ? 'Close Form' : '+ Post Notice'}</span>
          </button>
        )}
      </div>

      {/* Expandable Form for Posting Notice */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handlePostNotice}
              className="bg-[#F0F7F4] border-2 border-[#0D5230] p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)] space-y-4 font-sans"
              id="notice-creation-form"
            >
              <div className="flex items-center gap-2 border-b border-[#0D5230]/20 pb-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#0D5230]" />
                <h3 className="text-xs font-black uppercase text-[#0D5230] tracking-wider">
                  Draft New Community Notice
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#0D5230] block">
                    Notice Header / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. O-Positive blood needed at Sealdah General Hospital"
                    className="w-full bg-white border border-slate-300 text-xs py-2 px-3 focus:outline-none focus:border-[#0D5230]"
                  />
                </div>

                {/* Category Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#0D5230] block">
                    Category Tag *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 text-xs py-2 px-3 focus:outline-none focus:border-[#0D5230] font-bold"
                  >
                    <option value="General">📢 General</option>
                    <option value="Event">🗓️ Event</option>
                    <option value="Urgent">⚠️ Urgent Alert</option>
                    <option value="Academic">🎓 Academic</option>
                    <option value="Donation">🤝 Donation / Help</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0D5230] block">
                  Detailed Circular / Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide precise details, phone numbers, contact persons, or schedules. Keep it respectful and brief."
                  className="w-full bg-white border border-slate-300 text-xs p-3 focus:outline-none focus:border-[#0D5230]"
                />
              </div>

              {/* Error within form */}
              {error && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 border border-red-300">
                  ⚠️ {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-xs font-bold py-2 px-4 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-[#0D5230] hover:bg-[#0A4025] disabled:opacity-50 text-white text-xs font-bold py-2 px-6 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Notice</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success banner */}
      {formSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-800/60 text-emerald-800 flex items-center gap-2.5 text-xs font-sans">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span>Your notice has been published to the board in real-time.</span>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="bg-white border-2 border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans">
        
        {/* Category Pill Buttons */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {categories.map(tab => (
            <button
              key={tab}
              onClick={() => setCategoryFilter(tab)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === tab
                  ? 'bg-[#0D5230] text-white border border-[#0D5230]'
                  : 'bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/20 hover:border-[#0D5230]'
              }`}
            >
              {tab === 'All' ? '🌟 All Notices' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, posters, keywords..."
            className="w-full bg-white border border-slate-300 text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#0D5230]"
          />
        </div>

      </div>

      {/* Notices Stage */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white border-2 border-[#0D5230] min-h-[300px] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.15)]">
          <Loader2 className="h-8 w-8 text-[#0D5230] animate-spin mb-3" />
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Retrieving notice feed...</p>
        </div>
      ) : sortedFilteredNotices.length === 0 ? (
        <div className="text-center p-12 bg-white border-2 border-slate-200 font-sans">
          <Megaphone className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-serif italic">No notices found matching the search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedFilteredNotices.map((notice, index) => {
            const styles = getCategoryStyles(notice.category);
            const CategoryIcon = styles.icon;
            
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`flex flex-col justify-between border-2 p-5 bg-white relative transition-all ${styles.shadow} ${
                  notice.isPinned 
                    ? 'border-amber-400 shadow-[4px_4px_0px_0px_rgba(245,158,11,0.15)]' 
                    : `border-slate-200 hover:border-[#0D5230]`
                }`}
                id={`notice-item-${notice.id}`}
              >
                
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    
                    {/* Category Label */}
                    <span className={`px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider border flex items-center gap-1 ${styles.bg}`}>
                      <CategoryIcon className="h-3 w-3 shrink-0" />
                      <span>{notice.category}</span>
                    </span>

                    {/* Right action/pin labels */}
                    <div className="flex items-center gap-1.5">
                      {notice.isPinned && (
                        <span className="bg-amber-400 text-amber-950 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 border border-amber-500">
                          <Pin className="h-2.5 w-2.5 fill-amber-950" />
                          <span>PINNED BY EXEC</span>
                        </span>
                      )}
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={(e) => handleDeleteNotice(notice.id, e)}
                          className="p-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer rounded"
                          title="Delete notice permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Title & Content */}
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 leading-tight">
                      {notice.title}
                    </h4>
                    
                    <p className="text-xs text-slate-600 font-sans leading-relaxed whitespace-pre-wrap">
                      <FormattedText text={notice.content} />
                    </p>
                  </div>
                </div>

                {/* Footer Poster Info */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  
                  {/* Alumnus Identity */}
                  <div className="flex items-center gap-2">
                    <img
                      src={notice.postedBy?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                      alt={notice.postedBy?.name || "Alumnus"}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 object-cover rounded-full border border-slate-200"
                    />
                    <div className="font-sans text-[10px] leading-tight text-left">
                      <span className="font-bold text-slate-800 block truncate max-w-[120px]">
                        {notice.postedBy?.name || "TBAAK Member"}
                      </span>
                      <span className="text-slate-500 block">
                        Class of {notice.postedBy?.batchYear || "2008"}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 shrink-0" />
                    {new Date(notice.postedAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Notice Board Guidelines */}
      <div className="bg-emerald-50/50 border border-emerald-800/10 p-4 font-sans text-xs text-slate-600 flex gap-3 items-start mt-8">
        <User className="h-5 w-5 text-[#0D5230] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-emerald-900 uppercase tracking-wide text-[10px]">TBAAK Notice Board Rules</h5>
          <p className="leading-relaxed">
            Only authorized portal administrators can create, edit, or delete circulars and notices. Pinned posts are exclusive to the Executive Board.
          </p>
        </div>
      </div>

    </div>
  );
}
