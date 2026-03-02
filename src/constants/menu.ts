// ===== Header Nav =====
export const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Danh mục', href: '/category', hasDropdown: true, hasDot: true },
  { label: 'Đăng ký bán hàng', href: '/register-seller' },
];

// ===== Footer =====
export const FOOTER_ABOUT = {
  description: 'ASP trading - nhà phân phối phụ tùng ô tô chính hãng hàng đầu tại việt nam',
};

export const FOOTER_LINKS = {
  about: {
    title: 'Về ASP',
    items: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Đăng ký đối tác bán hàng', href: '/partner' },
      { label: 'Liên hệ', href: '/contact' },
    ],
  },
  policies: {
    title: 'Điều khoản sử dụng',
    items: [
      { label: 'Chính sách đổi trả', href: '/return-policy' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
      { label: 'Chính sách kiểm hàng', href: '/inspection' },
      { label: 'Chính sách bảo hành', href: '/warranty' },
      { label: 'Hướng dẫn thanh toán', href: '/payment-guide' },
      { label: 'Hướng dẫn mua hàng', href: '/buying-guide' },
    ],
  },
};

export const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'facebook', href: '#' },
  { name: 'Instagram', icon: 'instagram', href: '#' },
  { name: 'LinkedIn', icon: 'linkedin', href: '#' },
  { name: 'Twitter', icon: 'twitter', href: '#' },
];