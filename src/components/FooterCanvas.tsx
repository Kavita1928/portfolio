import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FooterCanvasProps {
  theme: 'dark' | 'light';
}

export default function FooterCanvas({ theme }: FooterCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    // Theme-based wave grid colors
    const colorPoints = isLight ? 0x0f766e : 0x10b981; // Deep Teal vs Emerald Green
    const colorLines = isLight ? 0x14b8a6 : 0x0d9488; // Brighter Teal vs Teal

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Wave Grid Parameters
    const columns = 36;
    const rows = 36;
    const spacing = 0.55;
    const particleCount = columns * rows;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalZ = new Float32Array(particleCount);

    // Generate grid points centered at origin
    const halfWidth = (columns - 1) * spacing * 0.5;
    const halfHeight = (rows - 1) * spacing * 0.5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const i = r * columns + c;
        const x = c * spacing - halfWidth;
        const y = r * spacing - halfHeight;

        positions[i * 3] = x;
        positions[i * 3 + 1] = 0; // z height initially flat
        positions[i * 3 + 2] = y;

        originalZ[i] = 0;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Premium Points Material
    const material = new THREE.PointsMaterial({
      color: colorPoints,
      size: 0.038,
      transparent: true,
      opacity: isLight ? 0.45 : 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const wavePoints = new THREE.Points(geometry, material);
    scene.add(wavePoints);

    // Subtle Grid lines (wireframe planes overlaying grid)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: colorLines,
      transparent: true,
      opacity: isLight ? 0.12 : 0.08,
      blending: THREE.AdditiveBlending,
    });

    const linesGroup = new THREE.Group();
    
    // Create connection lines for columns
    for (let c = 0; c < columns; c++) {
      const lineGeom = new THREE.BufferGeometry();
      const linePos = new Float32Array(rows * 3);
      for (let r = 0; r < rows; r++) {
        const i = r * columns + c;
        linePos[r * 3] = positions[i * 3];
        linePos[r * 3 + 1] = positions[i * 3 + 1];
        linePos[r * 3 + 2] = positions[i * 3 + 2];
      }
      lineGeom.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
      const line = new THREE.Line(lineGeom, lineMaterial);
      linesGroup.add(line);
    }
    
    scene.add(linesGroup);

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
      const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;

      // Update particle heights based on math sine waves
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const i = r * columns + c;
          
          // Wave equation mapping distance and time
          const dist = Math.sqrt(
            Math.pow(c - columns / 2, 2) + Math.pow(r - rows / 2, 2)
          );
          const height = Math.sin(dist * 0.28 - elapsedTime * 2.2) * 0.45;
          
          positionsAttr.setY(i, height);
        }
      }
      positionsAttr.needsUpdate = true;

      // Re-map connection lines to follow wave vertices
      let lineIdx = 0;
      for (let c = 0; c < columns; c++) {
        const line = linesGroup.children[lineIdx] as THREE.Line;
        const linePosAttr = line.geometry.attributes.position as THREE.BufferAttribute;
        for (let r = 0; r < rows; r++) {
          const i = r * columns + c;
          linePosAttr.setXYZ(
            r,
            positionsAttr.getX(i),
            positionsAttr.getY(i),
            positionsAttr.getZ(i)
          );
        }
        linePosAttr.needsUpdate = true;
        lineIdx++;
      }

      // Rotate group slowly
      wavePoints.rotation.y = elapsedTime * 0.05;
      linesGroup.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Clean-up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      linesGroup.children.forEach((child) => {
        (child as THREE.Line).geometry.dispose();
      });
      renderer.dispose();
    };
  }, [theme]); // Rebuild grid when theme swaps

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: isLight ? 0.8 : 0.6,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
