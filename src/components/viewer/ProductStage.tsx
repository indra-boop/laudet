import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import * as THREE from "three";
import { studio } from "@/lib/catalog";
import { useViewer, zoomLabelRef, type ViewerApi } from "@/lib/viewer-store";
import { JerryCan } from "@/components/viewer/Halo";

const TARGET = new THREE.Vector3(0, 0.62, 0);
const HOME = new THREE.Vector3(1.45, 0.92, 1.75);
const HOME_DIST = HOME.distanceTo(TARGET);

function publishZoom(camera: THREE.Camera, target: THREE.Vector3) {
  const el = zoomLabelRef.current;
  if (!el) return;
  const pct = Math.round((HOME_DIST / Math.max(0.001, camera.position.distanceTo(target))) * 100);
  const label = `${pct}%`;
  if (el.textContent !== label) el.textContent = label;
}

function cssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function RoomEnv() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 1.05;
    return () => {
      envMap.dispose();
      pmrem.dispose();
      room.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      if (scene.environment === envMap) scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

function Lights() {
  const keyLevel = useViewer((s) => s.key);
  const fillLevel = useViewer((s) => s.fill);
  const rimLevel = useViewer((s) => s.rim);
  const temp = useViewer((s) => s.temp);
  const keyColor = useMemo(() => {
    const cool = new THREE.Color(studio.keyCool);
    const warm = new THREE.Color(studio.keyWarm);
    return cool.lerp(warm, temp / 100);
  }, [temp]);

  return (
    <>
      <hemisphereLight args={[studio.ambientSky, studio.ambientGround, 0.38]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[3.4, 6.4, 4.1]}
        intensity={(keyLevel / 100) * 4.4}
        color={keyColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight
        position={[-4.2, 2.4, 3.2]}
        intensity={(fillLevel / 100) * 2.1}
        color={studio.fill}
      />
      <directionalLight
        position={[-2.2, 3.4, -4.4]}
        intensity={(rimLevel / 100) * 3.2}
        color={studio.rim}
      />
    </>
  );
}

function Plinth() {
  const [top] = useState(() => cssColor("--color-plinth", "#d5e0ec"));
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <circleGeometry args={[1.6, 64]} />
        <shadowMaterial opacity={0.28} transparent />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.72, 0.76, 0.04, 64]} />
        <meshStandardMaterial color={top} roughness={0.94} metalness={0} />
      </mesh>
    </group>
  );
}

function StudioRig() {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((s) => s.camera);
  const autoRotate = useViewer((s) => s.autoRotate);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    camera.position.copy(HOME);
    orbit.target.copy(TARGET);
    orbit.update();
    orbit.saveState();

    const api: ViewerApi = {
      reset() {
        orbit.reset();
        publishZoom(orbit.object, orbit.target);
      },
      zoomBy(factor: number) {
        const offset = orbit.object.position.clone().sub(orbit.target);
        const next = THREE.MathUtils.clamp(
          offset.length() * factor,
          orbit.minDistance,
          orbit.maxDistance,
        );
        offset.setLength(next);
        orbit.object.position.copy(orbit.target).add(offset);
        orbit.update();
        publishZoom(orbit.object, orbit.target);
      },
    };
    useViewer.getState().setApi(api);
    publishZoom(orbit.object, orbit.target);
    return () => useViewer.getState().setApi(null);
  }, [camera]);

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.72}
      zoomSpeed={0.65}
      autoRotate={autoRotate && !dragging}
      autoRotateSpeed={0.55}
      minDistance={1.25}
      maxDistance={4.8}
      minPolarAngle={0.42}
      maxPolarAngle={Math.PI / 2 + 0.06}
      target={[TARGET.x, TARGET.y, TARGET.z]}
      onStart={() => setDragging(true)}
      onEnd={() => {
        setDragging(false);
        const orbit = controls.current;
        if (orbit) publishZoom(orbit.object, orbit.target);
      }}
      onChange={() => {
        const orbit = controls.current;
        if (orbit) publishZoom(orbit.object, orbit.target);
      }}
    />
  );
}

function Scene() {
  return (
    <>
      <RoomEnv />
      <Lights />
      <JerryCan />
      <Plinth />
      <StudioRig />
    </>
  );
}

export function ProductStage() {
  const [background] = useState(() => cssColor("--color-stage", "#e6eef6"));

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.7]}
      camera={{ position: [HOME.x, HOME.y, HOME.z], fov: 32, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color(background);
      }}
    >
      <Scene />
    </Canvas>
  );
}
