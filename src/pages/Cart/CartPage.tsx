
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductListHeader from '../components/ProductListHeader/ProductListHeader';
import SellerProductGroup from '../components/SellerProductGroup/SellerProductGroup';
import ShoppingCard from '../components/ShoppingCard/ShoppingCard';
import VoucherModal from '../components/VoucherModal/VoucherModal';
import CartSummary from '../components/CartSummary/CartSummary';
import { useCartStore, type CartItem } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { CART_TEXT } from './constants';
import styles from './CartPage.module.css';

interface CartPageProps {
  showDealAndGift?: boolean;
}

// CartItem → ShoppingCardData
const toCardData = (item: CartItem) => ({
  name: item.name,
  sku: `PT-${item.productId}`,
  img: item.image
    ? `data:image/png;base64,${item.image}`
    : '/images/product-placeholder.png',
  quantity: item.qty,
  currentPrice: item.price,
  originalPrice: item.price,   
  promoText: undefined,
});


function groupByMock(items: CartItem[]): { sellerId: string; location: string; items: CartItem[] }[] {
  if (!items.length) return [];
  return [{ sellerId: 'D|VN-HANOI|001', location: 'Hồ Chí Minh', items }];
}

export default function CartPage({ showDealAndGift = false }: CartPageProps) {
  const navigate = useNavigate();
  const { items, removeItem, updateQty } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const showToast = useUiStore(s => s.showToast);

  const [allChecked, setAllChecked] = useState(false);
  const [groupChecked, setGroupChecked] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState('');

  const groups = useMemo(() => groupByMock(items), [items]);

  // ── Check all ──────────────────────────────────────────
  const handleCheckAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    const newChecked: Record<string, boolean> = {};
    const newGroup: Record<string, boolean> = {};
    groups.forEach(g => {
      newGroup[g.sellerId] = next;
      g.items.forEach(item => { newChecked[item.productId] = next; });
    });
    setCheckedItems(newChecked);
    setGroupChecked(newGroup);
  };

  const handleGroupCheck = (sellerId: string, groupItems: CartItem[]) => {
    const next = !groupChecked[sellerId];
    setGroupChecked(prev => ({ ...prev, [sellerId]: next }));
    const newChecked = { ...checkedItems };
    groupItems.forEach(item => { newChecked[item.productId] = next; });
    setCheckedItems(newChecked);
  };

  const toggleItem = (productId: number) => {
    setCheckedItems(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  // ── Summary rows (tính từ checked items hoặc tất cả) ──
  const checkedTotal = useMemo(() => {
    const selected = items.filter(i => checkedItems[i.productId]);
    const base = selected.length > 0 ? selected : items;
    return base.reduce((sum, i) => sum + i.price * i.qty, 0);
  }, [items, checkedItems]);

  const summaryRows = [
    { label: 'Tổng số tiền', value: checkedTotal.toLocaleString('vi-VN') + 'đ' },
    ...(appliedVoucher ? [{ label: 'Voucher', value: '— ' + appliedVoucher, highlight: true }] : []),
  ];

  // ── Checkout ──────────────────────────────────────────
  const handleCheckout = () => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để thanh toán', 'warning');
      return;
    }
    const selectedItems = items.filter(i => checkedItems[i.productId]);
    if (!selectedItems.length && !items.length) {
      showToast('Giỏ hàng trống', 'warning');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>{CART_TEXT.pageTitle}</h1>
      </div>

      <div className={styles.container}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#888' }}>
            <p style={{ fontSize: 18, marginBottom: 16 }}>Giỏ hàng của bạn đang trống</p>
            <button
              onClick={() => navigate('/catalog')}
              style={{ padding: '10px 24px', background: '#F26522', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Left: Products */}
            <div className={styles.leftCol}>
              <ProductListHeader
                checked={allChecked}
                onCheck={handleCheckAll}
              />

              {groups.map(g => (
                <SellerProductGroup
                  key={g.sellerId}
                  sellerId={g.sellerId}
                  location={g.location}
                  checked={!!groupChecked[g.sellerId]}
                  onCheck={() => handleGroupCheck(g.sellerId, g.items)}
                  voucherLabel="Voucher của nhà bán"
                  onVoucherClick={() => setVoucherModalOpen(true)}
                >
                  {g.items.map(item => (
                    <ShoppingCard
                      key={item.productId}
                      data={toCardData(item)}
                      checked={!!checkedItems[item.productId]}
                      onCheck={() => toggleItem(item.productId)}
                      onQuantityChange={qty => updateQty(item.productId, qty)}
                      onDelete={() => {
                        removeItem(item.productId);
                        showToast(`Đã xóa "${item.name}" khỏi giỏ hàng`, 'info');
                      }}
                    />
                  ))}
                </SellerProductGroup>
              ))}
            </div>

            {/* Right: Summary */}
            <div className={styles.rightCol}>
              <CartSummary
                rows={summaryRows}
                totalPrice={checkedTotal}
                showVoucherInput={showDealAndGift}
                onApplyVoucher={code => {
                  setAppliedVoucher(code);
                  showToast('Áp dụng voucher thành công!', 'success');
                }}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />

      <VoucherModal
        open={voucherModalOpen}
        vouchers={[
          { discount: 'Giảm 10%', minOrder: 'Đơn Tối Thiểu 300.000.000đ', maxDiscount: 'Giảm tối đa 100.000đ', expiry: 'HSD: 31.01.2024', eligible: false },
          { discount: 'Giảm 10%', minOrder: 'Đơn Tối Thiểu 300.000.000đ', maxDiscount: 'Giảm tối đa 100.000đ', expiry: 'HSD: 31.01.2024', eligible: true },
        ]}
        onClose={() => setVoucherModalOpen(false)}
        onConfirm={() => setVoucherModalOpen(false)}
      />
    </div>
  );
}