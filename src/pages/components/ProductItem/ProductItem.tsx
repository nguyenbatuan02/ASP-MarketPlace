import styles from './ProductItem.module.css';
import { useNavigate } from 'react-router-dom';

export interface ProductItemData {
  productId?: number;
  sku: string;
  name: string;
  image: string;
  brandLogo?: string;
  rating: number;          
  soldCount: string;       
  sellerCount: string;    
  priceRange: string;    
}

interface Props {
  data: ProductItemData;
  mobile?: boolean;
  onClick?: () => void;
}

// Star component
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

export default function ProductItem({ data, mobile = false, onClick }: Props) {
  const navigate = useNavigate();
  const { sku, name, image, brandLogo, rating, soldCount, sellerCount, priceRange } = data;
  const handleClick = () => {
    if (onClick) { onClick(); return; }
    if (data.productId) navigate(`/product/${data.productId}`);
  };
  if (mobile) {
    return (
      <div className={styles.cardMobile} onClick={handleClick}>
        <div className={styles.imageWrapMobile}>
          <img className={styles.imageMobile} src={image} alt={name} />
          <div className={styles.skuBadgeMobile}>
            <span className={styles.skuTextMobile}>{sku}</span>
          </div>
          {brandLogo && (
            <div className={styles.brandLogoMobile}>
              <img className={styles.brandLogoImgMobile} src={brandLogo} alt="brand" />
            </div>
          )}
        </div>
        <div className={styles.bodyMobile}>
          <h3 className={styles.productNameMobile}>{name}</h3>
          <StarRating rating={rating} size={18} />
          <div className={styles.soldTextMobile}>{soldCount}</div>
        </div>
        <div className={styles.priceMobile}>
          <div className={styles.priceTextMobile}>
            {sellerCount.split(/(\d+)/).map((part, i) =>
              /\d+/.test(part) ? (
                <span key={i} className={styles.priceHighlightMobile}>{part}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>
          <div className={styles.priceTextMobile} style={{ marginTop: 4 }}>
            {priceRange.split(/(\d[\d.,]+đ)/).map((part, i) =>
              /\d/.test(part) ? (
                <span key={i} className={styles.priceHighlightMobile}>{part}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageWrap}>
        <img className={styles.image} src={image} alt={name} />
        <div className={styles.skuBadge}>
          <span className={styles.skuText}>{sku}</span>
        </div>
        {brandLogo && (
          <div className={styles.brandLogo}>
            <img className={styles.brandLogoImg} src={brandLogo} alt="brand" />
          </div>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.productName}>{name}</h3>
        <div className={styles.ratingRow}>
          <StarRating rating={rating} />
          <span className={styles.soldText}>({soldCount})</span>
        </div>
      </div>
      <div className={styles.price}>
        <div className={styles.priceText}>
          {sellerCount.split(/(\d+)/).map((part, i) =>
            /\d+/.test(part) ? (
              <span key={i} className={styles.priceHighlight}>{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
        <div className={styles.priceText} style={{ marginTop: 4 }}>
          Giá từ{' '}
          {priceRange.replace('Giá từ ', '').split(/(\d[\d.,]+đ)/).map((part, i) =>
            /\d/.test(part) ? (
              <span key={i} className={styles.priceHighlight}>{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}