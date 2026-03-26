import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SearchBox from '../components/SearchBox/SearchBox';
import { productService, type ProductCategory, type AspBrand } from '../../services/productService';
import { useUiStore } from '../../stores/uiStore';
import styles from './HomePage.module.css';

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

const CategoryIcon = ({ color = '#7F00FF' }: { color?: string }) => (
  <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
    <rect width="34" height="40" rx="4" fill={color} fillOpacity="0.15" />
    <rect x="8" y="8" width="18" height="24" rx="2" fill={color} />
  </svg>
);

function CategoryCard({
  category, color, onClick,
}: {
  category: ProductCategory; color: string; onClick: () => void;
}) {
  return (
    <div className={styles.catCard} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className={styles.catIconWrap}>
        {category.image_128 ? (
          <img
            src={`data:image/png;base64,${category.image_128}`}
            alt={category.name}
            style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <CategoryIcon color={color} />
        )}
      </div>
      <span className={styles.catLabel}>{category.name}</span>
    </div>
  );
}

// ── Category skeleton ──────────────────────────────────────
function CategorySkeleton() {
  return (
    <div className={styles.catCard} style={{ opacity: 0.4 }}>
      <div className={styles.catIconWrap}>
        <div style={{ width: 40, height: 40, background: '#e0e0e0', borderRadius: 6 }} />
      </div>
      <div style={{ width: 60, height: 12, background: '#e0e0e0', borderRadius: 4, marginTop: 6 }} />
    </div>
  );
}

// ── Brand card ─────────────────────────────────────────────
function BrandCard({ brand, onClick }: { brand: AspBrand; onClick: () => void }) {
  return (
    <div className={styles.brandCard} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className={styles.brandInfo}>
        <div className={styles.brandLogoWrap}>
          {brand.image_128
            ? <img src={`data:image/png;base64,${brand.image_128}`} alt={brand.name}
                style={{ width: 64, height: 64, objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            : <div style={{ width: 64, height: 64, background: '#f4f6f8', borderRadius: 8 }} />
          }
        </div>
        <div className={styles.brandTextGroup}>
          <span className={styles.brandName}>{brand.name}</span>
          <span className={styles.brandDesc} style={{ whiteSpace: 'pre-line' }}>
            {brand.description || ''}
          </span>
        </div>
      </div>
      <button className={styles.viewDetailBtn} onClick={onClick}>
        <span className={styles.viewDetailText}>Xem chi tiết</span>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const showToast = useUiStore(s => s.showToast);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<AspBrand[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [catsResult, brndsResult] = await Promise.allSettled([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        if (!cancelled) {
          const cats = catsResult.status === 'fulfilled' ? catsResult.value : [];
          const brnds = brndsResult.status === 'fulfilled' ? brndsResult.value : [];
          setCategories(cats.filter(c => c.name.toLowerCase() !== 'all' && c.name !== 'Tất cả').slice(0, 12));
          setBrands(brnds);
        }
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const handleCategoryClick = (categoryId: number) => navigate(`/catalog?category=${categoryId}`);
  const handleBrandClick = (brandId: number) => navigate(`/catalog?brand=${brandId}`);

  const row1 = categories.slice(0, 6);
  const row2 = categories.slice(6, 12);

  return (
    <div className={styles.page}>
      <Header />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <SearchBox onSearch={p => console.log(p)} />
          <div className={styles.heroImage} />
        </div>
      </section>

      {/* Category */}
      <section className={styles.category}>
        <h2 className={styles.sectionTitle}>Danh mục</h2>
        <div className={styles.catGrid}>
          {loadingCats ? (
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
                  <CategoryCard
                    key={c.id}
                    category={c}
                    color={CAT_COLORS[i % CAT_COLORS.length]}
                    onClick={() => handleCategoryClick(c.id)}
                  />
                ))}
              </div>
              {row2.length > 0 && (
                <div className={styles.catRow}>
                  {row2.map((c, i) => (
                    <CategoryCard
                      key={c.id}
                      category={c}
                      color={CAT_COLORS[(i + 6) % CAT_COLORS.length]}
                      onClick={() => handleCategoryClick(c.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Brands */}
      <section className={styles.brands}>
        <h2 className={styles.sectionTitle}>Thương hiệu</h2>
        <div className={styles.brandRow}>
          {brands.length === 0
            ? <p style={{ color: '#888' }}>Chưa có thương hiệu nào.</p>
            : brands.map(b => (
                <BrandCard key={b.id} brand={b} onClick={() => handleBrandClick(b.id)} />
              ))
          }
        </div>
      </section>

      <Footer />
    </div>
  );
}