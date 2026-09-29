import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Users, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { UserProfile, AlumniEvent } from '../types';

interface EventsProps {
  user: UserProfile;
}

export default function Events({ user }: EventsProps) {
  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        setError('Failed to fetch scheduled alumni events.');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Connection error while loading events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state with the modified event
        setEvents(prev => prev.map(e => e.id === eventId ? data.event : e));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update RSVP status.');
      }
    } catch (err) {
      console.error('RSVP error:', err);
      setError('Could not connect to update RSVP.');
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'All') return true;
    return event.type === filter;
  });

  const filterTabs = ['All', 'Reunion', 'Meeting', 'Seminar', 'Social Work'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-[#0D5230] min-h-[300px] shadow-[3px_3px_0px_0px_rgba(13,82,48,0.15)]">
        <Loader2 className="h-8 w-8 text-[#0D5230] animate-spin mb-3" />
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500">Retrieving official schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="events-section">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0D5230]/30 pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#0D5230] flex items-center gap-2 font-serif uppercase tracking-tight">
            <Calendar className="h-5 w-5 text-[#0D5230]" />
            <span>Upcoming Meets & Reunions</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            Connect with classmates, join executive assemblies, and support Taki House initiatives.
          </p>
        </div>
        
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 font-sans">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#0D5230] text-white border border-[#0D5230]'
                  : 'bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/20 hover:border-[#0D5230]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-800/40 text-red-800 flex items-center gap-3 text-xs font-sans">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editorial List Layout */}
      {filteredEvents.length === 0 ? (
        <div className="text-center p-10 bg-white border-2 border-[#0D5230]/20 font-sans">
          <p className="text-sm text-slate-500 font-serif italic">No upcoming events found for this filter category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => {
            const hasRSVPed = event.rsvps.some(email => email.toLowerCase() === user.email.toLowerCase());
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border p-5 transition-all relative flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  hasRSVPed 
                    ? 'bg-green-50/40 border-2 border-[#0D5230] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)]' 
                    : 'bg-white border-2 border-slate-200 hover:border-[#0D5230] hover:bg-green-50/10'
                }`}
                id={`event-card-${event.id}`}
              >
                {/* Event Detail Block */}
                <div className="space-y-3 max-w-2xl">
                  {/* Event Type badge & Date */}
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider bg-[#F0F7F4] text-[#0D5230] border border-[#0D5230]/20">
                      {event.type}
                    </span>
                    <span className="text-xs font-mono text-[#0D5230] font-bold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-base font-bold text-[#1A1A1A] font-serif hover:text-[#0D5230] transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>

                  {/* Location, Time & RSVPs */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500 font-sans pt-1 border-t border-[#0D5230]/10">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      <span>{event.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{event.time}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-bold">
                      <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{event.rsvps.length} RSVP{event.rsvps.length !== 1 ? 's' : ''}</span>
                    </span>
                  </div>
                </div>

                {/* RSVP Call-to-action button */}
                <div className="shrink-0 flex flex-col items-stretch md:items-end justify-center min-w-[150px] font-sans">
                  {hasRSVPed ? (
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className="bg-[#0D5230] text-white hover:bg-[#0A4025] font-bold py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider border border-[#0D5230]"
                    >
                      <Check className="h-4 w-4" />
                      <span>Going (Cancel RSVP)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className="bg-white hover:bg-green-50 text-[#0D5230] border-2 border-[#0D5230] font-bold py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <span>Attend Event</span>
                    </button>
                  )}
                  {hasRSVPed && (
                    <span className="text-[10px] text-[#0D5230] font-bold block text-center md:text-right mt-1.5 italic font-serif flex items-center gap-1 md:justify-end">
                      <Sparkles className="h-3 w-3 animate-pulse text-green-700" />
                      <span>Your seat is reserved!</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
