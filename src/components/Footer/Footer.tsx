import { FOOTER_ABOUT, FOOTER_LINKS } from '../../constants/menu';
import styles from './Footer.module.css';

// TODO: Thay bằng icon thật từ Figma
// Đặt file vào src/assets/icons/ rồi import
// import icFacebook from '../../assets/icons/ic_facebook.svg';
// import icInstagram from '../../assets/icons/ic_instagram.svg';
// import icLinkedin from '../../assets/icons/ic_linkedin.svg';
// import icTwitter from '../../assets/icons/ic_twitter.svg';
// import icAppstore from '../../assets/icons/ic_appstore.svg';
// import icGoogleplay from '../../assets/icons/ic_googleplay.svg';

const SOCIAL_ICONS = [
  { name: 'facebook', src: '' },
  { name: 'instagram', src: '' },
  { name: 'linkedin', src: '' },
  { name: 'twitter', src: '' },
];

const APP_BUTTONS = [
  { icon: '', label: 'Download on the', name: 'Apple Store' },
  { icon: '', label: 'Download from', name: 'Google Play' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left: Brand */}
        <div className={styles.brand}>
          {/* Logo + Description */}
          <div className={styles.brandInfo}>
            <div className={styles.logo}>
              <span style={{ fontWeight: 800, fontSize: 22, color: '#F26522' }}>⚡ASP</span>
            </div>
            <p className={styles.description}>{FOOTER_ABOUT.description}</p>
          </div>

          {/* Social */}
          <div className={styles.socialSection}>
            <span className={styles.sectionLabel}>Social</span>
            <div className={styles.socialIcons}>
              {SOCIAL_ICONS.map((s) => (
                <button key={s.name} className={styles.iconButton} title={s.name}>
                  {/* Thay bằng: <img src={s.src} alt={s.name} width={20} height={20} /> */}
                  <div style={{ width: 20, height: 20, background: '#d9d9d9', borderRadius: 4 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Apps */}
          <div className={styles.appsSection}>
            <span className={styles.sectionLabel}>Apps</span>
            <div className={styles.appButtons}>
              {APP_BUTTONS.map((app) => (
                <a key={app.name} href="#" className={styles.appBtn}>
                  {/* Thay bằng: <img src={app.icon} alt={app.name} width={28} height={28} /> */}
                  <div style={{ width: 28, height: 28, background: '#555', borderRadius: 4 }} />
                  <div className={styles.appBtnText}>
                    <span className={styles.appBtnLabel}>{app.label}</span>
                    <span className={styles.appBtnName}>{app.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Links */}
        <div className={styles.linksArea}>
          {/* Về ASP */}
          <div className={styles.linkColumn}>
            <span className={styles.columnTitle}>{FOOTER_LINKS.about.title}</span>
            {FOOTER_LINKS.about.items.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>{item.label}</a>
            ))}
          </div>

          {/* Điều khoản */}
          <div className={styles.linkColumn}>
            <span className={styles.columnTitle}>{FOOTER_LINKS.policies.title}</span>
            {FOOTER_LINKS.policies.items.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>{item.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <span className={styles.copyright}>© 2023. All rights reserved</span>
        <div className={styles.bottomLinks}>
          <a href="#" className={styles.bottomLink}>Help Center</a>
          <a href="#" className={styles.bottomLink}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}