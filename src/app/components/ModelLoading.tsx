"use client";

import styles from "./ModelLoading.module.css";

interface ModelLoadingProps {
  text?: string;
  className?: string;
}

export function ModelLoading({
  text = "Loading 3D model...",
  className = "",
}: ModelLoadingProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
