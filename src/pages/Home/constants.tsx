// Placeholder icon — replace with real SVG/image per category
const PlaceholderIcon = ({ color = '#7F00FF' }: { color?: string }) => (
  <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
    <rect width="34" height="40" rx="4" fill={color} fillOpacity="0.15" />
    <rect x="8" y="8" width="18" height="24" rx="2" fill={color} />
  </svg>
);

export const CATEGORIES = [
  { label: 'Text', icon: <PlaceholderIcon /> },
  { label: 'Text', icon: <PlaceholderIcon color="#696CFF" /> },
  { label: 'Text', icon: <PlaceholderIcon color="#FF5630" /> },
  { label: 'Text', icon: <PlaceholderIcon color="#00B8D9" /> },
  { label: 'Text', icon: <PlaceholderIcon /> },
  { label: 'Text', icon: <PlaceholderIcon color="#FFAB00" /> },
  { label: 'Text', icon: <PlaceholderIcon color="#36B37E" /> },
  { label: 'Text', icon: <PlaceholderIcon color="#FF5630" /> },
  { label: 'Text', icon: <PlaceholderIcon color="#696CFF" /> },
  { label: 'Text', icon: <PlaceholderIcon /> },
  { label: 'Text', icon: <PlaceholderIcon color="#00B8D9" /> },
  { label: 'Text', icon: <PlaceholderIcon color="#FFAB00" /> },
];

export const BRANDS = [
  {
    name: 'LIQUI MOLY',
    description: 'Dầu nhớt, Phụ gia cao cấp\nXuất xứ Đức',
    logo: <img src="/images/brands/liqui-moly.png" alt="Liqui Moly" />,
  },
  {
    name: 'FURIO',
    description: 'Dầu động cơ xăng và Dầu động cơ Diesel',
    logo: <img src="/images/brands/furio.png" alt="Furio" />,
  },
  {
    name: 'AISIN',
    description: 'Dầu động cơ, Dầu hộp số, Nước mát\nThương hiệu Nhật Bản, thuộc Tập đoàn TOYOTA',
    logo: <img src="/images/brands/aisin.png" alt="Aisin" />,
  },
];