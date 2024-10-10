import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ModelViewer = () => {
  const containerRef = useRef(null);
  const mixerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const container = containerRef.current;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight
    );
    camera.position.set(0.2, 0.5, 2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 3;
    controls.minPolarAngle = 1.4;
    controls.maxPolarAngle = 1.4;
    controls.target.set(0, 0.75, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight());

    const spotlight = new THREE.SpotLight(0xffffff, 20, 8, 1);
    spotlight.penumbra = 0.5;
    spotlight.position.set(0, 4, 2);
    spotlight.castShadow = true;
    scene.add(spotlight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(1, 1, 2);
    keyLight.lookAt(new THREE.Vector3());
    scene.add(keyLight);

    loader.load(
      "../public/untitled.glb",
      (gltf) => {
        const avatar = gltf.scene;
        avatarRef.current = avatar;

        avatar.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(avatar);

        const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
          color: 0x888888,
        });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.castShadow = false;
        groundMesh.receiveShadow = true;
        groundMesh.position.y = -0.08;
        scene.add(groundMesh);

        mixerRef.current = new THREE.AnimationMixer(avatar);
        const clips = gltf.animations;
        const waveClip = THREE.AnimationClip.findByName(clips, "waving");
        const stumbleClip = THREE.AnimationClip.findByName(clips, "stumble");
        const warmClip = THREE.AnimationClip.findByName(clips, "warm");
        const entryClip = THREE.AnimationClip.findByName(clips, "entry");
        const danceClip = THREE.AnimationClip.findByName(clips, "dance ");

        const waveAction = mixerRef.current.clipAction(waveClip);
        const stumbleAction = mixerRef.current.clipAction(stumbleClip);
        const warmAction = mixerRef.current.clipAction(warmClip);
        const entryAction = mixerRef.current.clipAction(entryClip);
        const danceAction = mixerRef.current.clipAction(danceClip);

        danceAction.setEffectiveTimeScale(0.5);
        entryAction.setEffectiveTimeScale(0.5);
        waveAction.setEffectiveTimeScale(0.5);
        stumbleAction.setEffectiveTimeScale(0.6);
        warmAction.setEffectiveTimeScale(0.5);

        let isStumbling = false;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isHoveringAvatar = false;

        container.addEventListener("mousemove", (ev) => {
          mouse.x = (ev.offsetX / container.clientWidth) * 2 - 1;
          mouse.y = -(ev.offsetY / container.clientHeight) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObject(avatar, true);

          if (intersects.length > 0) {
            if (!isHoveringAvatar) {
              isHoveringAvatar = true;
              if (!warmAction.isRunning()) {
                warmAction.reset().play();
                waveAction.crossFadeTo(warmAction, 0.3);
              }
            }
          } else {
            if (isHoveringAvatar) {
              isHoveringAvatar = false;
              if (warmAction.isRunning()) {
                waveAction.reset().play();
                warmAction.crossFadeTo(waveAction, 1.5);
                setTimeout(() => warmAction.stop(), 1000);
              }
            }
          }
        });

        container.addEventListener("mouseleave", () => {
          if (warmAction.isRunning()) {
            warmAction.crossFadeTo(waveAction, 0.5);
            warmAction.stop();
            waveAction.reset().play();
          }
        });

        container.addEventListener("mousedown", (ev) => {
          if (isStumbling) return;

          isStumbling = true;
          stumbleAction.reset();
          stumbleAction.play();

          if (warmAction.isRunning()) {
            warmAction.crossFadeTo(stumbleAction, 0.2);
          } else {
            waveAction.crossFadeTo(stumbleAction, 0.3);
          }

          setTimeout(() => {
            waveAction.reset();
            waveAction.play();
            stumbleAction.crossFadeTo(waveAction, 0.5);
            isStumbling = false;
          }, 4000);
        });
        // danceAction.setLoop(THREE.LoopOnce);
        // danceAction.clampWhenFinished = true;

        // danceAction.onFinished = () => {
        //   waveAction.play();
        //   danceAction.crossFadeTo(waveAction, 0.5);
        // };
        // danceAction.play();
        waveAction.play();
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model:", error);
      }
    );

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ModelViewer;
