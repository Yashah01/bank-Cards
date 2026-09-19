/**
 * CardSphere India - Comparison Tray Component
 * Floating dock at the bottom of the viewport showing selected cards (up to 4)
 * with quick-remove, card preview thumbnails, clear all, and "Compare Now" action.
 */

import { StorageService } from '../services/StorageService.js';
import { CardDataService } from '../services/CardDataService.js';

export class ComparisonTray {
  static trayEl = null;

  static init() {
    this.createDom();
    this.update();

    window.addEventListener('cardsphere:comparison_changed', () => {
      this.update();
    });
  }

  static createDom() {
    if (document.getElementById('comparison-dock')) return;

    this.trayEl = document.createElement('div');
    this.trayEl.id = 'comparison-dock';
    this.trayEl.className = 'comparison-dock-tray';
    this.trayEl.setAttribute('role', 'region');
    this.trayEl.setAttribute('aria-label', 'Card Comparison Tray');
    document.body.appendChild(this.trayEl);
  }

  static async update() {
    if (!this.trayEl) this.createDom();

    const ids = StorageService.getComparisonIds();
    if (ids.length === 0) {
      this.trayEl.classList.remove('is-active');
      this.trayEl.innerHTML = '';
      return;
    }

    const cards = await CardDataService.getCardsByIds(ids);

    this.trayEl.classList.add('is-active');
    this.trayEl.innerHTML = `
      <div class="dock-container">
        <div class="dock-left">
          <span class="dock-badge">${cards.length}/4</span>
          <div class="dock-meta">
            <span class="dock-heading">${cards.length} Card${cards.length > 1 ? 's' : ''} Selected</span>
            <span class="dock-sub">Compare features, limits & fees side-by-side</span>
          </div>
        </div>

        <div class="dock-slots">
          ${cards.map(c => `
            <div class="dock-slot-item" title="${c.cardName}">
              <span class="dock-slot-name">${c.cardName}</span>
              <button class="dock-slot-remove" data-remove-id="${c.id}" aria-label="Remove ${c.cardName} from comparison">&times;</button>
            </div>
          `).join('')}
          ${Array.from({ length: 4 - cards.length }).map(() => `
            <div class="dock-slot-empty">
              <span>+ Add Card</span>
            </div>
          `).join('')}
        </div>

        <div class="dock-actions">
          <button class="dock-btn-clear" id="dock-clear-btn">Clear</button>
          <a href="#compare" class="btn btn-primary dock-btn-compare">
            Compare Now →
          </a>
        </div>
      </div>
    `;

    // Bind remove buttons
    this.trayEl.querySelectorAll('[data-remove-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-remove-id');
        StorageService.removeFromComparison(id);
      });
    });

    // Clear all button
    const clearBtn = this.trayEl.querySelector('#dock-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        StorageService.clearComparison();
      });
    }
  }
}
