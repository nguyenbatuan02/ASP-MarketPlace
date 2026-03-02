import { useState } from 'react';
import AddressModal, { type AddressFormData } from '../AddressModal/AddressModal';
import styles from './AddressManager.module.css';

export interface Address {
  id: string;
  name: string;
  phone: string;
  detail: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  initialAddresses?: Address[];
}

const LocationIcon = () => (
  <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
    <path
      d="M17.5 3C11.7 3 7 7.7 7 13.5c0 8.75 10.5 19.25 10.5 19.25S28 22.25 28 13.5C28 7.7 23.3 3 17.5 3zm0 14.25a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z"
      fill="rgba(0,0,0,0.56)"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function AddressRow({ address, onEdit, onDelete }: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const rows = [
    { label: 'Họ và tên', value: address.name, showChip: address.isDefault },
    { label: 'Số điện thoại', value: address.phone, showChip: false },
    { label: 'Địa chỉ', value: address.detail, showChip: false },
    { label: '', value: address.ward, showChip: false },
    { label: '', value: address.district, showChip: false },
    { label: '', value: address.city, showChip: false },
  ].filter(r => r.value);

  return (
    <div className={styles.addressRow}>
      {/* Icon */}
      <div className={styles.locationIconWrap}>
        <LocationIcon />
      </div>

      {/* Info */}
      <div className={styles.addressInfo}>
        {rows.map((r, i) => (
          <div key={i} className={styles.infoRow}>
            <span className={styles.infoLabel}>{r.label}</span>
            <div className={styles.infoValueWrap}>
              <span className={styles.infoValue}>{r.value}</span>
              {r.showChip && (
                <div className={styles.chip}>
                  <span className={styles.chipText}>Địa chỉ nhận hàng</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.addressActions}>
        <button className={styles.editBtn} onClick={onEdit}>
          <span className={styles.editBtnText}>Sửa</span>
        </button>
        {!address.isDefault && (
          <button className={styles.deleteBtn} onClick={onDelete}>
            <span className={styles.deleteBtnText}>Xóa</span>
          </button>
        )}
      </div>
    </div>
  );
}

const toFormData = (a: Address): AddressFormData => ({
  name: a.name, phone: a.phone, city: a.city,
  district: a.district, detail: a.detail, isDefault: a.isDefault,
});

export default function AddressManager({ initialAddresses = [] }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingAddress = editingId ? addresses.find(a => a.id === editingId) : undefined;

  const openAdd = () => { setEditingId(null); setModalOpen(true); };
  const openEdit = (id: string) => { setEditingId(id); setModalOpen(true); };

  const handleSave = (data: AddressFormData) => {
    if (editingId) {
      setAddresses(prev => prev.map(a =>
        a.id === editingId
          ? { ...a, ...data, ward: '', district: data.district, city: data.city }
          : data.isDefault ? { ...a, isDefault: false } : a
      ));
    } else {
      const newAddr: Address = {
        id: Date.now().toString(),
        name: data.name, phone: data.phone,
        detail: data.detail, ward: '', district: data.district,
        city: data.city, isDefault: data.isDefault,
      };
      setAddresses(prev =>
        data.isDefault
          ? [...prev.map(a => ({ ...a, isDefault: false })), newAddr]
          : [...prev, newAddr]
      );
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));

  return (
    <>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>Quản lý địa chỉ vận chuyển & nhận hàng</span>
          <button className={styles.addBtn} onClick={openAdd}>
            <PlusIcon />
            <span className={styles.addBtnText}>Thêm địa chỉ</span>
          </button>
        </div>

        {/* Address list */}
        <div className={styles.list}>
          {addresses.map(a => (
            <AddressRow
              key={a.id}
              address={a}
              onEdit={() => openEdit(a.id)}
              onDelete={() => handleDelete(a.id)}
            />
          ))}
          {addresses.length === 0 && (
            <p className={styles.empty}>Chưa có địa chỉ nào. Nhấn "Thêm địa chỉ" để thêm mới.</p>
          )}
        </div>
      </div>

      <AddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingAddress ? toFormData(editingAddress) : undefined}
      />
    </>
  );
}