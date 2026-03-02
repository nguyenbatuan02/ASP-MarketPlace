import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HotlineBanner from '../components/HotlineBanner/HotlineBanner';
import SellerProductCard from '../components/SellerProductCard/SellerProductCard';
import ProductDetailTabs from '../components/ProductDetailTabs/ProductDetailTabs';
import ProductItem from '../components/ProductItem/ProductItem';
import { productService, type OdooProduct } from '../../services/productService';
import { callKw } from '../../api/odoo';
import { useUiStore } from '../../stores/uiStore';
import styles from './ProductDetailPage.module.css';
import { useCartStore } from '../../stores/cartStore';

// ── Types ──────────────────────────────────────────────────
interface SupplierInfo {
  id: number;
  partner_id: [number, string];
  price: number;
  min_qty: number;
  delay: number;
}

// ── Icons ──────────────────────────────────────────────────
const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="rgba(0,0,0,0.54)" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="rgba(0,0,0,0.54)" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────
const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + 'đ';

const odooImageUrl = (id: number) =>
  `/web/image/product.template/${id}/image_1920`;

// Build attributes array từ OdooProduct
function buildAttributes(p: OdooProduct) {
  return [
    { label: 'Mã sản phẩm',   value: p.id },
    { label: 'Thương hiệu',   value: 'TOYOTA' },
    { label: 'Nước sản xuất', value: 'Nhật Bản' },
    { label: 'Danh mục',      value: p.categ_id?.[1] ?? '—' },
    { label: 'Đơn vị',        value: 'Cái' },
    { label: 'Dung tích',     value: '100ml' },
    { label: 'Tồn kho',       value: `${p.qty_available ?? 0}` },
  ];
}

// ── Skeleton ───────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ padding: '32px 24px' }}>
      {[200, 120, 80, 160].map((w, i) => (
        <div key={i} style={{
          width: w, height: 16, background: '#e0e0e0',
          borderRadius: 4, marginBottom: 16, opacity: 0.5,
        }} />
      ))}
    </div>
  );
}

// ── Section header ─────────────────────────────────────────
function SectionHeader({ title, showViewAll = false }: { title: string; showViewAll?: boolean }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionTitle}>{title}</span>
      {showViewAll && (
        <button className={styles.viewAllBtn}>
          <span className={styles.viewAllText}>Xem tất cả</span>
        </button>
      )}
    </div>
  );
}

