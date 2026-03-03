import { useState } from 'react';
import HotlineBanner from '../HotlineBanner/HotlineBanner';
import { useAuthStore } from '../../../stores/authStore';
import { useUiStore } from '../../../stores/uiStore';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 5L5 19M5 5l14 14" stroke="rgba(0,0,0,0.56)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {show ? (
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"
          stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M10.73 10.73a3 3 0 004.24 4.24"
          stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </>
    )}
  </svg>
);

function FloatInput({ label, type = 'text', value, onChange, showToggle, disabled }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; showToggle?: boolean; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={styles.input}
        type={showToggle ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder=" "
        disabled={disabled}
      />
      {showToggle && (
        <button className={styles.eyeBtn} onClick={() => setShow(s => !s)} type="button">
          <EyeIcon show={show} />
        </button>
      )}
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div style={{ padding: '8px 16px', background: '#fff2f0', borderRadius: 6, margin: '0 16px' }}>
      <span style={{ color: '#FF5630', fontSize: 13, fontFamily: 'Lexend, sans-serif' }}>{msg}</span>
    </div>
  );
}

export default function LoginModal({ open, onClose, onRegisterClick }: LoginModalProps) {
  const login = useAuthStore(s => s.login);
  const isLoading = useAuthStore(s => s.isLoading);
  const showToast = useUiStore(s => s.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Vui lòng nhập email'); return; }
    if (!password) { setError('Vui lòng nhập mật khẩu'); return; }
    try {
      await login(email.trim(), password);
      showToast('Đăng nhập thành công!', 'success');
      setEmail(''); setPassword('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.title}>Đăng nhập</span>
            <button className={styles.closeBtn} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.fields} onKeyDown={handleKeyDown}>
              <FloatInput
                label="Địa chỉ email *"
                type="email"
                value={email}
                onChange={v => { setEmail(v); setError(''); }}
                disabled={isLoading}
              />
              <FloatInput
                label="Mật khẩu *"
                value={password}
                onChange={v => { setPassword(v); setError(''); }}
                showToggle
                disabled={isLoading}
              />
            </div>

            <ErrorMsg msg={error} />

            {/* Forgot password */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px' }}>
              <button className={styles.linkBtn}>
                <span className={styles.linkBtnText}>Quên mật khẩu?</span>
              </button>
            </div>

            {/* Login button */}
            <button
              className={styles.loginBtn}
              onClick={handleLogin}
              disabled={isLoading}
            >
              <span className={styles.loginBtnText}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </span>
            </button>

            {/* Register link */}
            <div className={styles.registerRow}>
              <span className={styles.registerHint}>Chưa có tài khoản?</span>
              <button className={styles.linkBtn} onClick={onRegisterClick}>
                <span className={styles.linkBtnText}>Đăng ký ngay</span>
              </button>
            </div>

            {/* Hotline */}
            <div className={styles.hotlineWrap}>
              <HotlineBanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}