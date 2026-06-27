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
  baseX: number;
  label?: string;
  collected?: boolean;
}

interface SceneryEntity {
  mesh: THREE.Object3D;
  speed: number;
  baseX: number;
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
    
    // Racetrack asphalt, curbs, and beach sand colors
    const sandHex = 0xfa9d5a; // warm orange/peach sunset sand from screenshots
    const waterHex = 0x0b7a75; // deep teal water shoreline
    const asphaltHex = 0x1f2937; // dark grey asphalt road
    const redCheckHex = 0xef4444; // racetrack red curb
    const whiteCheckHex = 0xf8fafc; // racetrack white curb
    
    // 3D Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sandHex);
    scene.fog = new THREE.FogExp2(sandHex, 0.035);

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

    // Ambient colored light to capture sunset tones
    const sunsetLight = new THREE.DirectionalLight(0xfb923c, 0.5);
    sunsetLight.position.set(-5, 4, -10);
    scene.add(sunsetLight);

    // Sand Dune Base Plane (grounding floor)
    const groundGeom = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: sandHex,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.01, -10);
    scene.add(ground);

    // Shoreline Water Plane (on the left side)
    const waterGeom = new THREE.PlaneGeometry(50, 100);
    const waterMat = new THREE.MeshStandardMaterial({
      color: waterHex,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const water = new THREE.Mesh(waterGeom, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-33, 0.005, -10);
    scene.add(water);

    // Shoreline Wave Foam line
    const foamGeom = new THREE.PlaneGeometry(0.3, 100);
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const foam = new THREE.Mesh(foamGeom, foamMat);
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(-8.1, 0.008, -10);
    scene.add(foam);

    // Winding track math
    const getTrackOffset = (z: number, time: number) => {
      // Winding curve logic matching screenshots
      return Math.sin(z * 0.055 + time * 1.4) * 1.9 + Math.cos(z * 0.018) * 0.7;
    };

    // Segmented winding road plane (connecting blocks)
    const gridWidth = 8.5;
    const segmentCount = 28;
    const segmentLength = 2.0;
    const segments: { mesh: THREE.Group; z: number }[] = [];
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    const redCurbMat = new THREE.MeshStandardMaterial({ color: redCheckHex, roughness: 0.6 });
    const whiteCurbMat = new THREE.MeshStandardMaterial({ color: whiteCheckHex, roughness: 0.6 });
    const asphaltMat = new THREE.MeshStandardMaterial({ color: asphaltHex, roughness: 0.8, metalness: 0.1 });
    const dashedLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < segmentCount; i++) {
      const segZ = 10 - i * segmentLength;
      const segGroup = new THREE.Group();
      segGroup.position.set(0, 0, segZ);

      // Asphalt Segment
      const rPlane = new THREE.Mesh(new THREE.PlaneGeometry(gridWidth, segmentLength + 0.05), asphaltMat);
      rPlane.rotation.x = -Math.PI / 2;
      segGroup.add(rPlane);

      // White Center line
      if (i % 2 === 0) {
        const dLine = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.1), dashedLineMat);
        dLine.rotation.x = -Math.PI / 2;
        dLine.position.set(0, 0.006, 0);
        segGroup.add(dLine);
      }

      // Red-and-White Checkered curbs
      const curbGeom = new THREE.BoxGeometry(0.24, 0.08, segmentLength + 0.05);
      const curbMat = i % 2 === 0 ? redCurbMat : whiteCurbMat;
      
      const leftCurb = new THREE.Mesh(curbGeom, curbMat);
      leftCurb.position.set(-gridWidth / 2 - 0.12, 0.04, 0);
      
      const rightCurb = new THREE.Mesh(curbGeom, curbMat);
      rightCurb.position.set(gridWidth / 2 + 0.12, 0.04, 0);

      segGroup.add(leftCurb);
      segGroup.add(rightCurb);

      roadGroup.add(segGroup);
      segments.push({ mesh: segGroup, z: segZ });
    }

    // Procedural player vehicle mesh group
    const roverGroup = new THREE.Group();
    roverGroup.position.set(0, 0.45, 1.5);
    scene.add(roverGroup);

    const wheels: THREE.Object3D[] = [];

    // Helper to build player vehicle mesh based on selection
    const rebuildCar = (carType: CarType) => {
      while (roverGroup.children.length > 0) {
        roverGroup.remove(roverGroup.children[0]);
      }
      wheels.length = 0;

      if (carType === 'supercar') {
        // --- GOLD LUXURY RACER ---
        const bodyG = new THREE.BoxGeometry(0.85, 0.22, 1.55);
        const bodyM = new THREE.MeshStandardMaterial({
          color: 0xd97706,
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

        // Rear spoiler wing
        const wingG = new THREE.BoxGeometry(0.92, 0.03, 0.25);
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

        // Sport rims
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

        const cargoG = new THREE.BoxGeometry(0.8, 0.7, 0.9);
        const cargoM = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
        const cargo = new THREE.Mesh(cargoG, cargoM);
        cargo.position.set(0, 0.54, -0.3);
        roverGroup.add(cargo);

        const cabG = new THREE.BoxGeometry(0.7, 0.45, 0.5);
        const cab = new THREE.Mesh(cabG, bodyM);
        cab.position.set(0, 0.41, 0.4);
        roverGroup.add(cab);

        // Double tires
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
        // --- RED OFF-ROAD SUV (Default Rover updated to match screenshots) ---
        const bodyG = new THREE.BoxGeometry(0.84, 0.48, 1.45);
        const bodyM = new THREE.MeshStandardMaterial({
          color: 0xef4444, // Red offroad truck
          roughness: 0.15,
          metalness: 0.8,
          emissive: 0xef4444,
          emissiveIntensity: isLight ? 0.15 : 0.35,
        });
        const carBody = new THREE.Mesh(bodyG, bodyM);
        roverGroup.add(carBody);

        const cabinG = new THREE.BoxGeometry(0.64, 0.28, 0.8);
        const cabinM = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.05, metalness: 0.95 });
        const carCabin = new THREE.Mesh(cabinG, cabinM);
        carCabin.position.set(0, 0.36, -0.05);
        roverGroup.add(carCabin);

        // Black Roof Rack
        const rackG = new THREE.BoxGeometry(0.58, 0.04, 0.72);
        const rackM = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
        const rack = new THREE.Mesh(rackG, rackM);
        rack.position.set(0, 0.52, -0.05);
        roverGroup.add(rack);

        // Big chunky offroad wheels
        const wheelGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 12);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.85 });
        const rimCap = new THREE.CylinderGeometry(0.14, 0.14, 0.24, 10);
        const rimCapMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.4 });

        const wPos = [
          { x: -0.5, y: -0.12, z: 0.42 },
          { x: 0.5, y: -0.12, z: 0.42 },
          { x: -0.5, y: -0.12, z: -0.42 },
          { x: 0.5, y: -0.12, z: -0.42 },
        ];
        wPos.forEach(pos => {
          const wGroup = new THREE.Group();
          wGroup.position.set(pos.x, pos.y, pos.z);
          const tire = new THREE.Mesh(wheelGeom, wheelMat);
          tire.rotation.z = Math.PI / 2;
          wGroup.add(tire);
          const cap = new THREE.Mesh(rimCap, rimCapMat);
          cap.rotation.z = Math.PI / 2;
          wGroup.add(cap);
          roverGroup.add(wGroup);
          wheels.push(wGroup);
        });
      }

      // Re-add Headlights & Spotlights
      const headlightGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a }); // yellow headlights
      const lLight = new THREE.Mesh(headlightGeom, headlightMat);
      lLight.position.set(-0.25, -0.05, 0.72);
      const rLight = lLight.clone();
      rLight.position.x = 0.25;
      roverGroup.add(lLight);
      roverGroup.add(rLight);

      const spotlights = new THREE.SpotLight(0xffffff, isLight ? 2.5 : 6.0, 18, Math.PI / 4, 0.4, 1.0);
      spotlights.position.set(0, 0.05, 0.7);
      spotlights.target.position.set(0, -0.15, 8);
      roverGroup.add(spotlights);
      roverGroup.add(spotlights.target);
    };

    // Rebuild initial car choice
    rebuildCar(stateRef.current.selectedCar);

    // Procedural Oncoming Traffic Cars Mesh Spawner
    const createOncomingCar = (themeLight: boolean) => {
      const group = new THREE.Group();
      const colorsList = [0xef4444, 0xeab308, 0x8b5cf6, 0xf97316]; // Red, Yellow, Purple, Orange
      const colorHex = colorsList[Math.floor(Math.random() * colorsList.length)];

      // Chassis
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.76, 0.32, 1.3),
        new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.15,
          metalness: 0.7,
          emissive: colorHex,
          emissiveIntensity: themeLight ? 0.1 : 0.35,
        })
      );
      group.add(body);

      // Cabin glass top
      const cab = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.18, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.05, metalness: 0.9 })
      );
      cab.position.set(0, 0.24, -0.05);
      group.add(cab);

      // Glowing headlights
      const headGeom = new THREE.SphereGeometry(0.08, 6, 6);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const leftH = new THREE.Mesh(headGeom, headMat);
      leftH.position.set(-0.25, -0.03, -0.66);
      const rightH = leftH.clone();
      rightH.position.x = 0.25;
      group.add(leftH);
      group.add(rightH);

      // Tires
      const tireG = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10);
      const tireM = new THREE.MeshStandardMaterial({ color: 0x090d16 });
      const tPos = [
        { x: -0.42, y: -0.08, z: 0.35 },
        { x: 0.42, y: -0.08, z: 0.35 },
        { x: -0.42, y: -0.08, z: -0.35 },
        { x: 0.42, y: -0.08, z: -0.35 },
      ];
      tPos.forEach(pos => {
        const tire = new THREE.Mesh(tireG, tireM);
        tire.position.set(pos.x, pos.y, pos.z);
        tire.rotation.z = Math.PI / 2;
        group.add(tire);
      });

      return group;
    };

    // Scenery building helpers (Maple trees, pines, voxel deer)
    const createPinkMaple = () => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.9 })
      );
      trunk.position.y = 0.35;
      group.add(trunk);
      
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7, flatShading: true }); // Pink cherry foliage
      const fol1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 6, 6), foliageMat);
      fol1.position.set(0, 0.9, 0);
      const fol2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), foliageMat);
      fol2.position.set(-0.18, 0.75, 0.12);
      const fol3 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), foliageMat);
      fol3.position.set(0.18, 0.8, -0.12);
      
      group.add(fol1);
      group.add(fol2);
      group.add(fol3);
      return group;
    };

    const createYellowMaple = () => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.9 })
      );
      trunk.position.y = 0.35;
      group.add(trunk);
      
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.7, flatShading: true }); // Golden maple foliage
      const fol1 = new THREE.Mesh(new THREE.SphereGeometry(0.36, 6, 6), foliageMat);
      fol1.position.set(0, 0.9, 0);
      const fol2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), foliageMat);
      fol2.position.set(0.18, 0.78, 0.15);
      const fol3 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), foliageMat);
      fol3.position.set(-0.18, 0.82, -0.15);
      
      group.add(fol1);
      group.add(fol2);
      group.add(fol3);
      return group;
    };

    const createTree = () => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.12, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 })
      );
      trunk.position.y = 0.3;
      group.add(trunk);
      
      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 1.1, 6),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, flatShading: true })
      );
      foliage.position.y = 1.05;
      group.add(foliage);
      return group;
    };

    const createVoxelAnimal = () => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.18, 0.38),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 })
      );
      body.position.y = 0.3;
      group.add(body);
      
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.13, 0.15),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 })
      );
      head.position.set(0, 0.44, 0.17);
      group.add(head);
      
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

      // Pulsing sea wave motions
      const waveOffset = Math.sin(time * 1.8) * 0.18;
      water.position.x = -33.5 + waveOffset;
      foam.position.x = -8.5 + waveOffset;

      if (stateRef.current.gameState === 'playing') {
        // Update segment-based road segments
        segments.forEach((seg) => {
          seg.z += roadSpeed * delta;
          if (seg.z > 10) {
            seg.z = -45 + (seg.z - 10);
          }
          seg.mesh.position.z = seg.z;
          seg.mesh.position.x = getTrackOffset(seg.z, time);
        });

        wheels.forEach((w) => {
          w.rotation.x += roadSpeed * delta * 1.5;
        });

        // 1. Player Vehicle steering movement along the curve
        const steerSpeed = 4.8;
        if (stateRef.current.keys.Left) {
          stateRef.current.roverX -= steerSpeed * delta;
          roverGroup.rotation.z = THREE.MathUtils.lerp(roverGroup.rotation.z, 0.15, 0.1);
        } else if (stateRef.current.keys.Right) {
          stateRef.current.roverX += steerSpeed * delta;
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
        
        // World coordinates of player car: steering input + road offset at Z=1.5
        roverGroup.position.x = stateRef.current.roverX + getTrackOffset(roverGroup.position.z, time);

        // 2. Roadside Scenery elements Spawning (Cherry blossoms, pines, deers)
        scenerySpawnTimer += delta;
        const sceneryInterval = 0.3; 
        if (scenerySpawnTimer >= sceneryInterval) {
          scenerySpawnTimer = 0;
          
          const isLeft = Math.random() > 0.5;
          const spawnOffset = isLeft 
            ? (-gridWidth / 2 - 1.2 - Math.random() * 4.0) 
            : (gridWidth / 2 + 1.2 + Math.random() * 4.0);
            
          const typeRand = Math.random();
          let sceneryMesh: THREE.Object3D;
          
          if (typeRand < 0.35) {
            sceneryMesh = createTree(); // pine
          } else if (typeRand < 0.68) {
            sceneryMesh = createPinkMaple(); // pink cherry foliage
          } else if (typeRand < 0.88) {
            sceneryMesh = createYellowMaple(); // yellow foliage
          } else {
            sceneryMesh = createVoxelAnimal(); // deer
          }
          
          sceneryMesh.position.set(spawnOffset, 0, -45);
          scene.add(sceneryMesh);
          
          stateRef.current.sceneryEntities.push({
            mesh: sceneryMesh,
            speed: roadSpeed,
            baseX: spawnOffset,
          });
        }

        // 3. Gameplay Entity Spawning (Gems, oncoming traffic cars)
        spawnTimer += delta;
        const spawnInterval = Math.max(0.7, 1.5 - (stateRef.current.score * 0.02));
        if (spawnTimer >= spawnInterval) {
          spawnTimer = 0;
          
          const isGem = Math.random() > 0.45;
          const laneIdx = Math.floor(Math.random() * 3);
          const laneX = [-2.6, 0, 2.6][laneIdx];
          
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
            gemMesh.position.set(laneX, 0.5, -35);
            scene.add(gemMesh);

            const labelStr = gemsPool[Math.floor(Math.random() * gemsPool.length)];

            stateRef.current.activeEntities.push({
              mesh: gemMesh,
              type: 'gem',
              speed: 10.5 + Math.random() * 5.0,
              baseX: laneX,
              label: labelStr,
            });
          } else {
            // Spawn oncoming traffic car (instead of red spikes)
            const trafficMesh = createOncomingCar(isLight);
            trafficMesh.position.set(laneX, 0.45, -35);
            scene.add(trafficMesh);

            stateRef.current.activeEntities.push({
              mesh: trafficMesh,
              type: 'bug', // triggers hit response
              speed: 11.5 + Math.random() * 4.0,
              baseX: laneX,
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

      // 4. Update Scenery elements positions along curves
      const sceneryList = stateRef.current.sceneryEntities;
      for (let i = sceneryList.length - 1; i >= 0; i--) {
        const sc = sceneryList[i];
        if (stateRef.current.gameState === 'playing') {
          sc.mesh.position.z += roadSpeed * delta;
        } else {
          sc.mesh.position.z += 4.5 * delta;
        }
        // Offset X based on current Z and curve deflection
        sc.mesh.position.x = sc.baseX + getTrackOffset(sc.mesh.position.z, time);
        
        if (sc.mesh.position.z > 10) {
          scene.remove(sc.mesh);
          sceneryList.splice(i, 1);
        }
      }

      // 5. Process Gems and Oncoming traffic cars
      const entities = stateRef.current.activeEntities;
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];
        
        if (stateRef.current.gameState === 'playing') {
          ent.mesh.position.z += ent.speed * stateRef.current.speedFactor * delta;
          
          if (ent.type === 'gem') {
            ent.mesh.rotation.y += 2 * delta;
            ent.mesh.rotation.z += 1 * delta;
          } else {
            // Spin oncoming tires slightly
            ent.mesh.children.slice(2).forEach(c => {
              c.rotation.x -= 3 * delta;
            });
          }

          // Offset X based on Z and curve deflection
          ent.mesh.position.x = ent.baseX + getTrackOffset(ent.mesh.position.z, time);

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
          ent.mesh.position.x = ent.baseX + getTrackOffset(ent.mesh.position.z, time);
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
      
      groundGeom.dispose();
      waterGeom.dispose();
      foamGeom.dispose();
      particleGeometry.dispose();
      
      groundMat.dispose();
      waterMat.dispose();
      foamMat.dispose();
      particleMat.dispose();
      
      redCurbMat.dispose();
      whiteCurbMat.dispose();
      asphaltMat.dispose();
      dashedLineMat.dispose();

      while (roverGroup.children.length > 0) {
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
        Select your vehicle design, steer using keyboard **Arrow Keys** or **A/D**, and drive through the curved sunset beach!
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

        {/* IDLE / CAR SELECTION & START SCREEN OVERLAY (Live 3D Preview Layout) */}
        {gameState === 'idle' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* Sleek Side Panel for Selection */}
            <div
              style={{
                width: '320px',
                height: '100%',
                backgroundColor: isLight ? 'rgba(241, 245, 249, 0.94)' : 'rgba(15, 23, 42, 0.94)',
                borderRight: '1px solid var(--border-glow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '24px',
                pointerEvents: 'auto',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                  letterSpacing: '-0.02em',
                }}
              >
                Racetrack Drive
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                Choose your vehicle. The selected model will spin live on the right. Initialize to dodge oncoming cars!
              </p>

              {/* Selector list inside sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {/* Choice 1: Red SUV */}
                <div
                  onClick={() => setSelectedCar('rover')}
                  style={{
                    border: selectedCar === 'rover' ? '2px solid var(--accent-pink)' : '1px solid var(--input-border)',
                    backgroundColor: selectedCar === 'rover' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Car size={15} style={{ color: '#ef4444' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Off-Road SUV</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Speed: 80% | Shields: 100%</span>
                </div>

                {/* Choice 2: Supercar */}
                <div
                  onClick={() => setSelectedCar('supercar')}
                  style={{
                    border: selectedCar === 'supercar' ? '2px solid var(--accent-cyan)' : '1px solid var(--input-border)',
                    backgroundColor: selectedCar === 'supercar' ? 'rgba(217, 119, 6, 0.08)' : 'rgba(255,255,255,0.02)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Car size={15} style={{ color: '#d97706' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Gold Racer</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Speed: 100% | Shields: 75%</span>
                </div>

                {/* Choice 3: Truck */}
                <div
                  onClick={() => setSelectedCar('truck')}
                  style={{
                    border: selectedCar === 'truck' ? '2px solid var(--accent-violet)' : '1px solid var(--input-border)',
                    backgroundColor: selectedCar === 'truck' ? 'rgba(219, 39, 119, 0.08)' : 'rgba(255,255,255,0.02)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Car size={15} style={{ color: '#db2777' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>Voxel Truck</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Speed: 60% | Shields: 150%</span>
                </div>
              </div>

              <button
                onClick={startGame}
                className="glow-button primary"
                style={{ padding: '10px 24px', fontSize: '0.9rem', width: '100%' }}
              >
                <Play size={16} fill="currentColor" /> Initialize Drive
              </button>
            </div>
            
            {/* Transparent viewer on the right */}
            <div style={{ flex: 1 }} />
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
              Rover collapsed due to traffic collisions.
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
