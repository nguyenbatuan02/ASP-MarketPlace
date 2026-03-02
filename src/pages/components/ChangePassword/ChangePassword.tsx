import { useState } from 'react';
import styles from './ChangePassword.module.css';

interface ChangePasswordProps {
  onCancel?: () => void;
  onSave?: (old: string, newPw: string) => void;
}

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

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 1.667A8.333 8.333 0 1010 18.333 8.333 8.333 0 0010 1.667zM10 9.167v5M10 6.667h.008"
      stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function PwField({ placeholder, value, onChange }: {
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.fieldWrap}>
      <input
        className={styles.input}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button className={styles.eyeBtn} type="button" onClick={() => setShow(s => !s)}>
        <EyeIcon show={show} />
      </button>
    </div>
  );
}

export default function ChangePassword({ onCancel, onSave }: ChangePasswordProps) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  return (
    <div className={styles.card}>
      <PwField placeholder="Mật khẩu cũ" value={oldPw} onChange={setOldPw} />
      <PwField placeholder="Mật khẩu mới" value={newPw} onChange={setNewPw} />

      {/* Hint */}
      <div className={styles.hint}>
        <InfoIcon />
        <span className={styles.hintText}>
          Mật khẩu cần sử dụng từ 8-22 ký tự, bao gồm chữ cái thường, số, chữ cái in hoa.
        </span>
      </div>

      <PwField placeholder="Xác nhận lại mật khẩu" value={confirmPw} onChange={setConfirmPw} />

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.btnGroup}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            <span className={styles.cancelBtnText}>Huỷ</span>
          </button>
          <button className={styles.saveBtn} onClick={() => onSave?.(oldPw, newPw)}>
            <span className={styles.saveBtnText}>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  );
}