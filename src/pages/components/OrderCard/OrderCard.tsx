import { useState } from 'react';
import styles from './OrderCard.module.css';

export interface OrderProduct {
  image?: string;
  name: string;
  sku: string;
  quantity: number;
  price: string;
}

export interface OrderCardProps {
  sellerId: string;
  location: string;
  status: string;
  products: OrderProduct[];
  totalCount: number;
  totalPrice: string;
  note?: string;
}

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"
      stroke="#212B36" strokeWidth="0.86" fill="none"
    />
  </svg>
);

export default function OrderCard({
  sellerId, location, status, products, totalCount, totalPrice, note = '',
}: OrderCardProps) {
  const [msg, setMsg] = useState(note);

  return (
    <div className={styles.card}>

      {/* Frame 1 — header */}
      <div className={styles.frame1}>
        <div className={styles.sellerInfo}>
          <div className={styles.sellerLeft}>
            <span className={styles.sellerId}>{sellerId}</span>
            <div className={styles.divider} />
            <LocationIcon />
            <span className={styles.location}>{location}</span>
          </div>
        </div>
        <div className={styles.statusChip}>
          <span className={styles.statusText}>{status}</span>
        </div>
      </div>

      {/* Frame 2 — products */}
      <div className={styles.frame2}>
        {products.map((p, i) => (
          <div key={i} className={styles.productCard}>
            <div className={styles.productLeft}>
              <div className={styles.productImg}>
                {p.image
                  ? <img src={p.image} alt={p.name} />
                  : null}
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productName}>{p.name}</span>
                <span className={styles.productSku}>SKU: {p.sku}</span>
                <span className={styles.productQty}>x{p.quantity}</span>
              </div>
            </div>
            <div className={styles.productPrice}>{p.price}</div>
          </div>
        ))}
      </div>

      {/* Frame 3 — note + total */}
      <div className={styles.frame3}>
        <div className={styles.noteWrap}>
          <span className={styles.noteLabel}>Lời nhắn dành cho nhà bán</span>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              placeholder="Lời nhắn"
              value={msg}
              onChange={e => setMsg(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.totalWrap}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Tổng số tiền ({totalCount} sản phẩm):</span>
            <span className={styles.totalPrice}>{totalPrice}</span>
          </div>
        </div>
      </div>

    </div>
  );
}