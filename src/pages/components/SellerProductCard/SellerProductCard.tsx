import styles from './SellerProductCard.module.css';

interface SellerProductCardProps {
  promotionText?: string;
  productCode: string;
  rating: number; // 0-5
  soldCount: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
}

const Star = ({ filled, half, size }: { filled: boolean; half?: boolean; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    {half ? (
      <>
        <defs>
          <clipPath id="halfClip">
            <rect x="0" y="0" width="9" height="18" />
          </clipPath>
        </defs>
        <path
          d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.3 4.8 14.5l.8-4.7L2.2 6.5l4.7-.7L9 1.5z"
          fill="rgba(0,0,0,0.23)"
        />
        <path
          d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.3 4.8 14.5l.8-4.7L2.2 6.5l4.7-.7L9 1.5z"
          fill="#FFB400"
          clipPath="url(#halfClip)"
        />
      </>
    ) : (
      <path
        d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.3 4.8 14.5l.8-4.7L2.2 6.5l4.7-.7L9 1.5z"
        fill={filled ? '#FFB400' : 'rgba(0,0,0,0.23)'}
      />
    )}
  </svg>
);

const StarRating = ({ rating, size = 18 }: { rating: number; size?: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} filled size={size} />);
    } else if (rating >= i - 0.5) {
      stars.push(<Star key={i} filled={false} half size={size} />);
    } else {
      stars.push(<Star key={i} filled={false} size={size} />);
    }
  }
  return <div className={styles.stars}>{stars}</div>;
};

export default function SellerProductCard({
  promotionText = 'Mua 10 sản phẩm giảm giá 15%',
  productCode = 'D|VN-HANOI|001',
  rating = 4,
  soldCount = '1k+ đã bán',
  location = 'Hồ Chí Minh',
  currentPrice = '300.000.000đ',
  originalPrice = '400.000.000đ',
}: SellerProductCardProps) {
  return (
    <div className={styles.card}>
      {/* Frame 1 - Promotion banner */}
      <div className={styles.promoBanner}>
        <span className={styles.promoText}>{promotionText}</span>
      </div>

      {/* Frame 2 - Main content */}
      <div className={styles.mainContent}>
        <div className={styles.innerRow}>
          {/* Left column - product info */}
          <div className={styles.leftCol}>
            {/* Product code */}
            <div className={styles.productCodeWrap}>
              <span className={styles.productCode}>{productCode}</span>
            </div>

            {/* Rating + sold */}
             <div className={styles.ratingRow}>
                <StarRating rating={rating} />
                <span className={styles.soldCount}>({soldCount})</span>
            </div>

            {/* Location */}
            <div className={styles.locationWrap}>
              <span className={styles.location}>{location}</span>
            </div>
          </div>

          {/* Right column - pricing */}
          <div className={styles.rightCol}>
            <div className={styles.pricePlaceholder} />
            <span className={styles.currentPrice}>{currentPrice}</span>
            <span className={styles.originalPrice}>{originalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}