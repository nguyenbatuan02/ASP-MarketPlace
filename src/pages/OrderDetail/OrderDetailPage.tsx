import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OrderCard from '../components/OrderCard/OrderCard';
import { orderService, type OdooOrderDetail } from '../../services/orderService';
import { callKw } from '../../api/odoo';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import styles from './OrderDetailPage.module.css';

const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"
      stroke="#212B36" strokeWidth="1.5" fill="none" />
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

function PaymentSummary({ count, subtotal, total, paymentMethod }: {
  count: number; subtotal: string; total: string; paymentMethod: string;
}) {
  return (
    <div className={styles.paymentCard}>
      <span className={styles.paymentTitle}>
        Thanh toán <span className={styles.paymentCount}>({count} sản phẩm)</span>
      </span>
      <div className={styles.paymentRows}>
        <div className={styles.paymentRow}>
          <span className={styles.paymentLabel}>Tổng số tiền</span>
          <span className={styles.paymentValue}>{subtotal}</span>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.paymentRow}>
        <span className={styles.paymentLabelBold}>Số tiền thanh toán</span>
        <span className={styles.paymentValueBold}>{total}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.methodSection}>
        <span className={styles.methodTitle}>PHƯƠNG THỨC THANH TOÁN</span>
        <div className={styles.methodRow}>
          <button className={styles.radioBtn}><RadioIcon checked /></button>
          <span className={styles.methodLabel}>{paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[300, 200, 150, 250].map((w, i) => (
        <div key={i} style={{ width: w, height: 16, background: '#e0e0e0', borderRadius: 4 }} />
      ))}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const showToast = useUiStore(s => s.showToast);

  const [order, setOrder] = useState<OdooOrderDetail | null>(null);
  const [address, setAddress] = useState({ name: '', phone: '', address: '' });
  const [images, setImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/'); return; }
    if (!id) return;
    const orderId = Number(id);
    if (isNaN(orderId)) { navigate('/orders'); return; }

    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Order detail + lines
        const detail = await orderService.getOrderById(orderId);
        if (cancelled) return;
        setOrder(detail);

        // 2. Địa chỉ từ partner của order
        const partners = await callKw<{ name: string; phone: string | false; street: string | false; city: string | false }[]>(
          'res.partner', 'search_read',
          [[['id', '=', detail.partner_id[0]]]],
          { fields: ['name', 'phone', 'street', 'city'] }
        );
        if (!cancelled && partners.length) {
          const p = partners[0];
          setAddress({
            name: p.name,
            phone: p.phone || '',
            address: [p.street, p.city].filter(Boolean).join(', ') || 'Chưa có địa chỉ',
          });
        }

        // 3. Ảnh sản phẩm (batch theo product_id)
        const productIds = detail.lines.map(l => l.product_id[0]);
        if (productIds.length) {
          // product.product → product_tmpl_id để lấy ảnh
          const variants = await callKw<{ id: number; product_tmpl_id: [number, string] }[]>(
            'product.product', 'search_read',
            [[['id', 'in', productIds]]],
            { fields: ['id', 'product_tmpl_id'] }
          );
          const tmplIds = variants.map(v => v.product_tmpl_id[0]);
          const tmpls = await callKw<{ id: number; image_128: string | false }[]>(
            'product.template', 'search_read',
            [[['id', 'in', tmplIds]]],
            { fields: ['id', 'image_128'] }
          );
          // map product.product id → base64 image
          const tmplImageMap: Record<number, string> = {};
          tmpls.forEach(t => { if (t.image_128) tmplImageMap[t.id] = t.image_128; });
          const imgMap: Record<number, string> = {};
          variants.forEach(v => {
            const img = tmplImageMap[v.product_tmpl_id[0]];
            if (img) imgMap[v.id] = img;
          });
          if (!cancelled) setImages(imgMap);
        }
      } catch {
        if (!cancelled) {
          showToast('Không thể tải thông tin đơn hàng', 'error');
          navigate('/orders');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [id, isLoggedIn]);

  if (loading) return <><Header /><PageSkeleton /><Footer /></>;
  if (!order) return null;

  const totalCount = order.lines.reduce((s, l) => s + l.product_uom_qty, 0);

  const products = order.lines.map(l => ({
    name: l.product_id[1],
    sku: `PT-${l.product_id[0]}`,
    quantity: l.product_uom_qty,
    price: formatPrice(l.price_unit),
    image: images[l.product_id[0]]
      ? `data:image/png;base64,${images[l.product_id[0]]}`
      : undefined,
  }));

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.titleRow}>
            <span className={styles.title}>Thông tin đơn hàng #{order.name}</span>
          </div>

          <div className={styles.layout}>
            <div className={styles.leftCol}>
              <OrderCard
                sellerId="D|VN-HANOI|001"
                location="Hồ Chí Minh"
                status={orderService.getStateLabel(order.state)}
                products={products}
                totalCount={totalCount}
                totalPrice={formatPrice(order.amount_total)}
                note={order.note ? order.note.replace(/<[^>]+>/g, '') : ''}
              />
              <ShippingAddress
                name={address.name}
                phone={address.phone}
                address={address.address}
              />
            </div>

            <PaymentSummary
              count={totalCount}
              subtotal={formatPrice(order.amount_untaxed)}
              total={formatPrice(order.amount_total)}
              paymentMethod="Thanh toán khi nhận hàng"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}