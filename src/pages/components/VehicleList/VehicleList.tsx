import { useState } from 'react';
import VehicleItem, {type VehicleItemData } from '../VehicleItem/VehicleItem';
import styles from './VehicleList.module.css';

// 1. Simple List (inline) 
interface ListProps {
  vehicles: VehicleItemData[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  mobile?: boolean;
}

export function VehicleListInline({ vehicles, selectedIndex, onSelect, mobile = false }: ListProps) {
  return (
    <div className={mobile ? styles.listMobile : styles.list}>
      {vehicles.map((v, i) => (
        <VehicleItem
          key={i}
          data={v}
          mobile={mobile}
          selected={selectedIndex === i}
          onSelect={() => onSelect?.(i)}
        />
      ))}
    </div>
  );
}

//  2. Modal 
interface ModalProps {
  open: boolean;
  vehicles: VehicleItemData[];
  onClose: () => void;
  onSave: (selectedIndex: number) => void;
  mobile?: boolean;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 7l10 10M17 7L7 17" stroke="rgba(0,0,0,0.56)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function VehicleListModal({ open, vehicles, onClose, onSave, mobile = false }: ModalProps) {
  const [selected, setSelected] = useState<number>(-1);

  if (!open) return null;

  const handleSave = () => {
    if (selected >= 0) onSave(selected);
  };

  if (mobile) {
    return (
      <div className={styles.overlayMobile} onClick={onClose}>
        <div className={styles.modalMobile} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Danh sách xe đã tìm thấy</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <div className={styles.contentMobile}>
            {vehicles.map((v, i) => (
              <VehicleItem
                key={i}
                data={v}
                mobile
                selected={selected === i}
                onSelect={() => setSelected(i)}
              />
            ))}
          </div>
          <div className={styles.actionMobile}>
            <button className={styles.cancelBtn} onClick={onClose}>Hủy</button>
            <button className={styles.saveBtn} onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Danh sách xe đã tìm thấy</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.content}>
          {vehicles.map((v, i) => (
            <VehicleItem
              key={i}
              data={v}
              selected={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>
        <div className={styles.action}>
          <button className={styles.cancelBtn} onClick={onClose}>Hủy</button>
          <button className={styles.saveBtn} onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
}