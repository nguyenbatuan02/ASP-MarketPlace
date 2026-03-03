import { useState } from 'react';
import HotlineBanner from '../HotlineBanner/HotlineBanner';
import styles from './RegisterModal.module.css';
import SellerRegisterModal from '../SellerRegisterModal/SellerRegisterModal';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onSellerRegisterClick: () => void;
  onSubmit: () => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M19 5L5 19M5 5l14 14"
      stroke="rgba(0,0,0,0.56)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 9.5l5 5 5-5"
      stroke="rgba(0,0,0,0.56)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {show ? (
      <path
        d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="rgba(0,0,0,0.56)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    ) : (
      <>
        <path
          d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"
          stroke="rgba(0,0,0,0.56)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10.73 10.73a3 3 0 004.24 4.24"
          stroke="rgba(0,0,0,0.56)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </>
    )}
  </svg>
);

interface FloatInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  showToggle?: boolean;
}

function FloatInput({
  label,
  type = 'text',
  value,
  onChange,
  showToggle,
}: FloatInputProps) {
  const [show, setShow] = useState(false);
  const inputType = showToggle ? (show ? 'text' : 'password') : type;

  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={styles.input}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
      />
      {showToggle && (
        <button
          className={styles.eyeBtn}
          onClick={() => setShow(!show)}
          type="button"
        >
          <EyeIcon show={show} />
        </button>
      )}
    </div>
  );
}

interface FloatSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

function FloatSelect({
  label,
  value,
  onChange,
  options,
}: FloatSelectProps) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className={styles.selectIcon}>
        <ChevronDownIcon />
      </span>
    </div>
  );
}

export default function RegisterModal({
  open,
  onClose,
  onLoginClick,
  onSubmit,
}: RegisterModalProps) {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [openSeller, setOpenSeller] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInner}>
              <span className={styles.title}>
                Đăng ký tài khoản
              </span>
              <button className={styles.closeBtn} onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.contentInner}>
              <div className={styles.fields}>
                <FloatInput
                  label="Họ và tên *"
                  value={form.name}
                  onChange={set('name')}
                />

                <FloatSelect
                  label="Giới tính *"
                  value={form.gender}
                  onChange={set('gender')}
                  options={[
                    { value: '', label: '' },
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },

                  ]}
                />

                <FloatInput
                  label="Số điện thoại *"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                />

                <FloatInput
                  label="Địa chỉ email *"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                />

                <FloatInput
                  label="Mật khẩu *"
                  value={form.password}
                  onChange={set('password')}
                  showToggle
                />

                <FloatInput
                  label="Nhập lại mật khẩu *"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  showToggle
                />
              </div>

              {/* Register */}
              <button
                className={styles.registerBtn}
                onClick={onSubmit}
              >
                <span className={styles.registerBtnText}>
                  Đăng ký
                </span>
              </button>

              {/* Login */}
              <div className={styles.loginRow}>
                <span className={styles.loginHint}>
                  Đã có tài khoản?
                </span>
                <button
                  className={styles.linkBtn}
                  onClick={onLoginClick}
                >
                  <span className={styles.linkBtnText}>
                    Đăng nhập
                  </span>
                </button>
              </div>

              {/* Seller Register */}
              <button
                className={styles.sellerBtn}
                onClick={() => setOpenSeller(true)}
              >
                <span className={styles.linkBtnText}>
                  Đăng ký bán hàng trên ASP Marketplace
                </span>
              </button>

              {/* Hotline */}
              <div className={styles.hotlineWrap}>
                <HotlineBanner />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Modal */}
      <SellerRegisterModal
        open={openSeller}
        onClose={() => setOpenSeller(false)}
        onCancel={() => setOpenSeller(false)}
        onSubmit={(data) => {
          console.log(data);
          setOpenSeller(false);
        }}
      />

        
    </>
     
    
  );
}
