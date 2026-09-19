/**
 * CardSphere India - Theme Manager
 * Controls Dark and Light theme states, CSS custom variables, and notifies 3D scenes.
 */

import { StorageService } from '../services/StorageService.js';

export class ThemeManager {
  static currentTheme = 'dark';

  static init() {
    this.currentTheme = StorageService.getTheme();
    this.applyTheme(this.currentTheme, false);

    // Watch for system theme changes if user hasn't explicitly set one
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('cardsphere_theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  static toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  static setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') theme = 'dark';
    this.currentTheme = theme;
    StorageService.setTheme(theme);
    this.applyTheme(theme, true);
  }

  static applyTheme(theme, animate = true) {
    const root = document.documentElement;
    if (animate) {
      root.classList.add('theme-transitioning');
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 600);
    }

    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
    }

    // Update toggle buttons in DOM
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const iconEl = btn.querySelector('.theme-icon');
      if (iconEl) {
        iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    });

    // Notify Three.js 3D scenes
    window.dispatchEvent(new CustomEvent('cardsphere:theme_changed', { detail: { theme } }));
  }

  static getTheme() {
    return this.currentTheme;
  }
}
