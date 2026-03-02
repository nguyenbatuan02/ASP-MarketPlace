import { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OrderCard from '../components/OrderCard/OrderCard';
import { TABS, MOCK_ORDERS } from './constants';
import styles from './OrderListPage.module.css';

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  const filtered = activeTab === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.statusKey === activeTab);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <div className={styles.inner}>

          {/* Title */}
          <div className={styles.titleRow}>
            <span className={styles.title}>Đơn mua</span>
          </div>

          {/* Content box */}
          <div className={styles.contentBox}>

            {/* Tabs */}
            <div className={styles.tabBar}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span className={`${styles.tabText} ${activeTab === tab.key ? styles.tabTextActive : ''}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.key && <div className={styles.tabLine} />}
                </button>
              ))}
            </div>

            {/* Order list */}
            <div className={styles.orderList}>
              {filtered.map((order, i) => (
                <div key={i} className={styles.orderWrap}>
                  <OrderCard {...order} />
                </div>
              ))}
              {filtered.length === 0 && (
                <div className={styles.empty}>Không có đơn hàng nào</div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}