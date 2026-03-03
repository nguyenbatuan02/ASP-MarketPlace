import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import RegisterModal from '../../pages/components/RegisterModal/RegisterModal';
import LoginModal from '../../pages/components/LoginModal/LoginModal';
import OtpModal from '../../pages/components/OtpModal/OtpModal';
import SellerRegisterModal from '../../pages/components/SellerRegisterModal/SellerRegisterModal';
import { useAuthStore } from '../../stores/authStore';
import styles from './Header.module.css';

type Step = 'login' | 'register' | 'otp' | 'seller-register' | null;

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function UserDropdown({ name, onLogout }: { name: string; onLogout: () => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: '1px solid rgba(0,0,0,0.2)',
          borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
          fontFamily: 'Lexend, sans-serif', fontSize: 14, color: '#212b36',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#696CFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13,
        }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0, width: 180,
          background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          overflow: 'hidden', zIndex: 100,
        }}>
          {[
            { label: 'Tài khoản', path: '/account' },
            { label: 'Đơn hàng', path: '/orders' },
            { label: 'Giỏ hàng', path: '/cart' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setOpen(false); }}
              style={{
                width: '100%', padding: '12px 16px', background: 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Lexend, sans-serif', fontSize: 14, color: '#212b36',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f4f6f8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </button>
          ))}
          <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)' }} />
          <button
            onClick={() => { onLogout(); setOpen(false); }}
            style={{
              width: '100%', padding: '12px 16px', background: 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'Lexend, sans-serif', fontSize: 14, color: '#FF5630',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff2f0')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [step, setStep] = useState<Step>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.stack}>
          <a href="/" className={styles.logo}>
            <span style={{ fontWeight: 800, fontSize: 22, color: '#F26522' }}>
              ⚡ASP
            </span>
          </a>

          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <span className={styles.navDot} />
              Danh mục
              <span className={styles.navArrow}><ChevronDownIcon /></span>
            </NavLink>
            <span
              className={styles.navLink}
              onClick={() => setStep('seller-register')}
              style={{ cursor: 'pointer' }}
            >
              Đăng ký bán hàng
            </span>
          </nav>
        </div>

        <div className={styles.siteAction}>
          
          {isLoggedIn ? (
            <UserDropdown name={user?.name || 'User'} onLogout={handleLogout} />
          ) : (
            <>
              <button
                className={styles.btnRegister}
                onClick={() => setStep('register')}
                >
                Đăng ký
              </button>

              <button
                className={styles.btnLogin}
                onClick={() => setStep('login')}
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </header>

      {/* REGISTER */}
      <RegisterModal
        open={step === 'register'}
        onClose={() => setStep(null)}
        onLoginClick={() => setStep('login')}
        onSellerRegisterClick={() => window.open('/seller/register')}
        onSubmit={() => {
          setStep('otp');
        }}
      />

      <SellerRegisterModal
        open={step === 'seller-register'}
        onClose={() => setStep(null)}
        onCancel={() => setStep(null)}
        onSubmit={(data) => {
          console.log(data);
          setStep(null);
        }}
      />

      <LoginModal
        open={step === 'login'}
        onClose={() => setStep(null)}
        onRegisterClick={() => setStep('register')}
      />

      {/* OTP */}
      <OtpModal
        open={step === 'otp'}
        onClose={() => setStep(null)}
        onBack={() => setStep('register')}
        onContinue={(otp) => {
          console.log('OTP from modal:', otp);
          setStep(null); // done
        }}
      />
    </>
  );
}


