import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ShippingAddress from '../components/ShippingAddress/ShippingAddress';
import OrderGroup from '../components/OrderGroup/OrderGroup';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { orderService } from '../../services/orderService';
import { callKw } from '../../api/odoo';
import { type ShippingInfo, type Order } from './constants';
import styles from './CheckoutPage.module.css';

interface PartnerInfo {
  name: string;
  phone: string | false;
  street: string | false;
  city: string | false;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const showToast = useUiStore(s => s.showToast);

  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '', phone: '', address: '',
  });
  const [isPlacing, setIsPlacing] = useState(false);
  const [note, setNote] = useState('');

  // Redirect nếu chưa login hoặc cart trống
  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để đặt hàng', 'warning');
      navigate('/');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isLoggedIn, items.length]);

  // Fetch địa chỉ từ res.partner của user
  useEffect(() => {
    if (!user?.partner_id) return;
    let cancelled = false;
    const fetchPartner = async () => {
      try {
        const result = await callKw<PartnerInfo[]>('res.partner', 'search_read', [
          [['id', '=', user.partner_id]],
        ], { fields: ['name', 'phone', 'street', 'city'] });

        if (!cancelled && result.length) {
          const p = result[0];
          setShipping({
            name: p.name || user.name,
            phone: p.phone || '',
            address: [p.street, p.city].filter(Boolean).join(', ') || 'Chưa có địa chỉ',
          });
        }
      } catch {
        // fallback về thông tin từ authStore
        setShipping({ name: user.name, phone: '', address: 'Chưa có địa chỉ' });
      }
    };
    fetchPartner();
    return () => { cancelled = true; };
  }, [user?.partner_id]);

  // Map cartStore items → Order[] cho OrderGroup
  const orders: Order[] = [{
    id: 'ASP-STORE',
    location: 'Việt Nam',
    voucher: 'Đã áp dụng voucher giảm 100.000đ',
    items: items.map(i => ({
      name: i.name,
      sku: `PT-${i.productId}`,
      qty: i.qty,
      price: i.price,
      img: i.image ? `data:image/png;base64,${i.image}` : '/images/product-placeholder.png',
    })),
    totalItems: items.reduce((s, i) => s + i.qty, 0),
    totalPrice: totalPrice(),
  }];

  // Đặt hàng
  const handlePlaceOrder = async () => {
    if (!user) return;
    setIsPlacing(true);
    try {
      const orderId = await orderService.createOrder({
        partnerId: user.partner_id,
        lines: items.map(i => ({
          productId: i.productId,
          qty: i.qty,
          price: i.price,
        })),
        note,
      });

      await orderService.confirmOrder(orderId);
      clearCart();
      showToast('Đặt hàng thành công!', 'success');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      showToast('Đặt hàng thất bại, vui lòng thử lại', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  const summary = {
    totalProducts: items.reduce((s, i) => s + i.qty, 0),
    totalPrice: totalPrice(),
    paymentPrice: totalPrice(),
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>Đặt hàng</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <ShippingAddress data={shipping} />
            {orders.map((order, i) => (
              <OrderGroup
                key={i}
                order={order}
                onNoteChange={setNote}
              />
            ))}
          </div>

          <div className={styles.rightCol}>
            <OrderSummary
              summary={summary}
              onPlaceOrder={handlePlaceOrder}
              isPlacing={isPlacing}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}