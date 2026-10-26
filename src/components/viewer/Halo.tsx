import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function makeLabel() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#f7fbff";
  ctx.fillRect(0, 0, 512, 640);

  ctx.fillStyle = "#0c5cab";
  ctx.beginPath();
  ctx.arc(64, 72, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", 64, 74);

  ctx.textAlign = "left";
  ctx.fillStyle = "#0c5cab";
  ctx.font = "600 22px sans-serif";
  ctx.fillText("MURYATECH", 108, 78);

  ctx.fillStyle = "#0b3f86";
  ctx.font = "700 78px sans-serif";
  ctx.fillText("LAUDET L", 36, 190);

  ctx.strokeStyle = "#7eb4e6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(36, 230);
  ctx.lineTo(470, 230);
  ctx.stroke();

  ctx.fillStyle = "#3d5168";
  ctx.font = "600 22px sans-serif";
  ctx.fillText("PREMIUM LAUNDRY DETERGENT", 36, 268);

  const lines = [
    "Main wash",
    "Mengangkat kotoran",
    "Mengikat kotoran",
    "Laundry profesional",
  ];
  ctx.font = "500 20px sans-serif";
  ctx.fillStyle = "#1c3348";
  lines.forEach((line, i) => {
    ctx.fillText(line, 36, 330 + i * 36);
  });

  ctx.fillStyle = "#0c5cab";
  ctx.beginPath();
  ctx.moveTo(0, 560);
  ctx.quadraticCurveTo(160, 500, 280, 560);
  ctx.quadraticCurveTo(400, 620, 512, 540);
  ctx.lineTo(512, 640);
  ctx.lineTo(0, 640);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function JerryCan() {
  const label = useMemo(() => makeLabel(), []);
  const plastic = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e8f5ff",
        roughness: 0.16,
        metalness: 0,
        transmission: 0.82,
        thickness: 0.45,
        ior: 1.46,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.05,
        transparent: true,
      }),
    [],
  );
  const liquid = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#7eb4e6",
        roughness: 0.12,
        metalness: 0,
        transmission: 0.42,
        thickness: 0.9,
        ior: 1.34,
        clearcoat: 0.15,
        envMapIntensity: 0.85,
      }),
    [],
  );
  const capMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c2428",
        roughness: 0.42,
        metalness: 0.2,
      }),
    [],
  );
  const labelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: label,
        roughness: 0.48,
        metalness: 0,
      }),
    [label],
  );

  useEffect(
    () => () => {
      plastic.dispose();
      liquid.dispose();
      capMat.dispose();
      labelMat.dispose();
      label?.dispose();
    },
    [plastic, liquid, capMat, labelMat, label],
  );

  return (
    <group>
      <mesh position={[0, 0.48, 0]} material={liquid} castShadow>
        <boxGeometry args={[0.7, 0.84, 0.42]} />
      </mesh>
      <RoundedBox
        args={[0.82, 1.02, 0.54]}
        radius={0.055}
        smoothness={4}
        position={[0, 0.55, 0]}
        material={plastic}
        castShadow
        receiveShadow
      />
      <RoundedBox
        args={[0.62, 0.08, 0.4]}
        radius={0.03}
        smoothness={2}
        position={[0, 1.08, 0]}
        material={plastic}
        castShadow
      />
      <mesh position={[0.16, 1.16, 0.02]} material={plastic} castShadow>
        <cylinderGeometry args={[0.085, 0.095, 0.08, 32]} />
      </mesh>
      <mesh position={[0.16, 1.225, 0.02]} material={capMat} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.07, 28]} />
      </mesh>
      <mesh position={[0.16, 1.225, 0.02]} material={capMat} castShadow>
        <cylinderGeometry args={[0.112, 0.112, 0.018, 12]} />
      </mesh>
      <mesh position={[-0.12, 1.16, 0]} rotation={[0, 0, Math.PI / 2]} material={plastic} castShadow>
        <capsuleGeometry args={[0.038, 0.26, 6, 16]} />
      </mesh>
      <mesh position={[-0.24, 1.06, 0]} material={plastic} castShadow>
        <cylinderGeometry args={[0.032, 0.036, 0.14, 16]} />
      </mesh>
      <mesh position={[0, 1.06, 0]} material={plastic} castShadow>
        <cylinderGeometry args={[0.032, 0.036, 0.14, 16]} />
      </mesh>
      <mesh position={[0, 0.5, 0.276]} material={labelMat} castShadow>
        <planeGeometry args={[0.64, 0.78]} />
      </mesh>
    </group>
  );
}
