import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Eye, Video, Sun, Moon, Sparkles, RefreshCw, ZoomIn, Play, Activity, Maximize2, Minimize2, Flame } from 'lucide-react';
import { BallOutcome, PlayerProfile, ShotOption, BowlingOption, MatchState } from '../types/cricket';

interface Cricket3DStadiumProps {
  player: PlayerProfile;
  lastOutcome: BallOutcome | null;
  isAnimating: boolean;
  selectedShot?: ShotOption;
  selectedBowling?: BowlingOption;
  isBowlingMode?: boolean;
  userTeam: string;
  oppTeam: string;
  lang: 'en' | 'bn';
  cameraMode?: CameraViewMode;
  onCameraChange?: (mode: CameraViewMode) => void;
  matchState?: MatchState;
  activeMilestone?: string | null;
  activeOverAlert?: string | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export type CameraViewMode = 'BATSMAN_3P' | 'BROADCAST' | 'BOWLER_CAM' | 'SKY_DRONE' | 'CLOSE_UP';

export const Cricket3DStadium: React.FC<Cricket3DStadiumProps> = ({
  player,
  lastOutcome,
  isAnimating,
  selectedShot,
  selectedBowling,
  isBowlingMode = false,
  userTeam,
  oppTeam,
  lang,
  cameraMode: externalCameraMode,
  onCameraChange,
  matchState,
  activeMilestone,
  activeOverAlert,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalCameraMode, setInternalCameraMode] = useState<CameraViewMode>('BROADCAST');
  const cameraMode = externalCameraMode || internalCameraMode;

  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  const [showHawkeye, setShowHawkeye] = useState<boolean>(true);
  const [cameraShake, setCameraShake] = useState<number>(0);
  const [ballSpeedRadar, setBallSpeedRadar] = useState<number>(142);

  // 3D Scoreboard Canvas and Texture Refs
  const scoreboardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreboardTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Internal Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const ballTrailRef = useRef<THREE.Line | null>(null);
  const trailPositionsRef = useRef<THREE.Vector3[]>([]);

  // Articulated Player Models Refs
  const batsmanGroupRef = useRef<THREE.Group | null>(null);
  const batGroupRef = useRef<THREE.Group | null>(null);
  const batsmanTorsoRef = useRef<THREE.Mesh | null>(null);
  const batsmanArmRRef = useRef<THREE.Group | null>(null);
  const batsmanArmLRef = useRef<THREE.Group | null>(null);
  const batsmanLegLRef = useRef<THREE.Mesh | null>(null);
  const batsmanLegRRef = useRef<THREE.Mesh | null>(null);
  const momentumAuraGroupRef = useRef<THREE.Group | null>(null);
  const momentumAuraRingRef = useRef<THREE.Mesh | null>(null);

  const bowlerGroupRef = useRef<THREE.Group | null>(null);
  const bowlerArmRef = useRef<THREE.Group | null>(null);
  const bowlerLegLRef = useRef<THREE.Mesh | null>(null);
  const bowlerLegRRef = useRef<THREE.Mesh | null>(null);

  const umpireGroupRef = useRef<THREE.Group | null>(null);
  const umpireArmLeftRef = useRef<THREE.Mesh | null>(null);
  const umpireArmRightRef = useRef<THREE.Mesh | null>(null);

  const stumpsGroupStrikerRef = useRef<THREE.Group | null>(null);
  const stumpsGroupNonStrikerRef = useRef<THREE.Group | null>(null);
  const bailsMeshRef = useRef<THREE.Mesh[]>([]);
  const fieldersGroupRef = useRef<THREE.Group[]>([]);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const crowdMeshesRef = useRef<THREE.Mesh[]>([]);
  const pitchMarkerRef = useRef<THREE.Mesh | null>(null);

  const animFrameId = useRef<number | null>(null);

  // Real-time Ball Physics Simulation State
  const ballPhysicsRef = useRef<{
    active: boolean;
    phase: 'RUNUP' | 'FLIGHT_TO_PITCH' | 'BOUNCE_TO_BAT' | 'OFF_THE_BAT' | 'DEAD_BALL';
    timeInPhase: number;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    spin: THREE.Vector3;
    pitchTarget: THREE.Vector3;
    batHitTarget: THREE.Vector3;
    boundaryTarget: THREE.Vector3;
    isWicket: boolean;
    wicketType?: string;
    runs: number;
    shotType: string;
    shotAngle: number;
    ballSpeedKmh: number;
  }>({
    active: false,
    phase: 'RUNUP',
    timeInPhase: 0,
    pos: new THREE.Vector3(0, 1.8, -10),
    vel: new THREE.Vector3(0, 0, 0),
    spin: new THREE.Vector3(0, 0, 0),
    pitchTarget: new THREE.Vector3(0, 0.05, 4.2),
    batHitTarget: new THREE.Vector3(0, 0.75, 8.5),
    boundaryTarget: new THREE.Vector3(20, 0, 35),
    isWicket: false,
    runs: 0,
    shotType: 'DRIVE',
    shotAngle: 45,
    ballSpeedKmh: 142,
  });

  const updateCameraPosition = (mode: CameraViewMode, cam: THREE.PerspectiveCamera) => {
    switch (mode) {
      case 'BATSMAN_3P':
        cam.position.set(0, 2.6, 13.5);
        cam.lookAt(0, 1.2, 0);
        break;
      case 'BOWLER_CAM':
        cam.position.set(0, 3.2, -16.5);
        cam.lookAt(0, 1.0, 9);
        break;
      case 'SKY_DRONE':
        cam.position.set(0, 48, 8);
        cam.lookAt(0, 0, 2);
        break;
      case 'CLOSE_UP':
        cam.position.set(2.8, 1.4, 9.8);
        cam.lookAt(0, 1.1, 8.6);
        break;
      case 'BROADCAST':
      default:
        cam.position.set(0, 14, 28);
        cam.lookAt(0, 1.0, 4);
        break;
    }
  };

  const handleSetCamera = (mode: CameraViewMode) => {
    setInternalCameraMode(mode);
    if (onCameraChange) onCameraChange(mode);
    if (cameraRef.current) {
      updateCameraPosition(mode, cameraRef.current);
    }
  };

  // Initialize Three.js 3D Stadium
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNightMode ? 0x050814 : 0x70b5f9);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x050814 : 0x70b5f9, 0.007);

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 450);
    cameraRef.current = camera;
    updateCameraPosition(cameraMode, camera);

    // WebGL Renderer with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNightMode ? 1.3 : 1.1;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. LIGHTING (Stadium Floodlights + Ambient)
    // ==========================================
    const ambientLight = new THREE.AmbientLight(isNightMode ? 0x223355 : 0xffffff, isNightMode ? 0.8 : 0.9);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(isNightMode ? 0x99bbff : 0xfffaed, isNightMode ? 1.0 : 1.6);
    mainSun.position.set(35, 65, -30);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    // 4 High-Intensity Floodlight Towers
    const floodlightPositions = [
      [-40, 36, -40],
      [40, 36, -40],
      [-40, 36, 40],
      [40, 36, 40],
    ];

    floodlightPositions.forEach(([x, y, z]) => {
      const poleGeo = new THREE.CylinderGeometry(0.5, 0.9, 36, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(x, 18, z);
      scene.add(pole);

      const lampHeadGeo = new THREE.BoxGeometry(4.5, 2.5, 1.2);
      const lampHeadMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: isNightMode ? 0xffffff : 0x000000,
        emissiveIntensity: isNightMode ? 1.8 : 0,
      });
      const lampHead = new THREE.Mesh(lampHeadGeo, lampHeadMat);
      lampHead.position.set(x, 36, z);
      lampHead.lookAt(0, 0, 0);
      scene.add(lampHead);

      if (isNightMode) {
        const spot = new THREE.SpotLight(0xfffaed, 2.8, 110, Math.PI / 3.8, 0.4, 1.2);
        spot.position.set(x, 36, z);
        spot.target.position.set(0, 0, 0);
        scene.add(spot);
        scene.add(spot.target);
      }
    });

    // ==========================================
    // 2. CRICKET GROUND, PITCH & BOUNDARY
    // ==========================================
    const grassGeo = new THREE.CircleGeometry(55, 64);
    const grassMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x14532d : 0x16a34a,
      roughness: 0.85,
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);

    // Mown Turf Grass Ring Patterns
    for (let r = 12; r <= 48; r += 12) {
      const ringGeo = new THREE.RingGeometry(r - 0.3, r + 0.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isNightMode ? 0x166534 : 0x22c55e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      scene.add(ring);
    }

    // Dynamic 22-Yard Turf Pitch Material based on pitch condition
    let pitchColorHex = 0xc49a6c;
    let pitchRoughness = 0.7;

    if (matchState.pitch === 'GREEN_SEAM') {
      pitchColorHex = 0x5a8365;
      pitchRoughness = 0.6;
    } else if (matchState.pitch === 'DUSTY_TURN') {
      pitchColorHex = 0xcda06c;
      pitchRoughness = 0.9;
    } else if (matchState.pitch === 'FLAT_ROAD') {
      pitchColorHex = 0xddb782;
      pitchRoughness = 0.65;
    } else if (matchState.pitch === 'DAMP_SLOW') {
      pitchColorHex = 0x5d4d3e;
      pitchRoughness = 0.8;
    }

    const pitchGeo = new THREE.PlaneGeometry(3.4, 22.56);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: pitchColorHex,
      roughness: pitchRoughness,
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.02;
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Pitch Crease Markings
    const createCrease = (w: number, h: number, x: number, z: number) => {
      const lineGeo = new THREE.PlaneGeometry(w, h);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.035, z);
      scene.add(line);
    };

    createCrease(2.4, 0.08, 0, 8.5);  // Striker popping crease
    createCrease(1.8, 0.06, 0, 9.7);  // Striker bowling crease
    createCrease(0.06, 1.2, -0.9, 9.1);
    createCrease(0.06, 1.2, 0.9, 9.1);

    createCrease(2.4, 0.08, 0, -8.5); // Non-Striker popping crease
    createCrease(1.8, 0.06, 0, -9.7); // Non-Striker bowling crease
    createCrease(0.06, 1.2, -0.9, -9.1);
    createCrease(0.06, 1.2, 0.9, -9.1);

    // Pitch Target Spot Marker (Real Cricket length/line visualizer)
    const markerGeo = new THREE.RingGeometry(0.12, 0.35, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const pitchMarker = new THREE.Mesh(markerGeo, markerMat);
    pitchMarker.rotation.x = -Math.PI / 2;
    pitchMarker.position.set(0, 0.04, 4.2);
    scene.add(pitchMarker);
    pitchMarkerRef.current = pitchMarker;

    // 30-Yard Circle
    const innerRingGeo = new THREE.RingGeometry(27.4, 27.6, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.03;
    scene.add(innerRing);

    // Boundary Rope & LED Boards
    const ropeGeo = new THREE.TorusGeometry(51, 0.28, 8, 64);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.22;
    scene.add(rope);

    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      const ledGeo = new THREE.BoxGeometry(6.5, 1.2, 0.35);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: angle % 2 === 0 ? 0xf59e0b : 0x0284c7,
        emissiveIntensity: 0.85,
        roughness: 0.3,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(Math.sin(angle) * 53, 0.6, Math.cos(angle) * 53);
      led.lookAt(0, 0.6, 0);
      scene.add(led);
    }

    // ==========================================
    // 3. STADIUM STANDS & 3D CROWD
    // ==========================================
    crowdMeshesRef.current = [];
    const tiers = 3;
    for (let t = 0; t < tiers; t++) {
      const radius = 56 + t * 4.5;
      const height = 2 + t * 3.8;
      const standGeo = new THREE.CylinderGeometry(radius + 4.5, radius, 3.6, 48, 1, true);
      const standMat = new THREE.MeshStandardMaterial({
        color: t === 0 ? 0x1e293b : t === 1 ? 0x334155 : 0x0f172a,
        side: THREE.DoubleSide,
        roughness: 0.7,
      });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = height;
      scene.add(stand);

      // Populate Animated Crowd
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
        const crowdGeo = new THREE.BoxGeometry(1.3, 1.4, 0.8);
        const crowdColor = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0xffffff, 0xa855f7][Math.floor(Math.random() * 6)];
        const crowdMat = new THREE.MeshStandardMaterial({ color: crowdColor, roughness: 0.5 });
        const crowdMember = new THREE.Mesh(crowdGeo, crowdMat);
        crowdMember.position.set(Math.sin(a) * (radius + 2.2), height + 1.2, Math.cos(a) * (radius + 2.2));
        crowdMember.lookAt(0, height, 0);
        scene.add(crowdMember);
        crowdMeshesRef.current.push(crowdMember);
      }
    }

    // ==========================================
    // 3.5 GIANT 3D JUMBOTRON SCOREBOARD SCREEN
    // ==========================================
    const scoreboardCanvas = document.createElement('canvas');
    scoreboardCanvas.width = 1024;
    scoreboardCanvas.height = 512;
    scoreboardCanvasRef.current = scoreboardCanvas;

    const scoreboardTexture = new THREE.CanvasTexture(scoreboardCanvas);
    scoreboardTextureRef.current = scoreboardTexture;

    // Screen Plane Mesh
    const screenGeo = new THREE.PlaneGeometry(24, 12);
    const screenMat = new THREE.MeshBasicMaterial({
      map: scoreboardTexture,
      side: THREE.DoubleSide,
    });
    const scoreboardMesh = new THREE.Mesh(screenGeo, screenMat);
    scoreboardMesh.position.set(0, 20, -56);
    scoreboardMesh.rotation.y = 0; // facing south towards batsman & pitch
    scene.add(scoreboardMesh);

    // Scoreboard Stadium Truss & Beveled Frame
    const frameGeo = new THREE.BoxGeometry(25.5, 13.5, 1.2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.8,
      roughness: 0.3,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 20, -56.8);
    scene.add(frameMesh);

    // Stadium Floodlights Above Scoreboard
    const lightBarGeo = new THREE.BoxGeometry(26, 0.8, 1.4);
    const lightBarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.9,
    });
    const lightBar = new THREE.Mesh(lightBarGeo, lightBarMat);
    lightBar.position.set(0, 27.2, -56.2);
    scene.add(lightBar);

    // ==========================================
    // 4. WICKETS & FLYING BAILS
    // ==========================================
    const createStumps = (zPos: number) => {
      const group = new THREE.Group();
      const stumpMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
      const stumpGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.72, 12);

      [-0.11, 0, 0.11].forEach((x) => {
        const stump = new THREE.Mesh(stumpGeo, stumpMat);
        stump.position.set(x, 0.36, 0);
        stump.castShadow = true;
        group.add(stump);
      });

      const bailGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.11, 8);
      const bailMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2 });

      const bail1 = new THREE.Mesh(bailGeo, bailMat);
      bail1.rotation.z = Math.PI / 2;
      bail1.position.set(-0.055, 0.73, 0);
      group.add(bail1);

      const bail2 = new THREE.Mesh(bailGeo, bailMat);
      bail2.rotation.z = Math.PI / 2;
      bail2.position.set(0.055, 0.73, 0);
      group.add(bail2);

      group.position.set(0, 0, zPos);
      scene.add(group);
      return { group, bails: [bail1, bail2] };
    };

    const strikerStumps = createStumps(9.7);
    stumpsGroupStrikerRef.current = strikerStumps.group;
    bailsMeshRef.current = strikerStumps.bails;

    const nonStrikerStumps = createStumps(-9.7);
    stumpsGroupNonStrikerRef.current = nonStrikerStumps.group;

    // ==========================================
    // 5. ARTICULATED 3D BATSMAN MODEL
    // ==========================================
    const batsmanGroup = new THREE.Group();
    batsmanGroupRef.current = batsmanGroup;

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 });
    const userJerseyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    const padsMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.4, roughness: 0.3 });
    const glovesMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.48, 0.65, 0.26);
    const torso = new THREE.Mesh(torsoGeo, userJerseyMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    batsmanTorsoRef.current = torso;
    batsmanGroup.add(torso);

    // Head & Helmet with Metallic Visor
    const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.6;
    batsmanGroup.add(head);

    const helmetGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 1.62, 0.02);
    batsmanGroup.add(helmet);

    // Steel Visor Grille
    const visorGeo = new THREE.TorusGeometry(0.14, 0.012, 8, 16, Math.PI);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 1.58, 0.12);
    batsmanGroup.add(visor);

    // Legs with Batting Pads & Knee Rolls
    const legGeo = new THREE.BoxGeometry(0.18, 0.78, 0.22);
    const leftLeg = new THREE.Mesh(legGeo, padsMat);
    leftLeg.position.set(-0.14, 0.45, 0);
    batsmanLegLRef.current = leftLeg;
    batsmanGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, padsMat);
    rightLeg.position.set(0.14, 0.45, 0);
    batsmanLegRRef.current = rightLeg;
    batsmanGroup.add(rightLeg);

    // Knee rolls
    const kneeRollGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.18, 8);
    const kneeRollL = new THREE.Mesh(kneeRollGeo, padsMat);
    kneeRollL.rotation.z = Math.PI / 2;
    kneeRollL.position.set(-0.14, 0.52, 0.08);
    batsmanGroup.add(kneeRollL);

    const kneeRollR = new THREE.Mesh(kneeRollGeo, padsMat);
    kneeRollR.rotation.z = Math.PI / 2;
    kneeRollR.position.set(0.14, 0.52, 0.08);
    batsmanGroup.add(kneeRollR);

    // ==========================================
    // MOMENTUM AURA RING & ENERGY FLARE (3D)
    // ==========================================
    const momentumGroup = new THREE.Group();
    momentumGroup.position.set(0, 0.05, 0);

    const auraRingGeo = new THREE.RingGeometry(0.7, 1.25, 32);
    const auraRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0, // toggled by momentum in animate loop
    });
    const auraRing = new THREE.Mesh(auraRingGeo, auraRingMat);
    auraRing.rotation.x = -Math.PI / 2;
    momentumGroup.add(auraRing);
    momentumAuraRingRef.current = auraRing;

    const innerFlameGeo = new THREE.RingGeometry(0.3, 0.65, 32);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlame.rotation.x = -Math.PI / 2;
    momentumGroup.add(innerFlame);

    batsmanGroup.add(momentumGroup);
    momentumAuraGroupRef.current = momentumGroup;

    // Articulated Right Arm & Bat
    const armGeo = new THREE.BoxGeometry(0.12, 0.55, 0.12);
    const armRGroup = new THREE.Group();
    const armR = new THREE.Mesh(armGeo, userJerseyMat);
    armR.position.y = -0.25;
    armRGroup.add(armR);

    const gloveR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), glovesMat);
    gloveR.position.y = -0.55;
    armRGroup.add(gloveR);

    // Real English Willow Cricket Bat with Brand Texture
    const batGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.13, 0.72, 0.045);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.36;
    blade.castShadow = true;
    batGroup.add(blade);

    // Bat Sticker Decal on Face
    const stickerGeo = new THREE.PlaneGeometry(0.09, 0.35);
    const stickerMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide });
    const sticker = new THREE.Mesh(stickerGeo, stickerMat);
    sticker.position.set(0, 0.42, 0.024);
    batGroup.add(sticker);

    // Bat Grip Handle
    const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = 0.88;
    batGroup.add(handle);

    batGroup.position.set(0, -0.6, 0.1);
    batGroup.rotation.x = 0.4;
    batGroupRef.current = batGroup;
    armRGroup.add(batGroup);

    armRGroup.position.set(0.32, 1.35, 0.05);
    batsmanArmRRef.current = armRGroup;
    batsmanGroup.add(armRGroup);

    // Left Arm
    const armLGroup = new THREE.Group();
    const armL = new THREE.Mesh(armGeo, userJerseyMat);
    armL.position.y = -0.25;
    armLGroup.add(armL);
    armLGroup.position.set(-0.32, 1.35, 0.05);
    armLGroup.rotation.z = -0.3;
    batsmanArmLRef.current = armLGroup;
    batsmanGroup.add(armLGroup);

    batsmanGroup.position.set(0.2, 0, 8.8);
    batsmanGroup.rotation.y = -Math.PI / 2;
    scene.add(batsmanGroup);

    // ==========================================
    // 6. ARTICULATED 3D BOWLER MODEL
    // ==========================================
    const bowlerGroup = new THREE.Group();
    bowlerGroupRef.current = bowlerGroup;

    const oppJerseyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const bowlerTorso = new THREE.Mesh(torsoGeo, oppJerseyMat);
    bowlerTorso.position.y = 1.15;
    bowlerTorso.castShadow = true;
    bowlerGroup.add(bowlerTorso);

    const bowlerHead = new THREE.Mesh(headGeo, skinMat);
    bowlerHead.position.y = 1.6;
    bowlerGroup.add(bowlerHead);

    const bowlerLegL = new THREE.Mesh(legGeo, pantsMat);
    bowlerLegL.position.set(-0.13, 0.45, 0);
    bowlerLegLRef.current = bowlerLegL;
    bowlerGroup.add(bowlerLegL);

    const bowlerLegR = new THREE.Mesh(legGeo, pantsMat);
    bowlerLegR.position.set(0.13, 0.45, 0);
    bowlerLegRRef.current = bowlerLegR;
    bowlerGroup.add(bowlerLegR);

    // Bowling Arm Windmill
    const bowlerArmGroup = new THREE.Group();
    const bArm = new THREE.Mesh(armGeo, oppJerseyMat);
    bArm.position.y = -0.25;
    bowlerArmGroup.add(bArm);
    bowlerArmGroup.position.set(0.32, 1.35, 0);
    bowlerArmRef.current = bowlerArmGroup;
    bowlerGroup.add(bowlerArmGroup);

    bowlerGroup.position.set(-0.3, 0, -11.5);
    scene.add(bowlerGroup);

    // ==========================================
    // 7. ANIMATED 3D UMPIRE
    // ==========================================
    const umpireGroup = new THREE.Group();
    umpireGroupRef.current = umpireGroup;

    const umpireCoatMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const umpireHatMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });

    const uTorso = new THREE.Mesh(torsoGeo, umpireCoatMat);
    uTorso.position.y = 1.15;
    umpireGroup.add(uTorso);

    const uHead = new THREE.Mesh(headGeo, skinMat);
    uHead.position.y = 1.6;
    umpireGroup.add(uHead);

    const uHat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 16), umpireHatMat);
    uHat.position.y = 1.76;
    umpireGroup.add(uHat);

    const uArmL = new THREE.Mesh(armGeo, umpireCoatMat);
    uArmL.position.set(-0.3, 1.15, 0);
    umpireArmLeftRef.current = uArmL;
    umpireGroup.add(uArmL);

    const uArmR = new THREE.Mesh(armGeo, umpireCoatMat);
    uArmR.position.set(0.3, 1.15, 0);
    umpireArmRightRef.current = uArmR;
    umpireGroup.add(uArmR);

    umpireGroup.position.set(1.5, 0, -9.8);
    scene.add(umpireGroup);

    // ==========================================
    // 8. 3D FIELDERS AROUND STADIUM
    // ==========================================
    fieldersGroupRef.current = [];
    const fielderCoords = [
      { x: -8, z: 6, label: 'Point' },
      { x: -14, z: 0, label: 'Cover' },
      { x: 12, z: 4, label: 'Mid-Wicket' },
      { x: 8, z: 8, label: 'Square Leg' },
      { x: -22, z: -15, label: 'Deep Extra Cover' },
      { x: 25, z: -20, label: 'Long On' },
      { x: -24, z: 22, label: 'Third Man' },
      { x: 26, z: 24, label: 'Deep Mid-Wicket' },
      { x: 0.5, z: 10.8, label: 'Wicket Keeper' },
    ];

    fielderCoords.forEach((coord) => {
      const fGroup = new THREE.Group();
      const fTorso = new THREE.Mesh(torsoGeo, oppJerseyMat);
      fTorso.position.y = 1.1;
      fGroup.add(fTorso);

      const fHead = new THREE.Mesh(headGeo, skinMat);
      fHead.position.y = 1.55;
      fGroup.add(fHead);

      const fLegL = new THREE.Mesh(legGeo, pantsMat);
      fLegL.position.set(-0.13, 0.45, 0);
      fGroup.add(fLegL);

      const fLegR = new THREE.Mesh(legGeo, pantsMat);
      fLegR.position.set(0.13, 0.45, 0);
      fGroup.add(fLegR);

      fGroup.position.set(coord.x, 0, coord.z);
      fGroup.lookAt(0, 0, 8.8);
      scene.add(fGroup);
      fieldersGroupRef.current.push(fGroup);
    });

    // ==========================================
    // 9. 3D CRICKET BALL & TRAJECTORY TRAIL
    // ==========================================
    const ballGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c,
      roughness: 0.2,
      metalness: 0.3,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(0, 1.8, -10);
    ballMesh.castShadow = true;
    scene.add(ballMesh);
    ballMeshRef.current = ballMesh;

    // Pitch Dust Particles on bounce
    const dustCount = 40;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xd4a373,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    dustParticles.visible = false;
    scene.add(dustParticles);
    dustParticlesRef.current = dustParticles;

    // ==========================================
    // 10. REAL-TIME 60FPS PHYSICS & RENDER LOOP
    // ==========================================
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Animate stadium crowd cheering
      crowdMeshesRef.current.forEach((c, idx) => {
        c.position.y += Math.sin(time * 4 + idx) * 0.0025;
      });

      // Animate 3D Momentum Aura around Batsman
      const isSurge = matchState?.isMomentumSurgeActive || (matchState?.momentum ?? 0) >= 100;
      const hasFlow = (matchState?.momentum ?? 0) >= 50;

      if (momentumAuraGroupRef.current) {
        momentumAuraGroupRef.current.rotation.y += isSurge ? 0.06 : 0.02;
      }
      if (momentumAuraRingRef.current) {
        const ringMat = momentumAuraRingRef.current.material as THREE.MeshBasicMaterial;
        if (isSurge) {
          ringMat.opacity = 0.75 + Math.sin(time * 10) * 0.25;
          ringMat.color.setHex(0xf59e0b);
        } else if (hasFlow) {
          ringMat.opacity = 0.3 + Math.sin(time * 4) * 0.15;
          ringMat.color.setHex(0x38bdf8);
        } else {
          ringMat.opacity = 0.0;
        }
      }

      // Real-Time Ball Physics & Player Animation Loop
      const physics = ballPhysicsRef.current;
      if (physics.active && ballMeshRef.current) {
        physics.timeInPhase += delta;

        if (physics.phase === 'RUNUP') {
          // Bowler run-up towards crease
          const progress = Math.min(1.0, physics.timeInPhase / 0.45);
          if (bowlerGroupRef.current) {
            bowlerGroupRef.current.position.z = -14 + progress * 4.5;
            if (bowlerLegLRef.current && bowlerLegRRef.current) {
              bowlerLegLRef.current.rotation.x = Math.sin(progress * 20) * 0.6;
              bowlerLegRRef.current.rotation.x = -Math.sin(progress * 20) * 0.6;
            }
          }
          if (bowlerArmRef.current) {
            bowlerArmRef.current.rotation.x = -progress * Math.PI * 2;
          }
          ballMeshRef.current.position.set(0, 1.8 + Math.sin(progress * 4) * 0.2, -14 + progress * 4.5);

          if (progress >= 1.0) {
            physics.phase = 'FLIGHT_TO_PITCH';
            physics.timeInPhase = 0;
          }
        } else if (physics.phase === 'FLIGHT_TO_PITCH') {
          // Ball travels from release to pitch point
          const progress = Math.min(1.0, physics.timeInPhase / 0.35);
          const currentPos = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(0, 1.9, -9.5),
            physics.pitchTarget,
            progress
          );
          currentPos.y += Math.sin(progress * Math.PI) * 0.35;
          ballMeshRef.current.position.copy(currentPos);

          if (progress >= 1.0) {
            physics.phase = 'BOUNCE_TO_BAT';
            physics.timeInPhase = 0;
            if (dustParticlesRef.current) {
              dustParticlesRef.current.visible = true;
              dustParticlesRef.current.position.copy(physics.pitchTarget);
            }
          }
        } else if (physics.phase === 'BOUNCE_TO_BAT') {
          // Ball rises off the pitch towards batsman
          const progress = Math.min(1.0, physics.timeInPhase / 0.25);
          const currentPos = new THREE.Vector3().lerpVectors(
            physics.pitchTarget,
            physics.batHitTarget,
            progress
          );
          currentPos.y += Math.sin(progress * Math.PI) * 0.55;
          ballMeshRef.current.position.copy(currentPos);

          // Batsman swing animation
          if (batGroupRef.current) {
            if (physics.shotType.includes('LOFT') || physics.runs === 6) {
              batGroupRef.current.rotation.x = -1.4 * progress;
            } else if (physics.shotType.includes('CUT') || physics.shotType.includes('PULL')) {
              batGroupRef.current.rotation.z = -1.1 * progress;
            } else {
              batGroupRef.current.rotation.x = -0.7 * progress;
            }
          }

          if (progress >= 1.0) {
            physics.phase = 'OFF_THE_BAT';
            physics.timeInPhase = 0;
          }
        } else if (physics.phase === 'OFF_THE_BAT') {
          const progress = Math.min(1.0, physics.timeInPhase / 0.6);

          if (physics.isWicket) {
            // Stumps fly and bails dislodge
            ballMeshRef.current.position.set(0, 0.45, 9.7);
            if (stumpsGroupStrikerRef.current) {
              stumpsGroupStrikerRef.current.rotation.x = progress * 0.9;
            }
            if (bailsMeshRef.current[0]) {
              bailsMeshRef.current[0].position.y = 0.73 + progress * 3.2;
              bailsMeshRef.current[0].position.x = -0.055 - progress * 1.8;
            }
            if (umpireArmRightRef.current) {
              umpireArmRightRef.current.rotation.z = -Math.PI * 0.85; // Raised finger
            }
          } else {
            // Ball flies off the bat to boundary or field
            const currentPos = new THREE.Vector3().lerpVectors(
              physics.batHitTarget,
              physics.boundaryTarget,
              progress
            );
            const apexHeight = physics.runs === 6 ? 18 : physics.runs === 4 ? 4 : 1.2;
            currentPos.y += Math.sin(progress * Math.PI) * apexHeight;
            ballMeshRef.current.position.copy(currentPos);

            // Umpire boundary signals
            if (physics.runs === 6 && umpireArmLeftRef.current && umpireArmRightRef.current) {
              umpireArmLeftRef.current.rotation.z = Math.PI * 0.85;
              umpireArmRightRef.current.rotation.z = -Math.PI * 0.85;
            } else if (physics.runs === 4 && umpireArmRightRef.current) {
              umpireArmRightRef.current.rotation.x = Math.sin(progress * 10) * 0.6;
            }
          }

          if (progress >= 1.0) {
            physics.active = false;
            physics.phase = 'DEAD_BALL';
          }
        }

        // Rotate ball seam in flight
        ballMeshRef.current.rotation.x += 0.4;
        ballMeshRef.current.rotation.y += 0.3;

        // Dynamic Camera Follow in Broadcast mode
        if (cameraMode === 'BROADCAST' && cameraRef.current && ballMeshRef.current) {
          cameraRef.current.lookAt(ballMeshRef.current.position);
        }
      }

      // Camera Shake Effect
      if (cameraShake > 0 && cameraRef.current) {
        cameraRef.current.position.x += (Math.random() - 0.5) * cameraShake * 0.25;
        cameraRef.current.position.y += (Math.random() - 0.5) * cameraShake * 0.25;
        setCameraShake((prev) => Math.max(0, prev - delta * 2));
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [isNightMode]);

  // Redraw 3D Scoreboard Texture in Real-Time
  useEffect(() => {
    const canvas = scoreboardCanvasRef.current;
    const texture = scoreboardTextureRef.current;
    if (!canvas || !texture) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, width, height);

    // Neon Frame Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    // Top Header Banner
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, 8, width - 16, 56);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`⚡ ${userTeam.toUpperCase()}  VS  ${oppTeam.toUpperCase()}`, 24, 46);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE 3D STADIUM JUMBOTRON', width - 24, 46);
    ctx.textAlign = 'left';

    // Live Score Metrics
    const currentRuns = matchState ? matchState.runs : 0;
    const currentWickets = matchState ? matchState.wickets : 0;
    const currentBalls = matchState ? matchState.balls : 0;
    const oversStr = `${Math.floor(currentBalls / 6)}.${currentBalls % 6}`;
    const totalOvers = matchState ? matchState.totalOvers : 5;

    // Left Panel: Total Match Score
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(20, 76, 520, 200);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 76, 520, 200);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('MATCH SCORE', 40, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 80px sans-serif';
    ctx.fillText(`${currentRuns}/${currentWickets}`, 40, 195);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`OVERS: ${oversStr} / ${totalOvers}.0`, 40, 245);

    // Right Panel: Striker & Bowler Information
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(560, 76, 444, 200);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(560, 76, 444, 200);

    const strikerRuns = matchState ? matchState.userRuns : 0;
    const strikerBalls = matchState ? matchState.userBalls : 0;
    const striker4s = matchState ? matchState.userFours : 0;
    const striker6s = matchState ? matchState.userSixes : 0;

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`🏏 ${player.name}*`, 580, 115);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${strikerRuns} (${strikerBalls})`, 580, 160);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    const sr = strikerBalls > 0 ? ((strikerRuns / strikerBalls) * 100).toFixed(1) : '0.0';
    ctx.fillText(`4s: ${striker4s}   6s: ${striker6s}   SR: ${sr}`, 580, 190);

    const bowlerName = matchState?.currentBowler || 'Starc';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`⚡ BOWLER: ${bowlerName}`, 580, 230);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText(`Non-Striker: ${matchState?.nonStriker || 'Partner'}`, 580, 255);

    // Target / Situation Mid Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 290, 984, 58);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px monospace';
    if (matchState?.target) {
      const needed = Math.max(0, matchState.target - currentRuns);
      const ballsLeft = Math.max(0, totalOvers * 6 - currentBalls);
      const reqRate = ballsLeft > 0 ? (needed / (ballsLeft / 6)).toFixed(2) : '0.00';
      ctx.fillText(`🎯 TARGET: ${matchState.target}  |  NEED ${needed} IN ${ballsLeft} BALLS  |  REQ RR: ${reqRate}`, 40, 328);
    } else {
      const crr = currentBalls > 0 ? (currentRuns / (currentBalls / 6)).toFixed(2) : '0.00';
      ctx.fillText(`📊 1ST INNINGS  |  CRR: ${crr}  |  PROJECTED TOTAL: ${Math.round(Number(crr) * totalOvers)}`, 40, 328);
    }

    // Dynamic Bottom Flash Banner (Milestone / Over / Shot)
    if (activeMilestone) {
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(20, 362, 984, 130);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🎉 ${activeMilestone.toUpperCase()} 🎉`, width / 2, 425);
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.fillText(`${player.name} SALUTES THE STADIUM CROWD!`, width / 2, 465);
      ctx.textAlign = 'left';
    } else if (activeOverAlert) {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(20, 362, 984, 130);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🔄 ${activeOverAlert.toUpperCase()} 🔄`, width / 2, 425);
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px monospace';
      ctx.fillText(`OVER COMPLETED • NEW BOWLER ATTACKS`, width / 2, 465);
      ctx.textAlign = 'left';
    } else if (lastOutcome && isAnimating) {
      const isSix = lastOutcome.runs === 6;
      const isFour = lastOutcome.runs === 4;
      const isWkt = lastOutcome.isWicket;
      ctx.fillStyle = isSix ? '#d97706' : isFour ? '#059669' : isWkt ? '#be123c' : '#1e293b';
      ctx.fillRect(20, 362, 984, 130);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px sans-serif';
      ctx.textAlign = 'center';
      const txt = isSix ? '💥 MAXIMUM 6 RUNS! 💥' : isFour ? '🏏 BOUNDARY 4 RUNS! 🏏' : isWkt ? `🔴 WICKET! ${lastOutcome.wicketType || 'OUT'}` : `SHOT PLAYED: ${lastOutcome.runs} RUNS`;
      ctx.fillText(txt, width / 2, 440);
      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(20, 362, 984, 130);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`STADIUM: Sher-e-Bangla National Cricket Stadium`, 40, 412);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px monospace';
      ctx.fillText(`Atmosphere: 100% Electrifying Capacity  |  Pitch: True Bounce & Carry`, 40, 455);
    }

    texture.needsUpdate = true;
  }, [matchState, lastOutcome, isAnimating, activeMilestone, activeOverAlert, userTeam, oppTeam, player.name]);

  // Update pitch target marker when bowling line/length changes
  useEffect(() => {
    if (!pitchMarkerRef.current || !selectedBowling) return;
    let targetZ = 4.2; // Good length default
    if (selectedBowling.length === 'YORKER') targetZ = 8.2;
    else if (selectedBowling.length === 'FULL') targetZ = 6.4;
    else if (selectedBowling.length === 'SHORT') targetZ = 1.8;
    else if (selectedBowling.length === 'BOUNCER') targetZ = 0.5;

    let targetX = 0;
    if (selectedBowling.line === 'OUTSIDE_OFF') targetX = -0.65;
    else if (selectedBowling.line === 'MIDDLE_LEG') targetX = 0.45;

    pitchMarkerRef.current.position.set(targetX, 0.04, targetZ);
  }, [selectedBowling]);

  // Trigger Delivery & Physics when isAnimating turns true
  useEffect(() => {
    if (!isAnimating || !lastOutcome) return;

    let targetZ = 4.2;
    if (selectedBowling?.length === 'YORKER') targetZ = 8.0;
    else if (selectedBowling?.length === 'FULL') targetZ = 6.2;
    else if (selectedBowling?.length === 'SHORT') targetZ = 2.0;
    else if (selectedBowling?.length === 'BOUNCER') targetZ = 0.8;

    let targetX = 0;
    if (selectedBowling?.line === 'OUTSIDE_OFF') targetX = -0.6;
    else if (selectedBowling?.line === 'MIDDLE_LEG') targetX = 0.4;

    const angleDeg = lastOutcome.shotDirection ?? (selectedShot?.direction || 45);
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const dist = lastOutcome.runs === 6 ? 54 : lastOutcome.runs === 4 ? 49 : 28;

    const boundaryPos = new THREE.Vector3(
      Math.cos(rad) * dist,
      0.1,
      8.8 + Math.sin(rad) * dist
    );

    const speed = Math.floor(136 + Math.random() * 14);
    setBallSpeedRadar(speed);

    if (lastOutcome.runs === 6) {
      setCameraShake(1.5);
    }

    ballPhysicsRef.current = {
      active: true,
      phase: 'RUNUP',
      timeInPhase: 0,
      pos: new THREE.Vector3(0, 1.8, -10),
      vel: new THREE.Vector3(0, 0, 0),
      spin: new THREE.Vector3(0, 0, 0),
      pitchTarget: new THREE.Vector3(targetX, 0.05, targetZ),
      batHitTarget: new THREE.Vector3(0.1, 0.75, 8.5),
      boundaryTarget: boundaryPos,
      isWicket: lastOutcome.isWicket,
      wicketType: lastOutcome.wicketType,
      runs: lastOutcome.runs,
      shotType: selectedShot?.shotType || 'DRIVE',
      shotAngle: angleDeg,
      ballSpeedKmh: speed,
    };
  }, [isAnimating, lastOutcome, selectedShot, selectedBowling]);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950 flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Mini-Controls: Speed Radar, Weather, Camera Mode */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        {/* Speed Radar & Momentum Indicator */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-lg">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-gray-300 font-bold">
              SPEED: <span className="text-amber-400 font-black">{ballSpeedRadar} KM/H</span>
            </span>
          </div>

          {(matchState?.isMomentumSurgeActive || (matchState?.momentum ?? 0) >= 100) && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 px-2.5 py-1.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>ON FIRE 🔥 +18 PWR</span>
            </div>
          )}
        </div>

        {/* Camera Angles & Fullscreen Switcher */}
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-2xl border border-white/10 pointer-events-auto shadow-lg">
          {(
            [
              ['BROADCAST', '📺 TV'],
              ['BATSMAN_3P', '🏏 3P'],
              ['BOWLER_CAM', '⚡ Bowler'],
              ['SKY_DRONE', '🚁 Drone'],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => handleSetCamera(mode)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                cameraMode === mode
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white transition-colors"
            title="Toggle Day/Night Stadium Lighting"
          >
            {isNightMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-indigo-300" />}
          </button>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-xl text-gray-400 hover:text-amber-400 transition-colors border-l border-white/10 pl-2"
              title={isFullscreen ? 'Exit Full Stadium Screen' : 'Enter Full Stadium Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Center Event Callout Banner (SIX, FOUR, WICKET) */}
      {isAnimating && lastOutcome && (
        <div className="relative z-10 self-center my-auto pointer-events-none animate-bounce">
          {lastOutcome.isWicket ? (
            <div className="bg-rose-600/90 backdrop-blur-xl border-2 border-rose-400 text-white font-black font-teko text-3xl sm:text-5xl px-8 py-2 rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(225,29,72,0.8)]">
              OUT! {lastOutcome.wicketType?.replace('_', ' ')}
            </div>
          ) : lastOutcome.runs === 6 ? (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 border-2 border-amber-300 text-slate-950 font-black font-teko text-4xl sm:text-6xl px-10 py-2 rounded-2xl uppercase tracking-widest shadow-[0_0_50px_rgba(245,158,11,0.9)] scale-110">
              MAXIMUM SIX! 💥
            </div>
          ) : lastOutcome.runs === 4 ? (
            <div className="bg-emerald-600/90 backdrop-blur-xl border-2 border-emerald-400 text-white font-black font-teko text-3xl sm:text-5xl px-8 py-2 rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.8)]">
              CRACKING FOUR! 🏏
            </div>
          ) : null}
        </div>
      )}

      {/* Subtle Bottom Ambient Gradient for Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-0" />
    </div>
  );
};
