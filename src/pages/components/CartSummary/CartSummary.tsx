import { useState } from 'react';
import { type SummaryRow } from '../../Cart/constants';
import styles from './CartSummary.module.css';
import { formatPrice } from '../../../utils/format';

interface Props {
  title?: string;
  rows: SummaryRow[];
  totalPrice: number;
  buttonText?: string;
  showVoucherInput?: boolean;
  onApplyVoucher?: (code: string) => void;
  onCheckout?: () => void;
}

export default function CartSummary({
  title = 'Summary',
  rows,
  totalPrice, 
  buttonText = 'Thanh toán',
  showVoucherInput = false,
  onApplyVoucher,
  onCheckout,
}: Props) {
  const [voucherCode, setVoucherCode] = useState('');

  const handleApply = () => {
    if (voucherCode.trim() && onApplyVoucher) {
      onApplyVoucher(voucherCode.trim());
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      

      <div className={styles.rows}>
        {rows.map((row, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <span className={`${styles.value} ${row.highlight ? styles.valueHighlight : ''}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {showVoucherInput && (
        <div className={styles.voucherInputWrap}>
          <input
            className={styles.voucherInput}
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã giảm giá"
          />
          <button className={styles.voucherApplyBtn} onClick={handleApply}>
            Áp dụng
          </button>
        </div>
      )}

      <hr className={styles.divider} />

      <div className={styles.row}>
        <span className={styles.label}>Số tiền thanh toán</span>
        <span className={styles.value}>
          {formatPrice(totalPrice)}
        </span>
      </div>

      <button className={styles.checkoutBtn} onClick={onCheckout}>
        {buttonText}
      </button>
    </div>
  );
}