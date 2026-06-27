import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  theme: 'dark' | 'light';
}

interface SakuraPetal {
  mesh: THREE.Mesh;
  speedY: number;
  speedX: number;
  angle: number;
  angleSpeed: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  seed: number;
}

export default function ThreeCanvas({ theme }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const isLight = theme === 'light';
    
    // Theme-based 3D color choices for wireframe and core
    const colorWireframe = isLight ? 0x0891b2 : 0x06b6d4; // Cyan accent lines
    const colorCore = isLight ? 0x64748b : 0x475569; // Slate gray core
    const colorStars = isLight ? 0x94a3b8 : 0xffffff; // Twinkling star colors

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    // Shift camera/scene to the right on desktop, center on mobile
    scene.position.x = window.innerWidth > 992 ? 1.8 : 0;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.75 : 0.45);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(colorWireframe, 2.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Objects
    // 1. Central Professional Wireframe Sphere
    const sphereGeometry = new THREE.SphereGeometry(2.0, 24, 24);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: colorWireframe,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.22 : 0.15,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const wireframeSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(wireframeSphere);

    // 2. Central Core Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: colorCore,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.35 : 0.22,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // 3. Twinkling Background Silver Stars
    const starCount = 300;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 16.0;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 12.0;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 8.0 - 2.0;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: colorStars,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. 3D Cherry Blossom (Sakura) Petals (Unique, elegant, girlie yet professional)
    const petals: SakuraPetal[] = [];
    const petalCount = 65;
    const petalGeom = new THREE.BoxGeometry(0.15, 0.02, 0.22);
    
    // Soft glowing cherry blossom pink material
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xf472b6,
      emissiveIntensity: isLight ? 0.18 : 0.45,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeom, petalMat);
      mesh.position.set(
        (Math.random() - 0.5) * 9.0,
        Math.random() * 8.0 - 4.0,
        (Math.random() - 0.5) * 6.0
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(mesh);

      petals.push({
        mesh,
        speedY: 0.4 + Math.random() * 0.65, // falling downward
        speedX: -0.15 - Math.random() * 0.25, // gentle drift leftwards
        angle: Math.random() * Math.PI * 2,
        angleSpeed: 0.8 + Math.random() * 1.5,
        rotX: 0.4 + Math.random() * 0.8,
        rotY: 0.3 + Math.random() * 0.6,
        rotZ: 0.2 + Math.random() * 0.7,
        seed: Math.random() * 100,
      });
    }

    // Mouse Interaction
    const handleMouseMove = (event: MouseEvent) => {
      // Map screen coordinates relative to canvas center
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) - 0.5;
      const y = ((event.clientY - rect.top) / rect.height) - 0.5;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      scene.position.x = window.innerWidth > 992 ? 1.8 : 0;
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse coordinate tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Project mouse coordinates to 3D world space for repelling forces
      // (accounting for screen offset shift)
      const shiftX = window.innerWidth > 992 ? 1.8 : 0;
      const mouseWorldPos = new THREE.Vector3(
        mouseRef.current.x * 8.0 + shiftX,
        -mouseRef.current.y * 6.0,
        0
      );

      // 1. Rotate Central Core Structures (Professional engineering motif)
      wireframeSphere.rotation.y = elapsedTime * 0.06;
      wireframeSphere.rotation.x = elapsedTime * 0.02;
      coreMesh.rotation.y = -elapsedTime * 0.1;
      coreMesh.rotation.z = -elapsedTime * 0.05;

      // Pulse effects
      const pulse = Math.sin(elapsedTime * 1.8) * 0.08;
      wireframeSphere.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      coreMesh.scale.set(1 - pulse, 1 - pulse, 1 - pulse);

      // Twinkle star field opacities
      starMaterial.opacity = 0.65 + Math.sin(elapsedTime * 3) * 0.2;

      // 2. Animate 3D Sakura Petals (Girlie drift physics + mouse scattering)
      petals.forEach((p) => {
        // Wind drift
        p.mesh.position.y -= p.speedY * delta;
        p.mesh.position.x += p.speedX * delta;
        
        // Swaying motion
        p.angle += p.angleSpeed * delta;
        p.mesh.position.x += Math.sin(p.angle) * 0.18 * delta;

        // Individual tumbling rotations
        p.mesh.rotation.x += p.rotX * delta;
        p.mesh.rotation.y += p.rotY * delta;
        p.mesh.rotation.z += p.rotZ * delta;

        // Mouse repeller force: if mouse gets close, push the petals away
        const dist = p.mesh.position.distanceTo(mouseWorldPos);
        if (dist < 1.8) {
          const pushDir = new THREE.Vector3().subVectors(p.mesh.position, mouseWorldPos).normalize();
          // Stronger force closer to cursor
          const force = (1.8 - dist) * 3.5;
          p.mesh.position.addScaledVector(pushDir, force * delta);
        }

        // Boundary recycling (wrap around top or right)
        if (p.mesh.position.y < -4.5) {
          p.mesh.position.y = 4.5;
          p.mesh.position.x = (Math.random() - 0.5) * 9.0 + shiftX;
          p.mesh.position.z = (Math.random() - 0.5) * 6.0;
        }
        if (p.mesh.position.x < -6.0) {
          p.mesh.position.x = 6.0;
        }
      });

      // Local mouse parallax on the entire scene rotation
      scene.rotation.y = mouseRef.current.x * 0.6;
      scene.rotation.x = mouseRef.current.y * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    // Clean-up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      petalGeom.dispose();
      petalMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div ref={containerRef} className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
