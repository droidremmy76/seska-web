"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useScene, type SceneMode } from "@/context/SceneContext";

type ScenePreset = {
  background: string;
  camera: [number, number, number];
  key: string;
  fill: string;
  keyIntensity: number;
  fillIntensity: number;
  groupRotation: [number, number, number];
};

const PRESETS: Record<SceneMode, ScenePreset> = {
  hero: {
    background: "#020817",
    camera: [0, 0, 10],
    key: "#00AEEF",
    fill: "#FF007F",
    keyIntensity: 3.2,
    fillIntensity: 1.9,
    groupRotation: [0.12, -0.18, 0],
  },
  services: {
    background: "#07111D",
    camera: [0.55, -0.12, 10.8],
    key: "#00AEEF",
    fill: "#FFE600",
    keyIntensity: 2.8,
    fillIntensity: 1.5,
    groupRotation: [-0.08, 0.22, 0.05],
  },
  work: {
    background: "#090A16",
    camera: [-0.48, 0.24, 9.6],
    key: "#FF007F",
    fill: "#00AEEF",
    keyIntensity: 3.4,
    fillIntensity: 1.8,
    groupRotation: [0.05, -0.3, -0.04],
  },
  process: {
    background: "#020817",
    camera: [0.18, -0.36, 11.2],
    key: "#FFE600",
    fill: "#00AEEF",
    keyIntensity: 2.5,
    fillIntensity: 1.35,
    groupRotation: [-0.2, 0.1, 0.08],
  },
  contact: {
    background: "#050914",
    camera: [0, 0.32, 9.2],
    key: "#00AEEF",
    fill: "#FF007F",
    keyIntensity: 3.6,
    fillIntensity: 2.2,
    groupRotation: [0.16, 0.32, -0.08],
  },
};

export function SceneController() {
  const { scene: sceneMode } = useScene();
  const { camera, scene } = useThree();
  const keyRef = useRef<THREE.PointLight | null>(null);
  const fillRef = useRef<THREE.PointLight | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  const target = PRESETS[sceneMode];
  const targetBackground = useMemo(() => new THREE.Color(target.background), [target.background]);
  const targetKey = useMemo(() => new THREE.Color(target.key), [target.key]);
  const targetFill = useMemo(() => new THREE.Color(target.fill), [target.fill]);
  const targetCamera = useMemo(() => new THREE.Vector3(...target.camera), [target.camera]);
  const targetRotation = useMemo(
    () => new THREE.Euler(...target.groupRotation),
    [target.groupRotation]
  );

  useEffect(() => {
    const fog = new THREE.Fog("#020817", 8, 24);
    scene.fog = fog;
    scene.background = new THREE.Color("#020817");
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-3.2 * delta);
    camera.position.lerp(targetCamera, ease);
    camera.lookAt(0, 0, 0);

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetBackground, ease * 0.65);
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(targetBackground, ease * 0.55);
    }

    if (keyRef.current) {
      keyRef.current.color.lerp(targetKey, ease);
      keyRef.current.intensity = THREE.MathUtils.lerp(
        keyRef.current.intensity,
        target.keyIntensity,
        ease
      );
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(targetFill, ease);
      fillRef.current.intensity = THREE.MathUtils.lerp(
        fillRef.current.intensity,
        target.fillIntensity,
        ease
      );
    }

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.x,
        ease * 0.7
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.y,
        ease * 0.7
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.z,
        ease * 0.7
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight ref={keyRef} position={[4.5, 3, 4]} color="#00AEEF" intensity={3.2} distance={26} />
      <pointLight ref={fillRef} position={[-4, -2, 2]} color="#FF007F" intensity={1.9} distance={24} />
      <group ref={groupRef}>
        <mesh position={[-4.7, 2.6, -2.8]} rotation={[0.2, 0.4, 0.2]}>
          <torusGeometry args={[1.25, 0.018, 8, 96]} />
          <meshBasicMaterial color="#00AEEF" transparent opacity={0.18} depthWrite={false} />
        </mesh>
        <mesh position={[4.4, -2.1, -3.2]} rotation={[0.8, 0.2, 0.6]}>
          <torusGeometry args={[1.7, 0.014, 8, 96]} />
          <meshBasicMaterial color="#FF007F" transparent opacity={0.15} depthWrite={false} />
        </mesh>
        <mesh position={[0.8, 3.7, -4]} rotation={[0.5, -0.3, 0.1]}>
          <torusGeometry args={[0.85, 0.012, 8, 80]} />
          <meshBasicMaterial color="#FFE600" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}
