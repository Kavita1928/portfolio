import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Award, Car } from 'lucide-react';

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

interface SceneryEntity {
  mesh: THREE.Object3D;
  speed: number;
}

interface PortfolioGameProps {
  theme: 'dark' | 'light';
}

type CarType = 'rover' | 'supercar' | 'truck';

export default function PortfolioGame({ theme }: PortfolioGameProps) {
  const gemsPool = ['React', 'Node.js', 'AWS', 'Next.js', 'Redis', 'Python', 'Tailwind', 'Git'];
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game states
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [selectedCar, setSelectedCar] = useState<CarType>('rover');
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [lastCollected, setLastCollected] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  // Refs for animation loops & configurations
  const stateRef = useRef({
    gameState: 'idle',
    selectedCar: 'rover' as CarType,
    score: 0,
    shield: 100,
    roverX: 0,
    keys: { Left: false, Right: false },
    activeEntities: [] as GameEntity[],
    sceneryEntities: [] as SceneryEntity[],
    speedFactor: 1.0,
  });

  // Track game values in refs so animation loop has instant access
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.selectedCar = selectedCar;
  }, [selectedCar]);

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
    
    // Choose starting shield level based on selected car design
    const startShield = selectedCar === 'truck' ? 150 : selectedCar === 'supercar' ? 75 : 100;
    setShield(startShield);
    setLastCollected(null);
    stateRef.current.score = 0;
    stateRef.current.shield = startShield;
    stateRef.current.roverX = 0;
    stateRef.current.speedFactor = selectedCar === 'supercar' ? 1.2 : selectedCar === 'truck' ? 0.8 : 1.0;
    
    // Clear old gameplay elements
    stateRef.current.activeEntities.forEach(ent => {
      if (ent.mesh.parent) ent.mesh.parent.remove(ent.mesh);
    });
    stateRef.current.activeEntities = [];

    // Clear old scenery elements
    stateRef.current.sceneryEntities.forEach(sc => {
      if (sc.mesh.parent) sc.mesh.parent.remove(sc.mesh);
    });
    stateRef.current.sceneryEntities = [];
    
    setGameState('playing');
  };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const isLight = theme === 'light';
    
    // Theme configurations for visibility
    const bgHex = isLight ? 0xe2e8f0 : 0x070913; 
    const roadHex = isLight ? 0xf1f5f9 : 0x0f1322; 
    const gridHex = isLight ? 0x0891b2 : 0xa855f7; 
    const gridCenterHex = isLight ? 0x097969 : 0xf43f5e; 
    const borderLineHex = isLight ? 0x0ea5e9 : 0x06b6d4; 
    
    // Vehicle color config
    const carBodyHex = isLight ? 0x0284c7 : 0x06b6d4; 
    const cabinHex = isLight ? 0xffffff : 0x1f243b; 
    const capHex = isLight ? 0x7c3aed : 0xf43f5e; 

    // 3D Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.95 : 0.65);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.2 : 1.35);
    mainLight.position.set(5, 12, 4);
    scene.add(mainLight);

    // Dynamic point lights for cyber-city atmosphere
    const trackLightLeft = new THREE.PointLight(0x06b6d4, isLight ? 1.0 : 3.0, 25);
    trackLightLeft.position.set(-4, 2, -10);
    scene.add(trackLightLeft);

    const trackLightRight = new THREE.PointLight(0xa855f7, isLight ? 1.0 : 3.0, 25);
    trackLightRight.position.set(4, 2, -10);
    scene.add(trackLightRight);

    // Cyber Highway Solid Road Plane
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

    // Grid lines
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

    // Array to spin wheels
    const wheels: THREE.Object3D[] = [];

    // Procedural building helper functions (skyscraper, trees, animals)
    const createSkyscraper = (themeLight: boolean) => {
      const group = new THREE.Group();
      const w = 0.8 + Math.random() * 0.7;
      const h = 3.0 + Math.random() * 5.0;
      const d = 0.8 + Math.random() * 0.7;
      
      // Main tower block
      const towerGeom = new THREE.BoxGeometry(w, h, d);
      const towerMat = new THREE.MeshStandardMaterial({
        color: themeLight ? 0xcbd5e1 : 0x1e293b,
        roughness: 0.2,
        metalness: 0.8,
      });
      const tower = new THREE.Mesh(towerGeom, towerMat);
      tower.position.y = h / 2;
      group.add(tower);
      
      // Lit window cells
      const windowGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
      const windowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a }); // yellow glowing window
      
      const windowCount = 6 + Math.floor(Math.random() * 12);
      for (let i = 0; i < windowCount; i++) {
        const win = new THREE.Mesh(windowGeom, windowMat);
        const winY = 0.5 + Math.random() * (h - 1);
        const winX = (Math.random() - 0.5) * (w - 0.2);
        win.position.set(winX, winY, d / 2 + 0.015);
        group.add(win);
      }
      return group;
    };

    const createTree = () => {
      const group = new THREE.Group();
      // Trunk cylinder
      const trunkGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.6, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.y = 0.3;
      group.add(trunk);
      
      // Foliage green cone
      const foliageGeom = new THREE.ConeGeometry(0.38, 1.1, 6);
      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x15803d, 
        roughness: 0.7,
        flatShading: true,
      });
      const foliage = new THREE.Mesh(foliageGeom, foliageMat);
      foliage.position.y = 1.05;
      group.add(foliage);
      return group;
    };

    const createVoxelAnimal = () => {
      const group = new THREE.Group();
      // Voxel body
      const bodyGeom = new THREE.BoxGeometry(0.24, 0.18, 0.38);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }); // tan deer color
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.position.y = 0.3;
      group.add(body);
      
      // Head
      const headGeom = new THREE.BoxGeometry(0.13, 0.13, 0.15);
      const head = new THREE.Mesh(headGeom, bodyMat);
      head.position.set(0, 0.44, 0.17);
      group.add(head);
      
      // Legs
      const legGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const legs = [
        { x: -0.08, z: 0.12 },
        { x: 0.08, z: 0.12 },
        { x: -0.08, z: -0.12 },
        { x: 0.08, z: -0.12 },
      ];
      legs.forEach(l => {
        const leg = new THREE.Mesh(legGeom, legMat);
        leg.position.set(l.x, 0.11, l.z);
        group.add(leg);
      });
      return group;
    };

    // Construct selected vehicle model parts
    const rebuildCar = (carType: CarType) => {
      // Clear previous chassis parts
      while (roverGroup.children.length > 0) {
        roverGroup.remove(roverGroup.children[0]);
      }
      wheels.length = 0;

      if (carType === 'supercar') {
        // --- GOLD LUXURY RACER ---
        const bodyG = new THREE.BoxGeometry(0.85, 0.22, 1.55);
        const bodyM = new THREE.MeshStandardMaterial({
          color: 0xd97706, // metallic gold
          roughness: 0.05,
          metalness: 0.95,
          emissive: 0xd97706,
          emissiveIntensity: isLight ? 0.15 : 0.35,
        });
        const carBody = new THREE.Mesh(bodyG, bodyM);
        roverGroup.add(carBody);

        const cabinG = new THREE.BoxGeometry(0.5, 0.16, 0.85);
        const cabinM = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.05, metalness: 0.9 });
        const carCabin = new THREE.Mesh(cabinG, cabinM);
        carCabin.position.set(0, 0.18, -0.05);
        roverGroup.add(carCabin);

        // Aerodynamic rear spoiler wing
        const wingG = new THREE.BoxGeometry(0.9, 0.03, 0.25);
        const wing = new THREE.Mesh(wingG, bodyM);
        wing.position.set(0, 0.26, -0.65);
        
        const strutG = new THREE.BoxGeometry(0.04, 0.16, 0.08);
        const leftStrut = new THREE.Mesh(strutG, bodyM);
        leftStrut.position.set(-0.25, 0.12, -0.62);
        const rightStrut = leftStrut.clone();
        rightStrut.position.x = 0.25;
        
        roverGroup.add(wing);
        roverGroup.add(leftStrut);
        roverGroup.add(rightStrut);

        // Gold cap sport rims
        const rimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.2, 12);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0x05050a, roughness: 0.9 });
        const goldCap = new THREE.CylinderGeometry(0.1, 0.1, 0.22, 8);
        const goldCapMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });

        const wPos = [
          { x: -0.49, y: -0.08, z: 0.45 },
          { x: 0.49, y: -0.08, z: 0.45 },
          { x: -0.49, y: -0.08, z: -0.45 },
          { x: 0.49, y: -0.08, z: -0.45 },
        ];
        wPos.forEach(pos => {
          const wGroup = new THREE.Group();
          wGroup.position.set(pos.x, pos.y, pos.z);
          const tire = new THREE.Mesh(rimGeom, rimMat);
          tire.rotation.z = Math.PI / 2;
          wGroup.add(tire);
          const cap = new THREE.Mesh(goldCap, goldCapMat);
          cap.rotation.z = Math.PI / 2;
          wGroup.add(cap);
          roverGroup.add(wGroup);
          wheels.push(wGroup);
        });

      } else if (carType === 'truck') {
        // --- VOXEL TECH TRUCK ---
        const bodyG = new THREE.BoxGeometry(0.88, 0.38, 1.6);
        const bodyM = new THREE.MeshStandardMaterial({
          color: 0xdb2777, // pink body
          roughness: 0.2,
          metalness: 0.8,
          emissive: 0x9d174d,
          emissiveIntensity: isLight ? 0.15 : 0.35,
        });
        const carBody = new THREE.Mesh(bodyG, bodyM);
        roverGroup.add(carBody);

        // Rear cargo block container
        const cargoG = new THREE.BoxGeometry(0.8, 0.7, 0.9);
        const cargoM = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
        const cargo = new THREE.Mesh(cargoG, cargoM);
        cargo.position.set(0, 0.54, -0.3);
        roverGroup.add(cargo);

        // Truck Front Cabin
        const cabG = new THREE.BoxGeometry(0.7, 0.45, 0.5);
        const cab = new THREE.Mesh(cabG, bodyM);
        cab.position.set(0, 0.41, 0.4);
        roverGroup.add(cab);

        // Heavy-duty wheels (double rear wheels)
        const hdTireGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 12);
        const hdTireMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
        const roseCap = new THREE.CylinderGeometry(0.12, 0.12, 0.24, 8);
        const roseCapMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, emissive: 0xdb2777 });

        const wPos = [
          { x: -0.5, y: -0.06, z: 0.45, double: false },
          { x: 0.5, y: -0.06, z: 0.45, double: false },
          { x: -0.55, y: -0.06, z: -0.45, double: true },
          { x: 0.55, y: -0.06, z: -0.45, double: true },
        ];
        wPos.forEach(pos => {
          const wGroup = new THREE.Group();
          wGroup.position.set(pos.x, pos.y, pos.z);
          
          if (pos.double) {
            const tire1 = new THREE.Mesh(hdTireGeom, hdTireMat);
            tire1.rotation.z = Math.PI / 2;
            tire1.position.x = -0.08;
            const tire2 = tire1.clone();
            tire2.position.x = 0.08;
            wGroup.add(tire1);
            wGroup.add(tire2);
          } else {
            const tire = new THREE.Mesh(hdTireGeom, hdTireMat);
            tire.rotation.z = Math.PI / 2;
            wGroup.add(tire);
          }
          
          const cap = new THREE.Mesh(roseCap, roseCapMat);
          cap.rotation.z = Math.PI / 2;
          wGroup.add(cap);
          
          roverGroup.add(wGroup);
          wheels.push(wGroup);
        });

      } else {
        // --- CYBER-ROVER (Standard Cyan) ---
        const bodyMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, 0.35, 1.4),
          new THREE.MeshStandardMaterial({
            color: carBodyHex,
            roughness: 0.1,
            metalness: 0.8,
            emissive: carBodyHex,
            emissiveIntensity: isLight ? 0.15 : 0.35,
          })
        );
        roverGroup.add(bodyMesh);

        const cabinMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.56, 0.26, 0.7),
          new THREE.MeshStandardMaterial({ color: cabinHex, roughness: 0.05, metalness: 0.9 })
        );
        cabinMesh.position.set(0, 0.3, -0.1);
        roverGroup.add(cabinMesh);

        const neonBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.06, 0.08),
          new THREE.MeshBasicMaterial({ color: isLight ? 0x0ea5e9 : 0x06b6d4 })
        );
        neonBar.position.set(0, 0.1, 0.7);
        roverGroup.add(neonBar);

        const wG = new THREE.CylinderGeometry(0.25, 0.25, 0.18, 12);
        const wM = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8 });
        const cG = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 10);
        const cM = new THREE.MeshStandardMaterial({ color: capHex, emissive: capHex, emissiveIntensity: 0.5 });

        const wPos = [
          { x: -0.49, y: -0.1, z: 0.4 },
          { x: 0.49, y: -0.1, z: 0.4 },
          { x: -0.49, y: -0.1, z: -0.4 },
          { x: 0.49, y: -0.1, z: -0.4 },
        ];
        wPos.forEach(pos => {
          const wGroup = new THREE.Group();
          wGroup.position.set(pos.x, pos.y, pos.z);
          const tire = new THREE.Mesh(wG, wM);
          tire.rotation.z = Math.PI / 2;
          wGroup.add(tire);
          const cap = new THREE.Mesh(cG, cM);
          cap.rotation.z = Math.PI / 2;
          wGroup.add(cap);
          roverGroup.add(wGroup);
          wheels.push(wGroup);
        });
      }

      // Re-add Headlights & Spotlights
      const headlightGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const lLight = new THREE.Mesh(headlightGeom, headlightMat);
      lLight.position.set(-0.25, -0.05, 0.71);
      const rLight = lLight.clone();
      rLight.position.x = 0.25;
      roverGroup.add(lLight);
      roverGroup.add(rLight);

      const spotlights = new THREE.SpotLight(0xffffff, isLight ? 2.0 : 6.0, 18, Math.PI / 4, 0.4, 1.0);
      spotlights.position.set(0, 0.05, 0.7);
      spotlights.target.position.set(0, -0.15, 8);
      roverGroup.add(spotlights);
      roverGroup.add(spotlights.target);
    };

    // Initial vehicle mesh construction
    rebuildCar(stateRef.current.selectedCar);

    // Particle collision pool
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

    // Spawning logic timers
    let spawnTimer = 0;
    let scenerySpawnTimer = 0;

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Track active selected car changes to rebuild in real-time
    let currentLocalCar = stateRef.current.selectedCar;

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Check if user has changed car selections during idle screen overlay
      if (stateRef.current.selectedCar !== currentLocalCar) {
        currentLocalCar = stateRef.current.selectedCar;
        rebuildCar(currentLocalCar);
      }

      const roadSpeed = 12 * stateRef.current.speedFactor;

      if (stateRef.current.gameState === 'playing') {
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

        // 2. Roadside Scenery elements Spawning (Skyscrapers, Forest, Voxel Animals)
        scenerySpawnTimer += delta;
        const sceneryInterval = 0.35; // Spawns frequently to form continuous city landscape
        if (scenerySpawnTimer >= sceneryInterval) {
          scenerySpawnTimer = 0;
          
          const isLeft = Math.random() > 0.5;
          const spawnX = isLeft 
            ? (-gridWidth / 2 - 1.2 - Math.random() * 4.0) 
            : (gridWidth / 2 + 1.2 + Math.random() * 4.0);
            
          const typeRand = Math.random();
          let sceneryMesh: THREE.Object3D;
          
          if (typeRand < 0.42) {
            sceneryMesh = createTree();
          } else if (typeRand < 0.85) {
            sceneryMesh = createSkyscraper(isLight);
          } else {
            sceneryMesh = createVoxelAnimal();
          }
          
          sceneryMesh.position.set(spawnX, 0, -45);
          scene.add(sceneryMesh);
          
          stateRef.current.sceneryEntities.push({
            mesh: sceneryMesh,
            speed: roadSpeed,
          });
        }

        // 3. Gameplay Entity Spawning (Gems, bugs)
        spawnTimer += delta;
        const spawnInterval = Math.max(0.7, 1.5 - (stateRef.current.score * 0.02));
        if (spawnTimer >= spawnInterval) {
          spawnTimer = 0;
          
          const isGem = Math.random() > 0.4;
          const spawnX = (Math.random() - 0.5) * (gridWidth - 1.5);
          
          if (isGem) {
            const gemGeom = new THREE.IcosahedronGeometry(0.35, 1);
            const chosenColorHex = [0x06b6d4, 0xa855f7, 0xf43f5e][Math.floor(Math.random() * 3)];
            
            const gemMat = new THREE.MeshStandardMaterial({
              color: chosenColorHex,
              emissive: chosenColorHex,
              emissiveIntensity: 0.8,
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
            const bugGeom = new THREE.ConeGeometry(0.35, 0.8, 4);
            const bugMat = new THREE.MeshStandardMaterial({
              color: 0xff3b30,
              emissive: 0xff0000,
              emissiveIntensity: 1.0, 
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

        const baseMultiplier = currentLocalCar === 'supercar' ? 1.25 : currentLocalCar === 'truck' ? 0.85 : 1.0;
        stateRef.current.speedFactor = baseMultiplier * (1.0 + (stateRef.current.score * 0.015));
      } else {
        // Slow rotation around the selected car on start screens
        camera.position.x = Math.sin(time * 0.15) * 6;
        camera.position.z = 15 + Math.cos(time * 0.15) * 5;
        camera.position.y = 4.5 + Math.sin(time * 0.2) * 1.5;
        camera.lookAt(0, 0.2, -1);
        
        roverGroup.position.x = THREE.MathUtils.lerp(roverGroup.position.x, 0, 0.05);
        roverGroup.rotation.y = time * 0.35; // slow spinning presentation
        roverGroup.rotation.z = 0;
      }

      // 4. Update Scenery elements positions
      const sceneryList = stateRef.current.sceneryEntities;
      for (let i = sceneryList.length - 1; i >= 0; i--) {
        const sc = sceneryList[i];
        if (stateRef.current.gameState === 'playing') {
          sc.mesh.position.z += roadSpeed * delta;
        } else {
          sc.mesh.position.z += 4.5 * delta;
        }
        
        if (sc.mesh.position.z > 10) {
          scene.remove(sc.mesh);
          sceneryList.splice(i, 1);
        }
      }

      // 5. Process Gems and Bugs
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

      // 6. Update Particle systems
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
      borderGeom.dispose();
      particleGeometry.dispose();
      
      roadMat.dispose();
      borderMat.dispose();
      particleMat.dispose();
      
      // Cleanup dynamically created children in groups
      while(roverGroup.children.length > 0) {
        roverGroup.remove(roverGroup.children[0]);
      }
      
      stateRef.current.sceneryEntities.forEach(sc => {
        scene.remove(sc.mesh);
      });
      stateRef.current.activeEntities.forEach(ent => {
        scene.remove(ent.mesh);
      });

      renderer.dispose();
    };
  }, [theme, muted]);

  const isLight = theme === 'light';

  return (
    <section id="game" className="section" style={{ padding: '60px 24px', position: 'relative' }}>
      <h2 className="section-title">Cyber-Rover Arcade</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '-10px auto 30px auto', fontSize: '0.95rem' }}>
        Select your vehicle design, steer using keyboard **Arrow Keys** or **A/D**, and drive through the luxury city forest!
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

        {/* Dynamic Skill Popups */}
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

        {/* Sound toggle */}
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

        {/* IDLE / CAR SELECTION & START SCREEN OVERLAY */}
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
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '4px',
                letterSpacing: '-0.02em',
              }}
            >
              Start Steer Mission
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '420px' }}>
              Steer through the luxury city forest and collect tech gems. Choose your vehicle below to start:
            </p>

            {/* Interactive Car Selector Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Option 1: Rover */}
              <div
                onClick={() => setSelectedCar('rover')}
                style={{
                  border: selectedCar === 'rover' ? '2px solid var(--accent-cyan)' : '1px solid var(--input-border)',
                  backgroundColor: selectedCar === 'rover' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255,255,255,0.02)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '135px',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Car size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Cyber-Rover</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Speed: 80%</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Shields: 100%</span>
              </div>

              {/* Option 2: Supercar */}
              <div
                onClick={() => setSelectedCar('supercar')}
                style={{
                  border: selectedCar === 'supercar' ? '2px solid var(--accent-pink)' : '1px solid var(--input-border)',
                  backgroundColor: selectedCar === 'supercar' ? 'rgba(219, 39, 119, 0.08)' : 'rgba(255,255,255,0.02)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '135px',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Car size={16} style={{ color: 'var(--accent-pink)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Gold Racer</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Speed: 100%</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Shields: 75%</span>
              </div>

              {/* Option 3: Truck */}
              <div
                onClick={() => setSelectedCar('truck')}
                style={{
                  border: selectedCar === 'truck' ? '2px solid var(--accent-violet)' : '1px solid var(--input-border)',
                  backgroundColor: selectedCar === 'truck' ? 'rgba(124, 58, 237, 0.08)' : 'rgba(255,255,255,0.02)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '135px',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Car size={16} style={{ color: 'var(--accent-violet)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Voxel Truck</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Speed: 60%</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Shields: 150%</span>
              </div>
            </div>

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
