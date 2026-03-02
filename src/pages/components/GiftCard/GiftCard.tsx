import styles from './GiftCard.module.css';
// thẻ quà tặng
export interface GiftCardData {
  name: string;
  sku: string;
  img: string;
  quantity: number;
  giftLabel?: string;
}

interface Props {
  data: GiftCardData;
  onDelete?: () => void;
}

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M10 11v6M14 11v6M8 7l1 12a1 1 0 001 1h4a1 1 0 001-1l1-12" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function GiftCard({ data, onDelete }: Props) {
  const { name, sku, img, quantity, giftLabel = 'Quà tặng' } = data;

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.checkboxPlaceholder} />

        <div className={styles.productStack}>
          <div className={styles.productImg}>
            <img src={img} alt={name} />
          </div>
          <div className={styles.productInfo}>
            <div className={styles.giftChip}>
              <span className={styles.giftChipInner}>{giftLabel}</span>
            </div>
            <span className={styles.productName}>{name}</span>
            <span className={styles.productSku}>SKU: {sku}</span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.quantityWrap}>
          <span className={styles.qtyValue}>{quantity}</span>
        </div>
        <button className={styles.deleteBtn} onClick={onDelete}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}