import styles from './SellerVoucherSelect.module.css';
// chọn voucher nhà bán
interface Props {
  label: string;
  applied?: boolean;
  buttonText?: string;
  onClick?: () => void;
}

const VoucherIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#FF5630" strokeWidth="1.5" />
    <path d="M8 5v14" stroke="#FF5630" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M13 10h4M13 14h4" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function SellerVoucherSelect({
  label,
  applied = false,
  buttonText = 'Chọn hoặc nhập mã',
  onClick,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          <VoucherIcon />
        </div>
        <span className={`${styles.label} ${applied ? styles.labelApplied : ''}`}>
          {label}
        </span>
      </div>
      <button className={styles.selectBtn} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}