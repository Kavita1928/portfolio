import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Award } from 'lucide-react';

// Procedural Retro Audio Synthesizer (Zero asset size)
const playSound = (type: 'collect' | 'hit' | 'start' | 'gameover', muted: boolean) => {
  if (muted) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'collect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {
    console.warn('Audio Context blocked or not supported', e);
  }
};

interface GameEntity {
  mesh: THREE.Object3D;
  type: 'gem' | 'bug';
  speed: number;
  label?: string;
  collected?: boolean;
}

interface PortfolioGameProps {
  theme: 'dark' | 'light';
}

export default function PortfolioGame({ theme }: PortfolioGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game states
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [lastCollected, setLastCollected] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  // Refs for animation loops & configurations
  const stateRef = useRef({
    gameState: 'idle',
    score: 0,
    shield: 100,
    roverX: 0,
    keys: { Left: false, Right: false },
    activeEntities: [] as GameEntity[],
    speedFactor: 1.0,
  });

  // Track game values in refs so animation loop has instant access
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.score = score;
  }, [score]);

  useEffect(() => {
    stateRef.current.shield = shield;
  }, [shield]);

  // Handle steer inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        stateRef.current.keys.Left = true;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        stateRef.current.keys.Right = true;
      }
      // Prevent standard page scroll keys when playing
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) && stateRef.current.gameState === 'playing') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        stateRef.current.keys.Left = false;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        stateRef.current.keys.Right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    playSound('start', muted);
    setScore(0);
    setShield(100);
    setLastCollected(null);
    stateRef.current.score = 0;
    stateRef.current.shield = 100;
    stateRef.current.roverX = 0;
    stateRef.current.speedFactor = 1.0;
    
    // Clear old elements
    stateRef.current.activeEntities.forEach(ent => {
      if (ent.mesh.parent) ent.mesh.parent.remove(ent.mesh);
    });
    stateRef.current.activeEntities = [];
    
    setGameState('playing');
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const isLight = theme === 'light';
    
    // Theme configurations for visibility
    const bgHex = isLight ? 0xe2e8f0 : 0x070913; // Clean slate gray vs deep cyber navy
    const roadHex = isLight ? 0xf1f5f9 : 0x0f1322; // Brighter road surfaces
    const gridHex = isLight ? 0x0891b2 : 0xa855f7; // Cyan vs Violet neon tracks
    const gridCenterHex = isLight ? 0x097969 : 0xf43f5e; // Center track lane highlights
    const borderLineHex = isLight ? 0x0ea5e9 : 0x06b6d4; // Side lane boundaries
    
    // Vehicle color config
    const carBodyHex = isLight ? 0x0284c7 : 0x06b6d4; // Shiny Blue vs Neon Cyan
    const cabinHex = isLight ? 0xffffff : 0x1f243b; // White top vs dark purple core
    const capHex = isLight ? 0x7c3aed : 0xf43f5e; // Violet hubcaps vs Rose neon rims

    // 3D Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);

    // Fog: Much lighter density (0.035 instead of 0.08) so hazards are visible in the distance
    scene.fog = new THREE.FogExp2(bgHex, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Adjusted slightly forward to give better focus on the rover
    camera.position.set(0, 2.1, 4.8);
    camera.lookAt(0, 0.55, -2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights (significantly boosted intensities for "everything bright")
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.95 : 0.65);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.2 : 1.35);
    mainLight.position.set(5, 12, 4);
    scene.add(mainLight);

    // Dynamic point lights for neon highway atmosphere
    const trackLightLeft = new THREE.PointLight(0x06b6d4, isLight ? 1.0 : 3.0, 25);
    trackLightLeft.position.set(-4, 2, -10);
    scene.add(trackLightLeft);

    const trackLightRight = new THREE.PointLight(0xa855f7, isLight ? 1.0 : 3.0, 25);
    trackLightRight.position.set(4, 2, -10);
    scene.add(trackLightRight);

    // Cyber Highway: 1. Solid Road Plane (no longer driving in empty dark void)
    const gridWidth = 9;
    const gridLength = 50;
    
    const roadGeom = new THREE.PlaneGeometry(gridWidth, gridLength + 10);
    const roadMat = new THREE.MeshStandardMaterial({
      color: roadHex,
      roughness: 0.5,
      metalness: 0.3,
    });
    const roadPlane = new THREE.Mesh(roadGeom, roadMat);
    roadPlane.rotation.x = -Math.PI / 2;
    roadPlane.position.set(0, 0, -10);
    scene.add(roadPlane);

    // Cyber Highway: 2. Grid lines overlaid slightly above road plane to avoid clipping
    const gridHelper = new THREE.GridHelper(gridLength, 35, gridCenterHex, gridHex);
    gridHelper.position.set(0, 0.008, -10);
    scene.add(gridHelper);

    // Lateral border lines
    const borderGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-gridWidth / 2, 0.012, 10),
      new THREE.Vector3(-gridWidth / 2, 0.012, -40),
    ]);
    const borderMat = new THREE.LineBasicMaterial({ color: borderLineHex, linewidth: 3 });
    const leftBorder = new THREE.Line(borderGeom, borderMat);
    const rightBorder = leftBorder.clone();
    rightBorder.position.x = gridWidth;
    scene.add(leftBorder);
    scene.add(rightBorder);

    // Procedural 3D Cyber-Rover Mesh
    const roverGroup = new THREE.Group();
    roverGroup.position.set(0, 0.45, 1.5);
    scene.add(roverGroup);

    // 1. Rover Chassis
    const bodyGeom = new THREE.BoxGeometry(0.82, 0.35, 1.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: carBodyHex,
      roughness: 0.1,
      metalness: 0.8,
      emissive: carBodyHex,
      emissiveIntensity: isLight ? 0.15 : 0.35,
    });
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    roverGroup.add(bodyMesh);

    // 2. Cabin top
    const cabinGeom = new THREE.BoxGeometry(0.56, 0.26, 0.7);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: cabinHex,
      roughness: 0.05,
      metalness: 0.9,
    });
    const cabinMesh = new THREE.Mesh(cabinGeom, cabinMat);
    cabinMesh.position.set(0, 0.3, -0.1);
    roverGroup.add(cabinMesh);

    // 3. Glowing neon strips
    const neonBarGeom = new THREE.BoxGeometry(0.7, 0.06, 0.08);
    const neonBarMat = new THREE.MeshBasicMaterial({ color: isLight ? 0x0ea5e9 : 0x06b6d4 });
    const neonBar = new THREE.Mesh(neonBarGeom, neonBarMat);
    neonBar.position.set(0, 0.1, 0.7);
    roverGroup.add(neonBar);

    // Headlights
    const lightGeom = new THREE.SphereGeometry(0.09, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftLight = new THREE.Mesh(lightGeom, lightMat);
    leftLight.position.set(-0.25, -0.05, 0.71);
    const rightLight = leftLight.clone();
    rightLight.position.x = 0.25;
    roverGroup.add(leftLight);
    roverGroup.add(rightLight);

    // Real headlight spotlights projecting forward onto obstacles/road
    const headlightsSpot = new THREE.SpotLight(0xffffff, isLight ? 2.0 : 6.0, 18, Math.PI / 4, 0.4, 1.0);
    headlightsSpot.position.set(0, 0.05, 0.7);
    headlightsSpot.target.position.set(0, -0.15, 8); // project forward and slightly down
    roverGroup.add(headlightsSpot);
    roverGroup.add(headlightsSpot.target);

    // 4. Cylinder Wheels with Hubcaps
    const wheelGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.18, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8 });
    
    const capGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.20, 10);
    const capMat = new THREE.MeshStandardMaterial({
      color: capHex,
      emissive: capHex,
      emissiveIntensity: 0.5,
    });

    const wheels: THREE.Object3D[] = [];
    const wheelPositions = [
      { x: -0.49, y: -0.1, z: 0.4 }, // Front Left
      { x: 0.49, y: -0.1, z: 0.4 },  // Front Right
      { x: -0.49, y: -0.1, z: -0.4 }, // Back Left
      { x: 0.49, y: -0.1, z: -0.4 },  // Back Right
    ];

    wheelPositions.forEach((pos) => {
      const wheelContainer = new THREE.Group();
      wheelContainer.position.set(pos.x, pos.y, pos.z);
      
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheelContainer.add(wheel);

      // Neon Hubcap
      const hubcap = new THREE.Mesh(capGeom, capMat);
      hubcap.rotation.z = Math.PI / 2;
      wheelContainer.add(hubcap);
      
      roverGroup.add(wheelContainer);
      wheels.push(wheelContainer);
    });

    // Particle collision explosion pool
    const particleCount = 20;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = -100;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push(new THREE.Vector3());
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.18,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const explosionParticles = new THREE.Points(particleGeometry, particleMat);
    scene.add(explosionParticles);

    const triggerExplosion = (position: THREE.Vector3, colorHex: number) => {
      particleMat.color.setHex(colorHex);
      particleMat.opacity = 1.0;
      const positionsAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      
      for (let i = 0; i < particleCount; i++) {
        positionsAttr.setXYZ(i, position.x, position.y, position.z);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2.0 * Math.random() - 1.0);
        const speed = 2.0 + Math.random() * 3.5;

        particleVelocities[i].set(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.sin(phi) * Math.sin(theta) + 1.2,
          speed * Math.cos(phi)
        );
      }
      positionsAttr.needsUpdate = true;
    };

    // Spawning logic details
    const gemsPool = ['React', 'Node.js', 'AWS', 'Next.js', 'Redis', 'Python', 'Tailwind', 'Git'];
    let spawnTimer = 0;

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (stateRef.current.gameState === 'playing') {
        const roadSpeed = 12 * stateRef.current.speedFactor;
        gridHelper.position.z += roadSpeed * delta;
        if (gridHelper.position.z > 10) {
          gridHelper.position.z = -10;
        }

        wheels.forEach((w) => {
          w.rotation.x += roadSpeed * delta * 1.5;
        });

        // 1. Rover Steering Movement
        const speed = 4.8;
        if (stateRef.current.keys.Left) {
          stateRef.current.roverX -= speed * delta;
          roverGroup.rotation.z = THREE.MathUtils.lerp(roverGroup.rotation.z, 0.15, 0.1);
        } else if (stateRef.current.keys.Right) {
          stateRef.current.roverX += speed * delta;
          roverGroup.rotation.z = THREE.MathUtils.lerp(roverGroup.rotation.z, -0.15, 0.1);
        } else {
          roverGroup.rotation.z = THREE.MathUtils.lerp(roverGroup.rotation.z, 0, 0.1);
        }

        roverGroup.rotation.y = THREE.MathUtils.lerp(
          roverGroup.rotation.y,
          -roverGroup.rotation.z * 0.5,
          0.1
        );

        const limit = (gridWidth - 1.2) / 2;
        stateRef.current.roverX = Math.max(-limit, Math.min(limit, stateRef.current.roverX));
        roverGroup.position.x = stateRef.current.roverX;

        // 2. Entity Spawning
        spawnTimer += delta;
        const spawnInterval = Math.max(0.7, 1.5 - (stateRef.current.score * 0.02));
        if (spawnTimer >= spawnInterval) {
          spawnTimer = 0;
          
          const isGem = Math.random() > 0.4;
          const spawnX = (Math.random() - 0.5) * (gridWidth - 1.5);
          
          if (isGem) {
            const gemGeom = new THREE.IcosahedronGeometry(0.35, 1);
            const chosenColorHex = [0x06b6d4, 0xa855f7, 0xf43f5e][Math.floor(Math.random() * 3)];
            
            // Highly emissive shiny gem material
            const gemMat = new THREE.MeshStandardMaterial({
              color: chosenColorHex,
              emissive: chosenColorHex,
              emissiveIntensity: 0.8, // Glowing gems
              roughness: 0.05,
              metalness: 0.95,
            });
            const gemMesh = new THREE.Mesh(gemGeom, gemMat);
            gemMesh.position.set(spawnX, 0.5, -35);
            scene.add(gemMesh);

            const labelStr = gemsPool[Math.floor(Math.random() * gemsPool.length)];

            stateRef.current.activeEntities.push({
              mesh: gemMesh,
              type: 'gem',
              speed: 10.5 + Math.random() * 5.0,
              label: labelStr,
            });
          } else {
            // Highly visible spiky bugs - bright red warning signals
            const bugGeom = new THREE.ConeGeometry(0.35, 0.8, 4);
            const bugMat = new THREE.MeshStandardMaterial({
              color: 0xff3b30,
              emissive: 0xff0000,
              emissiveIntensity: 1.0, // High-emissive glow to see through dark fog!
              roughness: 0.1,
              metalness: 0.8,
            });
            const bugMesh = new THREE.Mesh(bugGeom, bugMat);
            bugMesh.rotation.x = Math.PI;
            bugMesh.position.set(spawnX, 0.5, -35);
            scene.add(bugMesh);

            stateRef.current.activeEntities.push({
              mesh: bugMesh,
              type: 'bug',
              speed: 11.5 + Math.random() * 4.0,
            });
          }
        }

        stateRef.current.speedFactor = 1.0 + (stateRef.current.score * 0.015);
      } else {
        camera.position.x = Math.sin(time * 0.15) * 6;
        camera.position.z = 15 + Math.cos(time * 0.15) * 5;
        camera.position.y = 4.5 + Math.sin(time * 0.2) * 1.5;
        camera.lookAt(0, 0, -2);
        
        roverGroup.position.x = THREE.MathUtils.lerp(roverGroup.position.x, 0, 0.05);
        roverGroup.rotation.set(0, 0, 0);
      }

      // 3. Process Entities
      const entities = stateRef.current.activeEntities;
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];
        
        if (stateRef.current.gameState === 'playing') {
          ent.mesh.position.z += ent.speed * stateRef.current.speedFactor * delta;
          
          if (ent.type === 'gem') {
            ent.mesh.rotation.y += 2 * delta;
            ent.mesh.rotation.z += 1 * delta;
          } else {
            ent.mesh.rotation.y -= 3 * delta;
          }

          const distZ = Math.abs(ent.mesh.position.z - roverGroup.position.z);
          const distX = Math.abs(ent.mesh.position.x - roverGroup.position.x);

          if (distZ < 0.8 && distX < 0.7 && !ent.collected) {
            ent.collected = true;

            if (ent.type === 'gem') {
              playSound('collect', muted);
              setScore((prev) => prev + 10);
              setLastCollected(ent.label || null);
              triggerExplosion(ent.mesh.position, 0x06b6d4);
            } else {
              playSound('hit', muted);
              setShield((prev) => {
                const next = prev - 25;
                if (next <= 0) {
                  setGameState('gameover');
                  playSound('gameover', muted);
                  return 0;
                }
                return next;
              });
              triggerExplosion(ent.mesh.position, 0xff3b30);
            }

            scene.remove(ent.mesh);
            entities.splice(i, 1);
            continue;
          }

          if (ent.mesh.position.z > 8) {
            scene.remove(ent.mesh);
            entities.splice(i, 1);
            continue;
          }
        } else {
          ent.mesh.position.z += 3 * delta;
          if (ent.mesh.position.z > 12) {
            scene.remove(ent.mesh);
            entities.splice(i, 1);
          }
        }
      }

      // 4. Update Particles
      if (particleMat.opacity > 0) {
        particleMat.opacity -= 1.8 * delta;
        const positionsAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          positionsAttr.setX(i, positionsAttr.getX(i) + particleVelocities[i].x * delta);
          positionsAttr.setY(i, positionsAttr.getY(i) + particleVelocities[i].y * delta);
          positionsAttr.setZ(i, positionsAttr.getZ(i) + particleVelocities[i].z * delta);
          particleVelocities[i].y -= 4.0 * delta;
        }
        positionsAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      roadGeom.dispose();
      gridHelper.geometry.dispose();
      bodyGeom.dispose();
      cabinGeom.dispose();
      neonBarGeom.dispose();
      lightGeom.dispose();
      wheelGeom.dispose();
      capGeom.dispose();
      particleGeometry.dispose();
      
      roadMat.dispose();
      borderMat.dispose();
      bodyMat.dispose();
      cabinMat.dispose();
      neonBarMat.dispose();
      lightMat.dispose();
      wheelMat.dispose();
      capMat.dispose();
      particleMat.dispose();
      
      renderer.dispose();
    };
  }, [theme, muted]);

  const isLight = theme === 'light';

  return (
    <section id="game" className="section" style={{ padding: '60px 24px', position: 'relative' }}>
      <h2 className="section-title">Cyber-Rover Arcade</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '-10px auto 30px auto', fontSize: '0.95rem' }}>
        Steer the retro Rover using your keyboard **Arrow Keys** or **A / D**. Collect floating technology tags and avoid code bugs!
      </p>

      {/* Main Game Arena Container */}
      <div
        ref={containerRef}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '850px',
          height: '420px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-neon)',
        }}
      >
        {/* WebGL Canvas */}
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Heads Up Display (HUD) */}
        {gameState === 'playing' && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'none',
              fontFamily: 'var(--font-heading)',
              zIndex: 5,
            }}
          >
            {/* Score info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(7, 9, 19, 0.85)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: isLight ? '1px solid rgba(8, 145, 178, 0.3)' : '1px solid rgba(6, 182, 212, 0.25)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                color: 'var(--text-primary)',
              }}
            >
              <Award size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Score:</span>
              <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', minWidth: '35px' }}>{score}</span>
            </div>

            {/* Shield Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(7, 9, 19, 0.85)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: isLight ? '1px solid rgba(219, 39, 119, 0.3)' : '1px solid rgba(244, 63, 94, 0.25)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                color: 'var(--text-primary)',
              }}
            >
              <Shield size={18} style={{ color: shield < 50 ? '#ef4444' : 'var(--accent-pink)' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Shields:</span>
              <span style={{ fontWeight: 800, color: shield < 50 ? '#ef4444' : 'var(--accent-pink)' }}>
                {shield}%
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Skill Popups (visual confirmation of item collect) */}
        {gameState === 'playing' && lastCollected && (
          <div
            style={{
              position: 'absolute',
              bottom: '35px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(6, 182, 212, 0.95)',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            +100 {lastCollected}!
          </div>
        )}

        {/* Sound toggle button */}
        <button
          onClick={() => setMuted(!muted)}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(7, 9, 19, 0.85)',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* IDLE / START SCREEN OVERLAY */}
        {gameState === 'idle' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: isLight ? 'rgba(226, 232, 240, 0.88)' : 'rgba(7, 9, 19, 0.82)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              padding: '24px',
              textAlign: 'center',
              backdropFilter: 'blur(5px)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
              }}
            >
              Start Steer Mission
            </h3>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                maxWidth: '450px',
                lineHeight: 1.5,
                marginBottom: '24px',
              }}
            >
              Take control of the cyber-rover. Gather knowledge items floating on the path and maintain your defense shields.
            </p>
            <button
              onClick={startGame}
              className="glow-button primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="currentColor" /> Initialize Drive
            </button>
          </div>
        )}

        {/* GAME OVER SCREEN OVERLAY */}
        {gameState === 'gameover' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: isLight ? 'rgba(226, 232, 240, 0.95)' : 'rgba(15, 23, 42, 0.88)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              padding: '24px',
              textAlign: 'center',
              backdropFilter: 'blur(5px)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#ef4444',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Shield Critical
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
              }}
            >
              Rover collapsed due to system bug collisions.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '32px',
                backgroundColor: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(7, 9, 19, 0.5)',
                padding: '12px 28px',
                borderRadius: '12px',
                border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  High Score
                </span>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 800, margin: 0 }}>
                  {score}
                </h4>
              </div>
            </div>

            <button
              onClick={startGame}
              className="glow-button primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              <RotateCcw size={18} /> Retry Drive
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
