import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ShippingAddress from '../components/ShippingAddress/ShippingAddress';
import OrderGroup from '../components/OrderGroup/OrderGroup';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import { MOCK_SHIPPING, MOCK_ORDERS } from './constants';
import styles from './CheckoutPage.module.css';


export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>Đặt hàng</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <ShippingAddress data={MOCK_SHIPPING} />
            {MOCK_ORDERS.map((order, i) => (
              <OrderGroup key={i} order={order} />
            ))}
          </div>
          <div className={styles.rightCol}>
            <OrderSummary />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}