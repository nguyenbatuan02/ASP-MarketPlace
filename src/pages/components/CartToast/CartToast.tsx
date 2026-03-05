import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartToast.module.css';

interface CartToastProps {
  open: boolean;
  productName: string;
  productImage: string;
  qty: number;
  price: number;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 5L5 19M5 5l14 14" stroke="rgba(0,0,0,0.56)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const formatPrice = (n: number) => n.toLocaleString('vi-VN') + ' đ';

export default function CartToast({ open, productName, productImage, qty, price, onClose }: CartToastProps) {
  const navigate = useNavigate();

  // Tự đóng sau 4 giây
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.toast}>
      {/* Header */}
      <div className={styles.toastHeader}>
        <span className={styles.toastTitle}>Mặt hàng đã được thêm vào giỏ hàng của bạn</span>
        <button className={styles.closeBtn} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      {/* Product row */}
      <div className={styles.productRow}>
        <div className={styles.productImg}>
          <img
            src={productImage}
            alt={productName}
            onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
          />
        </div>
        <div className={styles.productInfo}>
          <span className={styles.productQtyName}>
            <span className={styles.qty}>{qty} x</span> {productName}
          </span>
          <span className={styles.productPrice}>{formatPrice(price * qty)}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        className={styles.viewCartBtn}
        onClick={() => { navigate('/cart'); onClose(); }}
      >
        Xem giỏ hàng
      </button>
    </div>
  );
}