/**
 * CardSphere India - Display Mode Toggle (Flat View vs 3D View)
 * Allows global switching between pixel-perfect CSS/SVG Flat View and interactive Three.js 3D View.
 */

import { StorageService } from '../services/StorageService.js';

export class DisplayToggle {
  static currentMode = '3d';

  static init() {
    this.currentMode = StorageService.getDisplayMode();
    this.updateDom();

    window.addEventListener('cardsphere:display_mode_changed', (e) => {
      this.currentMode = e.detail.mode;
      this.updateDom();
    });
  }

  static toggle() {
    const nextMode = this.currentMode === '3d' ? 'flat' : '3d';
    this.setMode(nextMode);
    return nextMode;
  }

  static setMode(mode) {
    if (mode !== '3d' && mode !== 'flat') mode = '3d';
    this.currentMode = mode;
    StorageService.setDisplayMode(mode);
    this.updateDom();
  }

  static updateDom() {
    const buttons = document.querySelectorAll('.display-mode-toggle');
    buttons.forEach(btn => {
      const flatBtn = btn.querySelector('[data-mode="flat"]');
      const threeBtn = btn.querySelector('[data-mode="3d"]');

      if (flatBtn && threeBtn) {
        if (this.currentMode === 'flat') {
          flatBtn.classList.add('active');
          flatBtn.setAttribute('aria-pressed', 'true');
          threeBtn.classList.remove('active');
          threeBtn.setAttribute('aria-pressed', 'false');
        } else {
          threeBtn.classList.add('active');
          threeBtn.setAttribute('aria-pressed', 'true');
          flatBtn.classList.remove('active');
          flatBtn.setAttribute('aria-pressed', 'false');
        }
      }
    });

    document.documentElement.setAttribute('data-display-mode', this.currentMode);
  }

  static getMode() {
    return this.currentMode;
  }
}
