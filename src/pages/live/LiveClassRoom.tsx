import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { classService } from '../../services/classService';
import { liveClassService } from '../../services/liveClassService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { toPersianDigits } from '../../lib/formatters';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  PhoneOff,
  MessageSquare,
  Users,
  Send,
  Sparkles,
  Radio,
  FileText,
  Volume2,
} from 'lucide-react';

export const LiveClassRoom: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const activeClass = classService.getClassById(classId || 'class_1') || classService.listClasses()[0];
  const liveState = liveClassService.getLiveClassState(activeClass?.id || 'class_1');

  // Controls state
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  // Floating reaction emojis
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);

  // Sidebar Tab: 'chat' | 'participants' | 'notes'
  const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'notes'>('chat');

  // Chat message
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(liveState?.chatMessages || []);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      senderName: user ? `${user.firstName} ${user.lastName}` : 'زبان‌آموز مهمان',
      senderRole: (user?.role as any) || 'student',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    liveClassService.sendChatMessage(activeClass.id, newMsg);
    setChatInput('');
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now();
    setReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Top Classroom Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>پخش زنده فعال</span>
          </div>
          <h1 className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
            {activeClass?.title} - جلسه پنجم
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue" size="sm">
            مدرس: {activeClass?.teacherName}
          </Badge>
          <button
            onClick={() => navigate('/classes')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج از کلاس</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Stage / Video View Area */}
        <div className="flex-1 flex flex-col p-4 bg-slate-950 relative overflow-hidden">
          {/* Main Presenter / Slide Stage */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
            {/* Simulated Live Stage Content */}
            <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
              {/* Teacher camera thumbnail pip */}
              <div className="absolute top-4 right-4 z-10 w-44 h-32 rounded-2xl overflow-hidden border-2 border-blue-500/80 shadow-2xl bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Instructor stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>{activeClass?.teacherName}</span>
                </div>
              </div>

              {/* Central Whiteboard / Presentation Slide */}
              <div className="max-w-xl w-full mx-auto p-8 text-center space-y-6 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-2xl">
                <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    IELTS Speaking Part 2 & 3 Strategies
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Mastering Idiomatic Expressions & Cohesion
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                    Today's focus: Developing cohesive responses, avoiding hesitation markers, and utilizing high-band collocations under timed exam conditions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-right space-y-2 text-slate-300">
                  <p className="font-bold text-blue-400">نکات کلیدی این بخش:</p>
                  <p>۱. استفاده صحیح از Linking Words مانند "Furthermore" و "In consequence".</p>
                  <p>۲. ارائه مثال‌های عینی برای پاسخ به سوالات ارزیاب آزمون آیلتس.</p>
                </div>
              </div>

              {/* Floating Reactions overlay */}
              <div className="absolute bottom-8 right-8 pointer-events-none flex flex-col gap-2 z-30">
                {reactions.map((r) => (
                  <span
                    key={r.id}
                    className="text-4xl animate-bounce duration-500 transition-all filter drop-shadow-md"
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Classroom Controls Bar */}
          <div className="h-16 mt-3 flex items-center justify-between px-4 bg-slate-900/90 rounded-2xl border border-slate-800">
            {/* Quick Reactions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerReaction('👏')}
                className="p-2 text-base hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="تشویق"
              >
                👏
              </button>
              <button
                onClick={() => triggerReaction('👍')}
                className="p-2 text-base hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="تایید"
              >
                👍
              </button>
              <button
                onClick={() => triggerReaction('❤️')}
                className="p-2 text-base hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="عالی"
              >
                ❤️
              </button>
            </div>

            {/* Main Interactive Meeting Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500 text-white shadow-lg'
                }`}
                title={micOn ? 'قطع میکروفون' : 'فعال‌سازی میکروفون'}
              >
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setCameraOn(!cameraOn)}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  cameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500 text-white shadow-lg'
                }`}
                title={cameraOn ? 'خاموش کردن وبکم' : 'روشن کردن وبکم'}
              >
                {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  screenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="اشتراک‌گذاری صفحه"
              >
                <ScreenShare className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  handRaised ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="درخواست صحبت (بالا بردن دست)"
              >
                <Hand className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar toggle buttons on smaller screens */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`p-2.5 rounded-xl transition-colors ${
                  activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="چت کلاسی"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`p-2.5 rounded-xl transition-colors ${
                  activeTab === 'participants' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="لیست حاضرین"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Classroom Sidebar (RTL) */}
        <aside className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-72 lg:h-auto">
          {/* Tabs header */}
          <div className="flex items-center border-b border-slate-800 p-2 gap-1 bg-slate-900/50">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'chat' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              گفتگوی زنده
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === 'participants' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              حاضرین ({toPersianDigits(liveState?.participants.length || 0)})
            </button>
          </div>

          {/* Tab 1: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Messages scroll area */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar text-right">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span
                        className={`font-bold ${
                          msg.senderRole === 'teacher' ? 'text-amber-400' : 'text-blue-400'
                        }`}
                      >
                        {msg.senderName} {msg.senderRole === 'teacher' && '(مدرس)'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{toPersianDigits(msg.timestamp)}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/80 text-xs text-slate-200 border border-slate-750 leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="پیام خود را بنویسید..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-right"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Participants list */}
          {activeTab === 'participants' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-right">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">لیست زبان‌آموزان و استاد:</span>
              {liveState?.participants.map((p) => (
                <div
                  key={p.userId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {p.role === 'teacher' ? 'مدرس دوره' : 'زبان‌آموز'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    {p.isAudioOn ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    {p.isVideoOn ? (
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <VideoOff className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
