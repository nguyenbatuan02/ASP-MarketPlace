import { useState } from 'react';
import { formatPrice } from '../../../utils/format';
import styles from './OrderSummary.module.css';

interface SummaryData {
  totalProducts: number;
  totalPrice: number;
  paymentPrice: number;
}

interface Props {
  summary: SummaryData;
  onPlaceOrder?: () => void;
  isPlacing?: boolean;
}

export default function OrderSummary({ summary, onPlaceOrder, isPlacing }: Props) {
  const { totalProducts, totalPrice, paymentPrice } = summary;
  const [selected, setSelected] = useState(true);

  return (
    <div className={styles.summaryCard}>
      <h3 className={styles.summaryTitle}>
        Sản phẩm đã chọn ({String(totalProducts).padStart(2, '0')})
      </h3>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Tổng tiền hàng</span>
        <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
      </div>

      <span className={styles.paymentTitle}>PHƯƠNG THỨC THANH TOÁN</span>
      <div className={styles.paymentMethod} onClick={() => setSelected(true)}>
        <div className={styles.radioWrap}>
          <div className={`${styles.radio} ${selected ? styles.radioSelected : ''}`}>
            {selected && <div className={styles.radioDot} />}
          </div>
        </div>
        <span className={styles.paymentMethodText}>Thanh toán khi nhận hàng</span>
      </div>

      <hr className={styles.summaryDivider} />

      <div className={styles.amountRow}>
        <span className={styles.amountLabel}>Số tiền thanh toán</span>
        <span className={styles.amountValue}>{formatPrice(paymentPrice)}</span>
      </div>
      <p className={styles.paymentNote}>
        Chưa bao gồm phí giao hàng và các phí liên quan khác.
      </p>

      <button
        className={styles.orderBtn}
        onClick={onPlaceOrder}
        disabled={isPlacing}
        style={{ opacity: isPlacing ? 0.7 : 1, cursor: isPlacing ? 'not-allowed' : 'pointer' }}
      >
        {isPlacing ? 'Đang xử lý...' : 'Đặt hàng'}
      </button>
    </div>
  );
}