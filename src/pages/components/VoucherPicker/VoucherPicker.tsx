import { useState } from 'react';
import VoucherCard, {type VoucherData } from '../VoucherCard/VoucherCard';
import styles from './VoucherPicker.module.css';
// chọn voucher
interface Props {
  vouchers: VoucherData[];
  onApplyCode?: (code: string) => void;
  onSelect?: (index: number) => void;
}

export default function VoucherPicker({ vouchers, onApplyCode, onSelect }: Props) {
  const [code, setCode] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleApply = () => {
    if (code.trim() && onApplyCode) {
      onApplyCode(code.trim());
    }
  };

  const handleToggle = (index: number) => {
    const newIndex = selectedIndex === index ? null : index;
    setSelectedIndex(newIndex);
    if (onSelect) onSelect(newIndex ?? -1);
  };

  return (
    <div className={styles.container}>
      {/* Input */}
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã giảm giá"
        />
        <button className={styles.applyBtn} onClick={handleApply}>
          Áp dụng
        </button>
      </div>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Voucher list */}
      <div className={styles.voucherList}>
        {vouchers.map((v, i) => (
          <VoucherCard
            key={i}
            data={v}
            selected={selectedIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </div>
  );
}