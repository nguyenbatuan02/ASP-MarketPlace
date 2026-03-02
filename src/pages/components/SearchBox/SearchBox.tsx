import { useState } from 'react';
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
  const [mode, setMode] = useState<SearchMode>('part');
  const [vinMode, setVinMode] = useState(false);
  const [partCode, setPartCode] = useState('');
  const [vin, setVin] = useState('');
  const [vehicle, setVehicle] = useState({ brand: '', model: '', year: '', engine: '', chassis: '', origin: '' });

  const handleSearch = () => {
    if (mode === 'part') onSearch?.({ mode, partCode });
    else if (vinMode) onSearch?.({ mode, vin });
    else onSearch?.({ mode, ...vehicle });
  };

  return (
    <div className={styles.card}>
      {/* Frame 1 — mode selector */}
      <div className={styles.frame1}>
        <div className={styles.labelWrap}>
          <span className={styles.label}>Tìm kiếm theo</span>
        </div>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={mode}
            onChange={e => setMode(e.target.value as SearchMode)}
          >
            <option value="part">Phụ tùng</option>
            <option value="vehicle">Xe</option>
          </select>
          <span className={styles.selectIcon}><ChevronDownIcon /></span>
        </div>
      </div>

      {/* Frame 2 */}
      <div className={styles.frame2}>
        {mode === 'part' ? (
          /* ── Part search ── */
          <>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                placeholder="Nhập mã phụ tùng"
                value={partCode}
                onChange={e => setPartCode(e.target.value)}
              />
              <span className={styles.inputIcon}><SearchIcon /></span>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.searchBtn} onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </>
        ) : (
          /* ── Vehicle search ── */
          <>
            {/* Toggle VIN */}
            <div className={styles.toggleRow}>
              <button
                className={`${styles.toggle} ${vinMode ? styles.toggleOn : ''}`}
                onClick={() => setVinMode(!vinMode)}
                aria-label="Toggle VIN search"
              >
                <span className={styles.toggleTrack} />
                <span className={styles.toggleKnob} />
              </button>
              <span className={styles.toggleLabel}>Tìm kiếm xe theo số VIN</span>
            </div>

            {vinMode ? (
              /* VIN input */
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  placeholder="Nhập số VIN"
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                />
                <span className={styles.inputIcon}><SearchIcon /></span>
              </div>
            ) : (
              /* 6 selects */
              <div className={styles.selectGrid}>
                <div className={styles.selectRow}>
                  {(['brand', 'model', 'year'] as const).map((f, i) => (
                    <div key={f} className={styles.selectWrapFull}>
                      <select
                        className={styles.select}
                        value={vehicle[f]}
                        onChange={e => setVehicle({ ...vehicle, [f]: e.target.value })}
                      >
                        <option value="">{['Hãng xe', 'Model', 'Năm'][i]}</option>
                      </select>
                      <span className={styles.selectIcon}><ChevronDownIcon /></span>
                    </div>
                  ))}
                </div>
                <div className={styles.selectRow}>
                  {(['engine', 'chassis', 'origin'] as const).map((f, i) => (
                    <div key={f} className={styles.selectWrapFull}>
                      <select
                        className={styles.select}
                        value={vehicle[f]}
                        onChange={e => setVehicle({ ...vehicle, [f]: e.target.value })}
                      >
                        <option value="">{['Động cơ', 'Chasis', 'Nước sản xuất'][i]}</option>
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