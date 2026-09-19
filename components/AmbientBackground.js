/**
 * CardSphere India - Ambient Three.js Background
 * Subtle floating particle constellation and atmospheric lighting.
 * Highly optimized, GPU-friendly, respects prefers-reduced-motion and tab visibility.
 */

import * as THREE from 'three';

export class AmbientBackground {
  constructor(canvasId = 'ambient-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
    this.animId = null;
    this.isVisible = true;

    this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    try {
      this.scene = new THREE.Scene();
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
      this.camera.position.z = 400;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      this.createParticles();
      this.bindEvents();

      if (!this.reducedMotion) {
        this.animate();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    } catch (e) {
      console.warn('Ambient background WebGL initialization failed:', e);
    }
  }

  createParticles() {
    const particleCount = window.innerWidth < 768 ? 60 : 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      scales[i] = Math.random() * 3 + 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle sprite texture (soft radial circular glow)
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const ctx = particleCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(102, 252, 241, 0.9)');
    grad.addColorStop(0.3, 'rgba(69, 162, 158, 0.4)');
    grad.addColorStop(1, 'rgba(11, 12, 16, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(particleCanvas);

    const material = new THREE.PointsMaterial({
      size: 14,
      map: texture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.camera || !this.renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    if (!this.isVisible || !this.particleSystem || !this.renderer) return;

    const time = performance.now() * 0.0003;
    this.particleSystem.rotation.y = time * 0.15;
    this.particleSystem.rotation.x = Math.sin(time * 0.1) * 0.08;

    this.renderer.render(this.scene, this.camera);
  }
}
