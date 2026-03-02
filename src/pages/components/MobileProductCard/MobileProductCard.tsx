import { formatPrice } from '../../../utils/format';
import styles from './MobileProductCard.module.css';

export interface MobileProductCardData {
  name: string;
  img: string;
  price: number;
  quantity: number;
}

interface Props {
  data: MobileProductCardData;
  checked?: boolean;
  onCheck?: () => void;
  onQuantityChange?: (qty: number) => void;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 6l-6 6 6 6" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 6l6 6-6 6" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MobileProductCard({
  data,
  checked = false,
  onCheck,
  onQuantityChange,
}: Props) {
  const { name, img, price, quantity } = data;

  const handleDecrease = () => {
    if (quantity > 1 && onQuantityChange) onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (onQuantityChange) onQuantityChange(quantity + 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.checkboxOuter} onClick={onCheck}>
        <div className={styles.checkboxInner}>
          <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
            {checked && <CheckIcon />}
          </div>
        </div>
      </div>

      <div className={styles.productStack}>
        <div className={styles.productImg}>
          <img src={img} alt={name} />
        </div>
        <div className={styles.productInfo}>
          <span className={styles.productName}>{name}</span>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(price)}</span>
          </div>
          <div className={styles.quantityWrap}>
            <button className={styles.qtyBtn} onClick={handleDecrease}>
              <ChevronLeft />
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={handleIncrease}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}