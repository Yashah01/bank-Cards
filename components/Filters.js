/**
 * CardSphere India - Filters Component
 * Multi-faceted filter sidebar with mobile bottom-sheet support,
 * reactive state emission, and active filter pill tags with one-click removal.
 */

import { BANKS } from '../data/banks.js';
import { NETWORKS } from '../data/networks.js';

export class Filters {
  constructor(containerId, onFilterChange) {
    this.container = document.getElementById(containerId);
    this.onFilterChange = onFilterChange;

    this.state = {
      issuers: [],
      cardTypes: [],
      networks: [],
      categories: [],
      upiOnly: false,
      securedOnly: false,
      lifetimeFreeOnly: false,
      hasLounge: false,
      lowForexOnly: false,
      maxAnnualFee: 15000,
      sortBy: 'recommended',
      searchTerm: ''
    };

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();

    window.addEventListener('cardsphere:reset_filters', () => {
      this.resetFilters();
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="filters-sidebar-inner">
        
        <!-- Mobile Drawer Header -->
        <div class="mobile-filter-header">
          <span class="mobile-filter-title">Filter Payment Cards</span>
          <button class="mobile-close-filter" id="btn-close-mobile-filter" aria-label="Close filters">&times;</button>
        </div>

        <!-- Filter Header & Reset -->
        <div class="filter-header-row">
          <h3 class="filter-heading">Filters</h3>
          <button class="filter-reset-link" id="btn-clear-all-filters">Clear All</button>
        </div>

        <!-- 1. Quick Toggles Group -->
        <div class="filter-group">
          <label class="filter-group-title">Quick Highlights</label>
          <div class="toggle-checkbox-list">
            <label class="custom-checkbox">
              <input type="checkbox" id="chk-upi-only" ${this.state.upiOnly ? 'checked' : ''}>
              <span class="checkbox-box"></span>
              <span class="checkbox-label">⚡ RuPay UPI Supported</span>
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" id="chk-free-only" ${this.state.lifetimeFreeOnly ? 'checked' : ''}>
              <span class="checkbox-box"></span>
              <span class="checkbox-label">🎁 Lifetime Free (₹0 Fee)</span>
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" id="chk-lounge-only" ${this.state.hasLounge ? 'checked' : ''}>
              <span class="checkbox-box"></span>
              <span class="checkbox-label">✈ Airport Lounge Access</span>
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" id="chk-forex-only" ${this.state.lowForexOnly ? 'checked' : ''}>
              <span class="checkbox-box"></span>
              <span class="checkbox-label">🌍 Zero / Low Forex (≤2%)</span>
            </label>
            <label class="custom-checkbox">
              <input type="checkbox" id="chk-secured-only" ${this.state.securedOnly ? 'checked' : ''}>
              <span class="checkbox-box"></span>
              <span class="checkbox-label">🔒 FD-Backed (Secured)</span>
            </label>
          </div>
        </div>

        <!-- 2. Annual Fee Range Slider -->
        <div class="filter-group">
          <div class="slider-header">
            <label class="filter-group-title" for="slider-annual-fee">Max Annual Fee</label>
            <span class="slider-val-display" id="disp-fee-val">₹${this.state.maxAnnualFee.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" id="slider-annual-fee" min="0" max="15000" step="500" value="${this.state.maxAnnualFee}" class="custom-range-slider">
          <div class="slider-scale">
            <span>₹0 (Free)</span>
            <span>₹5,000</span>
            <span>₹15,000+</span>
          </div>
        </div>

        <!-- 3. Card Category -->
        <div class="filter-group">
          <label class="filter-group-title">Category</label>
          <div class="filter-pill-grid">
            ${['Cashback', 'Travel', 'UPI', 'Dining', 'Super-premium', 'Premium', 'Lifestyle', 'Debit Cards'].map(cat => `
              <button class="filter-chip-btn ${this.state.categories.includes(cat) ? 'active' : ''}" data-cat="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 4. Payment Networks -->
        <div class="filter-group">
          <label class="filter-group-title">Network</label>
          <div class="toggle-checkbox-list">
            ${NETWORKS.map(net => `
              <label class="custom-checkbox">
                <input type="checkbox" class="net-checkbox" value="${net.name}" ${this.state.networks.includes(net.name) ? 'checked' : ''}>
                <span class="checkbox-box"></span>
                <span class="checkbox-label">${net.name} ${net.upiCompatible ? '<span class="tag-upi-mini">UPI</span>' : ''}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- 5. Issuer Bank -->
        <div class="filter-group">
          <label class="filter-group-title">Issuing Bank</label>
          <div class="filter-scroll-list">
            ${BANKS.map(b => `
              <label class="custom-checkbox">
                <input type="checkbox" class="bank-checkbox" value="${b.id}" ${this.state.issuers.includes(b.id) ? 'checked' : ''}>
                <span class="checkbox-box"></span>
                <span class="checkbox-label">${b.name}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Mobile Filter Apply Action -->
        <div class="mobile-filter-footer">
          <button class="btn btn-primary btn-block" id="btn-apply-mobile-filter">Apply Filters</button>
        </div>

      </div>
    `;
  }

  bindEvents() {
    // Quick toggles
    this.container.querySelector('#chk-upi-only')?.addEventListener('change', (e) => {
      this.state.upiOnly = e.target.checked;
      this.emitChange();
    });

    this.container.querySelector('#chk-free-only')?.addEventListener('change', (e) => {
      this.state.lifetimeFreeOnly = e.target.checked;
      this.emitChange();
    });

    this.container.querySelector('#chk-lounge-only')?.addEventListener('change', (e) => {
      this.state.hasLounge = e.target.checked;
      this.emitChange();
    });

    this.container.querySelector('#chk-forex-only')?.addEventListener('change', (e) => {
      this.state.lowForexOnly = e.target.checked;
      this.emitChange();
    });

    this.container.querySelector('#chk-secured-only')?.addEventListener('change', (e) => {
      this.state.securedOnly = e.target.checked;
      this.emitChange();
    });

    // Slider
    const feeSlider = this.container.querySelector('#slider-annual-fee');
    const feeDisplay = this.container.querySelector('#disp-fee-val');
    if (feeSlider && feeDisplay) {
      feeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.state.maxAnnualFee = val;
        feeDisplay.textContent = val >= 15000 ? 'Any Fee' : `₹${val.toLocaleString('en-IN')}`;
      });
      feeSlider.addEventListener('change', () => {
        this.emitChange();
      });
    }

    // Category pills
    this.container.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        const idx = this.state.categories.indexOf(cat);
        if (idx > -1) {
          this.state.categories.splice(idx, 1);
          btn.classList.remove('active');
        } else {
          this.state.categories.push(cat);
          btn.classList.add('active');
        }
        this.emitChange();
      });
    });

    // Network checkboxes
    this.container.querySelectorAll('.net-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(this.container.querySelectorAll('.net-checkbox:checked')).map(el => el.value);
        this.state.networks = checked;
        this.emitChange();
      });
    });

    // Bank checkboxes
    this.container.querySelectorAll('.bank-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(this.container.querySelectorAll('.bank-checkbox:checked')).map(el => el.value);
        this.state.issuers = checked;
        this.emitChange();
      });
    });

    // Clear all filters
    this.container.querySelector('#btn-clear-all-filters')?.addEventListener('click', () => {
      this.resetFilters();
    });

    // Mobile drawer close and apply
    this.container.querySelector('#btn-close-mobile-filter')?.addEventListener('click', () => {
      document.body.classList.remove('filter-drawer-open');
    });

    this.container.querySelector('#btn-apply-mobile-filter')?.addEventListener('click', () => {
      document.body.classList.remove('filter-drawer-open');
      this.emitChange();
    });
  }

  setSortBy(sortBy) {
    this.state.sortBy = sortBy;
    this.emitChange();
  }

  setSearchTerm(term) {
    this.state.searchTerm = term;
    this.emitChange();
  }

  resetFilters() {
    this.state = {
      issuers: [],
      cardTypes: [],
      networks: [],
      categories: [],
      upiOnly: false,
      securedOnly: false,
      lifetimeFreeOnly: false,
      hasLounge: false,
      lowForexOnly: false,
      maxAnnualFee: 15000,
      sortBy: this.state.sortBy,
      searchTerm: ''
    };
    this.render();
    this.bindEvents();
    this.emitChange();
  }

  emitChange() {
    if (typeof this.onFilterChange === 'function') {
      this.onFilterChange({ ...this.state });
    }
  }

  getActiveFilterPills() {
    const pills = [];
    if (this.state.upiOnly) pills.push({ label: '⚡ RuPay UPI', key: 'upiOnly' });
    if (this.state.lifetimeFreeOnly) pills.push({ label: '🎁 Lifetime Free', key: 'lifetimeFreeOnly' });
    if (this.state.hasLounge) pills.push({ label: '✈ Lounge Access', key: 'hasLounge' });
    if (this.state.lowForexOnly) pills.push({ label: '🌍 Low Forex', key: 'lowForexOnly' });
    if (this.state.securedOnly) pills.push({ label: '🔒 Secured (FD)', key: 'securedOnly' });
    if (this.state.maxAnnualFee < 15000) pills.push({ label: `Max Fee: ₹${this.state.maxAnnualFee.toLocaleString('en-IN')}`, key: 'maxAnnualFee' });

    this.state.categories.forEach(c => pills.push({ label: c, key: 'category', val: c }));
    this.state.networks.forEach(n => pills.push({ label: n, key: 'network', val: n }));
    this.state.issuers.forEach(i => {
      const b = BANKS.find(bank => bank.id === i);
      pills.push({ label: b ? b.shortName : i, key: 'issuer', val: i });
    });

    return pills;
  }
}
