import {type ShoppingCardData } from '../components/ShoppingCard/ShoppingCard';

// ===== Text =====
export const CART_TEXT = {
  pageTitle: 'Giỏ hàng',
  summaryTitle: 'Summary',
  checkoutBtn: 'Thanh toán',
};

// ===== Summary rows =====
export interface SummaryRow {
  label: string;
  value: string;
  highlight?: boolean; 
}

export const MOCK_SUMMARY_ROWS: SummaryRow[] = [
  { label: 'Tổng số tiền', value: '525.000.000đ' },
  { label: 'Giảm giá trực tiếp', value: '45.000.000đ', highlight: true },
  { label: 'Giảm giá mua sỉ', value: '45.000.000đ', highlight: true },
  { label: 'Voucher nhà bán', value: '45.000.000đ', highlight: true },
];

export const MOCK_SUMMARY_PRICE = 525000000;

// ===== Mock products =====
export const MOCK_PRODUCTS_1: ShoppingCardData[] = [
  {
    name: 'Lọc gió động cơ JS',
    sku: '16H9UR7',
    img: '/images/product-placeholder.png',
    quantity: 1,
    currentPrice: 300000,
    originalPrice: 400000,
    promoText: 'Đã giảm 100.000đ. Mua thêm 2 sản phẩm để được giảm tiếp 100.000đ',
  },
  {
    name: 'Lọc gió động cơ JS',
    sku: '16H9UR7',
    img: '/images/product-placeholder.png',
    quantity: 1,
    currentPrice: 300000,
    originalPrice: 400000,
    promoText: 'Đã giảm 100.000đ. Mua thêm 2 sản phẩm để được giảm tiếp 100.000đ',
  },
];

export const MOCK_PRODUCTS_2: ShoppingCardData[] = [
  {
    name: 'Lọc gió động cơ JS',
    sku: '16H9UR7',
    img: '/images/product-placeholder.png',
    quantity: 1,
    currentPrice: 300000,
    originalPrice: 350000,
    promoText: 'Mua 10 sản phẩm để được giảm giá 15%',
  },
  {   
    name: 'Lọc gió động cơ JS',
    sku: '16H9UR7',
    img: '/images/product-placeholder.png',
    quantity: 1,
    currentPrice: 300000,
    originalPrice: 350000,
    promoText: 'Mua 10 sản phẩm để được giảm giá 15%',
  },
];