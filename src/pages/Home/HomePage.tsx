import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SearchBox from '../components/SearchBox/SearchBox';
import { BRANDS } from './constants';
import { productService, type ProductCategory } from '../../services/productService';
import { useUiStore } from '../../stores/uiStore';
import styles from './HomePage.module.css';

// ── Màu tuần tự cho icon category ──
const CAT_COLORS = [
  '#7F00FF', '#696CFF', '#FF5630', '#00B8D9',
  '#7F00FF', '#FFAB00', '#36B37E', '#FF5630',
  '#696CFF', '#7F00FF', '#00B8D9', '#FFAB00',
];

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8.3 6l7.4 6-7.4 6" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Category icon (placeholder svg, màu theo index) ──
const CategoryIcon = ({ color = '#7F00FF' }: { color?: string }) => (
  <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
    <rect width="34" height="40" rx="4" fill={color} fillOpacity="0.15" />
    <rect x="8" y="8" width="18" height="24" rx="2" fill={color} />
  </svg>
);

// ── Category card ──
function CategoryCard({ color, label }: { color: string; label: string }) {
  return (
    <div className={styles.catCard}>
      <div className={styles.catIconWrap}>
        <CategoryIcon color={color} />
      </div>
      <span className={styles.catLabel}>{label}</span>
    </div>
  );
}

// ── Category skeleton (loading) ──
function CategorySkeleton() {
  return (
    <div className={styles.catCard} style={{ opacity: 0.4 }}>
      <div className={styles.catIconWrap}>
        <div style={{ width: 34, height: 40, background: '#e0e0e0', borderRadius: 4 }} />
      </div>
      <div style={{ width: 60, height: 12, background: '#e0e0e0', borderRadius: 4, marginTop: 6 }} />
    </div>
  );
}

// ── Brand card ──
function BrandCard({ logo, name, description }: { logo: React.ReactNode; name: string; description: string }) {
  return (
    <div className={styles.brandCard}>
      <div className={styles.brandInfo}>
        <div className={styles.brandLogoWrap}>{logo}</div>
        <div className={styles.brandTextGroup}>
          <span className={styles.brandName}>{name}</span>
          <span className={styles.brandDesc}>{description}</span>
        </div>
      </div>
      <button className={styles.viewDetailBtn}>
        <span className={styles.viewDetailText}>Xem chi tiết</span>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const showToast = useUiStore(s => s.showToast);

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        // Lọc bỏ category gốc "All" hoặc "Tất cả" nếu có, lấy tối đa 12
        const filtered = data
          .filter(c => c.name.toLowerCase() !== 'all' && c.name !== 'Tất cả')
          .slice(0, 12);
        if (!cancelled) setCategories(filtered);
      } catch (err) {
        if (!cancelled) showToast('Không thể tải danh mục', 'error');
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    };
    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  // Chia 2 hàng, mỗi hàng tối đa 6
  const row1 = categories.slice(0, 6);
  const row2 = categories.slice(6, 12);

  return (
    <div className={styles.page}>
      <Header />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <SearchBox onSearch={p => console.log(p)} />
          <div className={styles.heroImage}>
            {/* Replace with <img src="..." alt="hero" /> */}
          </div>
        </div>
      </section>

      {/* Category */}
      <section className={styles.category}>
        <h2 className={styles.sectionTitle}>Danh mục</h2>
        <div className={styles.catGrid}>
          {loadingCats ? (
            // Hiển thị 12 skeleton khi đang load
            <>
              <div className={styles.catRow}>
                {Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}
              </div>
              <div className={styles.catRow}>
                {Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}
              </div>
            </>
          ) : categories.length === 0 ? (
            <p style={{ color: '#888', padding: '16px 0' }}>Chưa có danh mục nào.</p>
          ) : (
            <>
              <div className={styles.catRow}>
                {row1.map((c, i) => (
                  <CategoryCard key={c.id} label={c.name} color={CAT_COLORS[i % CAT_COLORS.length]} />
                ))}
              </div>
              {row2.length > 0 && (
                <div className={styles.catRow}>
                  {row2.map((c, i) => (
                    <CategoryCard key={c.id} label={c.name} color={CAT_COLORS[(i + 6) % CAT_COLORS.length]} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured brands */}
      <section className={styles.brands}>
        <h2 className={styles.sectionTitle}>Thương hiệu</h2>
        <div className={styles.brandRow}>
          {BRANDS.map((b, i) => (
            <BrandCard key={i} logo={b.logo} name={b.name} description={b.description} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}