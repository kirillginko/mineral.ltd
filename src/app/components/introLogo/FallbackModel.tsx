"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Model with proper flipping and centering
function Model() {
  const { scene } = useGLTF("/models/walkman2.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Set up the model after loading
  useEffect(() => {
    if (scene && modelRef.current) {
      // Apply materials
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

      // Create a rotation matrix for flipping
      const flipMatrix = new THREE.Matrix4();
      flipMatrix.makeRotationX(Math.PI); // 180 degrees around X axis

      // Apply the flip matrix to all mesh geometries
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          child.geometry.applyMatrix4(flipMatrix);
          child.geometry.computeVertexNormals();
        }
      });

      // Center the model
      const boundingBox = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      scene.position.set(-center.x, -center.y, -center.z);

      modelRef.current.add(scene);
      // Log the matrix to check its values.  This is CRUCIAL for debugging.
      console.log("Flip Matrix:", flipMatrix);
      console.log("Model Position after centering:", scene.position);
    }
  }, [scene]);

  // Auto-rotate animation
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
      {/* The scene is added as a child of this group */}
      <group ref={modelRef} scale={0.17} position={[0, 0, 0]} />
    </group>
  );
}

export default function FallbackModel() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas
        camera={{
          position: [0, 2, 5],
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
            target={[0, 2, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
