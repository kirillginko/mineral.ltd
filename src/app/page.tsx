import { Model3D } from "./components/Model3D";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.modelContainer}>
        <Model3D
          modelPath="/models/walkman2.glb"
          environmentPreset="sunset"
          scale={3}
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
          }}
        />
      </div>
    </main>
  );
}
