import { useState } from 'react';
import styles from './ProductDetailTabs.module.css';

interface Tab {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface ProductDetailTabsProps {
  tabs?: Tab[];
}

const defaultContent = (
  <p className={styles.contentText}>
    {`Sử dụng cho xe: \nToyota Innova 2006-2016\nFortune 2.7 02.2012-11.2016 VN ATM\nHilux 3.0 11.2004-07.2011 Philippines MTM\nRanger 2009\nHilux 2.5 07.2011-04.2015 Philippines MTM\nInnova 2.0 02.2012-11.2016 VN ATM\nFortune 2.5 02.2009-02.2012 VN MTM\nHilux 2.7 07.2011-04.2015 MTM`}
  </p>
);

const defaultTabs: Tab[] = [
  { key: 'detail', label: 'Thông tin chi tiết', content: defaultContent },
  { key: 'vehicles', label: 'Danh sách xe', content: <p className={styles.contentText}>Danh sách xe...</p> },
];

export default function ProductDetailTabs({ tabs = defaultTabs }: ProductDetailTabsProps) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div className={styles.wrapper}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${active === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActive(tab.key)}
          >
            <span className={`${styles.tabLabel} ${active === tab.key ? styles.tabLabelActive : ''}`}>
              {tab.label}
            </span>
            {active === tab.key && <div className={styles.tabLine} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.contentFrame}>
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}