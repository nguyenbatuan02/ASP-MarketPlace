import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fleetService, type FleetBrand, type FleetModel } from '../../../services/fleetService';
import styles from './SearchBox.module.css';

type SearchMode = 'part' | 'vehicle';

interface SearchBoxProps {
  onSearch?: (params: Record<string, string>) => void;
}

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 9.5l5 5 5-5" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" />
    <path d="M16 16l4 4" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const navigate = useNavigate();
  const [mode, setMode]       = useState<SearchMode>('part');
  const [vinMode, setVinMode] = useState(false);
  const [partCode, setPartCode] = useState('');
  const [vin, setVin]           = useState('');

  // Odoo data
  const [brands, setBrands]           = useState<FleetBrand[]>([]);
  const [models, setModels]           = useState<FleetModel[]>([]);
  const [years,  setYears]            = useState<number[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | ''>('');
  const [selectedModel, setSelectedModel] = useState<number | ''>('');
  const [selectedYear,  setSelectedYear]  = useState<number | ''>('');
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Load brands + years khi chuyển sang vehicle mode
  useEffect(() => {
    if (mode !== 'vehicle' || vinMode) return;
    setLoadingBrands(true);
    Promise.all([fleetService.getBrands(), fleetService.getYears()])
      .then(([b, y]) => { setBrands(b); setYears(y); })
      .finally(() => setLoadingBrands(false));
  }, [mode, vinMode]);

  // Cascade: chọn brand → load models
  useEffect(() => {
    setSelectedModel('');
    setModels([]);
    if (!selectedBrand) return;
    setLoadingModels(true);
    fleetService.getModels(selectedBrand as number)
      .then(setModels)
      .finally(() => setLoadingModels(false));
  }, [selectedBrand]);

  const handleSearch = () => {
    if (mode === 'part') {
      const trimmed = partCode.trim();
      if (!trimmed) return;
      navigate(`/catalog?code=${encodeURIComponent(trimmed)}`);
      onSearch?.({ mode, partCode: trimmed });
    } else if (vinMode) {
      const trimmed = vin.trim();
      if (!trimmed) return;
      navigate(`/catalog?vin=${encodeURIComponent(trimmed)}`);
      onSearch?.({ mode, vin: trimmed });
    } else {
      const params: Record<string, string> = { mode };
      if (selectedBrand) params.brandId = String(selectedBrand);
      if (selectedModel) params.modelId = String(selectedModel);
      if (selectedYear)  params.year    = String(selectedYear);
      // Build query string cho catalog
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([k]) => k !== 'mode'))
      ).toString();
      navigate(`/catalog?${qs}`);
      onSearch?.(params);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.card}>
      {/* Frame 1 — mode selector */}
      <div className={styles.frame1}>
        <div className={styles.labelWrap}>
          <span className={styles.label}>Tìm kiếm theo</span>
        </div>
        <div className={styles.selectWrap}>
          <select className={styles.select} value={mode}
            onChange={e => setMode(e.target.value as SearchMode)}>
            <option value="part">Phụ tùng</option>
            <option value="vehicle">Xe</option>
          </select>
          <span className={styles.selectIcon}><ChevronDownIcon /></span>
        </div>
      </div>

      {/* Frame 2 */}
      <div className={styles.frame2}>
        {mode === 'part' ? (
          <>
            <div className={styles.inputWrap}>
              <input className={styles.input} placeholder="Nhập mã phụ tùng"
                value={partCode} onChange={e => setPartCode(e.target.value)}
                onKeyDown={handleKeyDown} />
              <span className={styles.inputIcon}><SearchIcon /></span>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.searchBtn} onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </>
        ) : (
          <>
            {/* Toggle VIN */}
            <div className={styles.toggleRow}>
              <button className={`${styles.toggle} ${vinMode ? styles.toggleOn : ''}`}
                onClick={() => setVinMode(!vinMode)} aria-label="Toggle VIN search">
                <span className={styles.toggleTrack} />
                <span className={styles.toggleKnob} />
              </button>
              <span className={styles.toggleLabel}>Tìm kiếm xe theo số VIN</span>
            </div>

            {vinMode ? (
              <div className={styles.inputWrap}>
                <input className={styles.input} placeholder="Nhập số VIN"
                  value={vin} onChange={e => setVin(e.target.value)}
                  onKeyDown={handleKeyDown} />
                <span className={styles.inputIcon}><SearchIcon /></span>
              </div>
            ) : (
              <div className={styles.selectGrid}>
                {/* Row 1: Hãng, Model, Năm */}
                <div className={styles.selectRow}>
                  {/* Hãng xe */}
                  <div className={styles.selectWrapFull}>
                    <select className={styles.select} value={selectedBrand}
                      disabled={loadingBrands}
                      onChange={e => setSelectedBrand(e.target.value ? Number(e.target.value) : '')}>
                      <option value="">{loadingBrands ? 'Đang tải...' : 'Hãng xe'}</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <span className={styles.selectIcon}><ChevronDownIcon /></span>
                  </div>

                  {/* Model */}
                  <div className={styles.selectWrapFull}>
                    <select className={styles.select} value={selectedModel}
                      disabled={!selectedBrand || loadingModels}
                      onChange={e => setSelectedModel(e.target.value ? Number(e.target.value) : '')}>
                      <option value="">{loadingModels ? 'Đang tải...' : 'Model'}</option>
                      {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <span className={styles.selectIcon}><ChevronDownIcon /></span>
                  </div>

                  {/* Năm */}
                  <div className={styles.selectWrapFull}>
                    <select className={styles.select} value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : '')}>
                      <option value="">Năm</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <span className={styles.selectIcon}><ChevronDownIcon /></span>
                  </div>
                </div>

                {/* Row 2: Động cơ, Chasis, Nước SX — disabled, chưa có data */}
                <div className={styles.selectRow}>
                  {(['Động cơ', 'Chasis', 'Nước sản xuất'] as const).map(f => (
                    <div key={f} className={styles.selectWrapFull}>
                      <select className={styles.select} defaultValue="" disabled>
                        <option value="" disabled>{f}</option>
                      </select>
                      <span className={styles.selectIcon}><ChevronDownIcon /></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.btnRow}>
              <button className={styles.searchBtn} onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}