// ── Carousel ───────────────────────────────────────────────
function ProductCarousel({ products }: { products: OdooProduct[] }) {
  const [offset, setOffset] = useState(0);
  const visible = 3;
  const canPrev = offset > 0;
  const canNext = offset + visible < products.length;

  const toProductItemData = (p: OdooProduct) => ({
    productId: p.id,
    sku: `${p.id}`,
    image: odooImageUrl(p.id),
    brandLogo: '',
    name: p.name,
    rating: 4.5,
    soldCount: '1k+ đã bán',
    sellerCount: 'Tìm thấy 9 nơi bán',
    priceRange: formatPrice(p.list_price),
  });

  return (
    <div className={styles.carousel}>
      <button className={styles.iconBtn} onClick={() => setOffset(o => o - 1)} disabled={!canPrev}>
        <ChevronLeftIcon />
      </button>
      <div className={styles.carouselTrack}>
        {products.slice(offset, offset + visible).map(p => (
          <div key={p.id} className={styles.carouselItem}>
            <ProductItem data={toProductItemData(p)} />
          </div>
        ))}
      </div>
      <button className={styles.iconBtn} onClick={() => setOffset(o => o + 1)} disabled={!canNext}>
        <ChevronRightIcon />
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useUiStore(s => s.showToast);
  const addItem = useCartStore(s => s.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  };

  const [product, setProduct]       = useState<OdooProduct | null>(null);
  const [suppliers, setSuppliers]   = useState<SupplierInfo[]>([]);
  const [related, setRelated]       = useState<OdooProduct[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAll, setShowAll]       = useState(false);

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    if (isNaN(productId)) { navigate('/catalog'); return; }

    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Fetch product detail
        const p = await productService.getProductById(productId);
        if (cancelled) return;
        setProduct(p);

        // 2. Fetch supplier info (danh sách nơi bán)
        const sup = await callKw<SupplierInfo[]>('product.supplierinfo', 'search_read', [
          [['product_tmpl_id', '=', productId]],
        ], { fields: ['id', 'partner_id', 'price', 'min_qty', 'delay'] });
        if (!cancelled) setSuppliers(sup);

        // 3. Fetch sản phẩm liên quan (cùng category)
        const rel = await productService.getProducts({
          categoryId: p.categ_id?.[0],
          limit: 9,
        });
        if (!cancelled) setRelated(rel.filter(r => r.id !== productId));
      } catch (err) {
        if (!cancelled) {
          showToast('Không thể tải thông tin sản phẩm', 'error');
          navigate('/');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [id]);

  // Build tabs từ description Odoo
  const buildTabs = (p: OdooProduct) => [
    {
      key: 'detail',
      label: 'Thông tin chi tiết',
      content: (
        <p className={styles.contentText} style={{ whiteSpace: 'pre-line' }}>
          {p.description_sale || p.description || 'Chưa có thông tin chi tiết.'}
        </p>
      ),
    },
    {
      key: 'vehicles',
      label: 'Danh sách xe',
      content: <p className={styles.contentText}>Chưa có danh sách xe áp dụng.</p>,
    },
  ];

  // Map supplier → SellerProductCard props
  const toSellerProps = (s: SupplierInfo, idx: number) => ({
    promotionText: 'Mua 10 sản phẩm giảm giá 15%',
    productCode: `D|VN|HANOI|${String(idx + 1).padStart(3, '0')}`,
    rating: 4.5,
    soldCount: '1k+ đã bán',
    location: 'Hồ Chí Minh',
    currentPrice: formatPrice(s.price),
    originalPrice: formatPrice(s.price * 1.1),
  });

  const visibleSellers = showAll ? suppliers : suppliers.slice(0, 6);
  const row1 = visibleSellers.slice(0, 3);
  const row2 = visibleSellers.slice(3, 6);

  // Chia related thành OE (nửa đầu) và replace (nửa sau)
  const mid = Math.ceil(related.length / 2);
  const oeProducts      = related.slice(0, mid);
  const replaceProducts = related.slice(mid);

  if (loading) return <><Header /><PageSkeleton /><Footer /></>;
  if (!product) return null;

  return (
    <div className={styles.page}>
      <Header />

      {/* Title */}
      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>{product.name}</h1>
      </div>

      <div className={styles.container}>

        {/* Frame 1 — Image + info */}
        <div className={styles.frame1}>
          <div className={styles.imageCard}>
            <img
              src={odooImageUrl(product.id)}
              alt={product.name}
              className={styles.productImage}
              onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
            />
            <div className={styles.hotlineWrap}><HotlineBanner /></div>
          </div>

          <div className={styles.infoCol}>
            <div className={styles.infoInner}>
              <h2 className={styles.productName}>{product.name}</h2>
              <div className={styles.attrList}>
                {buildAttributes(product).map((attr, i) => (
                  <div key={i} className={styles.attrRow}>
                    <span className={styles.attrLabel}>{attr.label}</span>
                    <span className={styles.attrValue}>{attr.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    padding: '12px 28px',
                    background: '#696CFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Frame 2 — Seller heading */}
        {suppliers.length > 0 && (
          <div className={styles.frame2}>
            <span className={styles.sectionTitle}>Danh sách sản phẩm bán</span>
          </div>
        )}

        {/* Frame 3 — Seller cards */}
        {suppliers.length > 0 && (
          <div className={styles.frame3}>
            <div className={styles.sellerRow}>
              {row1.map((s, i) => <SellerProductCard key={s.id} {...toSellerProps(s, i)} />)}
            </div>
            {row2.length > 0 && (
              <div className={styles.sellerRow}>
                {row2.map((s, i) => <SellerProductCard key={s.id} {...toSellerProps(s, i + 3)} />)}
              </div>
            )}
            {suppliers.length > 6 && (
              <div className={styles.viewMoreWrap}>
                <button className={styles.viewMoreBtn} onClick={() => setShowAll(v => !v)}>
                  <span className={styles.viewMoreText}>
                    {showAll ? 'Thu gọn' : `Xem thêm (${suppliers.length - 6})`}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Frame 4 — Tabs */}
        <div className={styles.frame4}>
          <ProductDetailTabs tabs={buildTabs(product)} />
        </div>

        {/* Frame 5+6 — OE products */}
        {oeProducts.length > 0 && (
          <>
            <div className={styles.frame5}>
              <SectionHeader title="Danh sách OE thay thế" showViewAll />
            </div>
            <div className={styles.frame6}>
              <ProductCarousel products={oeProducts} />
            </div>
          </>
        )}

        {/* Frame 7+8 — Replace products */}
        {replaceProducts.length > 0 && (
          <>
            <div className={styles.frame7}>
              <SectionHeader title="Danh sách sản phẩm thay thế" showViewAll />
            </div>
            <div className={styles.frame8}>
              <ProductCarousel products={replaceProducts} />
            </div>
          </>
        )}

      </div>

      <Footer />
    </div>
  );
}