"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";

interface NavbarProps {
  isVisible?: boolean;
}

export function Navbar({ isVisible = false }: NavbarProps) {
  return (
    <nav
      className={`${styles.navbar} ${isVisible ? styles.navbarVisible : ""}`}
    >
      <div className={styles.logo}>
        <Link href="/">Mineral.ltd</Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/services">Services</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/agentforce">AgentForce</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact" className={styles.getInTouch}>
          Get in touch
        </Link>
      </div>
    </nav>
  );
}
