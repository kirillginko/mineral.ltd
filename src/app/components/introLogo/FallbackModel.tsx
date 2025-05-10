"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/logo.glb");
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene && modelRef.current) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: "#ff6b00",
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1,
            emissive: new THREE.Color("#1eff00"),
            emissiveIntensity: 0.3,
          });
        }
      });

      const boundingBox = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      scene.position.set(-center.x, -center.y, -center.z);

      modelRef.current.add(scene);

      const modelGroupBoundingBox = new THREE.Box3().setFromObject(
        modelRef.current
      );
      const modelGroupCenter = new THREE.Vector3();
      modelGroupBoundingBox.getCenter(modelGroupCenter);
      modelRef.current.position.y = -modelGroupCenter.y;

      console.log("Model Position after initial centering:", scene.position);
      console.log("Model Group Center:", modelGroupCenter);
      console.log(
        "Model Group Position after vertical adjustment:",
        modelRef.current.position
      );
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={modelRef} scale={0.1}>
      {" "}
      {/* Changed scale to 0.1 */}{" "}
    </group>
  );
}

export default function FallbackModel() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <Model />
          <Environment preset="sunset" />
          <OrbitControls
            enableZoom={false}
            autoRotate={false}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
