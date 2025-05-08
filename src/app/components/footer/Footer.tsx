import Link from "next/link";
import styles from "./Footer.module.css";

interface FooterProps {
  isVisible?: boolean;
}

export function Footer({ isVisible = true }: FooterProps) {
  return (
    <footer
      className={`${styles.footer} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.container}>
        <h1 className={styles.brandLogo}>Mineral.ltd</h1>

        <div className={styles.grid}>
          {/* First column */}
          <div className={styles.column}>
            <Link href="/" className={styles.link}>
              Home
            </Link>
            <Link href="/services" className={styles.link}>
              Services
            </Link>
          </div>

          {/* Second column */}
          <div className={styles.column}>
            <Link href="/blogs" className={styles.link}>
              All Blogs
            </Link>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
            <Link href="/about" className={styles.link}>
              About
            </Link>
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
          </div>

          {/* Third column */}
          <div className={styles.column}>
            <Link
              href="https://instagram.com"
              target="_blank"
              className={styles.link}
            >
              Instagram
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className={styles.link}
            >
              Twitter/X
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className={styles.link}
            >
              LinkedIn
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              className={styles.link}
            >
              Facebook
            </Link>
          </div>
        </div>

        {/* Copyright text */}
        <div className={styles.copyright}>
          <p className={styles.tagline}>
            Ai Powered Music
            <br />
            Playlists Creator
          </p>
          <p className={styles.companyInfo}>
            {new Date().getFullYear()} © Mineral.ltd
            <br />
            All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
