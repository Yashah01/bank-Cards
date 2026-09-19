/**
 * CardSphere India - SearchBar Component
 * Instant debounced search with keyword suggestions dropdown,
 * keyboard accessibility, and quick navigation to card details.
 */

import { CardDataService } from '../services/CardDataService.js';

export class SearchBar {
  constructor(inputElement, dropdownElement, onSelectCard) {
    this.input = inputElement;
    this.dropdown = dropdownElement;
    this.onSelectCard = onSelectCard;
    this.debounceTimer = null;
    this.selectedIndex = -1;
    this.suggestions = [];

    this.init();
  }

  init() {
    if (!this.input) return;

    this.input.addEventListener('input', (e) => {
      const q = e.target.value;
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performSearch(q);
      }, 200);
    });

    this.input.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    this.input.addEventListener('focus', () => {
      if (this.input.value.trim().length > 0) {
        this.performSearch(this.input.value);
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  async performSearch(query) {
    const q = query.trim();
    if (q.length === 0) {
      this.hideDropdown();
      return;
    }

    const results = await CardDataService.searchCards(q);
    this.suggestions = results.slice(0, 6);
    this.selectedIndex = -1;
    this.renderDropdown(q);
  }

  renderDropdown(query) {
    if (!this.dropdown) return;

    if (this.suggestions.length === 0) {
      this.dropdown.innerHTML = `
        <div class="search-suggestion-empty">
          <span>No matching cards for "${query}"</span>
          <span class="search-hint">Try searching "Amazon", "Cashback", "Lounge", "UPI" or "HDFC"</span>
        </div>
      `;
      this.showDropdown();
      return;
    }

    this.dropdown.innerHTML = `
      <div class="search-suggestions-list" role="listbox">
        <div class="search-dropdown-header">
          <span>Matching Cards (${this.suggestions.length})</span>
        </div>
        ${this.suggestions.map((c, i) => `
          <div class="suggestion-item" role="option" data-idx="${i}" data-card-id="${c.id}">
            <div class="suggestion-meta">
              <span class="suggestion-issuer">${c.issuer}</span>
              <span class="suggestion-title">${c.cardName}</span>
              <span class="suggestion-snippet">${c.category} • ${c.annualFee === 0 ? 'Lifetime Free' : `₹${c.annualFee}/yr`}</span>
            </div>
            <div class="suggestion-tag">
              ${c.upiSupported ? '<span class="tag-upi-mini">UPI</span>' : ''}
              <span class="suggestion-net">${c.network}</span>
            </div>
          </div>
        `).join('')}
        <a href="#cards?q=${encodeURIComponent(query)}" class="search-all-link">
          View all results for "${query}" →
        </a>
      </div>
    `;

    this.dropdown.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-card-id');
        this.selectCard(id);
      });
    });

    this.showDropdown();
  }

  showDropdown() {
    this.dropdown.classList.add('is-open');
    this.dropdown.setAttribute('aria-expanded', 'true');
  }

  hideDropdown() {
    this.dropdown.classList.remove('is-open');
    this.dropdown.setAttribute('aria-expanded', 'false');
    this.selectedIndex = -1;
  }

  handleKeyDown(e) {
    if (!this.dropdown.classList.contains('is-open')) return;

    const items = this.dropdown.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % items.length;
      this.updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
      this.updateSelection(items);
    } else if (e.key === 'Enter') {
      if (this.selectedIndex >= 0 && this.selectedIndex < this.suggestions.length) {
        e.preventDefault();
        this.selectCard(this.suggestions[this.selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      this.hideDropdown();
    }
  }

  updateSelection(items) {
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  selectCard(cardId) {
    this.hideDropdown();
    this.input.value = '';
    if (typeof this.onSelectCard === 'function') {
      this.onSelectCard(cardId);
    } else {
      window.location.hash = `#card/${cardId}`;
    }
  }
}
