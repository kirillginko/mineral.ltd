"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./styles/page.module.css";
import { Navbar } from "./components/navbar/Navbar";
import { Footer } from "./components/footer/Footer";

// Dynamic import with no SSR
const FallbackModel = dynamic(
  () => import("./components/introLogo/FallbackModel"),
  { ssr: false }
);

export default function Home() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Make sure we're on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!showMainContent && (
        <div className={styles.modelView}>
          {/* Model container */}
          <FallbackModel />

          {/* Button positioned at bottom */}
          <button
            onClick={() => setShowMainContent(true)}
            className={styles.modelButton}
          >
            Mineral.ltd
          </button>
        </div>
      )}

      {showMainContent && (
        <main className={styles.main}>
          <Navbar isVisible={true} />
          <div className={styles.mainContent}>
            <div className={styles.footerWrapper}>
              <Footer isVisible={true} />
            </div>
          </div>
        </main>
      )}
    </>
  );
}
