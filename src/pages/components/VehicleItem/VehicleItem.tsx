import styles from './VehicleItem.module.css';

export interface VehicleItemData {
  title: string;       
  subtitle: string;    
  specs: string;       
  image: string;
}

interface Props {
  data: VehicleItemData;
  selected?: boolean;
  onSelect?: () => void;
  mobile?: boolean;
}

export default function VehicleItem({ data, selected = false, onSelect, mobile = false }: Props) {
  const { title, subtitle, specs, image } = data;

  if (mobile) {
    return (
      <div className={styles.cardMobile} onClick={onSelect}>
        <div className={styles.radioWrapMobile}>
          <div className={`${styles.radioMobile} ${selected ? styles.radioSelected : ''}`}>
            {selected && <div className={styles.radioDot} />}
          </div>
        </div>
        <div className={styles.itemMobile}>
          <div className={styles.itemInnerMobile}>
            <div className={styles.imageWrapMobile}>
              <img className={styles.imageMobile} src={image} alt={title} />
            </div>
            <div className={styles.infoMobile}>
              <h4 className={styles.titleMobile}>{title}</h4>
              <p className={styles.subtitleMobile}>{subtitle}</p>
              <p className={styles.specsMobile}>{specs}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={onSelect}>
      <div className={styles.radioWrap}>
        <div className={`${styles.radio} ${selected ? styles.radioSelected : ''}`}>
          {selected && <div className={styles.radioDot} />}
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.itemInner}>
          <div className={styles.imageWrap}>
            <img className={styles.image} src={image} alt={title} />
          </div>
          <div className={styles.info}>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.subtitle}>{subtitle}</p>
            <p className={styles.specs}>{specs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}