import type { ReactNode } from 'react';
import SellerVoucherMobile from '../SellerVoucherMobile/SellerVoucherMobile';
import styles from './MobileShoppingCard.module.css';

interface Props {
  sellerId: string;
  checked?: boolean;
  onCheck?: () => void;
  children: ReactNode;        
  voucherChecked?: boolean;
  onVoucherCheck?: () => void;
  onVoucherNavigate?: () => void;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 7l1.5-4h15L21 7M3 7v2a3 3 0 003 3 3 3 0 003-3 3 3 0 003 3 3 3 0 003-3 3 3 0 003 3 3 3 0 003-3V7M3 7h18" stroke="#212B36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12v8h14v-8" stroke="#212B36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MobileShoppingCard({
  sellerId,
  checked = false,
  onCheck,
  children,
  voucherChecked = false,
  onVoucherCheck,
  onVoucherNavigate,
}: Props) {
  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleBar}>
        <div className={styles.checkboxOuter} onClick={onCheck}>
          <div className={styles.checkboxInner}>
            <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
              {checked && <CheckIcon />}
            </div>
          </div>
        </div>
        <div className={styles.titleInfo}>
          <StoreIcon />
          <div className={styles.sellerStack}>
            <span className={styles.sellerId}>{sellerId}</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className={styles.productsArea}>
        {children}
      </div>

      {/* Voucher */}
      <div className={styles.voucherArea}>
        <SellerVoucherMobile
          checked={voucherChecked}
          onCheck={onVoucherCheck}
          onNavigate={onVoucherNavigate}
        />
      </div>
    </div>
  );
}