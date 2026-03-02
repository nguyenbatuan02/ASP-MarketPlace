export const MOCK_ORDER = {
  orderId: '231228DPPJ7V6U',
  sellerId: 'D|VN-HANOI|001',
  location: 'Hồ Chí Minh',
  status: 'Chờ lấy hàng',
  totalCount: 7,
  totalPrice: '875.000đ',
  products: [
    { name: 'Lọc gió động cơ JS', sku: '16H9UR7', quantity: 1, price: '300.000đ' },
    { name: 'Lọc gió động cơ JS', sku: '16H9UR7', quantity: 1, price: '300.000đ' },
  ],
};

export const MOCK_ADDRESS = {
  name: 'Anton Vuong',
  phone: '0123456789',
  address: '68 Ngõ Huế, phường Phố Huế, quận Hai Bà Trưng, thành phố Hà Nội, Việt Nam',
};

export const MOCK_PAYMENT = {
  count: 7,
  subtotal: '525.000.000đ',
  voucher: '-45.000.00đ',
  total: '525.000.000đ',
  paymentMethod: 'Thanh toán khi nhận hàng',
};