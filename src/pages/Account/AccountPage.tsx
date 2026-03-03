import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AccountInfo, { type AccountInfoData } from '../components/AccountInfo/AccountInfo';
import AddressManager, { type Address } from '../components/AddressManager/AddressManager';
import ChangePassword from '../components/ChangePassword/ChangePassword';
import BusinessInfo, { type BusinessInfoData } from '../components/BusinessInfo/BusinessInfo';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { authService } from '../../services/authService';
import { callKw } from '../../api/odoo';
import styles from './AccountPage.module.css';

type TabKey = 'account' | 'address' | 'password' | 'business';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'account',  label: 'Tài khoản' },
  { key: 'address',  label: 'Quản lý địa chỉ' },
  { key: 'password', label: 'Đổi mật khẩu' },
  { key: 'business', label: 'Thông tin doanh nghiệp' },
];

interface OdooPartner {
  id: number;
  name: string;
  phone: string | false;
  email: string | false;
  street: string | false;
  city: string | false;
  vat: string | false;           
  company_name: string | false;
  comment: string | false;       // dùng lưu legalRep tạm
  child_ids: number[];
}

interface OdooChildPartner {
  id: number;
  name: string;
  phone: string | false;
  street: string | false;
  street2: string | false;
  city: string | false;
  type: string;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const showToast = useUiStore(s => s.showToast);

  const [activeTab, setActiveTab] = useState<TabKey>('account');
  const [partner, setPartner] = useState<OdooPartner | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/'); return; }
    if (!user?.partner_id) return;
    let cancelled = false;

