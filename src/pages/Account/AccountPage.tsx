import { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AccountInfo from '../components/AccountInfo/AccountInfo';
import AddressManager from '../components/AddressManager/AddressManager';
import ChangePassword from '../components/ChangePassword/ChangePassword';
import BusinessInfo from '../components/BusinessInfo/BusinessInfo';
import { MOCK_ADDRESSES, MOCK_ACCOUNT, MOCK_BUSINESS } from './constants';
import styles from './AccountPage.module.css';

type TabKey = 'account' | 'address' | 'password' | 'business';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'account',  label: 'Tài khoản' },
  { key: 'address',  label: 'Quản lý địa chỉ' },
  { key: 'password', label: 'Đổi mật khẩu' },
  { key: 'business', label: 'Thông tin doanh nghiệp' },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('account');

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <div className={styles.inner}>

          {/* Title */}
          <div className={styles.titleRow}>
            <span className={styles.title}>Tài khoản của tôi</span>
          </div>

          {/* Content box */}
          <div className={styles.contentBox}>

            {/* Tab bar */}
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

            {/* Tab content */}
            <div className={styles.tabContent}>
              {activeTab === 'account' && (
                <AccountInfo
                  initialData={MOCK_ACCOUNT}
                  onChange={d => console.log('account:', d)}
                />
              )}
              {activeTab === 'address' && (
                <AddressManager initialAddresses={MOCK_ADDRESSES} />
              )}
              {activeTab === 'password' && (
                <ChangePassword
                  onCancel={() => console.log('cancelled')}
                  onSave={(o, n) => console.log('pw:', o, n)}
                />
              )}
              {activeTab === 'business' && (
                <BusinessInfo
                  initialData={MOCK_BUSINESS}
                  bizAddress="68 Ngõ Huế, phường Phố Huế, quận Hai Bà Trưng, thành phố Hà Nội, Việt Nam"
                  onChange={d => console.log('business:', d)}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}