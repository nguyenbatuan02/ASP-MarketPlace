import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fleetService, type FleetBrand, type FleetModel} from '../../../services/fleetService';
import styles from './CatalogNavbar.module.css';

// ===== Types =====
export interface FilterOption { label: string; checked: boolean; }
export interface FilterGroup  { title: string; options: FilterOption[]; }

interface Props {
  searchType: 'parts' | 'vehicle';
  onSearchTypeChange: (type: 'parts' | 'vehicle') => void;
  onSearch: (keyword: string) => void;
  onVehicleFilter: (opts: { vin?: string; brandId?: number; modelId?: number; year?: number }) => void;
  filters: FilterGroup[];
  onFilterChange: (groupIndex: number, optionIndex: number) => void;
  onClearFilters: () => void;
}

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" />
    <path d="M16 16l4 4" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const ChevronUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 15l6-6 6 6" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="rgba(0,0,0,0.56)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <path d="M1 5h16M5 5V3a2 2 0 012-2h4a2 2 0 012 2v2M7 9v8M11 9v8M3 5l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"
      stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function FilterSection({ group, groupIndex, onFilterChange }: {
  group: FilterGroup; groupIndex: number;
  onFilterChange: (gi: number, oi: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterHeader} onClick={() => setExpanded(!expanded)}>
        <span className={styles.filterTitle}>{group.title}</span>
        <button className={styles.filterToggle}>{expanded ? <ChevronUp /> : <ChevronRight />}</button>
      </div>
      {expanded && (
        <div className={styles.filterList}>
          {group.options.map((opt, i) => (
            <div key={i} className={styles.filterItem} onClick={() => onFilterChange(groupIndex, i)}>
              <div className={styles.checkboxWrap}>
                <div className={`${styles.checkbox} ${opt.checked ? styles.checkboxChecked : ''}`}>
                  {opt.checked && <CheckIcon />}
                </div>
              </div>
              <span className={styles.filterItemLabel}>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogNavbar({
  searchType, onSearchTypeChange, onSearch, onVehicleFilter,
  filters, onFilterChange, onClearFilters,
}: Props) {
  const [keyword, setKeyword]       = useState('');
  const [vinMode, setVinMode]       = useState(false);
  const navigate = useNavigate();

  const [brands, setBrands]         = useState<FleetBrand[]>([]);
  const [models, setModels]         = useState<FleetModel[]>([]);
  const [years, setYears]           = useState<number[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | ''>('');
  const [selectedModel, setSelectedModel] = useState<number | ''>('');
  const [selectedYear,  setSelectedYear]  = useState<number | ''>('');
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Load brands + years khi mở tab vehicle
  useEffect(() => {
    if (searchType !== 'vehicle' || vinMode) return;
    setLoadingBrands(true);
    Promise.all([fleetService.getBrands(), fleetService.getYears()])
      .then(([b, y]) => { setBrands(b); setYears(y); })
      .finally(() => setLoadingBrands(false));
  }, [searchType, vinMode]);

  // Cascade: khi đổi brand → load models tương ứng
  useEffect(() => {
    if (searchType !== 'vehicle' || vinMode) return;
    setSelectedModel('');
    setModels([]);
    if (!selectedBrand) return;
    setLoadingModels(true);
    fleetService.getModels(selectedBrand as number)
      .then(setModels)
      .finally(() => setLoadingModels(false));
  }, [selectedBrand, searchType, vinMode]);

  const handleSearch = () => {
    if (searchType === 'parts') {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      navigate(`/catalog?code=${encodeURIComponent(trimmed)}`);
      onSearch(trimmed);
      return;
    }

    // Vehicle tab
    if (vinMode) {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      onVehicleFilter({ vin: trimmed });
    } else {
      onVehicleFilter({
        brandId: selectedBrand  || undefined,
        modelId: selectedModel  || undefined,
        year:    selectedYear   || undefined,
      });
    }
  };

  return (
    <div className={styles.navbar}>
      {/* Parts search box */}
      {searchType === 'parts' ? (
        <div className={styles.searchBox}>
          <div className={styles.searchTypeRow}>
            <span className={styles.searchTypeLabel}>Tìm kiếm theo</span>
            <select className={styles.select} value={searchType}
              onChange={e => onSearchTypeChange(e.target.value as 'parts' | 'vehicle')}>
              <option value="parts">Phụ tùng</option>
              <option value="vehicle">Xe</option>
            </select>
          </div>
          <div className={styles.inputWrap}>
            <input className={styles.input} placeholder="Nhập mã phụ tùng"
              value={keyword} onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            <div className={styles.inputIcon}><SearchIcon /></div>
          </div>
          <div className={styles.searchBtnRow}>
            <button className={styles.searchBtn} onClick={handleSearch}>Tìm kiếm</button>
          </div>
        </div>

      ) : (
        /* Vehicle search box */
        <div className={styles.searchBoxVehicle}>
          <div className={styles.searchTypeRow}>
            <span className={styles.searchTypeLabel}>Tìm kiếm theo</span>
            <select className={styles.select} value={searchType}
              onChange={e => onSearchTypeChange(e.target.value as 'parts' | 'vehicle')}>
              <option value="parts">Phụ tùng</option>
              <option value="vehicle">Xe</option>
            </select>
          </div>

          <div className={styles.switchRow}>
            <div className={styles.switch} onClick={() => setVinMode(!vinMode)}>
              <div className={`${styles.switchTrack} ${vinMode ? styles.switchTrackActive : ''}`} />
              <div className={`${styles.switchKnob} ${vinMode ? styles.switchKnobActive : ''}`} />
            </div>
            <span className={styles.switchLabel}>Tìm kiếm theo số VIN</span>
          </div>

          {vinMode ? (
            <div className={styles.inputWrap}>
              <input className={styles.input} placeholder="Nhập số VIN"
                value={keyword} onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              <div className={styles.inputIcon}><SearchIcon /></div>
            </div>
          ) : (
            <>
              {/* Hãng xe */}
              <select className={styles.vehicleSelect}
                value={selectedBrand}
                disabled={loadingBrands}
                onChange={e => setSelectedBrand(e.target.value ? Number(e.target.value) : '')}>
                <option value="">{loadingBrands ? 'Đang tải...' : 'Hãng xe'}</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>

              {/* Model — chỉ enable khi đã chọn hãng */}
              <select className={styles.vehicleSelect}
                value={selectedModel}
                disabled={!selectedBrand || loadingModels}
                onChange={e => setSelectedModel(e.target.value ? Number(e.target.value) : '')}>
                <option value="">{loadingModels ? 'Đang tải...' : 'Model'}</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>

              {/* Năm */}
              <select className={styles.vehicleSelect}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Năm</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              {['Động cơ', 'Chasis', 'Nước sản xuất'].map(f => (
                <select key={f} className={styles.vehicleSelect} defaultValue="" disabled>
                  <option value="" disabled>{f}</option>
                </select>
              ))}
            </>
          )}

          <div className={styles.searchBtnRow}>
            <button className={styles.searchBtn} onClick={handleSearch}>Tìm kiếm</button>
          </div>
        </div>
      )}

      {/* Filter Sections */}
      {filters.map((group, i) => (
        <FilterSection key={i} group={group} groupIndex={i} onFilterChange={onFilterChange} />
      ))}

      <button className={styles.clearBtn} onClick={onClearFilters}>
        <span className={styles.clearIcon}><TrashIcon /></span>
        Xóa bộ lọc
      </button>
    </div>
  );
}