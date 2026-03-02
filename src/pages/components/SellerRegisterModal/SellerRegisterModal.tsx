import { useState, useRef } from 'react';
import styles from './SellerRegisterModal.module.css';

interface SellerRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (data: SellerFormData) => void;
}

interface SellerFormData {
  name: string; gender: string; phone: string; email: string;
  bizName: string; group: string; taxCode: string; bizAddress: string;
  legalRep: string; bizPhone: string;
  frontImage: File | null; officeImage: File | null;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 5L5 19M5 5l14 14" stroke="rgba(0,0,0,0.56)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill="rgba(0,0,0,0.56)" />
  </svg>
);

const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
      fill="#919EAB" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function FloatInput({ label, value, onChange, type = 'text', disabled }: {
  label: string; value: string; onChange?: (v: string) => void; type?: string; disabled?: boolean;
}) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.floatLabel}>{label}</label>
      <input
        className={`${styles.input} ${disabled ? styles.inputDisabled : ''}`}
        type={type} value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder=" " disabled={disabled}
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
        {file ? (
          <img src={URL.createObjectURL(file)} alt="preview" className={styles.uploadPreview} />
        ) : (
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

export default function SellerRegisterModal({ open, onClose, onCancel, onSubmit }: SellerRegisterModalProps) {
  const [form, setForm] = useState<SellerFormData>({
    name: '', gender: '', phone: '', email: '',
    bizName: '', group: '', taxCode: '', bizAddress: '', legalRep: '', bizPhone: '',
    frontImage: null, officeImage: null,
  });
  const set = (k: keyof SellerFormData) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.title}>Đăng ký tài khoản người mua</span>
            <button className={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.contentInner}>

            {/* Section: Account info */}
            <div className={styles.sectionLabel}>Thông tin tài khoản</div>

            <div className={styles.row2}>
              <FloatInput label="Họ và tên *" value={form.name} onChange={set('name')} disabled />
              <FloatInput label="Giới tính *" value={form.gender} onChange={set('gender')} disabled />
            </div>
            <div className={styles.row2}>
              <FloatInput label="Số điện thoại *" value={form.phone} onChange={set('phone')} disabled />
              <FloatInput label="Địa chỉ email *" value={form.email} onChange={set('email')} disabled />
            </div>

            {/* Section: Business info */}
            <div className={styles.sectionTitle}>Thông tin doanh nghiệp</div>

            <div className={styles.row1}>
              <FloatInput label="Tên doanh nghiệp *" value={form.bizName} onChange={set('bizName')} />
            </div>
            <div className={styles.row2}>
              <FloatSelect label="Nhóm *" value={form.group} onChange={set('group')} options={GROUP_OPTIONS} />
              <FloatInput label="MST *" value={form.taxCode} onChange={set('taxCode')} />
            </div>
            <div className={styles.row1}>
              <FloatInput label="Địa chỉ trên đăng ký kinh doanh *" value={form.bizAddress} onChange={set('bizAddress')} />
            </div>
            <div className={styles.row2}>
              <FloatInput label="Đại diện pháp luật *" value={form.legalRep} onChange={set('legalRep')} />
              <FloatInput label="Số điện thoại" value={form.bizPhone} onChange={set('bizPhone')} />
            </div>

            {/* Section: Business address */}
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionTitle}>Địa chỉ kinh doanh</span>
              <button className={styles.iconBtn}><EditIcon /></button>
            </div>
            <div className={styles.addressText}>
              {form.bizAddress || '68 Ngõ Huế, phường Phố Huế, quận Hai Bà Trưng, thành phố Hà Nội, Việt Nam'}
            </div>

            {/* Section: Images */}
            <div className={styles.sectionTitle}>Hình ảnh</div>
            <p className={styles.imageHint}>Vui lòng cung cấp các hình ảnh giấy phép cần thiết để xác thực tài khoản</p>

            <UploadBox
              label="Đăng ký kinh doanh (mặt trước)"
              file={form.frontImage}
              onChange={f => setForm(p => ({ ...p, frontImage: f }))}
            />
            <UploadBox
              label="Hình ảnh trụ sở kinh doanh"
              file={form.officeImage}
              onChange={f => setForm(p => ({ ...p, officeImage: f }))}
            />

          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.btnGroup}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              <span className={styles.cancelBtnText}>Huỷ</span>
            </button>
            <button className={styles.submitBtn} onClick={() => onSubmit(form)}>
              <span className={styles.submitBtnText}>Đăng ký</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}