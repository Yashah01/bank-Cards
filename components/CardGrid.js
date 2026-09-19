/**
 * CardSphere India - CardGrid Component
 * Renders responsive card tiles with live 2D/3D previews, key financial metrics,
 * comparison dock triggers, and saved cards bookmarks.
 */

import { Card2D } from './Card2D.js';
import { StorageService } from '../services/StorageService.js';
import { Toast } from './Toast.js';

export class CardGrid {
  /**
   * Renders an individual card tile HTML
   * @param {Object} card
   * @param {string} displayMode '3d' | 'flat'
   * @returns {string} HTML markup
   */
  static renderCardTile(card, displayMode = '3d') {
    const isSaved = StorageService.isCardSaved(card.id);
    const comparisonList = StorageService.getComparisonIds();
    const isCompared = comparisonList.includes(card.id);

    const feeText = card.annualFee === 0 
      ? '<span class="fee-free">LIFETIME FREE (₹0)</span>' 
      : `<span class="fee-val">₹${card.annualFee.toLocaleString('en-IN')}</span> / year`;

    const waiverNote = card.feeWaiverThreshold > 0 
      ? `<span class="waiver-note">Waived on ₹${(card.feeWaiverThreshold / 100000).toFixed(1)}L annual spend</span>`
      : '';

    const loungeBadge = card.lounge?.domestic && card.lounge.domestic !== 'None'
      ? `<span class="tile-badge badge-lounge" title="${card.lounge.frequency || ''}">✈ ${card.lounge.domestic}</span>`
      : '<span class="tile-badge badge-dim">No Lounge</span>';

    const upiBadge = card.upiSupported
      ? '<span class="tile-badge badge-upi">⚡ RuPay UPI</span>'
      : '';

    const forexBadge = card.travel?.forexMarkup === '0.0%'
      ? '<span class="tile-badge badge-forex">🌍 0% Forex</span>'
      : '';

    return `
      <article class="card-tile ${card.secured ? 'tile-secured' : ''}" data-card-id="${card.id}">
        
        <!-- Top Visual Preview Area -->
        <div class="tile-preview-box" data-card-id="${card.id}">
          ${Card2D.render(card, { size: 'sm', interactive: false })}
          <button class="save-card-btn ${isSaved ? 'is-saved' : ''}" 
                  data-card-id="${card.id}" 
                  aria-label="${isSaved ? 'Remove from saved' : 'Save card'}" 
                  title="${isSaved ? 'Saved to Favorites' : 'Save to Favorites'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <!-- Card Tile Body -->
        <div class="tile-content">
          
          <div class="tile-header">
            <span class="tile-issuer">${card.issuer}</span>
            <span class="tile-category-tag">${card.category}</span>
          </div>

          <h3 class="tile-title">
            <a href="#card/${card.id}" class="tile-title-link">${card.cardName}</a>
          </h3>

          <!-- Badge Pills -->
          <div class="tile-badges">
            ${loungeBadge}
            ${upiBadge}
            ${forexBadge}
            <span class="tile-badge badge-network">${card.network}</span>
          </div>

          <!-- Highlight Metrics Box -->
          <div class="tile-metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Annual Fee</span>
              <div class="metric-value">${feeText}</div>
              ${waiverNote}
            </div>
            <div class="metric-item">
              <span class="metric-label">Reward / Cashback</span>
              <div class="metric-value metric-reward">
                ${card.category === 'Cashback' ? card.cashback?.baseRate || '1%' : card.rewards?.baseRate || '1.0%'}
              </div>
              <span class="metric-desc">${card.category === 'Cashback' ? 'Cashback' : 'Value rate'}</span>
            </div>
          </div>

          <!-- Key Benefit Snippet -->
          <p class="tile-benefit-snippet">
            ${card.cashback?.categories || card.rewards?.description || 'Competitive rewards across daily categories.'}
          </p>

          <!-- Footer Actions -->
          <div class="tile-actions">
            <button class="btn btn-secondary tile-details-btn" data-action="details" data-card-id="${card.id}">
              View Details
            </button>
            <button class="btn ${isCompared ? 'btn-primary' : 'btn-outline'} tile-compare-btn" 
                    data-action="compare" 
                    data-card-id="${card.id}"
                    aria-pressed="${isCompared ? 'true' : 'false'}">
              ${isCompared ? '✓ Added' : '+ Compare'}
            </button>
          </div>

        </div>

      </article>
    `;
  }

  /**
   * Renders a list/grid of cards into a target DOM container
   * @param {HTMLElement} container
   * @param {Array} cards
   * @param {string} displayMode
   */
  static renderInto(container, cards, displayMode = '3d') {
    if (!container) return;

    if (!cards || cards.length === 0) {
      container.innerHTML = `
        <div class="empty-results-state">
          <div class="empty-icon" aria-hidden="true">💳</div>
          <h3>No matching cards found</h3>
          <p>Try clearing some filters or searching for different criteria like "Cashback", "UPI", "Zero Forex" or a bank name.</p>
          <button class="btn btn-primary" id="btn-reset-filters">Reset All Filters</button>
        </div>
      `;

      const resetBtn = container.querySelector('#btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('cardsphere:reset_filters'));
        });
      }
      return;
    }

    container.innerHTML = cards.map(c => this.renderCardTile(c, displayMode)).join('');
    this.attachEvents(container);
  }

  static attachEvents(container) {
    // Save Card heart click
    container.querySelectorAll('.save-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute('data-card-id');
        const isSaved = StorageService.toggleSaveCard(cardId);
        btn.classList.toggle('is-saved', isSaved);
        btn.setAttribute('aria-label', isSaved ? 'Remove from saved' : 'Save card');
        btn.setAttribute('title', isSaved ? 'Saved to Favorites' : 'Save to Favorites');
        btn.querySelector('svg').setAttribute('fill', isSaved ? 'currentColor' : 'none');

        if (isSaved) {
          Toast.success('Card added to your saved collection');
        } else {
          Toast.info('Card removed from saved collection');
        }
      });
    });

    // Compare button click
    container.querySelectorAll('.tile-compare-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute('data-card-id');
        const list = StorageService.getComparisonIds();

        if (list.includes(cardId)) {
          StorageService.removeFromComparison(cardId);
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline');
          btn.textContent = '+ Compare';
          btn.setAttribute('aria-pressed', 'false');
          Toast.info('Removed from comparison');
        } else {
          const res = StorageService.addToComparison(cardId);
          if (res.success) {
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
            btn.textContent = '✓ Added';
            btn.setAttribute('aria-pressed', 'true');
            Toast.success(`Added to comparison (${res.list.length}/4)`);
          } else if (res.reason === 'max_reached') {
            Toast.warning('You can compare a maximum of 4 cards at a time. Remove one first.');
          }
        }
      });
    });

    // View details button click
    container.querySelectorAll('.tile-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cardId = btn.getAttribute('data-card-id');
        window.location.hash = `#card/${cardId}`;
      });
    });
  }
}
