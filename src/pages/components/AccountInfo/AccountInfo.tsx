import { useState, useRef } from 'react';
import styles from './AccountInfo.module.css';

export interface AccountInfoData {
  name: string;
  phone: string;
  dob: string;
  gender: string;
  email: string;
  avatar: File | null;
}

interface AccountInfoProps {
  initialData?: Partial<AccountInfoData>;
  onChange?: (data: AccountInfoData) => void;
}

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 5h18v16H3V5zM16 3v4M8 3v4M3 9h18" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" fill="#fff" />
    <path d="M9 3L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.17L15 3H9z" fill="#fff" fillOpacity="0.85" />
  </svg>
);

function FloatInput({ label, value, onChange, type = 'text', icon }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; icon?: React.ReactNode;
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={styles.input} type={type}
        value={value} onChange={e => onChange(e.target.value)}
        placeholder=" "
        style={icon ? { paddingRight: 44 } : undefined}
      />
      {icon && <span className={styles.fieldIcon}>{icon}</span>}
    </div>
  );
}

function FloatSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <select className={styles.select} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className={styles.fieldIcon}><ChevronDownIcon /></span>
    </div>
  );
}

const GENDER_OPTIONS = [
  { value: '', label: '' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
];

export default function AccountInfo({ initialData, onChange }: AccountInfoProps) {
  const [form, setForm] = useState<AccountInfoData>({
    name: initialData?.name ?? '',
    phone: initialData?.phone ?? '',
    dob: initialData?.dob ?? '',
    gender: initialData?.gender ?? '',
    email: initialData?.email ?? '',
    avatar: initialData?.avatar ?? null,
  });
  const avatarRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof AccountInfoData) => (v: string) => {
    const next = { ...form, [k]: v };
    setForm(next);
    onChange?.(next);
  };

  const handleAvatar = (f: File) => {
    const next = { ...form, avatar: f };
    setForm(next);
    onChange?.(next);
  };

  const avatarUrl = form.avatar ? URL.createObjectURL(form.avatar) : null;

  return (
    <div className={styles.wrapper}>
      {/* Left: form fields */}
      <div className={styles.formCard}>
        <div className={styles.sectionLabel}>Thông tin tài khoản</div>

        {/* Row 1: name + phone */}
        <div className={styles.row2}>
          <FloatInput label="Họ và tên *" value={form.name} onChange={set('name')} />
          <FloatInput label="Số điện thoại *" value={form.phone} onChange={set('phone')} type="tel" />
        </div>

        {/* Row 2: dob + gender */}
        <div className={styles.row2}>
          <FloatInput label="Ngày sinh *" value={form.dob} onChange={set('dob')}
            icon={<CalendarIcon />} />
          <FloatSelect label="Giới tính *" value={form.gender} onChange={set('gender')} options={GENDER_OPTIONS} />
        </div>

        {/* Row 3: email full-width */}
        <div className={styles.row1}>
          <FloatInput label="Địa chỉ email *" value={form.email} onChange={set('email')} type="email" />
        </div>
      </div>

      {/* Right: avatar upload */}
      <div className={styles.avatarCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap} onClick={() => avatarRef.current?.click()}>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className={styles.avatarImg} />
              : <div className={styles.avatarPlaceholder} />}
            <div className={styles.avatarOverlay}>
              <CameraIcon />
              <span className={styles.avatarOverlayText}>Update photo</span>
            </div>
          </div>
          <div className={styles.avatarHintWrap}>
            <p className={styles.avatarHint}>Allowed *.jpeg, *.jpg, *.png, *.gif{'\n'}max size of 3.1 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}