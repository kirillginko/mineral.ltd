"use client";

import { Suspense } from "react";
import { ModelLoader } from "./ModelLoader";
import { ModelLoading } from "./ModelLoading";
import styles from "./Model3D.module.css";

interface Model3DProps {
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
  loadingText?: string;
  className?: string;
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
    emissiveColor?: string;
    emissiveIntensity?: number;
  };
}

export function Model3D({
  modelPath = "/models/walkman.glb",
  backgroundColor = "transparent",
  showControls = true,
  environmentPreset = "studio",
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  loadingText = "Loading 3D model...",
  className = "",
  flipVertical = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  materialProps,
}: Model3DProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <Suspense fallback={<ModelLoading text={loadingText} />}>
        <ModelLoader
          modelPath={modelPath}
          backgroundColor={backgroundColor}
          showControls={showControls}
          environmentPreset={environmentPreset}
          scale={scale}
          position={position}
          rotation={rotation}
          flipVertical={flipVertical}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          materialProps={materialProps}
        />
      </Suspense>
    </div>
  );
}
