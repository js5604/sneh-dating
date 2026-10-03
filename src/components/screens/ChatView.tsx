import React, { useState } from 'react';
import { ArrowLeft, Send, ShieldAlert, MoreVertical, ShieldCheck, CheckCheck, AlertTriangle, Image as ImageIcon, Video, MapPin, Mic, Play, Clock, Sparkles } from 'lucide-react';
import { MatchProfile, ChatMessage, Language } from '../../types/dating';
import { translations } from '../../constants/translations';

interface ChatViewProps {
  match: MatchProfile;
  language: Language;
  onBack: () => void;
  onOpenReport: (profile: MatchProfile) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  match,
  language,
  onBack,
  onOpenReport
}) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: match.id,
      text: "Hey! Loved reading that you're into Sufi music. What's one song that calms your soul?",
      timestamp: '10:30 AM',
      isRead: true,
      type: 'text'
    },
    {
      id: 'm2',
      senderId: 'me',
      text: "Sat Sri Akal! Definitely 'Chaap Tilak' by Nusrat Fateh Ali Khan. What about you?",
      timestamp: '10:32 AM',
      isRead: true,
      type: 'text'
    },
    {
      id: 'm3',
      senderId: match.id,
      text: match.lastMessage,
      timestamp: match.timestamp,
      isRead: true,
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showScamBanner, setShowScamBanner] = useState(false);

  // Scam pattern detection keywords
  const scamKeywords = ['otp', 'upi', 'gpay', 'paytm', 'money', 'transfer', 'bank', 'crypto', 'investment', 'rupees'];

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'text'
    };

    setMessages((prev) => [...prev, newMsg]);
    const sentText = inputText.toLowerCase();
    setInputText('');

    if (scamKeywords.some((kw) => sentText.includes(kw))) {
      setShowScamBanner(true);
    }
  };

  const handleShareLiveLocation = () => {
    const locMsg: ChatMessage = {
      id: `loc_${Date.now()}`,
      senderId: 'me',
      text: '📍 Shared Live Location for Meetup Safety',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'location',
      locationData: {
        placeName: 'CCD Cafe & Bistro, Sector 17',
        approxArea: 'Sector 17 Plaza, Chandigarh',
        durationMins: 30,
        expiresAt: 'In 30 mins'
      }
    };
    setMessages((prev) => [...prev, locMsg]);
    setShowMediaMenu(false);
  };

  const handleSendPhoto = () => {
    const photoMsg: ChatMessage = {
      id: `img_${Date.now()}`,
      senderId: 'me',
      text: 'Shared a memorable travel capture from Himachal 🏔️',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    };
    setMessages((prev) => [...prev, photoMsg]);
    setShowMediaMenu(false);
  };

  const handleSendVideo = () => {
    const videoMsg: ChatMessage = {
      id: `vid_${Date.now()}`,
      senderId: 'me',
      text: '📹 10s video clip of live Sufi acoustic music evening',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    };
    setMessages((prev) => [...prev, videoMsg]);
    setShowMediaMenu(false);
  };

  const triggerSimulatedScamAlert = () => {
    const fakeIncomingMsg: ChatMessage = {
      id: `scam_${Date.now()}`,
      senderId: match.id,
      text: "Hey, can you please send Rs. 2,000 via Google Pay / UPI urgently? I'll return it tomorrow.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      containsScamAlert: true,
      type: 'text'
    };
    setMessages((prev) => [...prev, fakeIncomingMsg]);
    setShowScamBanner(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0e0816] text-slate-100 relative overflow-hidden">
      {/* Top Chat Bar */}
      <div className="p-3 bg-[#150d20] border-b border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
            <img src={match.photo} alt={match.name} className="w-full h-full object-cover" />
            {match.govtVerification?.isVerified && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-white ring-1 ring-[#150d20]">
                <ShieldCheck className="w-2.5 h-2.5" />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-1">
              <span>{match.name}</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-medium">
              {match.caste ? `${match.caste} • ` : ''}{match.area}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={triggerSimulatedScamAlert}
            className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-amber-300 font-mono"
            title="Simulate receiving an illicit money/UPI request to test automated safety warnings"
          >
            Test Scam Alert
          </button>
          <button
            onClick={() => onOpenReport(match)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Alert Warning Banner */}
      {showScamBanner && (
        <div className="bg-rose-950/90 border-b border-rose-500/40 p-3 text-xs text-rose-100 flex items-start gap-2.5 z-20 animate-in slide-in-from-top duration-300 backdrop-blur-sm">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-rose-300">{t.safetyAlertTitle}</div>
            <p className="text-[11px] text-rose-200/90 leading-tight">
              {t.safetyAlertMsg}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onOpenReport(match)}
                className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[10px]"
              >
                {t.reportAction}
              </button>
              <button
                onClick={() => onOpenReport(match)}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white font-medium text-[10px]"
              >
                {t.blockAction}
              </button>
              <button
                onClick={() => setShowScamBanner(false)}
                className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white text-[10px]"
              >
                {t.dismissWarning}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center my-1">
          <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
            Matched on Sneh • {match.city} • Safe &amp; Monitored Chat
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isMe
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-tr-sm shadow-md shadow-rose-950/40'
                    : 'bg-[#22162e] text-slate-100 rounded-tl-sm border border-white/5'
                }`}
              >
                {/* 1. Location Card */}
                {msg.type === 'location' && msg.locationData && (
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{msg.locationData.placeName}</span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {msg.locationData.approxArea}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md w-fit">
                      <Clock className="w-3 h-3" />
                      <span>Live sharing active ({msg.locationData.expiresAt})</span>
                    </div>
                  </div>
                )}

                {/* 2. Photo Message */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={msg.mediaUrl} alt="Shared photo" className="w-full h-36 object-cover" />
                  </div>
                )}

                {/* 3. Video Message */}
                {msg.type === 'video' && msg.mediaUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                    <img src={msg.mediaUrl} alt="Video preview" className="w-full h-32 object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Text body */}
                <p>{msg.text}</p>

                <div className="flex items-center justify-end gap-1 text-[9px] text-white/60">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-white/80" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rich Media Sharing Attachment Menu */}
      {showMediaMenu && (
        <div className="p-3 bg-[#150d20] border-t border-white/10 grid grid-cols-3 gap-2 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={handleShareLiveLocation}
            className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs flex flex-col items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-[11px]">Live Location</span>
          </button>

          <button
            onClick={handleSendPhoto}
            className="p-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-200 text-xs flex flex-col items-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-sky-400" />
            <span className="font-semibold text-[11px]">Share Photo</span>
          </button>

          <button
            onClick={handleSendVideo}
            className="p-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs flex flex-col items-center gap-1.5 transition-colors"
          >
            <Video className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-[11px]">Video Clip</span>
          </button>
        </div>
      )}

      {/* Message Input Box */}
      <form onSubmit={handleSendText} className="p-2.5 bg-[#150d20] border-t border-white/10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowMediaMenu(!showMediaMenu)}
          className={`p-2 rounded-xl border transition-colors ${
            showMediaMenu ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
          }`}
          title="Share live location, photos, videos"
        >
          <MapPin className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.typeMessage}
          className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white flex items-center justify-center transition-colors shrink-0 shadow-md shadow-rose-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
