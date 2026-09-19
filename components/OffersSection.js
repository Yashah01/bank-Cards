/**
 * CardSphere India - OffersSection Component
 * Merchant discounts directory with category filters, copyable coupon codes,
 * validity tags (ACTIVE, EXPIRING SOON), and bank eligibility filters.
 */

import { OfferDataService } from '../services/OfferDataService.js';
import { Toast } from './Toast.js';

export class OffersSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCategory = 'All';
    this.offers = [];
    this.init();
  }

  async init() {
    if (!this.container) return;
    this.offers = await OfferDataService.getOffers();
    this.render();
  }

  async setCategory(cat) {
    this.currentCategory = cat;
    this.offers = await OfferDataService.getOffers({ category: cat });
    this.render();
  }

  render() {
    const categories = ['All', 'Shopping', 'Dining', 'Travel', 'Entertainment', 'Utilities', 'Fuel'];

    this.container.innerHTML = `
      <div class="offers-page-wrapper">
        
        <!-- Header -->
        <div class="offers-header-bar">
          <div>
            <span class="offers-tag">VERIFIED MERCHANT DEALS</span>
            <h1 class="offers-title">Exclusive Payment Card Offers</h1>
            <p class="offers-desc">Instant discounts, cashback promos, and BOGO ticket deals currently active across Indian merchants.</p>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="offers-category-pills">
          ${categories.map(c => `
            <button class="cat-pill-btn ${this.currentCategory === c ? 'active' : ''}" data-cat="${c}">
              ${c}
            </button>
          `).join('')}
        </div>

        <!-- Offers Grid -->
        <div class="offers-grid">
          ${this.offers.map(offer => {
            const isExpiring = offer.status === 'EXPIRING SOON';

            return `
              <article class="offer-card status-${offer.status.toLowerCase().replace(/\s+/g, '-')}">
                
                <div class="offer-top-row">
                  <div class="offer-merchant-badge">
                    <span class="offer-merchant-name">${offer.merchant}</span>
                    <span class="offer-cat-label">${offer.category}</span>
                  </div>
                  <span class="offer-status-tag ${isExpiring ? 'tag-warning' : 'tag-active'}">
                    ${offer.status}
                  </span>
                </div>

                <div class="offer-body">
                  <h3 class="offer-discount-title">${offer.discount}</h3>
                  
                  <div class="offer-card-eligibility">
                    <span class="card-chip-icon">💳</span>
                    <span class="eligibility-text">${offer.cardEligibility}</span>
                  </div>

                  <p class="offer-terms-snippet">${offer.terms}</p>

                  <div class="offer-meta-grid">
                    <div class="offer-meta-item">
                      <span class="meta-label">Min Spend</span>
                      <span class="meta-val">${offer.minimumSpend === 0 ? 'No Minimum' : `₹${offer.minimumSpend.toLocaleString('en-IN')}`}</span>
                    </div>
                    <div class="offer-meta-item">
                      <span class="meta-label">Max Discount</span>
                      <span class="meta-val">${offer.maximumDiscount}</span>
                    </div>
                    <div class="offer-meta-item">
                      <span class="meta-label">Valid Until</span>
                      <span class="meta-val">${offer.endDate}</span>
                    </div>
                  </div>

                  <!-- Promo Code Copy Box -->
                  <div class="promo-code-container">
                    <span class="promo-code-text">${offer.promoCode}</span>
                    <button class="btn-copy-code" data-code="${offer.promoCode}" aria-label="Copy promo code ${offer.promoCode}">
                      Copy Code
                    </button>
                  </div>
                </div>

                <div class="offer-footer-note">
                  <span>Data verified: ${offer.lastVerified}</span>
                  <span class="offer-source">Source: ${offer.source}</span>
                </div>

              </article>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Category click
    this.container.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        this.setCategory(cat);
      });
    });

    // Copy promo code
    this.container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(() => {
            Toast.success(`Promo code "${code}" copied!`);
            btn.textContent = '✓ Copied!';
            setTimeout(() => { btn.textContent = 'Copy Code'; }, 2000);
          });
        } else {
          prompt('Copy coupon code:', code);
        }
      });
    });
  }
}
