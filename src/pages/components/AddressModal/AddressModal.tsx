import { useState } from 'react';
import styles from './AddressModal.module.css';

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSave: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
}

export interface AddressFormData {
  name: string;
  phone: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 5L5 19M5 5l14 14" stroke="rgba(0,0,0,0.56)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    {checked ? (
      <>
        <rect width="18" height="18" rx="2" fill="#696CFF" />
        <path d="M4 9l3.5 3.5L14 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <rect x="0.5" y="0.5" width="17" height="17" rx="1.5" stroke="#637381" />
    )}
  </svg>
);

function FloatInput({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={styles.input} type={type}
        value={value} onChange={e => onChange(e.target.value)}
        placeholder=" "
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
      <span className={styles.selectIcon}><ChevronDownIcon /></span>
    </div>
  );
}

const CITIES = [
  { value: '', label: '' },
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'hcm', label: 'Hồ Chí Minh' },
  { value: 'danang', label: 'Đà Nẵng' },
];

const DISTRICTS: Record<string, { value: string; label: string }[]> = {
  hanoi: [
    { value: '', label: '' },
    { value: 'haibatrung', label: 'Hai Bà Trưng' },
    { value: 'hoankiem', label: 'Hoàn Kiếm' },
    { value: 'dongda', label: 'Đống Đa' },
  ],
  hcm: [
    { value: '', label: '' },
    { value: 'q1', label: 'Quận 1' },
    { value: 'q3', label: 'Quận 3' },
  ],
  danang: [
    { value: '', label: '' },
    { value: 'haichau', label: 'Hải Châu' },
  ],
};

export default function AddressModal({ open, onClose, onCancel, onSave, initialData }: AddressModalProps) {
  const [form, setForm] = useState<AddressFormData>({
    name: initialData?.name ?? '',
    phone: initialData?.phone ?? '',
    city: initialData?.city ?? '',
    district: initialData?.district ?? '',
    detail: initialData?.detail ?? '',
    isDefault: initialData?.isDefault ?? false,
  });

  const set = (k: keyof AddressFormData) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  if (!open) return null;

  const districts = DISTRICTS[form.city] ?? [{ value: '', label: '' }];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.title}>Chi tiết địa chỉ</span>
            <button className={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.contentInner}>

            {/* Contact info */}
            <div className={styles.sectionTitle}>Thông tin người liên hệ</div>
            <div className={styles.row2}>
              <FloatInput label="Họ và tên *" value={form.name} onChange={set('name')} />
              <FloatInput label="Số điện thoại *" value={form.phone} onChange={set('phone')} type="tel" />
            </div>

            {/* Address info */}
            <div className={styles.sectionTitle}>Thông tin địa chỉ</div>
            <div className={styles.row2}>
              <FloatSelect
                label="Thành phố/Tỉnh"
                value={form.city}
                onChange={v => setForm(f => ({ ...f, city: v, district: '' }))}
                options={CITIES}
              />
              <FloatSelect
                label="Quận/Huyện"
                value={form.district}
                onChange={set('district')}
                options={districts}
              />
            </div>
            <div className={styles.row1}>
              <div className={styles.textareaWrap}>
                <label className={styles.floatLabel}>Địa chỉ chi tiết</label>
                <textarea
                  className={styles.textarea}
                  value={form.detail}
                  onChange={e => set('detail')(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Default checkbox */}
            <button
              className={styles.checkboxRow}
              onClick={() => setForm(f => ({ ...f, isDefault: !f.isDefault }))}
            >
              <span className={styles.checkboxIconWrap}>
                <CheckboxIcon checked={form.isDefault} />
              </span>
              <span className={styles.checkboxLabel}>Đặt làm địa chỉ nhận hàng</span>
            </button>

          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.btnGroup}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              <span className={styles.cancelBtnText}>Huỷ</span>
            </button>
            <button className={styles.saveBtn} onClick={() => onSave(form)}>
              <span className={styles.saveBtnText}>Lưu</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}