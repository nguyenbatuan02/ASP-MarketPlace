import { useState } from 'react';
import styles from './OtpModal.module.css';

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (otp: string) => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 5L5 19M5 5l14 14" stroke="rgba(0,0,0,0.56)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function OtpModal({ open, onClose, onBack, onContinue }: OtpModalProps) {
  const [otp, setOtp] = useState('');

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.title}>Đăng ký tài khoản</span>
            <button className={styles.closeBtn} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <p className={styles.hint}>
              Mã xác nhận đã được gửi tới số điện thoại bạn đăng ký
            </p>
            <input
              className={styles.input}
              placeholder="Nhập mã xác thực"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.btnGroup}>
            <button className={styles.backBtn} onClick={onBack}>
              <span className={styles.backBtnText}>Quay lại</span>
            </button>
            <button className={styles.continueBtn} onClick={() => onContinue(otp)}>
              <span className={styles.continueBtnText}>Tiếp tục</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}