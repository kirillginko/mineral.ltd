"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  PresentationControls,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import styles from "./ModelLoader.module.css";

interface ModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  flipVertical?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  materialProps?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    transmission?: number;
    thickness?: number;
    ior?: number;
  };
}

function Model({
  path,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  flipVertical = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  materialProps = {
    color: "#ff6b00",
    metalness: 0.8,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 0.5,
    thickness: 0.5,
    ior: 1.5,
  },
}: ModelProps) {
  const { scene } = useGLTF(path);
  const modelRef = useRef<THREE.Group>(null);

  // Apply vertical flip if needed
  useEffect(() => {
    if (flipVertical && modelRef.current) {
      modelRef.current.scale.y = -Math.abs(modelRef.current.scale.y);
    }

    // Apply material to all meshes in the scene
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial(materialProps);
      }
    });
  }, [flipVertical, scene, materialProps]);

  // Auto-rotate logic
  useFrame((_, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * autoRotateSpeed;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

interface ModelLoaderProps {
  modelPath?: string;
  backgroundColor?: string;
  showControls?: boolean;
  environmentPreset?:
    | "sunset"
    | "dawn"
    | "night"
    | "warehouse"
    | "forest"
    | "apartment"
    | "studio"
    | "city"
    | "park"
    | "lobby";
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  flipVertical?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  materialProps?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    transmission?: number;
    thickness?: number;
    ior?: number;
  };
}

export function ModelLoader({
  modelPath = "/models/walkman.glb",
  backgroundColor = "transparent",
  showControls = true,
  environmentPreset = "studio",
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  flipVertical = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  materialProps,
}: ModelLoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 40,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: backgroundColor }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[-10, 10, -10]}
          angle={0.5}
          intensity={1}
          castShadow
        />
        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
            speed={1.5}
          >
            <Center>
              <Model
                path={modelPath}
                scale={scale}
                position={position}
                rotation={rotation}
                flipVertical={flipVertical}
                autoRotate={autoRotate}
                autoRotateSpeed={autoRotateSpeed}
                materialProps={materialProps}
              />
            </Center>
          </PresentationControls>
          <Environment preset={environmentPreset} />
          {showControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.75}
              makeDefault
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model to improve performance
useGLTF.preload("/models/walkman2.glb");