    const fetchPartner = async () => {
      setLoading(true);
      try {
        // 1. Fetch partner chính
        const partners = await callKw<OdooPartner[]>('res.partner', 'search_read', [
          [['id', '=', user.partner_id]],
        ], { fields: ['id','name','phone','email','street','city','vat','company_name','comment','child_ids'] });

        if (cancelled || !partners.length) return;
        const p = partners[0];
        setPartner(p);

        // 2. Fetch địa chỉ con (child contacts kiểu delivery)
        if (p.child_ids.length) {
          const children = await callKw<OdooChildPartner[]>('res.partner', 'search_read', [
            [['id', 'in', p.child_ids], ['type', 'in', ['delivery', 'other']]],
          ], { fields: ['id','name','phone','street','street2','city','type'] });

          if (!cancelled) {
            setAddresses(children.map((c, idx) => ({
              id: String(c.id),
              name: c.name,
              phone: c.phone || '',
              detail: c.street || '',
              ward: c.street2 || '',
              district: '',
              city: c.city || '',
              isDefault: idx === 0,
            })));
          }
        }
      } catch {
        if (!cancelled) showToast('Không thể tải thông tin tài khoản', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPartner();
    return () => { cancelled = true; };
  }, [user?.partner_id, isLoggedIn]);

  const handleSaveAccount = async (data: AccountInfoData) => {
    if (!user?.partner_id) return;
    setSaving(true);
    try {
      await authService.updateProfile(user.partner_id, {
        name: data.name,
        phone: data.phone,
      });
      if (data.avatar) {
        const base64 = await fileToBase64(data.avatar);
        await callKw('res.partner', 'write', [[user.partner_id], { image_1920: base64 }]);
      }
      showToast('Cập nhật thông tin thành công', 'success');
    } catch {
      showToast('Cập nhật thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (addr: Address) => {
    if (!user?.partner_id) return;
    try {
      const newId = await callKw<number>('res.partner', 'create', [{
        parent_id: user.partner_id,
        type: 'delivery',
        name: addr.name,
        phone: addr.phone,
        street: addr.detail,
        street2: addr.ward,
        city: addr.city,
      }]);
      setAddresses(prev => [...prev, { ...addr, id: String(newId) }]);
      showToast('Thêm địa chỉ thành công', 'success');
    } catch {
      showToast('Thêm địa chỉ thất bại', 'error');
    }
  };

  const handleUpdateAddress = async (addr: Address) => {
    try {
      await callKw('res.partner', 'write', [[Number(addr.id)], {
        name: addr.name,
        phone: addr.phone,
        street: addr.detail,
        street2: addr.ward,
        city: addr.city,
      }]);
      setAddresses(prev => prev.map(a => a.id === addr.id ? addr : a));
      showToast('Cập nhật địa chỉ thành công', 'success');
    } catch {
      showToast('Cập nhật địa chỉ thất bại', 'error');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await callKw('res.partner', 'write', [[Number(id)], { active: false }]);
      setAddresses(prev => prev.filter(a => a.id !== id));
      showToast('Đã xóa địa chỉ', 'info');
    } catch {
      showToast('Xóa địa chỉ thất bại', 'error');
    }
  };

  const handleSaveBusiness = async (data: BusinessInfoData) => {
    if (!user?.partner_id) return;
    setSaving(true);
    try {
      await callKw('res.partner', 'write', [[user.partner_id], {
        company_name: data.bizName,
        vat: data.taxCode,
        street: data.bizRegAddress,
        phone: data.bizPhone,
        comment: data.legalRep,   // lưu vào comment field
      }]);
      showToast('Cập nhật thông tin doanh nghiệp thành công', 'success');
    } catch {
      showToast('Cập nhật thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (oldPw: string, newPw: string) => {
    setSaving(true);
    try {
      await authService.changePassword(oldPw, newPw);
      showToast('Đổi mật khẩu thành công', 'success');
    } catch {
      showToast('Mật khẩu cũ không đúng', 'error');
    } finally {
      setSaving(false);
    }
  };

  const accountInitial: Partial<AccountInfoData> = partner ? {
    name: partner.name,
    phone: partner.phone || '',
    email: partner.email || '',
    dob: '',      
    gender: '',   
    avatar: null,
  } : {};

  const businessInitial: Partial<BusinessInfoData> = partner ? {
    bizName: partner.company_name || '',
    taxCode: partner.vat || '',
    bizRegAddress: partner.street || '',
    bizPhone: partner.phone || '',
    legalRep: partner.comment || '',
    group: '',
    frontImage: null,
    officeImage: null,
  } : {};

  const bizAddress = partner
    ? [partner.street, partner.city].filter(Boolean).join(', ')
    : '';

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.titleRow}>
            <span className={styles.title}>Tài khoản của tôi</span>
          </div>

          <div className={styles.contentBox}>
            {/* Tab bar */}
            <div className={styles.tabBar}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span className={`${styles.tabText} ${activeTab === tab.key ? styles.tabTextActive : ''}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.key && <div className={styles.tabLine} />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className={styles.tabContent}>
              {loading ? (
                <div style={{ padding: 32, color: '#888' }}>Đang tải...</div>
              ) : (
                <>
                  {activeTab === 'account' && (
                    <AccountInfo
                      initialData={accountInitial}
                      onChange={handleSaveAccount}
                    />
                  )}

                  {activeTab === 'address' && (
                    <AddressManager
                      initialAddresses={addresses}
                      onAdd={handleAddAddress}
                      onUpdate={handleUpdateAddress}
                      onDelete={handleDeleteAddress}
                    />
                  )}

                  {activeTab === 'password' && (
                    <ChangePassword
                      onCancel={() => setActiveTab('account')}
                      onSave={handleChangePassword}
                    />
                  )}

                  {activeTab === 'business' && (
                    <BusinessInfo
                      initialData={businessInitial}
                      bizAddress={bizAddress}
                      onChange={handleSaveBusiness}
                    />
                  )}
                </>
              )}

              {/* Saving indicator */}
              {saving && (
                <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#333', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 14 }}>
                  Đang lưu...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(',')[1]);
    r.onerror = () => rej(new Error('Read failed'));
    r.readAsDataURL(file);
  });
}