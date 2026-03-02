import styles from './VoucherCard.module.css';
// thẻ voucher
export interface VoucherData {
  discount: string;       
  minOrder: string;       
  maxDiscount: string;    
  expiry: string;         
  eligible: boolean;      
}

interface Props {
  data: VoucherData;
  selected?: boolean;
  onToggle?: () => void;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function VoucherCard({ data, selected = false, onToggle }: Props) {
  const { discount, minOrder, maxDiscount, expiry, eligible } = data;

  return (
    <div className={styles.card}>
      {/* Left: Info */}
      <div className={styles.info}>
        {discount}<br />
        {minOrder}<br />
        {maxDiscount}<br />
        {expiry}
      </div>

      {/* Right: Action */}
      <div className={styles.action}>
        <div
          className={styles.checkboxWrap}
          onClick={eligible ? onToggle : undefined}
        >
          <div
            className={`
              ${styles.checkbox}
              ${!eligible ? styles.checkboxDisabled : ''}
              ${eligible && selected ? styles.checkboxChecked : ''}
            `}
          >
            {eligible && selected && <CheckIcon />}
          </div>
        </div>
        <span
          className={`
            ${styles.statusText}
            ${!eligible ? styles.statusTextIneligible : ''}
          `}
        >
          {eligible ? 'Đủ điều kiện' : 'Không đủ điều kiện'}
        </span>
      </div>
    </div>
  );
}