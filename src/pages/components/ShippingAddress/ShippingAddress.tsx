import {type ShippingInfo } from '../../Checkout/constants';
import styles from './ShippingAddress.module.css';
import { useState } from 'react';
import AddressModal, { type AddressFormData } from '../AddressModal/AddressModal';

interface Props {
  data: ShippingInfo;
}

const LocationIcon = () => (
  <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
    <path
      d="M17.5 3C11.7 3 7 7.7 7 13.5c0 8.75 10.5 19.25 10.5 19.25S28 22.25 28 13.5C28 7.7 23.3 3 17.5 3zm0 14.25a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z"
      stroke="#FF5630"
    />
  </svg>
);

export default function ShippingAddress({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [shipping, setShipping] = useState(data);

  const handleSave = (form: AddressFormData) => {
    const fullAddress = `${form.detail}, ${form.district}, ${form.city}`;

    setShipping({
      name: form.name,
      phone: form.phone,
      address: fullAddress,
    });

    setOpen(false);
  };

  return (
    <>
      <div className={styles.shippingCard}>
        <div className={styles.shippingHeader}>
          <div className={styles.shippingIcon}>
            <LocationIcon />
          </div>
          <span className={styles.shippingTitle}>Địa chỉ giao hàng</span>
        </div>

        <div className={styles.shippingBody}>
          <div className={styles.shippingName}>
            {shipping.name}<br />{shipping.phone}
          </div>

          <div className={styles.shippingAddress}>
            {shipping.address}
          </div>

          <div className={styles.shippingActions}>
            <div className={styles.defaultChip}>
              <span className={styles.defaultChipInner}>Mặc định</span>
            </div>

            <button
              className={styles.changeBtn}
              onClick={() => setOpen(true)}
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>
      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onSave={handleSave}
        initialData={{
          name: shipping.name,
          phone: shipping.phone,
        }}
      />
    </>
  );
}