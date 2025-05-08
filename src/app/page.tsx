"use client";

import { useState } from "react";
import { Model3D } from "./components/introLogo/Model3D";
import styles from "./styles/page.module.css";
import { Navbar } from "./components/navbar/Navbar";
import { Footer } from "./components/footer/Footer";

export default function Home() {
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  const handleTitleClick = () => {
    setIsLoaderVisible(false);
  };

  if (isLoaderVisible) {
    return (
      <div className={styles.loaderScreen}>
        <div className={styles.modelWrapper}>
          <Model3D
            modelPath="/models/walkman2.glb"
            environmentPreset="sunset"
            scale={0.3}
            position={[0, 0, 0]}
            rotation={[0, Math.PI / 4, 0]}
            showControls={true}
            backgroundColor="transparent"
            flipVertical={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            materialProps={{
              color: "#ff6b00",
              metalness: 0.8,
              roughness: 0.1,
              clearcoat: 1,
              clearcoatRoughness: 0.1,
              transmission: 0.5,
              thickness: 0.5,
              ior: 1.5,
              emissiveColor: "#1eff00",
              emissiveIntensity: 0.5,
            }}
          />
        </div>
        <button onClick={handleTitleClick} className={styles.title}>
          Mineral.ltd
        </button>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <Navbar isVisible={true} />
      <div className={styles.mainContent}>
        {/* Main content goes here */}
        <div className={styles.footerWrapper}>
          <Footer isVisible={true} />
        </div>
      </div>
    </main>
  );
}
