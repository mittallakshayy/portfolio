// src/App.jsx
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  const avatarRef = useRef();
  const mixer = useRef();

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations;
    const waveClip = THREE.AnimationClip.findByName(clips, "waving");
    const stumbleClip = THREE.AnimationClip.findByName(clips, "stagger");
    const waveAction = mixer.current.clipAction(waveClip);
    const stumbleAction = mixer.current.clipAction(stumbleClip);

    waveAction.play();

    return () => {
      waveAction.stop();
      stumbleAction.stop();
    };
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      ref={avatarRef}
      onClick={(event) => {
        const isStumbling = false; // Manage the state appropriately
        if (isStumbling) return;

        // Stumbling logic
        const stumbleAction = mixer.current.clipAction("stagger");
        stumbleAction.reset().play();
        setTimeout(() => {
          const waveAction = mixer.current.clipAction("waving");
          waveAction.reset().play();
        }, 4000);
      }}
    />
  );
};

const Ground = () => (
  <mesh position-y={-0.05}>
    <cylinderBufferGeometry args={[0.6, 0.6, 0.1, 64]} />
    <meshStandardMaterial />
  </mesh>
);

const App = () => {
  return (
    <Canvas shadows camera={{ position: [0.2, 0.5, 1], fov: 45 }}>
      <ambientLight />
      <spotLight position={[0, 4, 2]} penumbra={0.5} angle={Math.PI / 6} />
      <directionalLight position={[1, 1, 2]} />
      <Model url="../../public/untitled.glb" />
      <Ground />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
