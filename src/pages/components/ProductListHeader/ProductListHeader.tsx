import styles from './ProductListHeader.module.css';
// thẻ tiêu đề danh sách sản phẩm
interface Props {
  checked?: boolean;
  onCheck?: () => void;
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProductListHeader({ checked = false, onCheck }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.checkboxWrap} onClick={onCheck}>
          <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
            {checked && <CheckIcon />}
          </div>
        </div>
        <span className={styles.productLabel}>Sản phẩm</span>
      </div>
      <div className={styles.right}>
        <span className={styles.colQuantity}>Số lượng</span>
        <span className={styles.colPrice}>Số tiền</span>
        <span className={styles.colAction}>Thao tác</span>
      </div>
    </div>
  );
}