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

export default function PortfolioGame() {
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

    // 3D Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070913);

    // Fog for retro cyber glow depth
    scene.fog = new THREE.FogExp2(0x070913, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 5.0);
    camera.lookAt(0, 0.6, -2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.85);
    mainLight.position.set(5, 8, 3);
    scene.add(mainLight);

    // Add neon track grid lights
    const gridLight1 = new THREE.PointLight(0x06b6d4, 2, 20);
    gridLight1.position.set(-3, 1, -5);
    scene.add(gridLight1);

    const gridLight2 = new THREE.PointLight(0xf43f5e, 2, 20);
    gridLight2.position.set(3, 1, -5);
    scene.add(gridLight2);

    // Cyber Highway / Grid Floor
    const gridWidth = 9;
    const gridLength = 50;
    const gridHelper = new THREE.GridHelper(gridLength, 35, 0xa855f7, 0x1f243b);
    gridHelper.position.set(0, 0, -10);
    scene.add(gridHelper);

    // Lateral border lines
    const borderGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-gridWidth / 2, 0.01, 10),
      new THREE.Vector3(-gridWidth / 2, 0.01, -40),
    ]);
    const borderMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
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
    const bodyGeom = new THREE.BoxGeometry(0.8, 0.35, 1.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.2,
      metalness: 0.8,
    });
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    roverGroup.add(bodyMesh);

    // 2. Cabin top
    const cabinGeom = new THREE.BoxGeometry(0.55, 0.25, 0.7);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x374151,
      roughness: 0.1,
      metalness: 0.9,
    });
    const cabinMesh = new THREE.Mesh(cabinGeom, cabinMat);
    cabinMesh.position.set(0, 0.3, -0.1);
    roverGroup.add(cabinMesh);

    // 3. Headlights & Cyber Neon Bar
    const neonBarGeom = new THREE.BoxGeometry(0.7, 0.06, 0.08);
    const neonBarMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const neonBar = new THREE.Mesh(neonBarGeom, neonBarMat);
    neonBar.position.set(0, 0.1, 0.7);
    roverGroup.add(neonBar);

    // Headlights
    const lightGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfbfbfb });
    const leftLight = new THREE.Mesh(lightGeom, lightMat);
    leftLight.position.set(-0.25, -0.05, 0.71);
    const rightLight = leftLight.clone();
    rightLight.position.x = 0.25;
    roverGroup.add(leftLight);
    roverGroup.add(rightLight);

    // 4. Cylinder Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    
    const wheels: THREE.Mesh[] = [];
    const wheelPositions = [
      { x: -0.48, y: -0.1, z: 0.4 }, // Front Left
      { x: 0.48, y: -0.1, z: 0.4 },  // Front Right
      { x: -0.48, y: -0.1, z: -0.4 }, // Back Left
      { x: 0.48, y: -0.1, z: -0.4 },  // Back Right
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.z = Math.PI / 2; // Orient sideways
      wheel.position.set(pos.x, pos.y, pos.z);
      roverGroup.add(wheel);
      wheels.push(wheel);
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
      size: 0.15,
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
        const speed = 2.0 + Math.random() * 3.0;

        particleVelocities[i].set(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.sin(phi) * Math.sin(theta) + 1.0,
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
        const speed = 4.5;
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
        const spawnInterval = Math.max(0.75, 1.6 - (stateRef.current.score * 0.02));
        if (spawnTimer >= spawnInterval) {
          spawnTimer = 0;
          
          const isGem = Math.random() > 0.4;
          const spawnX = (Math.random() - 0.5) * (gridWidth - 1.5);
          
          if (isGem) {
            const gemGeom = new THREE.IcosahedronGeometry(0.35, 1);
            const chosenColorHex = [0x06b6d4, 0xa855f7, 0xf43f5e][Math.floor(Math.random() * 3)];
            const gemMat = new THREE.MeshStandardMaterial({
              color: chosenColorHex,
              roughness: 0.1,
              metalness: 0.9,
              flatShading: true,
            });
            const gemMesh = new THREE.Mesh(gemGeom, gemMat);
            gemMesh.position.set(spawnX, 0.5, -35);
            scene.add(gemMesh);

            const labelStr = gemsPool[Math.floor(Math.random() * gemsPool.length)];

            stateRef.current.activeEntities.push({
              mesh: gemMesh,
              type: 'gem',
              speed: 10 + Math.random() * 5,
              label: labelStr,
            });
          } else {
            const bugGeom = new THREE.ConeGeometry(0.35, 0.8, 4);
            const bugMat = new THREE.MeshStandardMaterial({
              color: 0xef4444,
              roughness: 0.3,
              metalness: 0.7,
              emissive: 0x500000,
            });
            const bugMesh = new THREE.Mesh(bugGeom, bugMat);
            bugMesh.rotation.x = Math.PI;
            bugMesh.position.set(spawnX, 0.5, -35);
            scene.add(bugMesh);

            stateRef.current.activeEntities.push({
              mesh: bugMesh,
              type: 'bug',
              speed: 11 + Math.random() * 4,
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
              triggerExplosion(ent.mesh.position, 0xef4444);
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
      
      gridHelper.geometry.dispose();
      bodyGeom.dispose();
      cabinGeom.dispose();
      neonBarGeom.dispose();
      lightGeom.dispose();
      wheelGeom.dispose();
      particleGeometry.dispose();
      
      borderMat.dispose();
      bodyMat.dispose();
      cabinMat.dispose();
      neonBarMat.dispose();
      lightMat.dispose();
      wheelMat.dispose();
      particleMat.dispose();
      
      renderer.dispose();
    };
  }, [muted]);

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
                backgroundColor: 'rgba(7, 9, 19, 0.75)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.25)',
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
                backgroundColor: 'rgba(7, 9, 19, 0.75)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(244, 63, 94, 0.25)',
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
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(6, 182, 212, 0.9)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.88rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)',
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
            backgroundColor: 'rgba(7, 9, 19, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
              backgroundColor: 'rgba(7, 9, 19, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              padding: '24px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
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
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
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
                backgroundColor: 'rgba(7, 9, 19, 0.5)',
                padding: '12px 28px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
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
