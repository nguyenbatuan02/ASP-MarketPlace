import { useState, useRef } from 'react';
import styles from './BusinessInfo.module.css';

export interface BusinessInfoData {
  bizName: string;
  group: string;
  taxCode: string;
  bizRegAddress: string;
  legalRep: string;
  bizPhone: string;
  frontImage: File | null;
  officeImage: File | null;
}

interface BusinessInfoProps {
  initialData?: Partial<BusinessInfoData>;
  bizAddress?: string;
  onChange?: (data: BusinessInfoData) => void;
}

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
      fill="#919EAB" />
  </svg>
);

function FloatInput({ label, value, onChange, disabled, fullWidth }: {
  label: string; value: string; onChange?: (v: string) => void;
  disabled?: boolean; fullWidth?: boolean;
}) {
  return (
    <div className={`${styles.fieldWrap} ${fullWidth ? styles.fieldFull : ''}`}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={`${styles.input} ${disabled ? styles.inputDisabled : ''}`}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder=" "
        disabled={disabled}
      />
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

function UploadBox({ label, file, onChange }: {
  label: string; file: File | null; onChange: (f: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.uploadGroup}>
      <span className={styles.uploadLabel}>{label}</span>
      <div className={styles.uploadBox} onClick={() => ref.current?.click()}>
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && onChange(e.target.files[0])} />
        {file
          ? <img src={URL.createObjectURL(file)} alt="preview" className={styles.uploadPreview} />
          : (
            <div className={styles.uploadPlaceholder}>
              <UploadIcon />
              <span className={styles.uploadHint}>Tải ảnh lên</span>
            </div>
          )}
      </div>
    </div>
  );
}

const GROUP_OPTIONS = [
  { value: '', label: '' },
  { value: 'garage', label: 'Garage' },
  { value: 'dealer', label: 'Đại lý' },
  { value: 'shop', label: 'Cửa hàng' },
];

export default function BusinessInfo({ initialData, bizAddress, onChange }: BusinessInfoProps) {
  const [form, setForm] = useState<BusinessInfoData>({
    bizName: initialData?.bizName ?? '',
    group: initialData?.group ?? '',
    taxCode: initialData?.taxCode ?? '',
    bizRegAddress: initialData?.bizRegAddress ?? '',
    legalRep: initialData?.legalRep ?? '',
    bizPhone: initialData?.bizPhone ?? '',
    frontImage: initialData?.frontImage ?? null,
    officeImage: initialData?.officeImage ?? null,
  });

  const set = (k: keyof BusinessInfoData) => (v: string) => {
    const next = { ...form, [k]: v };
    setForm(next);
    onChange?.(next);
  };

  const setFile = (k: 'frontImage' | 'officeImage') => (f: File) => {
    const next = { ...form, [k]: f };
    setForm(next);
    onChange?.(next);
  };

  return (
    <div className={styles.card}>
      {/* Frame 1 — Section title */}
      <div className={styles.sectionTitle}>Thông tin doanh nghiệp</div>

      {/* Textfield 1 — Tên doanh nghiệp */}
      <FloatInput label="Tên doanh nghiệp *" value={form.bizName} onChange={set('bizName')} fullWidth />

      {/* Frame 2 — Nhóm + MST */}
      <div className={styles.row2}>
        <FloatSelect label="Nhóm *" value={form.group} onChange={set('group')} options={GROUP_OPTIONS} />
        <FloatInput label="MST *" value={form.taxCode} onChange={set('taxCode')} />
      </div>

      {/* Frame 3 — Địa chỉ đăng ký */}
      <FloatInput label="Địa chỉ trên đăng ký kinh doanh *" value={form.bizRegAddress} onChange={set('bizRegAddress')} fullWidth />

      {/* Frame 3b — Đại diện + SĐT */}
      <div className={styles.row2}>
        <FloatInput label="Đại diện pháp luật" value={form.legalRep} onChange={set('legalRep')} />
        <FloatInput label="Số điện thoại" value={form.bizPhone} onChange={set('bizPhone')} />
      </div>

      {/* Frame 4 — Địa chỉ kinh doanh title */}
      <div className={styles.sectionTitle}>Địa chỉ kinh doanh</div>

      {/* Frame 5 — Address text */}
      <div className={styles.addressText}>
        {bizAddress ?? '68 Ngõ Huế, phường Phố Huế, quận Hai Bà Trưng, thành phố Hà Nội, Việt Nam'}
      </div>

      {/* Frame 6 — Hình ảnh title */}
      <div className={styles.sectionTitle}>Hình ảnh</div>

      {/* Frame 7 — Hint */}
      <p className={styles.imageHint}>
        Vui lòng cung cấp các hình ảnh giấy phép cần thiết để xác thực tài khoản
      </p>

      {/* Frame 8 — Upload boxes */}
      <div className={styles.uploadSection}>
        <UploadBox
          label="Đăng ký kinh doanh (mặt trước)"
          file={form.frontImage}
          onChange={setFile('frontImage')}
        />
        <UploadBox
          label="Hình ảnh trụ sở kinh doanh"
          file={form.officeImage}
          onChange={setFile('officeImage')}
        />
      </div>
    </div>
  );
}