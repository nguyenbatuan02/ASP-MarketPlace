import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import OrderCard from '../components/OrderCard/OrderCard';
import { TABS } from './constants';
import { orderService, type OdooOrderLine } from '../../services/orderService';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { callKw } from '../../api/odoo';
import styles from './OrderListPage.module.css';

const STATE_TO_TAB: Record<string, string> = {
  draft:  'pending',
  sent:   'pending',
  sale:   'pickup',
  done:   'delivered',
  cancel: 'cancelled',
};

const formatPrice = (n: number) => n.toLocaleString('vi-VN') + 'đ';

function OrderSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[200, 140, 100].map((w, i) => (
        <div key={i} style={{ width: w, height: 14, background: '#e0e0e0', borderRadius: 4 }} />
      ))}
    </div>
  );
}

interface OrderRow {
  orderId: number;
  sellerId: string;
  location: string;
  status: string;
  statusKey: string;
  products: { name: string; sku: string; quantity: number; price: string; image?: string }[];
  totalCount: number;
  totalPrice: string;
}

export default function OrderListPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const showToast = useUiStore(s => s.showToast);

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để xem đơn hàng', 'warning');
      navigate('/');
      return;
    }
    if (!user?.partner_id) return;

    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        // 1. Lấy danh sách orders
        const odooOrders = await orderService.getMyOrders(user.partner_id);
        if (cancelled) return;

        // 2. Lấy tất cả order lines của các orders này 1 lần (batch)
        const orderIds = odooOrders.map(o => o.id);
        const lines = orderIds.length > 0
          ? await callKw<OdooOrderLine[]>('sale.order.line', 'search_read', [
              [['order_id', 'in', orderIds]],
            ], {
              fields: ['order_id', 'product_id', 'product_template_id', 'name', 'product_uom_qty', 'price_unit', 'price_total'],
            })
          : [];

        // 3. Lấy ảnh theo product_template_id (batch)
        const tmplIds = [...new Set(lines.map(l => (l as any).product_template_id?.[0]).filter(Boolean))];
        const tmplImages: Record<number, string> = {};
        if (tmplIds.length > 0) {
          const tmpls = await callKw<{ id: number; image_128: string | false }[]>(
            'product.template', 'search_read',
            [[['id', 'in', tmplIds]]],
            { fields: ['id', 'image_128'] }   // image_128 nhỏ hơn, load nhanh hơn
          );
          tmpls.forEach(t => { if (t.image_128) tmplImages[t.id] = t.image_128; });
        }

        if (cancelled) return;

        // 3. Group lines theo order_id
        const linesByOrder: Record<number, OdooOrderLine[]> = {};
        lines.forEach(l => {
          const oid = (l as any).order_id[0] as number;
          if (!linesByOrder[oid]) linesByOrder[oid] = [];
          linesByOrder[oid].push(l);
        });

        // 4. Build OrderRow[]
        const rows: OrderRow[] = odooOrders.map(o => {
          const orderLines = linesByOrder[o.id] ?? [];
          return {
            orderId: o.id,
            sellerId: o.name,
            location: 'Hồ Chí Minh',
            status: orderService.getStateLabel(o.state),
            statusKey: STATE_TO_TAB[o.state] ?? 'all',
            products: orderLines.map(l => {
              const tmplId = (l as any).product_template_id?.[0];
              return {
                name: l.product_id[1],   
                sku: `PT-${l.product_id[0]}`,
                quantity: l.product_uom_qty,
                price: formatPrice(l.price_unit),
                image: tmplId && tmplImages[tmplId]
                  ? `data:image/png;base64,${tmplImages[tmplId]}`
                  : undefined,
              };
            }),
            totalCount: orderLines.reduce((s, l) => s + l.product_uom_qty, 0),
            totalPrice: formatPrice(o.amount_total),
          };
        });

        setOrders(rows);
      } catch {
        if (!cancelled) showToast('Không thể tải danh sách đơn hàng', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => { cancelled = true; };
  }, [user?.partner_id, isLoggedIn]);

  const filtered = activeTab === 'all'
    ? orders
    : orders.filter(o => o.statusKey === activeTab);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.titleRow}>
            <span className={styles.title}>Đơn mua</span>
          </div>

          <div className={styles.contentBox}>
            {/* Tabs */}
            <div className={styles.tabBar}>
              {TABS.map(tab => {
                const count = tab.key === 'all' ? 0 : orders.filter(o => o.statusKey === tab.key).length;
                return (
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
                );
              })}
            </div>

            {/* Order list */}
            <div className={styles.orderList}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <div className={styles.empty}>Không có đơn hàng nào</div>
              ) : (
                filtered.map(order => (
                  <div
                    key={order.orderId}
                    className={styles.orderWrap}
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <OrderCard
                      sellerId={order.sellerId}
                      location={order.location}
                      status={order.status}
                      products={order.products}
                      totalCount={order.totalCount}
                      totalPrice={order.totalPrice}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}