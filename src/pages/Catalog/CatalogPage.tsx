import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CatalogNavbar from '../components/CatalogNavbar/CatalogNavbar';
import ProductItem from '../components/ProductItem/ProductItem';
import { VehicleListInline } from '../components/VehicleList/VehicleList';
import VehicleListModal from '../components/VehicleList/VehicleList';
import { productService, type OdooProduct } from '../../services/productService';
import { fleetService, type FleetVehicle } from '../../services/fleetService';
import { useUiStore } from '../../stores/uiStore';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { CATALOG_TEXT, MOCK_FILTERS } from './constants';
import type { VehicleItemData } from '../components/VehicleItem/VehicleItem';
import styles from './CatalogPage.module.css';

const ITEMS_PER_PAGE = 12;

const odooImageUrl = (id: number) => `/web/image/product.template/${id}/image_1920`;
const formatPrice   = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const toProductItemData = (p: OdooProduct) => ({
  productId: p.id,
  sku: p.global_code || `${p.id}`,
  name: p.name,
  image: odooImageUrl(p.id),
  brandLogo: '',
  rating: 4.5,
  soldCount: '1k+ đã bán',
  sellerCount: 'Đã tìm thấy 9 nơi bán',
  priceRange: formatPrice(p.list_price),
});

const toVehicleItemData = (v: FleetVehicle): VehicleItemData => ({
  title: v.name,
  subtitle: v.model_id ? v.model_id[1] : '',
  specs: [
    v.model_year  ? `Năm ${v.model_year}` : '',
    v.fuel_type   ? `Nhiên liệu: ${v.fuel_type}` : '',
    v.power       ? `${v.power} CV` : '',
    v.license_plate ? `Biển số: ${v.license_plate}` : '',
  ].filter(Boolean).join(' · '),
  image: '/images/vehicle-placeholder.png',
});

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
  const brandId    = searchParams.get('brand')    ? Number(searchParams.get('brand'))    : undefined;
  const codeQuery  = searchParams.get('code')     ?? undefined;

  // Params từ SearchBox homepage
  const vinParam     = searchParams.get('vin')     ?? undefined;
  const brandIdParam = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : undefined;
  const modelIdParam = searchParams.get('modelId') ? Number(searchParams.get('modelId')) : undefined;
  const yearParam    = searchParams.get('year')    ? Number(searchParams.get('year'))    : undefined;

  const navigate  = useNavigate();
  const showToast = useUiStore(s => s.showToast);

  const [searchType, setSearchType] = useState<'parts' | 'vehicle'>('parts');
  const [filters, setFilters]       = useState(MOCK_FILTERS);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle]   = useState(0);

  // Products state
  const [products, setProducts] = useState<OdooProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);

  // Vehicle search state
  const [vehicles,        setVehicles]        = useState<FleetVehicle[]>([]);
  const [vehicleLoading,  setVehicleLoading]  = useState(false);
  const [vehicleSearched, setVehicleSearched] = useState(false); 

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [data, count] = await Promise.all([
          codeQuery
            ? productService.searchByCode(codeQuery)
            : brandId
              ? productService.getProductsByBrand(brandId, ITEMS_PER_PAGE, (page - 1) * ITEMS_PER_PAGE)
              : productService.getProducts({ limit: ITEMS_PER_PAGE, offset: (page - 1) * ITEMS_PER_PAGE, categoryId }),
          codeQuery
            ? Promise.resolve(0)
            : brandId
              ? productService.countProducts({ brandId })
              : productService.countProducts({ categoryId }),
        ]);
        if (!cancelled) { setProducts(data); setTotal(codeQuery ? data.length : count); }
      } catch {
        if (!cancelled) showToast('Không thể tải danh sách sản phẩm', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [page, categoryId, brandId, codeQuery]);

  useEffect(() => {
    if (!vinParam && !brandIdParam && !modelIdParam && !yearParam) return;
    setSearchType('vehicle');
    doVehicleSearch({
      vin:     vinParam,
      brandId: brandIdParam,
      modelId: modelIdParam,
      year:    yearParam,
    });
  }, [vinParam, brandIdParam, modelIdParam, yearParam]);

 
  const handleVehicleFilter = (opts: {
    vin?: string; brandId?: number; modelId?: number; year?: number;
  }) => {
    const qs = new URLSearchParams();
    if (opts.vin)     qs.set('vin',     opts.vin);
    if (opts.brandId) qs.set('brandId', String(opts.brandId));
    if (opts.modelId) qs.set('modelId', String(opts.modelId));
    if (opts.year)    qs.set('year',    String(opts.year));
    navigate(`/catalog?${qs.toString()}`);
  };

  const doVehicleSearch = async (opts: {
    vin?: string; brandId?: number; modelId?: number; year?: number;
  }) => {
    setVehicleLoading(true);
    setVehicleSearched(true);
    setSelectedVehicle(0);
    try {
      const results = opts.vin
        ? await fleetService.searchByVin(opts.vin)
        : await fleetService.searchByFilter({ brandId: opts.brandId, modelId: opts.modelId, year: opts.year });
      const limited = results.slice(0, 2);
      setVehicles(results);       
      if (limited.length > 0) {
        setLoading(true);
        try {
          const [data, count] = await Promise.all([
            productService.getProducts({ limit: ITEMS_PER_PAGE, offset: 0 }),
            productService.countProducts({}),
          ]);
          setProducts(data);
          setTotal(count);
          setPage(1);
        } finally {
          setLoading(false);
        }
      }
    } catch {
      showToast('Không thể tìm kiếm xe', 'error');
    } finally {
      setVehicleLoading(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const mid             = Math.ceil(products.length / 2);
  const searchResults   = products.slice(0, mid);
  const replacementParts = products.slice(mid);

  const vehicleItems = vehicles.map(toVehicleItemData);

  const handleFilterChange = (gi: number, oi: number) => {
    const updated = [...filters];
    updated[gi] = {
      ...updated[gi],
      options: updated[gi].options.map((opt, i) => i === oi ? { ...opt, checked: !opt.checked } : opt),
    };
    setFilters(updated);
  };

  const handleClearFilters = () =>
    setFilters(filters.map(g => ({ ...g, options: g.options.map(o => ({ ...o, checked: false })) })));

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>{CATALOG_TEXT.pageTitle}</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.navCol}>
          <CatalogNavbar
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            onSearch={kw => console.log('search:', kw)}
            onVehicleFilter={handleVehicleFilter}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className={styles.mainCol}>
          {searchType === 'parts' ? (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {CATALOG_TEXT.searchResult}
                  {!loading && (
                    <span style={{ fontWeight: 400, fontSize: 14, color: '#637381', marginLeft: 8 }}>
                      ({total} sản phẩm)
                    </span>
                  )}
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

              {!loading && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '24px 0' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={pageBtnStyle(page === 1)}>‹</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce<(number | '...')[]>((acc, n, i, arr) => {
                      if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                      acc.push(n); return acc;
                    }, [])
                    .map((n, i) => n === '...'
                      ? <span key={`e-${i}`} style={{ padding: '0 4px', color: '#637381' }}>...</span>
                      : <button key={n} onClick={() => setPage(n as number)} style={pageBtnStyle(false, page === n)}>{n}</button>
                    )}

                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={pageBtnStyle(page === totalPages)}>›</button>
                </div>
              )}
            </>

          ) : (
            /* ── Vehicle tab ── */
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.vehicleFound}</h2>
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => vehicles.length > 2 ? setVehicleModalOpen(true) : undefined}
                  style={{ cursor: vehicles.length > 2 ? 'pointer' : 'default' }}
                >
                  {vehicles.length > 2
                    ? `Xem thêm (${vehicles.length} xe)`
                    : `(${vehicles.length} xe)`}
                </button>
              </div>

              <div className={styles.vehicleListWrap}>
                {vehicleLoading ? (
                  <p style={{ color: '#888', padding: '16px 0' }}>Đang tìm kiếm xe...</p>
                ) : vehicleSearched && vehicleItems.length === 0 ? (
                  <p style={{ color: '#888', padding: '16px 0' }}>Không tìm thấy xe phù hợp.</p>
                ) : (
                  <VehicleListInline
                    vehicles={vehicleItems.slice(0, 2)}
                    selectedIndex={selectedVehicle}
                    onSelect={setSelectedVehicle}
                  />
                )}
              </div>

              {/* Parts list — chỉ hiện khi đã có xe */}
              {vehicleSearched && vehicleItems.length > 0 && (
                <>
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
            </>
          )}
        </div>
      </div>

      <Footer />

      <VehicleListModal
        open={vehicleModalOpen}
        vehicles={vehicleItems}
        onClose={() => setVehicleModalOpen(false)}
        onSave={idx => { setSelectedVehicle(idx); setVehicleModalOpen(false); }}
      />
    </div>
  );
}

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