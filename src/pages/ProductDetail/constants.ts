export const PRODUCT_DETAIL = {
  name: 'Lọc gió động cơ JS',
  image: '/images/products/air-filter-js.png',
  attributes: [
    { label: 'Mã sản phẩm',    value: 'SKU12345' },
    { label: 'Thương hiệu',    value: 'TOYOTA' },
    { label: 'Nước sản xuất',  value: 'Nhật Bản' },
    { label: 'Danh mục',       value: 'Chất lỏng - Dầu nhớt' },
    { label: '',               value: 'Chất lỏng - Dầu nhớt' },
    { label: 'Đơn vị',         value: 'Cái' },
    { label: 'Dung tích',      value: '100ml' },
  ],
};

const SELLER_MOCK = {
  promotionText: 'Mua 10 sản phẩm giảm giá 15%',
  productCode: 'D|VN-HANOI|001',
  rating: 2.5,
  soldCount: '1k+ đã bán',
  location: 'Hồ Chí Minh',
  currentPrice: '300.000.000đ',
  originalPrice: '400.000.000đ',
};

export const MOCK_SELLERS = Array(6).fill(SELLER_MOCK);

const PRODUCT_ITEM_MOCK = {
  sku: 'SKU12345',
  image: '/images/products/air-filter-js.png',
  brandLogo: '/images/brands/sello.png',
  name: 'Lọc gió động cơ JS',
  rating: 2.5,
  soldCount: '1k+ đã bán',
  sellerCount: 'Tìm thấy 9 nơi bán',
  priceRange: '160.000đ - 550.000đ',
};

export const MOCK_OE_PRODUCTS     = Array(3).fill(PRODUCT_ITEM_MOCK);
export const MOCK_REPLACE_PRODUCTS = Array(3).fill(PRODUCT_ITEM_MOCK);