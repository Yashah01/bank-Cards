/**
 * CardSphere India - Three.js 3D Card Engine
 * Renders an ISO 7810 ID-1 standard rounded rectangular payment card with physical beveling,
 * dynamic high-DPI procedural front/back textures, interactive mouse/touch tilt damping,
 * 180-degree flip animation, drag orbiting, and 4 lighting presets.
 */

import * as THREE from 'three';
import { Card2D } from './Card2D.js';

export class Card3D {
  constructor(container, card, options = {}) {
    this.container = container;
    this.card = card;
    this.options = {
      interactive: true,
      autoRotate: options.autoRotate || false,
      lightingPreset: options.lightingPreset || 'studio',
      enableFlip: options.enableFlip !== false,
      height: options.height || 360,
      enableControls: options.enableControls !== false,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cardMesh = null;
    this.cardGroup = null;
    this.lights = {};
    this.animId = null;
    this.isDisposed = false;

    // Interaction state
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.isFlipped = false;
    this.flipProgress = 0; // 0 = front, 1 = back
    this.isDragging = false;
    this.previousPointer = { x: 0, y: 0 };
    this.dragRotation = { x: 0, y: 0 };
    this.pushZ = 0;
    this.targetPushZ = 0;

    // Accessibility check
    this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  static isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init() {
    if (!Card3D.isWebGLAvailable()) {
      console.warn('WebGL unavailable, falling back to Card2D');
      this.renderFallback();
      return;
    }

    try {
      this.setupScene();
      this.createCardGeometry();
      this.setupLighting(this.options.lightingPreset);
      this.bindEvents();
      this.animate();
    } catch (err) {
      console.error('Error initializing Three.js Card3D:', err);
      this.renderFallback();
    }
  }

  renderFallback() {
    this.container.innerHTML = Card2D.render(this.card, {
      interactive: true,
      isFlipped: this.isFlipped,
      size: 'lg'
    });
  }

  setupScene() {
    this.container.innerHTML = '';
    this.container.classList.add('card-3d-wrapper');

    const width = this.container.clientWidth || 480;
    const height = this.options.height || this.container.clientHeight || 320;

    this.scene = new THREE.Scene();

    // Perspective Camera: 45 deg FOV
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.renderer.domElement.className = 'card-3d-canvas';
    this.container.appendChild(this.renderer.domElement);

    this.cardGroup = new THREE.Group();
    this.scene.add(this.cardGroup);
  }

  createCardGeometry() {
    // ISO/IEC 7810 ID-1: 85.60 mm × 53.98 mm -> Ratio ~ 1.5858
    const width = 3.375;
    const height = 2.128;
    const radius = 0.14;
    const depth = 0.035;

    // Rounded rectangle shape
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.014
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // High-resolution Canvas textures
    const frontCanvas = this.generateFrontTextureCanvas();
    const backCanvas = this.generateBackTextureCanvas();

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTexture.anisotropy = 8;

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;
    backTexture.anisotropy = 8;

    // Metallic / Finish settings based on card
    const theme = this.card.colorTheme || {};
    const isMetallic = theme.metallic || false;
    const metalness = isMetallic ? 0.85 : 0.25;
    const roughness = isMetallic ? 0.22 : 0.38;

    // Side edge material (silver / gold / dark chrome)
    const edgeColor = isMetallic ? (theme.accent || '#D4AF37') : (theme.primary || '#333333');
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(edgeColor),
      metalness: isMetallic ? 0.9 : 0.4,
      roughness: 0.25
    });

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      metalness: metalness,
      roughness: roughness,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      reflectivity: 0.8
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      metalness: 0.3,
      roughness: 0.45,
      clearcoat: 0.3
    });

    // Custom multi-material assignment for ExtrudeGeometry
    // In Three.js ExtrudeGeometry, material index 0 = front/back faces, material index 1 = extruded sides/bevels
    // To have distinct front and back faces, we use two thin face meshes sandwiching the core
    const coreMesh = new THREE.Mesh(geometry, edgeMaterial);

    // Front decal plane
    const faceGeo = new THREE.PlaneGeometry(width - 0.02, height - 0.02);
    const frontMesh = new THREE.Mesh(faceGeo, frontMaterial);
    frontMesh.position.z = (depth / 2) + 0.02;

    // Back decal plane
    const backGeo = new THREE.PlaneGeometry(width - 0.02, height - 0.02);
    const backMesh = new THREE.Mesh(backGeo, backMaterial);
    backMesh.position.z = -(depth / 2) - 0.02;
    backMesh.rotation.y = Math.PI; // Flip back face so text isn't mirrored

    this.cardMesh = new THREE.Group();
    this.cardMesh.add(coreMesh);
    this.cardMesh.add(frontMesh);
    this.cardMesh.add(backMesh);

    this.cardGroup.add(this.cardMesh);
  }

  generateFrontTextureCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 646; // ID-1 ratio
    const ctx = canvas.getContext('2d');

    const theme = this.card.colorTheme || {};
    const primary = theme.primary || '#1A1C23';
    const secondary = theme.secondary || '#2E384D';
    const accent = theme.accent || '#66FCF1';
    const textColor = theme.textColor || '#FFFFFF';

    // Base background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 646);
    bgGrad.addColorStop(0, primary);
    bgGrad.addColorStop(1, secondary);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 646);

    // Dynamic metallic sheen / holographic diagonal bands
    const sheenGrad = ctx.createLinearGradient(0, 0, 1024, 646);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    sheenGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.12)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
    sheenGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.08)');
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(0, 0, 1024, 646);

    // Subtle geometric pattern / watermarking
    ctx.strokeStyle = `${accent}1A`;
    ctx.lineWidth = 2;
    for (let i = -600; i < 1200; i += 80) {
      ctx.beginPath();
      ctx.arc(i + 400, 323, 400, 0, Math.PI * 2);
      ctx.stroke();
    }

    // --- 1. TOP LEFT: Bank Branding ---
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText((this.card.issuer || 'BANK').toUpperCase(), 64, 90);

    ctx.fillStyle = `${accent}`;
    ctx.font = '600 20px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillText((this.card.variant || this.card.category || 'CREDIT CARD').toUpperCase(), 66, 122);

    // --- 2. TOP RIGHT: Contactless Icon & UPI Badge ---
    if (this.card.upiSupported) {
      // Draw RuPay UPI Pill
      ctx.fillStyle = '#097939';
      this.roundRect(ctx, 740, 58, 140, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('⚡ UPI LINKED', 752, 82);
    }

    // Contactless 3 Arcs
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(920, 76, 12, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(920, 76, 22, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(920, 76, 32, -0.6, 0.6);
    ctx.stroke();

    // --- 3. EMV CHIP (Metallic Gold / Silver) ---
    const chipX = 72;
    const chipY = 220;
    const chipW = 120;
    const chipH = 92;

    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
    chipGrad.addColorStop(0, '#E5C07B');
    chipGrad.addColorStop(0.5, '#F3E5AB');
    chipGrad.addColorStop(1, '#D4AF37');
    ctx.fillStyle = chipGrad;
    this.roundRect(ctx, chipX, chipY, chipW, chipH, 12);
    ctx.fill();

    // Chip internal circuit lines
    ctx.strokeStyle = 'rgba(60, 40, 10, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(chipX + 22, chipY + 16, chipW - 44, chipH - 32);
    ctx.beginPath();
    ctx.moveTo(chipX, chipY + chipH / 2);
    ctx.lineTo(chipX + chipW, chipY + chipH / 2);
    ctx.moveTo(chipX + chipW / 2, chipY);
    ctx.lineTo(chipX + chipW / 2, chipY + chipH);
    ctx.stroke();

    // --- 4. MASKED CARD NUMBER ---
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px "Space Grotesk", "Courier New", monospace';
    ctx.letterSpacing = '6px';
    ctx.fillText('••••   ••••   ••••   4291', 72, 410);

    // --- 5. BOTTOM ROW: Cardholder, Expiry, Network ---
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CARDHOLDER', 72, 490);
    ctx.fillText('VALID THRU', 380, 490);

    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('RAHUL SHARMA', 72, 530);

    ctx.font = 'bold 24px "Space Grotesk", monospace';
    ctx.fillText('08/29', 380, 530);

    // Network Logo (Right)
    const net = (this.card.network || '').toLowerCase();
    if (net.includes('rupay')) {
      ctx.fillStyle = '#097939';
      ctx.font = 'italic bold 44px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('RuPay', 820, 535);
      ctx.fillStyle = '#F26522';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('SELECT', 835, 560);
    } else if (net.includes('visa')) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'italic 900 52px "Arial Black", sans-serif';
      ctx.fillText('VISA', 830, 535);
    } else if (net.includes('mastercard')) {
      // Mastercard interlocking red and yellow circles
      ctx.fillStyle = '#EB001B';
      ctx.beginPath();
      ctx.arc(840, 520, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(247, 158, 27, 0.9)';
      ctx.beginPath();
      ctx.arc(884, 520, 36, 0, Math.PI * 2);
      ctx.fill();
    } else if (net.includes('amex') || net.includes('american express')) {
      ctx.fillStyle = '#006FCF';
      this.roundRect(ctx, 800, 480, 150, 70, 8);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('AMEX', 840, 525);
    } else {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(this.card.network || 'NETWORK', 780, 535);
    }

    return canvas;
  }

  generateBackTextureCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 646;
    const ctx = canvas.getContext('2d');

    const theme = this.card.colorTheme || {};
    const primary = theme.primary || '#11141A';

    // Base background
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, 1024, 646);

    // Magnetic stripe (Dark brown/black)
    ctx.fillStyle = '#0B0D11';
    ctx.fillRect(0, 60, 1024, 110);

    // Signature strip
    ctx.fillStyle = '#E8E8E8';
    this.roundRect(ctx, 64, 240, 580, 74, 4);
    ctx.fill();

    // Subtle signature watermark pattern
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1.5;
    for (let x = 70; x < 630; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 305);
      ctx.lineTo(x + 10, 245);
      ctx.stroke();
    }

    // CVV Box
    ctx.fillStyle = '#FFFFFF';
    this.roundRect(ctx, 656, 240, 140, 74, 4);
    ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'italic bold 28px "Space Grotesk", monospace';
    ctx.fillText('842', 700, 286);

    ctx.fillStyle = '#888888';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('CVV', 666, 260);

    // Hologram Square
    const holoGrad = ctx.createLinearGradient(840, 240, 950, 314);
    holoGrad.addColorStop(0, '#A0C4FF');
    holoGrad.addColorStop(0.5, '#BDB2FF');
    holoGrad.addColorStop(1, '#FDFFB6');
    ctx.fillStyle = holoGrad;
    this.roundRect(ctx, 830, 240, 120, 74, 8);
    ctx.fill();

    // Disclaimer text
    ctx.fillStyle = '#8D99AE';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CardSphere India Simulation Card. For informational and educational discovery only.', 64, 420);
    ctx.fillText('This card is subject to the terms of the issuing financial institution.', 64, 450);
    ctx.fillText('For customer service assistance call 1800-XXX-XXXX or visit issuer portal.', 64, 480);

    // Small bank wordmark on bottom left
    ctx.fillStyle = '#C5C6C7';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText((this.card.issuer || 'ISSUER').toUpperCase(), 64, 550);

    return canvas;
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  setupLighting(preset = 'studio') {
    // Remove existing lights
    Object.values(this.lights).forEach(l => this.scene.remove(l));
    this.lights = {};

    switch (preset) {
      case 'midnight':
        // Cool cyan / deep blue rim lighting
        this.lights.ambient = new THREE.AmbientLight(0x0a192f, 1.5);
        this.lights.main = new THREE.DirectionalLight(0x66fcf1, 2.5);
        this.lights.main.position.set(3, 4, 4);
        this.lights.rim = new THREE.DirectionalLight(0x45a29e, 3.0);
        this.lights.rim.position.set(-4, -2, -3);
        this.lights.top = new THREE.PointLight(0x00f2fe, 1.8, 10);
        this.lights.top.position.set(0, 3, 2);
        break;

      case 'platinum':
        // High specular chrome reflections
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 2.0);
        this.lights.main = new THREE.DirectionalLight(0xffffff, 3.2);
        this.lights.main.position.set(4, 5, 5);
        this.lights.spec = new THREE.PointLight(0xf0f4f8, 3.5, 12);
        this.lights.spec.position.set(-3, 3, 4);
        this.lights.rim = new THREE.DirectionalLight(0xd9e2ec, 1.8);
        this.lights.rim.position.set(0, -4, -3);
        break;

      case 'cyber':
        // Electric teal + neon purple accent
        this.lights.ambient = new THREE.AmbientLight(0x130f26, 1.8);
        this.lights.main = new THREE.DirectionalLight(0x66fcf1, 3.0);
        this.lights.main.position.set(4, 3, 4);
        this.lights.accent = new THREE.DirectionalLight(0xa855f7, 3.5);
        this.lights.accent.position.set(-4, -3, 3);
        this.lights.back = new THREE.PointLight(0xec4899, 2.5, 8);
        this.lights.back.position.set(0, 0, -4);
        break;

      case 'studio':
      default:
        // Balanced neutral 3-point softbox
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 1.8);
        this.lights.key = new THREE.DirectionalLight(0xffffff, 2.2);
        this.lights.key.position.set(4, 4, 5);
        this.lights.fill = new THREE.DirectionalLight(0xcfd8dc, 1.4);
        this.lights.fill.position.set(-4, 2, 4);
        this.lights.back = new THREE.DirectionalLight(0x90a4ae, 1.2);
        this.lights.back.position.set(0, -3, -4);
        break;
    }

    Object.values(this.lights).forEach(l => this.scene.add(l));
  }

  setLightingPreset(preset) {
    this.options.lightingPreset = preset;
    this.setupLighting(preset);
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }

  setAutoRotate(enabled) {
    this.options.autoRotate = !!enabled;
  }

  bindEvents() {
    const el = this.container;

    // Mouse movement tilt
    this.onPointerMove = (e) => {
      if (this.reducedMotion) return;

      const rect = el.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (this.isDragging) {
        const deltaX = clientX - this.previousPointer.x;
        const deltaY = clientY - this.previousPointer.y;
        this.dragRotation.y += deltaX * 0.008;
        this.dragRotation.x += deltaY * 0.008;
        this.previousPointer = { x: clientX, y: clientY };
        return;
      }

      // Normalized coordinates (-1 to 1)
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1;

      // Max rotation: X: ±12 deg (0.21 rad), Y: ±18 deg (0.31 rad)
      const maxRotX = 0.21;
      const maxRotY = 0.31;

      this.targetRotation.x = -ny * maxRotX;
      this.targetRotation.y = nx * maxRotY;
    };

    this.onPointerDown = (e) => {
      this.isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.previousPointer = { x: clientX, y: clientY };
      this.targetPushZ = 0.15; // Subtle pop forward
    };

    this.onPointerUp = () => {
      this.isDragging = false;
      this.targetPushZ = 0.0;
    };

    this.onPointerLeave = () => {
      this.isDragging = false;
      this.targetRotation.x = 0;
      this.targetRotation.y = 0;
      this.targetPushZ = 0.0;
    };

    // Attach listeners
    el.addEventListener('mousemove', this.onPointerMove, { passive: true });
    el.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mouseup', this.onPointerUp);
    el.addEventListener('mouseleave', this.onPointerLeave);

    // Touch support for mobile
    el.addEventListener('touchstart', this.onPointerDown, { passive: true });
    el.addEventListener('touchmove', this.onPointerMove, { passive: true });
    el.addEventListener('touchend', this.onPointerUp);

    // Window resize
    this.onResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.options.height || this.container.clientHeight;
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', this.onResize);

    // Listen for global theme changes to adjust ambient light
    this.onThemeChanged = (e) => {
      const theme = e.detail.theme;
      if (this.lights.ambient) {
        this.lights.ambient.intensity = theme === 'light' ? 2.4 : 1.8;
      }
    };
    window.addEventListener('cardsphere:theme_changed', this.onThemeChanged);
  }

  animate() {
    if (this.isDisposed) return;

    this.animId = requestAnimationFrame(() => this.animate());

    if (!this.cardMesh || !this.renderer || !this.scene || !this.camera) return;

    // Smooth lerp damping for tilt
    const lerpFactor = 0.08;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * lerpFactor;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * lerpFactor;
    this.pushZ += (this.targetPushZ - this.pushZ) * 0.12;

    // Smooth flip interpolation
    const targetFlip = this.isFlipped ? Math.PI : 0;
    this.flipProgress += (targetFlip - this.flipProgress) * 0.07;

    // Gentle idle floating motion (if not reduced motion)
    let idleY = 0;
    let idleRotZ = 0;
    if (!this.reducedMotion) {
      const t = performance.now() * 0.0015;
      idleY = Math.sin(t) * 0.05;
      idleRotZ = Math.sin(t * 0.8) * 0.015;

      if (this.options.autoRotate && !this.isDragging) {
        this.dragRotation.y += 0.012;
      }
    }

    // Apply combined rotations
    this.cardMesh.rotation.x = this.currentRotation.x + this.dragRotation.x;
    this.cardMesh.rotation.y = this.currentRotation.y + this.dragRotation.y + this.flipProgress;
    this.cardMesh.rotation.z = idleRotZ;

    this.cardMesh.position.y = idleY;
    this.cardMesh.position.z = this.pushZ;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isDisposed = true;
    if (this.animId) cancelAnimationFrame(this.animId);

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('cardsphere:theme_changed', this.onThemeChanged);
    window.removeEventListener('mouseup', this.onPointerUp);

    if (this.cardMesh) {
      this.cardMesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }
}
