import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ChatWidget.module.css';
import { useAuthStore } from '../../../stores/authStore';
import { discussService } from '../../../services/discussService';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="white" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 5L5 19M5 5l14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function TypingDots() {
  return (
    <div className={styles.typingDots}>
      <span /><span /><span />
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`${styles.bubbleWrap} ${isUser ? styles.bubbleWrapUser : ''}`}>
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleBot}`}>
        {msg.loading
          ? <TypingDots />
          : <span dangerouslySetInnerHTML={{ __html: msg.content }} />
        }
      </div>
    </div>
  );
}

export default function ChatWidget() {
  useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', content: 'Xin chào! Tôi là trợ lý ASP.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState<number | null>(null);
  const [botPartnerId, setBotPartnerId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMsgIdRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingMsgIdRef = useRef(-1);
  const msgId = useRef(1);

  useEffect(() => {
    discussService.getChannelId().then(id => {
      console.log('[CHAT] channelId:', id);
      setChannelId(id);
    });
    discussService.getBotPartnerId().then(id => {
      console.log('[CHAT] botPartnerId:', id);
      setBotPartnerId(id);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
  }, []);

  const pollForReply = useCallback((chId: number, botId: number | null, attempts = 0) => {
    console.log('[POLL]', attempts, '| chId:', chId, '| botId:', botId, '| lastMsgId:', lastMsgIdRef.current);

    if (attempts > 30) {
      setMessages(prev => prev.map(m =>
        m.id === loadingMsgIdRef.current
          ? { ...m, content: 'Xin lỗi, không nhận được phản hồi. Vui lòng thử lại!', loading: false }
          : m
      ));
      setLoading(false);
      return;
    }

    pollTimerRef.current = setTimeout(async () => {
      try {
        const newMsgs = await discussService.getMessages(chId, lastMsgIdRef.current);
        console.log('[POLL] newMsgs count:', newMsgs.length, newMsgs.map(m => ({
          id: m.id,
          author: m.author_id,
          preview: m.body?.slice(0, 60),
        })));

        if (!newMsgs.length) {
          pollForReply(chId, botId, attempts + 1);
          return;
        }

        lastMsgIdRef.current = Math.max(...newMsgs.map(m => m.id));

        const botMsgs = botId
          ? newMsgs.filter(m => m.author_id[0] === botId)
          : newMsgs;

        console.log('[POLL] botMsgs:', botMsgs.length);

        if (!botMsgs.length) {
          pollForReply(chId, botId, attempts + 1);
          return;
        }

        const isJson = (body: string) => {
          const b = body.trim();
          return b.startsWith('{') || b.startsWith('&lt;{') || b.startsWith('<p>{');
        };

        const htmlMsg = botMsgs.find(m => !isJson(m.body ?? ''));

        if (!htmlMsg) {
          console.log('[POLL] only JSON found, waiting...');
          pollForReply(chId, botId, attempts + 1);
          return;
        }

        console.log('[POLL] found HTML reply:', htmlMsg.body?.slice(0, 100));
        setMessages(prev => prev.map(m =>
          m.id === loadingMsgIdRef.current
            ? { ...m, content: htmlMsg.body || 'Không có phản hồi.', loading: false }
            : m
        ));
        setLoading(false);

      } catch (err) {
        console.error('[POLL] error:', err);
        pollForReply(chId, botId, attempts + 1);
      }
    }, 1000);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !channelId) return;
    setInput('');

    const userMsg: Message = { id: ++msgId.current, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    const loadingId = ++msgId.current;
    loadingMsgIdRef.current = loadingId;
    setMessages(prev => [...prev, { id: loadingId, role: 'assistant', content: '', loading: true }]);
    setLoading(true);

    try {
      lastMsgIdRef.current = await discussService.getLatestMessageId(channelId);
      console.log('[CHAT] lastMsgId before send:', lastMsgIdRef.current);

      await discussService.sendMessage(channelId, text);
      pollForReply(channelId, botPartnerId);
    } catch (err) {
      console.error('[CHAT] sendMessage error:', err);
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, content: 'Vui lòng đăng nhập để sử dụng', loading: false }
          : m
      ));
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const notConnected = !channelId;

  return (
    <>
      {open && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.headerAvatar}>⚡</div>
              <div>
                <div className={styles.headerName}>Trợ lý ASP</div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={notConnected ? 'Đang kết nối Odoo...' : 'Nhập câu hỏi...'}
              disabled={loading || notConnected}
            />
            <button
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={!input.trim() || loading || notConnected}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </>
  );
}