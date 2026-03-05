import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogNavbar from '../components/CatalogNavbar/CatalogNavbar';
import ProductItem from '../components/ProductItem/ProductItem';
import { VehicleListInline } from '../components/VehicleList/VehicleList';
import VehicleListModal from '../components/VehicleList/VehicleList';
import { productService, type OdooProduct } from '../../services/productService';
import { useUiStore } from '../../stores/uiStore';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { CATALOG_TEXT, MOCK_FILTERS, MOCK_VEHICLES } from './constants';
import styles from './CatalogPage.module.css';


const ITEMS_PER_PAGE = 12;

const odooImageUrl = (id: number) => `/web/image/product.template/${id}/image_1920`;
const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const toProductItemData = (p: OdooProduct) => ({
  productId: p.id,
  sku: `${p.id}`,
  name: p.name,
  image: odooImageUrl(p.id),
  brandLogo: '',
  rating: 4.5,
  soldCount: '1k+ đã bán',
  sellerCount: 'Đã tìm thấy 9 nơi bán',
  priceRange: formatPrice(p.list_price),
});

// Skeleton card
function ProductSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ width: '100%', paddingTop: '80%', background: '#e0e0e0', borderRadius: 8 }} />
      {[80, 60, 50].map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: 12, background: '#e0e0e0', borderRadius: 4 }} />
      ))}
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
  const brandId = searchParams.get('brand') ? Number(searchParams.get('brand')) : undefined;

  const showToast = useUiStore(s => s.showToast);

  const [searchType, setSearchType] = useState<'parts' | 'vehicle'>('parts');
  const [filters, setFilters] = useState(MOCK_FILTERS);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  // Products state
  const [products, setProducts] = useState<OdooProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // Fetch products — chưa có search, load tất cả có phân trang
  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const [data, count] = await Promise.all([
          brandId
            ? productService.getProductsByBrand(brandId, ITEMS_PER_PAGE, (page - 1) * ITEMS_PER_PAGE)
            : productService.getProducts({ limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE, categoryId }),
          brandId
            ? productService.countProducts({ brandId })
            : productService.countProducts({ categoryId }),
        ]);
        if (!cancelled) { setProducts(data); setTotal(count); }
      } catch {
        if (!cancelled) showToast('Không thể tải danh sách sản phẩm', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, categoryId, brandId]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Chia đôi: nửa đầu = kết quả, nửa sau = phụ tùng thay thế
  const mid = Math.ceil(products.length / 2);
  const searchResults = products.slice(0, mid);
  const replacementParts = products.slice(mid);

  const handleFilterChange = (gi: number, oi: number) => {
    const updated = [...filters];
    updated[gi] = {
      ...updated[gi],
      options: updated[gi].options.map((opt, i) =>
        i === oi ? { ...opt, checked: !opt.checked } : opt
      ),
    };
    setFilters(updated);
  };

  const handleClearFilters = () => {
    setFilters(filters.map(g => ({ ...g, options: g.options.map(o => ({ ...o, checked: false })) })));
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>{CATALOG_TEXT.pageTitle}</h1>
      </div>

      <div className={styles.container}>
        {/* Navbar */}
        <div className={styles.navCol}>
          <CatalogNavbar
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            onSearch={kw => console.log('search:', kw)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main content */}
        <div className={styles.mainCol}>
          {searchType === 'parts' ? (
            <>
              {/* Danh sách sản phẩm */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {CATALOG_TEXT.searchResult}
                  {!loading && <span style={{ fontWeight: 400, fontSize: 14, color: '#637381', marginLeft: 8 }}>({total} sản phẩm)</span>}
                </h2>
              </div>

              <div className={styles.productGrid}>
                {loading
                  ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <div key={i} className={styles.productGridItem}><ProductSkeleton /></div>
                    ))
                  : searchResults.length === 0
                    ? <p style={{ color: '#888', padding: '16px 0' }}>Không có sản phẩm nào.</p>
                    : searchResults.map(p => (
                        <div key={p.id} className={styles.productGridItem}>
                          <ProductItem data={toProductItemData(p)} />
                        </div>
                      ))
                }
              </div>

              {/* Danh sách phụ tùng thay thế */}
              {!loading && replacementParts.length > 0 && (
                <>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{CATALOG_TEXT.replacementParts}</h2>
                  </div>
                  <div className={styles.productGrid}>
                    {replacementParts.map(p => (
                      <div key={p.id} className={styles.productGridItem}>
                        <ProductItem data={toProductItemData(p)} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Phân trang */}
              {!loading && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '24px 0' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={pageBtnStyle(page === 1)}
                  >‹</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce<(number | '...')[]>((acc, n, i, arr) => {
                      if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, i) => n === '...'
                      ? <span key={`e-${i}`} style={{ padding: '0 4px', color: '#637381' }}>...</span>
                      : <button key={n} onClick={() => setPage(n as number)} style={pageBtnStyle(false, page === n)}>{n}</button>
                    )
                  }

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={pageBtnStyle(page === totalPages)}
                  >›</button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Tab vehicle — giữ nguyên mock */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.vehicleFound}</h2>
                <button className={styles.viewMoreBtn} onClick={() => setVehicleModalOpen(true)}>
                  Xem thêm (18 xe)
                </button>
              </div>
              <div className={styles.vehicleListWrap}>
                <VehicleListInline
                  vehicles={MOCK_VEHICLES}
                  selectedIndex={selectedVehicle}
                  onSelect={setSelectedVehicle}
                />
              </div>

              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.partsList}</h2>
              </div>
              <div className={styles.productGrid}>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={styles.productGridItem}><ProductSkeleton /></div>
                    ))
                  : products.map(p => (
                      <div key={p.id} className={styles.productGridItem}>
                        <ProductItem data={toProductItemData(p)} />
                      </div>
                    ))
                }
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      <VehicleListModal
        open={vehicleModalOpen}
        vehicles={MOCK_VEHICLES}
        onClose={() => setVehicleModalOpen(false)}
        onSave={index => { setSelectedVehicle(index); setVehicleModalOpen(false); }}
      />
    </div>
  );
}

// Pagination button style helper
const pageBtnStyle = (disabled: boolean, active = false): React.CSSProperties => ({
  width: 36, height: 36,
  border: active ? '2px solid #696CFF' : '1px solid rgba(0,0,0,0.15)',
  borderRadius: 8,
  background: active ? '#696CFF' : '#fff',
  color: active ? '#fff' : disabled ? '#ccc' : '#212b36',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'Lexend, sans-serif',
  fontSize: 14, fontWeight: active ? 600 : 400,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});