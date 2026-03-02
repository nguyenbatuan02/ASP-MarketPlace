import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OrderCard from '../components/OrderCard/OrderCard';
import { MOCK_ORDER, MOCK_ADDRESS, MOCK_PAYMENT } from './constants';
import styles from './OrderDetailPage.module.css';

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"
      stroke="#212B36" strokeWidth="1.5" fill="none"
    />
  </svg>
);

const RadioIcon = ({ checked }: { checked: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={checked ? '#696CFF' : '#637381'} strokeWidth="2" />
    {checked && <circle cx="12" cy="12" r="5" fill="#696CFF" />}
  </svg>
);

function ShippingAddress({ name, phone, address }: { name: string; phone: string; address: string }) {
  return (
    <div className={styles.addressCard}>
      <div className={styles.addressHeader}>
        <LocationIcon />
        <span className={styles.addressTitle}>Địa chỉ giao hàng</span>
      </div>
      <div className={styles.addressBody}>
        <div className={styles.addressRow}>
          <div className={styles.addressContact}>
            <span>{name}</span>
            <span>{phone}</span>
          </div>
          <span className={styles.addressText}>{address}</span>
        </div>
      </div>
    </div>
  );
}

function PaymentSummary({
  count, subtotal, voucher, total, paymentMethod,
}: {
  count: number; subtotal: string; voucher?: string; total: string; paymentMethod: string;
}) {
  return (
    <div className={styles.paymentCard}>
      <span className={styles.paymentTitle}>
        Thanh toán{' '}
        <span className={styles.paymentCount}>({count} sản phẩm)</span>
      </span>

      {/* Rows */}
      <div className={styles.paymentRows}>
        <div className={styles.paymentRow}>
          <span className={styles.paymentLabel}>Tổng số tiền</span>
          <span className={styles.paymentValue}>{subtotal}</span>
        </div>
        {voucher && (
          <div className={styles.paymentRow}>
            <span className={styles.paymentLabel}>Voucher nhà bán</span>
            <span className={styles.paymentValueDiscount}>{voucher}</span>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* Final total */}
      <div className={styles.paymentRow}>
        <span className={styles.paymentLabelBold}>Số tiền thanh toán</span>
        <span className={styles.paymentValueBold}>{total}</span>
      </div>

      <div className={styles.divider} />

      {/* Payment method */}
      <div className={styles.methodSection}>
        <span className={styles.methodTitle}>PHƯƠNG THỨC THANH TOÁN</span>
        <div className={styles.methodRow}>
          <button className={styles.radioBtn}>
            <RadioIcon checked />
          </button>
          <span className={styles.methodLabel}>{paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <div className={styles.inner}>

          {/* Title */}
          <div className={styles.titleRow}>
            <span className={styles.title}>Thông tin đơn hàng #{MOCK_ORDER.orderId}</span>
          </div>

          {/* Layout */}
          <div className={styles.layout}>
            {/* Left col */}
            <div className={styles.leftCol}>
              <OrderCard
                sellerId={MOCK_ORDER.sellerId}
                location={MOCK_ORDER.location}
                status={MOCK_ORDER.status}
                products={MOCK_ORDER.products}
                totalCount={MOCK_ORDER.totalCount}
                totalPrice={MOCK_ORDER.totalPrice}
              />
              <ShippingAddress
                name={MOCK_ADDRESS.name}
                phone={MOCK_ADDRESS.phone}
                address={MOCK_ADDRESS.address}
              />
            </div>

            {/* Right col */}
            <PaymentSummary
              count={MOCK_PAYMENT.count}
              subtotal={MOCK_PAYMENT.subtotal}
              voucher={MOCK_PAYMENT.voucher}
              total={MOCK_PAYMENT.total}
              paymentMethod={MOCK_PAYMENT.paymentMethod}
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}