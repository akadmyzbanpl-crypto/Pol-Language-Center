export interface LiveChatMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

export const liveClassService = {
  getRoomChat(classId: string): LiveChatMessage[] {
    try {
      const raw = localStorage.getItem(`pol_live_chat_${classId}`);
      if (!raw) {
        const initial: LiveChatMessage[] = [
          {
            id: 'm1',
            classId,
            senderId: 'sys',
            senderName: 'سیستم آموزشگاه پل',
            senderRole: 'admin',
            text: 'به کلاس آنلاین آموزشگاه پل خوش آمدید. لطفاً میکروفن خود را در صورت عدم صحبت بی‌صدا نگه دارید.',
            timestamp: '18:00',
          },
          {
            id: 'm2',
            classId,
            senderId: 'user_teacher_1',
            senderName: 'دکتر محمدرضا رضایی (استاد)',
            senderRole: 'teacher',
            text: 'سلام دوستان عزیز، تا ۲ دقیقه دیگر مبحث پارت ۲ اسپیکینگ را شروع می‌کنیم.',
            timestamp: '18:02',
          },
        ];
        localStorage.setItem(`pol_live_chat_${classId}`, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  getLiveClassState(classId: string) {
    const chatMessages = this.getRoomChat(classId);
    const participants = [
      { userId: 'user_teacher_1', name: 'دکتر محمدرضا رضایی', role: 'teacher', isAudioOn: true, isVideoOn: true },
      { userId: 'user_student_1', name: 'سارا احمدی', role: 'student', isAudioOn: false, isVideoOn: true },
      { userId: 'user_student_2', name: 'علی کاظمی', role: 'student', isAudioOn: true, isVideoOn: false },
      { userId: 'user_student_3', name: 'نیلوفر محمدی', role: 'student', isAudioOn: false, isVideoOn: false },
      { userId: 'user_student_4', name: 'حسین رضوی', role: 'student', isAudioOn: false, isVideoOn: true },
    ];
    return {
      isLive: true,
      participantCount: participants.length,
      participants,
      chatMessages,
    };
  },

  sendChatMessage(classId: string, message: { id?: string; senderName: string; senderRole: string; text: string; timestamp?: string }): LiveChatMessage {
    const fullMsg: Omit<LiveChatMessage, 'id' | 'timestamp'> = {
      classId,
      senderId: 'user_' + Date.now(),
      senderName: message.senderName,
      senderRole: message.senderRole,
      text: message.text,
    };
    return this.sendMessage(classId, fullMsg);
  },

  sendMessage(classId: string, message: Omit<LiveChatMessage, 'id' | 'timestamp'>): LiveChatMessage {
    const list = this.getRoomChat(classId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: LiveChatMessage = {
      ...message,
      id: 'msg_' + Date.now(),
      timestamp: timeStr,
    };
    list.push(newMsg);
    localStorage.setItem(`pol_live_chat_${classId}`, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('pol_live_chat_event', { detail: { classId } }));
    return newMsg;
  },
};
