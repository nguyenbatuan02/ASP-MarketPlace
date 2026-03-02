import type { OrderCardProps } from '../components/OrderCard/OrderCard';

export const TABS = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'pending',    label: 'Chờ xác nhận' },
  { key: 'pickup',     label: 'Chờ lấy hàng' },
  { key: 'shipping',   label: 'Chờ giao hàng' },
  { key: 'delivered',  label: 'Đã giao' },
  { key: 'cancelled',  label: 'Đã huỷ' },
  { key: 'returned',   label: 'Trả hàng' },
];

const SAMPLE_PRODUCTS = [
  { name: 'Lọc gió động cơ JS', sku: '16H9UR7', quantity: 1, price: '300.000đ' },
  { name: 'Lọc gió động cơ JS', sku: '16H9UR8', quantity: 2, price: '275.000đ' },
];

export const MOCK_ORDERS: (OrderCardProps & { statusKey: string })[] = [
  {
    statusKey: 'pickup',
    sellerId: 'D|VN-HANOI|001',
    location: 'Hồ Chí Minh',
    status: 'Chờ lấy hàng',
    products: SAMPLE_PRODUCTS,
    totalCount: 7,
    totalPrice: '875.000đ',
  },
  {
    statusKey: 'pending',
    sellerId: 'D|VN-HANOI|002',
    location: 'Hà Nội',
    status: 'Chờ xác nhận',
    products: SAMPLE_PRODUCTS.slice(0, 1),
    totalCount: 3,
    totalPrice: '450.000đ',
  },
  {
    statusKey: 'delivered',
    sellerId: 'D|VN-HANOI|003',
    location: 'Đà Nẵng',
    status: 'Đã giao',
    products: SAMPLE_PRODUCTS,
    totalCount: 5,
    totalPrice: '600.000đ',
  },
];