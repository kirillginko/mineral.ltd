"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Center,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

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
    emissiveColor?: string;
    emissiveIntensity?: number;
  };
}

interface ModelLoaderProps extends Omit<ModelProps, "path"> {
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
    emissiveColor: "#ff3000",
    emissiveIntensity: 0.5,
  },
}: ModelProps) {
  const { scene } = useGLTF(path);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (flipVertical && modelRef.current) {
      modelRef.current.scale.y = -Math.abs(modelRef.current.scale.y);
    }

    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshPhysicalMaterial({
          ...materialProps,
          emissive: materialProps.emissiveColor
            ? new THREE.Color(materialProps.emissiveColor)
            : undefined,
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Auto-rotation setup
    const intervalId = autoRotate
      ? setInterval(() => {
          if (modelRef.current) {
            modelRef.current.rotation.y += 0.01 * autoRotateSpeed;
          }
        }, 16)
      : null;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [flipVertical, scene, materialProps, autoRotate, autoRotateSpeed]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}

export function ModelLoader({
  modelPath = "/models/walkman.glb",
  backgroundColor = "transparent",
  showControls = true,
  environmentPreset = "sunset",
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  flipVertical = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  materialProps,
}: ModelLoaderProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        left: 0,
        top: 0,
        background: backgroundColor,
        zIndex: 101,
      }}
    >
      <ambientLight intensity={1.0} />
      <pointLight position={[10, 10, 10]} intensity={2} />

      <Suspense fallback={<Loader />}>
        <Center scale={[2, 2, 2]}>
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
        <Environment preset={environmentPreset} />
        {showControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.75}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

// Preload the model to improve performance
useGLTF.preload("/models/walkman2.glb");
