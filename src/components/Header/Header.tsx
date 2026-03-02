import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import RegisterModal from '../../pages/components/RegisterModal/RegisterModal';
import OtpModal from '../../pages/components/OtpModal/OtpModal';
import SellerRegisterModal from '../../pages/components/SellerRegisterModal/SellerRegisterModal';
import styles from './Header.module.css';

type Step = 'register' | 'otp' | 'seller-register' | null;

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Header() {
  const [step, setStep] = useState<Step>(null);

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
              to="/category"
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
          <button
            className={styles.btnRegister}
            onClick={() => setStep('register')}
          >
            Đăng ký
          </button>

          <button className={styles.btnLogin}>
            Đăng nhập
          </button>
        </div>
      </header>

      {/* REGISTER */}
      <RegisterModal
        open={step === 'register'}
        onClose={() => setStep(null)}
        onLoginClick={() => setStep(null)}
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
