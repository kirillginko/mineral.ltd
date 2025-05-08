import { Model3D } from "./components/introLogo/Model3D";
import styles from "./styles/page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Mineral.ltd</h2>
      <div className={styles.modelContainer}>
        <Model3D
          modelPath="/models/walkman2.glb"
          environmentPreset="sunset"
          scale={0.2}
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 4, 0]}
          showControls={true}
          backgroundColor="transparent"
          flipVertical={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
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
    </main>
  );
}
