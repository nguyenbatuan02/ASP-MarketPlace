import PromoBanner from '../PromoBanner/PromoBanner';
import {formatPrice} from '../../../utils/format';
import styles from './ShoppingCard.module.css';
// thẻ sản phẩm shopping card
export interface ShoppingCardData {
  name: string;
  sku: string;
  img: string;
  quantity: number;
  currentPrice: number;
  originalPrice: number;
  promoText?: string;
}

interface Props {
  data: ShoppingCardData;
  checked?: boolean;
  onCheck?: () => void;
  onQuantityChange?: (qty: number) => void;
  onDelete?: () => void;
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

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M10 11v6M14 11v6M8 7l1 12a1 1 0 001 1h4a1 1 0 001-1l1-12" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ShoppingCard({
  data,
  checked = false,
  onCheck,
  onQuantityChange,
  onDelete,
}: Props) {
  const { name, sku, img, quantity, currentPrice, originalPrice, promoText } = data;

  const handleDecrease = () => {
    if (quantity > 1 && onQuantityChange) onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (onQuantityChange) onQuantityChange(quantity + 1);
  };

  return (
    <div className={styles.card}>
      {/* Product row */}
      <div className={styles.productRow}>
        <div className={styles.productLeft}>
          <div className={styles.checkboxWrap} onClick={onCheck}>
            <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
              {checked && <CheckIcon />}
            </div>
          </div>
          <div className={styles.productStack}>
            <div className={styles.productImg}>
              <img src={img} alt={name} />
            </div>
            <div className={styles.productInfo}>
              <span className={styles.productName}>{name}</span>
              <span className={styles.productSku}>SKU: {sku}</span>
            </div>
          </div>
        </div>

        <div className={styles.productRight}>
          {/* Quantity */}
          <div className={styles.quantityWrap}>
            <button className={styles.qtyBtn} onClick={handleDecrease}>
              <ChevronLeft />
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={handleIncrease}>
              <ChevronRight />
            </button>
          </div>

          {/* Price */}
          <div className={styles.priceWrap}>
            <span className={styles.priceCurrent}>{formatPrice(currentPrice)}</span>
            {originalPrice !== currentPrice && (
              <span className={styles.priceOriginal}>{formatPrice(originalPrice)}</span>
            )}
          </div>

          {/* Delete */}
          <button className={styles.deleteBtn} onClick={onDelete}>
            <DeleteIcon />
          </button>
        </div>
      </div>

      {/* Promo banner */}
      {promoText && <PromoBanner text={promoText} />}
    </div>
  );
}