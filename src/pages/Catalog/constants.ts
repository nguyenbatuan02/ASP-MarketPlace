import { type ProductItemData } from '../components/ProductItem/ProductItem';
import { type VehicleItemData } from '../components/VehicleItem/VehicleItem';
import { type FilterGroup } from '../components/CatalogNavbar/CatalogNavbar';

export const CATALOG_TEXT = {
  pageTitle: 'Catalog',
  searchResult: 'Kết quả tìm kiếm',
  replacementParts: 'Danh sách phụ tùng thay thế',
  vehicleFound: 'Danh sách xe đã tìm thấy',
  partsList: 'Danh sách phụ tùng',
};

export const MOCK_FILTERS: FilterGroup[] = [
  {
    title: 'Category',
    options: [
      { label: 'Chất lỏng', checked: false},
      { label: 'Phần máy', checked: false },
      { label: 'Phần gầm', checked: false },
      { label: 'Phần điện', checked: false },
    ],
  },
  {
    title: 'Sub-category',
    options: [
      { label: 'Dầu nhớt', checked: false },
      { label: 'Dầu động cơ', checked: false },
      { label: 'Dầu phanh', checked: false },
      { label: 'Nước mát', checked: false },
    ],
  },
  {
    title: 'Thương hiệu',
    options: [
      { label: 'LIQUI MOLY', checked: false },
      { label: 'AISIN', checked: false },
      { label: 'FURIO', checked: false },
      { label: 'SELIG', checked: false },
    ],
  },
];

const MOCK_PRODUCT: ProductItemData = {
  sku: 'SKU12345',
  name: 'Lọc gió động cơ JS',
  image: '/images/product-placeholder.png',
  brandLogo: '/images/brand-placeholder.png',
  rating: 3.5,
  soldCount: '(1k+ đã bán)',
  sellerCount: 'Tìm thấy 9 nơi bán',
  priceRange: 'Giá từ 160.000đ - 550.000đ',
};

export const MOCK_SEARCH_RESULTS: ProductItemData[] = [MOCK_PRODUCT];

export const MOCK_REPLACEMENT_PARTS: ProductItemData[] = Array(9).fill(MOCK_PRODUCT);

export const MOCK_PARTS_LIST: ProductItemData[] = Array(9).fill(MOCK_PRODUCT);

export const MOCK_VEHICLES: VehicleItemData[] = [
  {
    title: '2022 Toyota Camry',
    subtitle: 'Hybrid SE Sedan 4-Door',
    specs: '2.5L 2487CC 152Cu. In. l4 FULL HYBRID EV-GAS (FHEV) DOHC Naturally Aspirated',
    image: '/images/vehicle-placeholder.png',
  },
  {
    title: '2022 Toyota Camry',
    subtitle: 'Hybrid SE Sedan 4-Door',
    specs: '2.5L 2487CC 152Cu. In. l4 FULL HYBRID EV-GAS (FHEV) DOHC Naturally Aspirated',
    image: '/images/vehicle-placeholder.png',
  },
];