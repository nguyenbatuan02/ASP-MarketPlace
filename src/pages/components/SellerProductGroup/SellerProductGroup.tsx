import type { ReactNode } from 'react';
import SellerVoucherSelect from '../SellerVoucherSelect/SellerVoucherSelect';
import styles from './SellerProductGroup.module.css';

interface Props {
  sellerId: string;           
  location: string;          
  checked?: boolean;
  onCheck?: () => void;
  children: ReactNode;        
  voucherLabel?: string;
  voucherApplied?: boolean;
  onVoucherClick?: () => void;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" stroke="#212B36" strokeWidth="0.86" />
  </svg>
);

export default function SellerProductGroup({
  sellerId,
  location,
  checked = false,
  onCheck,
  children,
  voucherLabel = 'Voucher của nhà bán',
  voucherApplied = false,
  onVoucherClick,
}: Props) {
  return (
    <div className={styles.container}>
      {/* Title bar */}
      <div className={styles.titleBar}>
        <div className={styles.checkboxWrap} onClick={onCheck}>
          <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
            {checked && <CheckIcon />}
          </div>
        </div>
        <div className={styles.sellerInfo}>
          <span className={styles.sellerId}>{sellerId}</span>
          <div className={styles.divider} />
          <LocationIcon />
          <span className={styles.locationText}>{location}</span>
        </div>
      </div>

      {/* Products */}
      <div className={styles.productsArea}>
        {children}
      </div>

      {/* Seller voucher */}
      <SellerVoucherSelect
        label={voucherLabel}
        applied={voucherApplied}
        onClick={onVoucherClick}
      />
    </div>
  );
}