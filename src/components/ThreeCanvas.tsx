import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  theme: 'dark' | 'light';
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
    const colorWireframe = isLight ? 0x0d9488 : 0x14b8a6; // Teal
    const colorCore = isLight ? 0xe11d48 : 0xf43f5e; // Rose Core
    
    const colorLight1 = isLight ? 0x0d9488 : 0x14b8a6;
    const colorLight2 = isLight ? 0xe11d48 : 0xf43f5e;

    // Multi-color palette choices for particle system
    const colorChoices = isLight
      ? [
          new THREE.Color('#0d9488'), // Teal
          new THREE.Color('#0891b2'), // Cyan
          new THREE.Color('#db2777'), // Pink
          new THREE.Color('#ea580c'), // Orange/Amber
        ]
      : [
          new THREE.Color('#14b8a6'), // Teal
          new THREE.Color('#06b6d4'), // Cyan
          new THREE.Color('#f43f5e'), // Rose/Coral
          new THREE.Color('#f59e0b'), // Amber/Gold
        ];

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
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.7 : 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colorLight1, 2.5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colorLight2, 2.5, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Objects
    // 1. Particle Sphere (dynamic star field / data node network)
    const particleCount = 1200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const radius = 3.5;
    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Randomize distance slightly to create depth
      const r = radius * (0.85 + Math.random() * 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Assign random color from palette
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material with round soft particles
    const particleMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.05,
      transparent: true,
      opacity: isLight ? 0.75 : 0.9,
      sizeAttenuation: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 2. Wireframe Central Sphere (dynamic developer grid)
    const sphereGeometry = new THREE.SphereGeometry(2.2, 24, 24);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: colorWireframe,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.22 : 0.15,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const wireframeSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(wireframeSphere);

    // 3. Inner Icosahedron Core (floating data cell)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: colorCore,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.4 : 0.25,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Mouse Interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (event.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll Interaction
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      
      // Shift scene on desktop, center on mobile
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

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp mouse positioning
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Scroll factor calculations (fade/scale/move over 700px of scrolling)
      const targetScroll = 700;
      const scrollRatio = Math.min(scrollY / targetScroll, 1.0);

      // Base scaling factor
      const baseScale = 1.0 - scrollRatio * 0.45; // scale down to 55%

      // Rotate objects (speed up rotation slightly with scroll)
      particleSystem.rotation.y = elapsedTime * 0.04 + scrollRatio * 1.5;
      particleSystem.rotation.x = elapsedTime * 0.02 + scrollRatio * 0.5;

      wireframeSphere.rotation.y = -elapsedTime * 0.06 - scrollRatio * 1.8;
      wireframeSphere.rotation.x = -elapsedTime * 0.03 - scrollRatio * 0.6;

      coreMesh.rotation.y = elapsedTime * 0.1 + scrollRatio * 2.0;
      coreMesh.rotation.z = -elapsedTime * 0.08 - scrollRatio * 1.0;

      // Pulse effects
      const pulseFactor = Math.sin(elapsedTime * 2) * 0.1;
      const wireframeScale = baseScale * (1 + pulseFactor);
      wireframeSphere.scale.set(wireframeScale, wireframeScale, wireframeScale);
      
      const corePulse = Math.cos(elapsedTime * 3) * 0.15;
      const coreScale = baseScale * (1 + corePulse);
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      particleSystem.scale.set(baseScale, baseScale, baseScale);

      // Shift position based on scroll (moves up and slightly right)
      const basePosX = window.innerWidth > 992 ? 1.8 : 0;
      scene.position.x = basePosX;
      scene.position.y = scrollRatio * 3.5;

      // Fade out materials based on scroll
      const fadeFactor = 1.0 - scrollRatio;
      particleMaterial.opacity = (isLight ? 0.75 : 0.9) * fadeFactor;
      sphereMaterial.opacity = (isLight ? 0.22 : 0.15) * fadeFactor;
      coreMaterial.opacity = (isLight ? 0.4 : 0.25) * fadeFactor;

      // Subtle mouse tracking parallax offsets
      scene.rotation.y = mouseRef.current.x * 0.8;
      scene.rotation.x = mouseRef.current.y * 0.8;

      // Dynamic vertex movement (subtle wave pattern)
      const positionsAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        // Wave formula based on position and time
        const wave = Math.sin(elapsedTime * 1.5 + (x + y + z) * 0.5) * 0.08;
        
        // Push particles along their position vector
        positionsAttr.setXYZ(
          i,
          x + (x / radius) * wave,
          y + (y / radius) * wave,
          z + (z / radius) * wave
        );
      }
      positionsAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Clean-up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Memory cleanup
      particleGeometry.dispose();
      particleMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]); // Rebuild scene on theme change

  return (
    <div ref={containerRef} className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
