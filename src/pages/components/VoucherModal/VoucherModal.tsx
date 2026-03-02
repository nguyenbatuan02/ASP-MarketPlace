import VoucherPicker from '../VoucherPicker/VoucherPicker';
import {type VoucherData } from '../VoucherCard/VoucherCard';
import styles from './VoucherModal.module.css';

interface Props {
  open: boolean;
  vouchers: VoucherData[];
  onClose: () => void;
  onConfirm: () => void;
  onApplyCode?: (code: string) => void;
  onSelect?: (index: number) => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 7l10 10M17 7L7 17"
      stroke="rgba(0,0,0,0.56)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function VoucherModal({ open, vouchers, onClose, onConfirm, onApplyCode, onSelect }: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Voucher nhà bán</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <VoucherPicker
            vouchers={vouchers}
            onApplyCode={onApplyCode}
            onSelect={onSelect}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Hủy</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>Đồng ý</button>
        </div>
      </div>
    </div>
  );
}