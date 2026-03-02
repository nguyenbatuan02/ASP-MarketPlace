export interface OrderItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  img: string;
}

export interface Order {
  id: string;
  location: string;
  voucher: string;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
}

export const CHECKOUT_TEXT = {
  pageTitle: 'Đặt hàng',
  shippingTitle: 'Địa chỉ giao hàng',
  defaultLabel: 'Mặc định',
  changeLabel: 'Thay đổi',
  messagePlaceholder: 'Lời nhắn',
  messageLabel: 'Lời nhắn dành cho nhà bán',
  totalLabel: (count: number) => `Tổng số tiền (${count} sản phẩm):`,
  summaryTitle: (count: number) => `Sản phẩm đã chọn (${String(count).padStart(2, '0')})`,
  summaryTotal: 'Tổng số tiền',
  paymentTitle: 'PHƯƠNG THỨC THANH TOÁN',
  paymentMethod: 'Thanh toán khi nhận hàng',
  paymentAmount: 'Số tiền thanh toán',
  paymentNote: 'Chưa bao gồm phí giao hàng và các phí liên quan khác.',
  orderButton: 'Đặt hàng',
};

export const MOCK_SHIPPING: ShippingInfo = {
  name: 'Anton Vuong',
  phone: '0123456789',
  address: '68 Ngõ Huế, phường Phố Huế, quận Hai Bà Trưng, thành phố Hà Nội, Việt Nam',
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'DI|VN-HANOI|001',
    location: 'Hồ Chí Minh',
    voucher: 'Đã áp dụng voucher giảm 100.000đ',
    items: [
      { name: 'Lọc gió động cơ JS', sku: '16H9UR7', qty: 1, price: 300000, img: '/images/product-placeholder.png' },
      { name: 'Lọc gió động cơ JS', sku: '16H9UR7', qty: 1, price: 300000, img: '/images/product-placeholder.png' },
    ],
    totalItems: 7,
    totalPrice: 875000,
  },
  {
    id: 'D|VN-HANOI|001',
    location: 'Hồ Chí Minh',
    voucher: 'Đã áp dụng voucher giảm 100.000đ',
    items: [
      { name: 'Lọc gió động cơ JS', sku: '16H9UR7', qty: 1, price: 300000, img: '/images/product-placeholder.png' },
      { name: 'Lọc gió động cơ JS', sku: '16H9UR7', qty: 1, price: 300000, img: '/images/product-placeholder.png' },
    ],
    totalItems: 7,
    totalPrice: 875000,
  },
];

export const MOCK_SUMMARY = {
  totalProducts: 3,
  totalPrice: 525000000,
  paymentPrice: 525000000,
};