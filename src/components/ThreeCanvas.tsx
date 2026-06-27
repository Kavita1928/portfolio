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
    
    // Theme-based 3D color choices for wireframe and core (subtle and minimal)
    const colorWireframe = isLight ? 0x0891b2 : 0x06b6d4; // Cyan accent lines
    const colorCore = isLight ? 0x64748b : 0x475569; // Minimal slate core
    
    const colorLight1 = isLight ? 0x0891b2 : 0x06b6d4;
    const colorLight2 = isLight ? 0x475569 : 0x334155;

    // Monochromatic Silver/White stars (Minimalist, removing rainbow clutter)
    const colorChoices = isLight
      ? [
          new THREE.Color('#94a3b8'), // Slate-400
          new THREE.Color('#cbd5e1'), // Slate-300
          new THREE.Color('#e2e8f0'), // Slate-200
          new THREE.Color('#64748b'), // Slate-500
        ]
      : [
          new THREE.Color('#ffffff'), // Glowing White
          new THREE.Color('#f8fafc'), // Silver-Slate
          new THREE.Color('#cbd5e1'), // Muted Silver
          new THREE.Color('#94a3b8'), // Slate-400
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

    // Shift camera/scene to the right on desktop initially
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

    const pointLight1 = new THREE.PointLight(colorLight1, 2.0, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colorLight2, 2.0, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Objects
    // 1. Particle Sphere (monochromatic star field)
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

      // Assign random monochromatic color from palette
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
      size: 0.048,
      transparent: true,
      opacity: isLight ? 0.65 : 0.8,
      sizeAttenuation: true,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 2. Wireframe Central Sphere
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

    // 3. Inner Icosahedron Core (minimalist slate core)
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: colorCore,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.35 : 0.22,
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

    // Scroll Interaction (tracks page-wide scroll progress)
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

      // Document-wide scroll ratio (0.0 to 1.0)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = docHeight > 0 ? Math.min(scrollY / docHeight, 1.0) : 0;

      // Determine targets for side-to-side scrolling animation matching sections
      let targetX = 0;
      let targetY = 0;
      let targetScale = 1.0;
      
      const isDesktop = window.innerWidth > 992;
      
      if (scrollRatio < 0.2) {
        // Hero section (Shift right)
        targetX = isDesktop ? 1.8 : 0;
        targetY = 0;
        targetScale = 1.0;
      } else if (scrollRatio < 0.55) {
        // About & Experience (Shift left to sit opposite text blocks)
        targetX = isDesktop ? -1.8 : 0;
        targetY = 0.3;
        targetScale = 0.78;
      } else if (scrollRatio < 0.85) {
        // Projects & Achievements (Shift right)
        targetX = isDesktop ? 1.8 : 0;
        targetY = -0.3;
        targetScale = 0.65;
      } else {
        // Playground & Contact (Center)
        targetX = 0;
        targetY = -0.8;
        targetScale = 0.48;
      }

      // Smoothly lerp position and scale transforms
      scene.position.x += (targetX - scene.position.x) * 0.05;
      scene.position.y += (targetY - scene.position.y) * 0.05;

      const currentScale = THREE.MathUtils.lerp(particleSystem.scale.x, targetScale, 0.05);
      particleSystem.scale.set(currentScale, currentScale, currentScale);

      // Rotate objects (incorporate scroll speedups)
      particleSystem.rotation.y = elapsedTime * 0.04 + scrollRatio * 1.5;
      particleSystem.rotation.x = elapsedTime * 0.02 + scrollRatio * 0.5;

      wireframeSphere.rotation.y = -elapsedTime * 0.06 - scrollRatio * 1.8;
      wireframeSphere.rotation.x = -elapsedTime * 0.03 - scrollRatio * 0.6;

      coreMesh.rotation.y = elapsedTime * 0.1 + scrollRatio * 2.0;
      coreMesh.rotation.z = -elapsedTime * 0.08 - scrollRatio * 1.0;

      // Pulse effects
      const pulseFactor = Math.sin(elapsedTime * 2) * 0.1;
      const wireframeScale = currentScale * (1 + pulseFactor);
      wireframeSphere.scale.set(wireframeScale, wireframeScale, wireframeScale);
      
      const corePulse = Math.cos(elapsedTime * 3) * 0.15;
      const coreScale = currentScale * (1 + corePulse);
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      // Fade out subtly toward the bottom of the page (keeping it visible as a background)
      const fadeFactor = 1.0 - scrollRatio * 0.6;
      particleMaterial.opacity = (isLight ? 0.65 : 0.8) * fadeFactor;
      sphereMaterial.opacity = (isLight ? 0.22 : 0.15) * fadeFactor;
      coreMaterial.opacity = (isLight ? 0.35 : 0.22) * fadeFactor;

      // Mouse parallax offsets
      scene.rotation.y = mouseRef.current.x * 0.8;
      scene.rotation.x = mouseRef.current.y * 0.8;

      // Dynamic vertex movement (subtle wave pattern)
      const positionsAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        const wave = Math.sin(elapsedTime * 1.5 + (x + y + z) * 0.5) * 0.08;
        
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
