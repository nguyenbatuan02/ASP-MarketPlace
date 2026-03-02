import styles from './PromoBanner.module.css';
// mua nhiều giảm giá
interface Props {
  text: string;
}

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#FF5630" strokeWidth="1.5" />
    <path d="M12 8v0m0 4v4" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="8" r="0.5" fill="#FF5630" stroke="#FF5630" />
  </svg>
);

export default function PromoBanner({ text }: Props) {
  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <InfoIcon />
        </div>
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  );
}