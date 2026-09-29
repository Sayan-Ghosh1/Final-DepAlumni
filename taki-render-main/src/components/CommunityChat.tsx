import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, RefreshCw, Search, MessageSquare, ShieldCheck, User } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface CommunityChatProps {
  currentUser: UserProfile | null;
}

export default function CommunityChat({ currentUser }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isPolling, setIsPolling] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from backend
  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch('/api/chat/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (err) {
      // Handle transient errors gracefully in the background
      console.warn('Chat sync paused or connection offline.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Poll for messages periodically
  useEffect(() => {
    fetchMessages(true);

    let intervalId: any = null;
    if (isPolling) {
      intervalId = setInterval(() => {
        fetchMessages(false);
      }, 3000); // Poll every 3 seconds for active chat experience
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setSending(true);
    const content = newMessageText;
    setNewMessageText(''); // Clear input instantly for smooth UX

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: currentUser?.email || 'guest@alumni.tbaak.org',
          text: content,
        }),
      });

      if (response.ok) {
        // Refetch immediately
        await fetchMessages(false);
      } else {
        console.error('Failed to send message');
        setNewMessageText(content); // Restore input if failed
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessageText(content);
    } finally {
      setSending(false);
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.text.toLowerCase().includes(q) ||
      msg.senderName.toLowerCase().includes(q) ||
      msg.senderBatch.toString().includes(q)
    );
  });

  return (
    <div className="bg-white border-2 border-[#0D5230] overflow-hidden flex flex-col h-[650px] shadow-[4px_4px_0px_0px_rgba(13,82,48,0.25)] rounded-none" id="community-chat-container">
      
      {/* Chat Header */}
      <div className="p-4 bg-white border-b-2 border-[#0D5230] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 text-[#0D5230] border border-[#0D5230]/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-md font-bold text-[#0D5230] flex items-center gap-1.5 font-serif uppercase tracking-tight">
              <span>Taki House Boys Community Chat</span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-600 animate-pulse" title="Live Polling Active"></span>
            </h3>
            <p className="text-xs text-slate-600 font-sans">Share memories, arrange reunions, or ask for guidance</p>
          </div>
        </div>

        {/* Polling control and Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto font-sans">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-[#0D5230]/60" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat or batch..."
              className="w-full sm:w-48 bg-white border border-[#0D5230]/40 py-1.5 pl-8 pr-3 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#0D5230] focus:border-[#0D5230] transition-colors rounded-none"
            />
          </div>

          <button 
            onClick={() => fetchMessages(true)}
            disabled={loading}
            className="p-1.5 bg-white border border-[#0D5230]/40 text-[#0D5230] hover:bg-green-50 transition-all cursor-pointer rounded-none"
            title="Manual Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setIsPolling(!isPolling)}
            className={`px-2 py-1.5 text-[10px] font-bold border transition-all cursor-pointer rounded-none ${
              isPolling 
                ? 'bg-[#0D5230] text-white border-[#0D5230]' 
                : 'bg-[#F0F7F4] text-[#0D5230] border-[#0D5230]/30'
            }`}
            title={isPolling ? "Auto-refresh: On" : "Auto-refresh: Off"}
          >
            {isPolling ? "LIVE ON" : "PAUSED"}
          </button>
        </div>
      </div>

      {/* Main Chat Display Window */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F0F7F4]/40">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-white border border-[#0D5230]/30 rounded-none text-slate-400">
              <MessageSquare className="h-8 w-8 text-[#0D5230]" />
            </div>
            <div>
              <p className="text-slate-800 font-serif font-bold">No messages found</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1 font-sans">
                {searchQuery ? "Try altering your keyword or passout year search." : "Be the first to post a message to the Taki Boys network!"}
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = currentUser ? msg.senderEmail.toLowerCase() === currentUser.email.toLowerCase() : false;
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {msg.avatarUrl ? (
                    <img 
                      src={msg.avatarUrl} 
                      alt={msg.senderName} 
                      className="h-9 w-9 rounded-full border border-[#0D5230]/40 object-cover bg-slate-50"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-[#F0F7F4] border border-[#0D5230]/40 flex items-center justify-center text-[#0D5230] text-sm font-bold">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Message Box */}
                <div>
                  <div className={`flex items-center gap-2 mb-1 text-xs font-sans ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-serif font-black text-slate-900">
                      {msg.senderName}
                    </span>
                    <span className="px-1.5 py-0.5 bg-[#F0F7F4] border border-[#0D5230]/20 text-[#0D5230] text-[9px] font-bold">
                      Batch of {msg.senderBatch}
                    </span>
                    {msg.senderEmail === 'pradip.banerjee@taki.alumni' && (
                      <span className="text-[10px] font-bold text-[#0D5230] flex items-center gap-0.5" title="Verified Lifetime Patron">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Patron</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={`p-3.5 text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-[#0D5230] text-white rounded-none rounded-tr-none rounded-tl-xl rounded-bl-xl rounded-br-xl border border-[#0A4025] font-sans' 
                      : 'bg-white text-[#1A1A1A] rounded-none rounded-tl-none rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-200 font-sans shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Inputs */}
      <div className="p-4 bg-white border-t-2 border-[#0D5230]">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text"
              required
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder={currentUser ? `Write a message as ${currentUser.name}...` : "Write a message in Community Chat..."}
              className="w-full bg-white border border-[#0D5230]/40 focus:border-[#0D5230] focus:ring-1 focus:ring-[#0D5230] text-[#1A1A1A] rounded-none py-3 pl-4 pr-12 text-sm focus:outline-none transition-colors"
            />
            <span className="absolute right-3.5 top-3.5 text-[10px] text-slate-400 font-mono hidden sm:inline">
              Press Enter ↵
            </span>
          </div>

          <button 
            type="submit"
            disabled={sending || !newMessageText.trim()}
            className="bg-[#0D5230] hover:bg-[#0A4025] disabled:opacity-40 disabled:hover:bg-[#0D5230] text-white font-bold px-5 rounded-none flex items-center justify-center transition-all cursor-pointer border border-[#0D5230]"
          >
            {sending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-500 px-1 font-sans">
          <User className="h-3 w-3 text-[#0D5230]" />
          <span>Sending as <strong>{currentUser?.email || 'Guest Visitor'}</strong> • Please maintain complete respect towards both senior and junior alumni boys.</span>
        </div>
      </div>

    </div>
  );
}
