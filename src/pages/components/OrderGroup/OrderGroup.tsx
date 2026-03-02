import { useState } from 'react';
import { CHECKOUT_TEXT, type Order } from '../../Checkout/constants';
import { formatPrice } from '../../../utils/format';
import styles from './OrderGroup.module.css';

interface Props {
  order: Order;
}

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" stroke="#212B36" strokeWidth="0.86" />
  </svg>
);

const VoucherIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#FF5630" strokeWidth="1.5" />
    <path d="M8 5v14" stroke="#FF5630" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M13 10h4M13 14h4" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function OrderGroup({ order }: Props) {
  const [message, setMessage] = useState('');

  return (
    <div className={styles.orderCard}>
      {/* Header */}
      <div className={styles.orderHeader}>
        <div className={styles.orderHeaderLeft}>
          <div className={styles.orderIdGroup}>
            <span className={styles.orderId}>{order.id}</span>
            <div className={styles.orderDivider} />
            <div className={styles.orderLocationIcon}>
              <LocationIcon />
            </div>
            <span className={styles.orderLocation}>{order.location}</span>
          </div>
        </div>
        {/* <div className={styles.statusChip}>
          <span className={styles.statusChipInner}>{order.status}</span>
        </div> */}
      </div>

      {/* Items */}
      <div className={styles.orderItems}>
        {order.items.map((item, i) => (
          <div key={i} className={styles.productCard}>
            <div className={styles.productCardInner}>
              <div className={styles.productFrame}>
                <div className={styles.productImg}>
                  <img src={item.img} alt={item.name} />
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{item.name}</span>
                  <span className={styles.productSku}>SKU: {item.sku}</span>
                  <span className={styles.productQty}>x{item.qty}</span>
                </div>
              </div>
              <span className={styles.productPrice}>{formatPrice(item.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher */}
      <div className={styles.voucherRow}>
        <div className={styles.voucherInner}>
          <div className={styles.voucherIconWrap}>
            <div className={styles.voucherIcon}>
              <VoucherIcon />
            </div>
          </div>
          <span className={styles.voucherText}>{order.voucher}</span>
        </div>
      </div>

      {/* Message + Total */}
      <div className={styles.orderFooter}>
        <div className={styles.messageSection}>
          <span className={styles.messageLabel}>{CHECKOUT_TEXT.messageLabel}</span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={CHECKOUT_TEXT.messagePlaceholder}
            className={styles.messageInput}
          />
        </div>
        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{CHECKOUT_TEXT.totalLabel(order.totalItems)}</span>
            <span className={styles.totalPrice}>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}