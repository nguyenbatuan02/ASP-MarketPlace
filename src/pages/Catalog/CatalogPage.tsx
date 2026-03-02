import { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CatalogNavbar from '../components/CatalogNavbar/CatalogNavbar';
import ProductItem from '../components/ProductItem/ProductItem';
import { VehicleListInline } from '../components/VehicleList/VehicleList';
import VehicleListModal from '../components/VehicleList/VehicleList';
import {
  CATALOG_TEXT,
  MOCK_FILTERS,
  MOCK_SEARCH_RESULTS,
  MOCK_REPLACEMENT_PARTS,
  MOCK_PARTS_LIST,
  MOCK_VEHICLES,
} from './constants';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  const [searchType, setSearchType] = useState<'parts' | 'vehicle'>('parts');
  const [filters, setFilters] = useState(MOCK_FILTERS);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const handleFilterChange = (gi: number, oi: number) => {
    const updated = [...filters];
    updated[gi] = {
      ...updated[gi],
      options: updated[gi].options.map((opt, i) =>
        i === oi ? { ...opt, checked: !opt.checked } : opt
      ),
    };
    setFilters(updated);
  };

  const handleClearFilters = () => {
    setFilters(
      filters.map((g) => ({
        ...g,
        options: g.options.map((o) => ({ ...o, checked: false })),
      }))
    );
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleSection}>
        <h1 className={styles.pageTitle}>{CATALOG_TEXT.pageTitle}</h1>
      </div>

      <div className={styles.container}>
        {/* Navbar */}
        <div className={styles.navCol}>
          <CatalogNavbar
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            onSearch={(kw) => console.log('search:', kw)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main content */}
        <div className={styles.mainCol}>
          {searchType === 'parts' ? (
            <>
              {/* Kết quả tìm kiếm */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.searchResult}</h2>
              </div>
              <div className={styles.productGrid}>
                {MOCK_SEARCH_RESULTS.map((p, i) => (
                  <div key={`sr-${i}`} className={styles.productGridItem}>
                    <ProductItem data={p} />
                  </div>
                ))}
              </div>

              {/* Danh sách phụ tùng thay thế */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.replacementParts}</h2>
              </div>
              <div className={styles.productGrid}>
                {MOCK_REPLACEMENT_PARTS.map((p, i) => (
                  <div key={`rp-${i}`} className={styles.productGridItem}>
                    <ProductItem data={p} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Danh sách xe đã tìm thấy */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.vehicleFound}</h2>
                <button
                  className={styles.viewMoreBtn}
                  onClick={() => setVehicleModalOpen(true)}
                >
                  Xem thêm (18 xe)
                </button>
              </div>
              <div className={styles.vehicleListWrap}>
                <VehicleListInline
                  vehicles={MOCK_VEHICLES}
                  selectedIndex={selectedVehicle}
                  onSelect={setSelectedVehicle}
                />
              </div>

              {/* Danh sách phụ tùng */}
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{CATALOG_TEXT.partsList}</h2>
              </div>
              <div className={styles.productGrid}>
                {MOCK_PARTS_LIST.map((p, i) => (
                  <div key={`pl-${i}`} className={styles.productGridItem}>
                    <ProductItem data={p} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* Vehicle Modal */}
      <VehicleListModal
        open={vehicleModalOpen}
        vehicles={MOCK_VEHICLES}
        onClose={() => setVehicleModalOpen(false)}
        onSave={(index) => {
          setSelectedVehicle(index);
          setVehicleModalOpen(false);
        }}
      />
    </div>
  );
}