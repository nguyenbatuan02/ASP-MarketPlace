import styles from './SellerVoucherMobile.module.css';
// Chọn voucher sản phẩm, shopping card mobile
interface Props {
  label?: string;
  checked?: boolean;
  onCheck?: () => void;
  onNavigate?: () => void;
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 5l5 5-5 5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SellerVoucherMobile({
  label = 'Voucher của nhà bán',
  checked = false,
  onCheck,
  onNavigate,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.checkboxOuter} onClick={onCheck}>
          <div className={styles.checkboxInner}>
            <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
              {checked && <CheckIcon />}
            </div>
          </div>
        </div>
        <span className={styles.label}>{label}</span>
      </div>
      <button className={styles.arrowBtn} onClick={onNavigate}>
        <ChevronRight />
      </button>
    </div>
  );
}