import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  User, 
  Clock, 
  Film,
  Play,
  Trash2
} from 'lucide-react';
import { UserProfile, GalleryPhoto } from '../types';
import { parseMediaUrl } from '../utils/media';

interface MediaGalleryProps {
  currentUser: UserProfile | null;
}

export default function MediaGallery({ currentUser }: MediaGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('All');

  // Selected Photo for Lightbox Modal
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
      } else {
        setError('Failed to fetch gallery images.');
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Connection error while loading gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDeletePhoto = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    try {
      const response = await fetch(`/api/gallery/${photoId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-role': currentUser?.role === 'admin' ? 'admin' : '',
          'x-user-email': currentUser?.email || ''
        }
      });

      if (response.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        if (selectedPhoto && selectedPhoto.id === photoId) {
          setSelectedPhoto(null);
        }
      } else {
        const data = await response.json().catch(() => ({}));
        console.warn(data.error || "Failed to delete media post.");
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const filteredPhotos = photos.filter(photo => {
    if (filter === 'All') return true;
    return photo.tag === filter;
  });

  const categories = ['All', 'Cultural Events', 'Sports & Athletics', 'School Heritage', 'Alumni Gathering'];

  // Lightbox Media URL parser
  const parsedModal = selectedPhoto ? parseMediaUrl(selectedPhoto.url, selectedPhoto.mediaType) : null;

  return (
    <div className="space-y-8" id="media-gallery-component">
      
      {/* 1. Header Segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0D5230]/30 pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif font-black text-[#0D5230] uppercase tracking-tight flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <span>Nostalgic Media Gallery</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Explore and cherish real-life snapshots of Taki House sports, cultural events, campus life, and reunions.
          </p>
        </div>
      </div>

      {/* 2. Category Select Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 font-sans" id="gallery-filters">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filter === cat
                ? 'bg-[#0D5230] text-white shadow-[2px_2px_0px_0px_rgba(13,82,48,0.2)]'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0D5230] hover:text-[#0D5230]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
          {error}
        </div>
      )}

      {/* 3. Beautiful Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 min-h-[250px]">
          <div className="h-7 w-7 border-2 border-[#0D5230] border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">Unrolling School Film...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-[#0D5230]/20 font-sans">
          <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-serif italic text-slate-600">No photos published in the "{filter}" album yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-photos-grid">
          {filteredPhotos.map((photo, index) => {
            const parsed = parseMediaUrl(photo.url, photo.mediaType);
            
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-white border-2 border-slate-200 hover:border-[#0D5230] cursor-pointer transition-all flex flex-col group shadow-sm hover:shadow-[4px_4px_12px_rgba(13,82,48,0.08)]"
              >
                {/* Photo/Video Media Wrapper */}
                <div className="relative h-48 overflow-hidden bg-slate-900 flex items-center justify-center">
                  {parsed.mediaType === 'video' ? (
                    parsed.isEmbed ? (
                      <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                        <iframe
                          src={parsed.displayUrl}
                          className="w-full h-full border-0 pointer-events-none opacity-80"
                          title={photo.title}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <div className="p-3 bg-[#0D5230] text-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                        <video src={parsed.displayUrl} className="w-full h-full object-cover opacity-80" muted />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <div className="p-3 bg-[#0D5230] text-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <img
                      src={parsed.displayUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600";
                      }}
                    />
                  )}
                  <span className="absolute bottom-3 left-3 bg-[#0D5230] text-[9px] text-white font-sans font-bold px-2 py-0.5 uppercase tracking-wider z-10 flex items-center gap-1">
                    {parsed.mediaType === 'video' && <Film className="h-3 w-3 inline" />}
                    <span>{photo.tag}</span>
                  </span>
                  {(currentUser?.role === 'admin' || (currentUser?.email && photo.uploadedBy?.email?.toLowerCase() === currentUser.email.toLowerCase())) && (
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded z-20 shadow transition-transform hover:scale-105 cursor-pointer"
                      title="Delete media post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-sm text-[#1A1A1A] group-hover:text-[#0D5230] transition-colors leading-tight">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans line-clamp-2 leading-relaxed">
                      {photo.description || "Nostalgic snapshot of school activities."}
                    </p>
                  </div>

                  {/* Card Info Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-sans text-slate-500">
                    <div className="flex items-center gap-1 font-bold">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{photo.uploadedBy.name}</span>
                      <span className="text-slate-400">('{photo.uploadedBy.batchYear.toString().slice(-2)})</span>
                    </div>

                    <div className="flex items-center gap-1 font-sans text-slate-400 text-[10px]">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(photo.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. Immersive Clean Image Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && parsedModal && (
          <div 
            className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 w-full max-w-4xl rounded-none border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-serif relative"
            >
              {/* Top Bar */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white z-10">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0D5230] text-[10px] text-white font-sans font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                    {parsedModal.mediaType === 'video' && <Film className="h-3 w-3" />}
                    <span>{selectedPhoto.tag}</span>
                  </span>
                  <h3 className="font-bold text-sm sm:text-base truncate max-w-[280px] sm:max-w-md">{selectedPhoto.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {(currentUser?.role === 'admin' || (currentUser?.email && selectedPhoto.uploadedBy?.email?.toLowerCase() === currentUser.email.toLowerCase())) && (
                    <button
                      onClick={(e) => handleDeletePhoto(selectedPhoto.id, e)}
                      className="p-1.5 bg-red-600/80 hover:bg-red-700 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                      title="Delete Post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Close Image Viewer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Center Media View */}
              <div className="flex-1 flex items-center justify-center bg-black min-h-[350px] max-h-[70vh] p-2 overflow-hidden">
                {parsedModal.mediaType === 'video' ? (
                  parsedModal.isEmbed ? (
                    <iframe
                      src={parsedModal.displayUrl}
                      className="w-full h-[380px] md:h-[500px] border-0"
                      title={selectedPhoto.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={parsedModal.displayUrl}
                      controls
                      autoPlay
                      className="max-h-[68vh] w-full object-contain"
                    />
                  )
                ) : (
                  <img
                    src={parsedModal.displayUrl}
                    alt={selectedPhoto.title}
                    className="max-h-[68vh] w-full object-contain select-none"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600";
                    }}
                  />
                )}
              </div>

              {/* Caption / Description & Uploader Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-white space-y-2 text-left font-sans text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-amber-100">{selectedPhoto.title}</h4>
                    {selectedPhoto.description && (
                      <p className="text-slate-300 font-serif text-xs mt-1 leading-relaxed">{selectedPhoto.description}</p>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 shrink-0 font-sans border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
                    <span className="block text-slate-400 text-[10px]">Posted by:</span>
                    <span className="font-bold text-slate-200">{selectedPhoto.uploadedBy.name} <span className="font-normal text-slate-400">('{selectedPhoto.uploadedBy.batchYear.toString().slice(-2)})</span></span>
                    <span className="block text-[10px] text-slate-400">{new Date(selectedPhoto.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
