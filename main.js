/**
 * CardSphere India - Main Application Entrypoint
 * Coordinates SPA hash routing, component lifecycles, global event buses,
 * hero 3D card carousel, discovery catalog, and view management.
 */

import { CardDataService } from './services/CardDataService.js';
import { StorageService } from './services/StorageService.js';
import { ThemeManager } from './components/ThemeManager.js';
import { DisplayToggle } from './components/DisplayToggle.js';
import { ComparisonTray } from './components/ComparisonTray.js';
import { CardDetailModal } from './components/CardDetailModal.js';
import { SearchBar } from './components/SearchBar.js';
import { CardGrid } from './components/CardGrid.js';
import { Filters } from './components/Filters.js';
import { Card3D } from './components/Card3D.js';
import { Card2D } from './components/Card2D.js';
import { RecommendationWizard } from './components/RecommendationWizard.js';
import { ValueCalculator } from './components/ValueCalculator.js';
import { OffersSection } from './components/OffersSection.js';
import { LoungeSection } from './components/LoungeSection.js';
import { EducationalSection } from './components/EducationalSection.js';
import { AmbientBackground } from './components/AmbientBackground.js';
import { Toast } from './components/Toast.js';
import { AuthService } from './services/AuthService.js';
import { AuthModal } from './components/AuthModal.js';

class App {
  constructor() {
    this.currentView = 'home';
    this.catalogFilters = null;
    this.hero3DCard = null;
    this.heroCards = [];
    this.heroCardIndex = 0;
    this.wizardInstance = null;
    this.calculatorInstance = null;
    this.offersInstance = null;
    this.loungeInstance = null;
    this.learnInstance = null;

    this.init();
  }

  async init() {
    // 1. Initialize Core Singletons & Services
    ThemeManager.init();
    DisplayToggle.init();
    ComparisonTray.init();
    CardDetailModal.init();
    AuthModal.init();

    // 2. Initialize Ambient Three.js Background
    new AmbientBackground('ambient-canvas');

    // 3. Setup Global Search in Navbar
    const searchInput = document.getElementById('nav-global-search');
    const searchDropdown = document.getElementById('nav-search-dropdown');
    new SearchBar(searchInput, searchDropdown, (cardId) => {
      window.location.hash = `#card/${cardId}`;
    });

    // 4. Bind Global Navbar Buttons
    this.bindNavbarEvents();

    // 5. Setup SPA Hash Routing
    window.addEventListener('hashchange', () => this.handleRoute());

    // 6. Update Saved Cards Counter Badge & Auth State
    this.updateSavedBadge();
    this.updateAuthNav();
    window.addEventListener('cardsphere:saved_changed', () => this.updateSavedBadge());
    window.addEventListener('cardsphere:auth_changed', () => this.updateAuthNav());

    // 7. Load Initial Data & Setup Hero Showcase
    await this.setupHeroShowcase();
    await this.setupCatalog();

    // 8. Initial Route Evaluation
    this.handleRoute();

    // 9. Dismiss Initial Loading Screen with cinematic fade
    this.dismissLoader();
  }

  dismissLoader() {
    const loader = document.getElementById('initial-loader');
    const statusText = document.getElementById('loader-status-text');
    if (statusText) statusText.textContent = 'Loading card ecosystem...';

    setTimeout(() => {
      if (loader) {
        loader.classList.add('loader-hidden');
        setTimeout(() => {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 500);
      }
    }, 450);
  }

  bindNavbarEvents() {
    // Theme Toggle button
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      ThemeManager.toggleTheme();
    });

    // Display Mode Toggle (Flat / 3D)
    document.querySelectorAll('.display-mode-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        DisplayToggle.setMode(mode);
      });
    });

    // Mobile Hamburger Menu
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileClose = document.getElementById('btn-close-mobile-nav');

    mobileMenuBtn?.addEventListener('click', () => {
      mobileDrawer?.classList.add('is-open');
    });

    mobileClose?.addEventListener('click', () => {
      mobileDrawer?.classList.remove('is-open');
    });

    // Close mobile drawer when clicking links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer?.classList.remove('is-open');
      });
    });
  }

  updateSavedBadge() {
    const badge = document.getElementById('saved-counter-badge');
    if (badge) {
      const count = StorageService.getSavedCardIds().length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // --- Hero Section 3D Card Showcase ---
  async setupHeroShowcase() {
    this.heroCards = await CardDataService.getFeaturedCards();
    if (this.heroCards.length === 0) return;

    this.renderHeroCard();

    // Hero carousel buttons
    document.getElementById('btn-hero-card-prev')?.addEventListener('click', () => {
      this.heroCardIndex = (this.heroCardIndex - 1 + this.heroCards.length) % this.heroCards.length;
      this.renderHeroCard();
    });

    document.getElementById('btn-hero-card-next')?.addEventListener('click', () => {
      this.heroCardIndex = (this.heroCardIndex + 1) % this.heroCards.length;
      this.renderHeroCard();
    });

    document.getElementById('btn-hero-card-flip')?.addEventListener('click', () => {
      if (this.hero3DCard) {
        this.hero3DCard.flip();
      }
    });

    // Render Featured Cards Grid in Home View
    const featuredGrid = document.getElementById('featured-cards-grid');
    if (featuredGrid) {
      CardGrid.renderInto(featuredGrid, this.heroCards.slice(0, 3), DisplayToggle.getMode());
    }

    // Quick filter pills on home page
    document.querySelectorAll('.quick-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const filterType = pill.getAttribute('data-filter');
        window.location.hash = '#cards';
        setTimeout(() => {
          if (this.catalogFilters) {
            if (filterType === 'upi') this.catalogFilters.state.upiOnly = true;
            if (filterType === 'cashback') this.catalogFilters.state.categories = ['Cashback'];
            if (filterType === 'free') this.catalogFilters.state.lifetimeFreeOnly = true;
            if (filterType === 'lounge') this.catalogFilters.state.hasLounge = true;
            if (filterType === 'travel') this.catalogFilters.state.lowForexOnly = true;
            if (filterType === 'secured') this.catalogFilters.state.securedOnly = true;
            if (filterType === 'super-premium') this.catalogFilters.state.categories = ['Super-premium'];
            this.catalogFilters.render();
            this.catalogFilters.bindEvents();
            this.catalogFilters.emitChange();
          }
        }, 100);
      });
    });
  }

  renderHeroCard() {
    const card = this.heroCards[this.heroCardIndex];
    if (!card) return;

    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    if (this.hero3DCard) {
      this.hero3DCard.dispose();
      this.hero3DCard = null;
    }

    if (DisplayToggle.getMode() === '3d') {
      this.hero3DCard = new Card3D(container, card, {
        height: 320,
        interactive: true,
        autoRotate: true,
        lightingPreset: 'studio'
      });
    } else {
      container.innerHTML = Card2D.render(card, { size: 'lg', interactive: true });
    }

    const caption = document.getElementById('hero-card-caption');
    if (caption) {
      caption.innerHTML = `<strong>${card.cardName}</strong> by ${card.issuer} • ${card.annualFee === 0 ? 'Lifetime Free' : `₹${card.annualFee}/yr`}`;
    }
  }

  // --- Catalog Discovery View Setup ---
  async setupCatalog() {
    const filterSidebarId = 'catalog-filter-sidebar';
    this.catalogFilters = new Filters(filterSidebarId, async (filterState) => {
      await this.applyCatalogFilters(filterState);
    });

    // Mobile filter trigger button
    document.getElementById('btn-trigger-mobile-filter')?.addEventListener('click', () => {
      document.body.classList.add('filter-drawer-open');
    });

    // Sort select
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        if (this.catalogFilters) {
          this.catalogFilters.setSortBy(e.target.value);
        }
      });
    }

    // Initial load of all cards
    const allCards = await CardDataService.getCards();
    this.renderCatalogResults(allCards);
  }

  async applyCatalogFilters(filterState) {
    const results = await CardDataService.filterCards(filterState, filterState.sortBy);
    this.renderCatalogResults(results);
    this.renderActiveFilterChips();
  }

  renderCatalogResults(cards) {
    const grid = document.getElementById('catalog-card-grid');
    const countEl = document.getElementById('catalog-results-count');

    if (countEl) {
      countEl.innerHTML = `Showing <span>${cards.length}</span> card${cards.length === 1 ? '' : 's'}`;
    }

    if (grid) {
      CardGrid.renderInto(grid, cards, DisplayToggle.getMode());
    }
  }

  renderActiveFilterChips() {
    const container = document.getElementById('active-filter-chips');
    if (!container || !this.catalogFilters) return;

    const pills = this.catalogFilters.getActiveFilterPills();
    if (pills.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      ${pills.map((p, idx) => `
        <span class="active-filter-pill">
          ${p.label}
          <button data-pill-idx="${idx}" aria-label="Remove filter ${p.label}">&times;</button>
        </span>
      `).join('')}
    `;

    container.querySelectorAll('[data-pill-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-pill-idx'), 10);
        const pill = pills[idx];
        if (pill) {
          if (pill.key === 'upiOnly') this.catalogFilters.state.upiOnly = false;
          else if (pill.key === 'lifetimeFreeOnly') this.catalogFilters.state.lifetimeFreeOnly = false;
          else if (pill.key === 'hasLounge') this.catalogFilters.state.hasLounge = false;
          else if (pill.key === 'lowForexOnly') this.catalogFilters.state.lowForexOnly = false;
          else if (pill.key === 'securedOnly') this.catalogFilters.state.securedOnly = false;
          else if (pill.key === 'maxAnnualFee') this.catalogFilters.state.maxAnnualFee = 15000;
          else if (pill.key === 'category') {
            this.catalogFilters.state.categories = this.catalogFilters.state.categories.filter(c => c !== pill.val);
          } else if (pill.key === 'network') {
            this.catalogFilters.state.networks = this.catalogFilters.state.networks.filter(n => n !== pill.val);
          } else if (pill.key === 'issuer') {
            this.catalogFilters.state.issuers = this.catalogFilters.state.issuers.filter(i => i !== pill.val);
          }
          this.catalogFilters.render();
          this.catalogFilters.bindEvents();
          this.catalogFilters.emitChange();
        }
      });
    });
  }

  // --- SPA Hash Router ---
  async handleRoute() {
    const rawHash = window.location.hash.slice(1) || 'home';
    const [path, queryString] = rawHash.split('?');

    // Check for Card Detail route: #card/:id
    if (path.startsWith('card/')) {
      const cardId = path.replace('card/', '');
      const card = await CardDataService.getCardById(cardId);
      if (card) {
        CardDetailModal.open(card);
      } else {
        Toast.error('Card not found in database');
      }
      return;
    }

    // Check for Auth routes: #login / #signup
    if (path === 'login') {
      AuthModal.open('login');
      return;
    }
    if (path === 'signup') {
      AuthModal.open('signup');
      return;
    }

    // Otherwise switch main view
    this.switchView(path);

    // Update active nav links
    document.querySelectorAll('.nav-item-link').forEach(link => {
      const navTarget = link.getAttribute('data-nav');
      if (navTarget === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Handle Query parameters if any (e.g. search from navbar)
    if (queryString && path === 'cards') {
      const params = new URLSearchParams(queryString);
      const q = params.get('q');
      if (q && this.catalogFilters) {
        this.catalogFilters.setSearchTerm(q);
      }
    }
  }

  switchView(viewName) {
    const validViews = ['home', 'cards', 'compare', 'find-my-card', 'calculator', 'offers', 'lounge', 'learn', 'saved'];
    const target = validViews.includes(viewName) ? viewName : 'home';

    validViews.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) {
        if (v === target) {
          el.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          el.classList.add('hidden');
        }
      }
    });

    // Lazy load or refresh target view components
    if (target === 'compare') {
      const compareContainer = document.getElementById('comparison-view-container');
      if (compareContainer) Comparison.render(compareContainer);
    } else if (target === 'find-my-card') {
      if (!this.wizardInstance) {
        this.wizardInstance = new RecommendationWizard('wizard-view-container');
      }
    } else if (target === 'calculator') {
      if (!this.calculatorInstance) {
        this.calculatorInstance = new ValueCalculator('calculator-view-container');
      }
    } else if (target === 'offers') {
      if (!this.offersInstance) {
        this.offersInstance = new OffersSection('offers-view-container');
      }
    } else if (target === 'lounge') {
      if (!this.loungeInstance) {
        this.loungeInstance = new LoungeSection('lounge-view-container');
      }
    } else if (target === 'learn') {
      if (!this.learnInstance) {
        this.learnInstance = new EducationalSection('learn-view-container');
      }
    } else if (target === 'saved') {
      this.renderSavedCardsView();
    }
  }

  async renderSavedCardsView() {
    const grid = document.getElementById('saved-cards-grid');
    if (!grid) return;

    const savedIds = StorageService.getSavedCardIds();
    const cards = await CardDataService.getCardsByIds(savedIds);

    if (cards.length === 0) {
      grid.innerHTML = `
        <div class="empty-results-state" style="grid-column: 1 / -1;">
          <div class="empty-icon" aria-hidden="true">🤍</div>
          <h3>You have not saved any cards yet</h3>
          <p>Click the heart icon on any payment card in the catalog to bookmark it for later review.</p>
          <a href="#cards" class="btn btn-primary" style="margin-top: 1rem;">Explore Cards Now</a>
        </div>
      `;
      return;
    }

    CardGrid.renderInto(grid, cards, DisplayToggle.getMode());

    // Clear all saved cards button
    document.getElementById('btn-clear-saved-cards')?.addEventListener('click', () => {
      StorageService.set('cardsphere_saved_cards', []);
      window.dispatchEvent(new CustomEvent('cardsphere:saved_changed'));
      this.renderSavedCardsView();
      Toast.info('All saved bookmarks cleared');
    });
  }

  // --- User Authentication UI Navigation ---
  updateAuthNav() {
    const desktopContainer = document.getElementById('nav-auth-container');
    const mobileContainer = document.getElementById('mobile-auth-container');
    const user = AuthService.getCurrentUser();

    if (user) {
      // Logged in UI
      const userHtml = `
        <div class="user-profile-menu" id="user-profile-menu">
          <button class="nav-user-pill-btn" id="btn-user-profile" aria-expanded="false" aria-label="User account menu">
            <span class="user-avatar-badge" aria-hidden="true">👤</span>
            <span class="user-name-label">${user.username}</span>
            <span class="user-caret" aria-hidden="true">▾</span>
          </button>
          <div class="user-profile-dropdown" id="user-profile-dropdown">
            <div class="user-dropdown-header">
              <span class="user-dropdown-greeting">Signed in as</span>
              <span class="user-dropdown-username">${user.username}</span>
            </div>
            <div class="user-dropdown-divider"></div>
            <a href="#saved" class="user-dropdown-item">
              <span class="dropdown-item-icon">❤️</span> Saved Cards
            </a>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item btn-signout" id="btn-dropdown-logout">
              <span class="dropdown-item-icon">🚪</span> Sign Out
            </button>
          </div>
        </div>
      `;

      if (desktopContainer) {
        desktopContainer.innerHTML = userHtml;
        const btnProfile = desktopContainer.querySelector('#btn-user-profile');
        const dropdown = desktopContainer.querySelector('#user-profile-dropdown');
        const btnLogout = desktopContainer.querySelector('#btn-dropdown-logout');

        btnProfile?.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = dropdown?.classList.toggle('is-open');
          btnProfile.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        btnLogout?.addEventListener('click', () => {
          AuthService.logout();
          Toast.info('Signed out successfully');
        });

        // Close dropdown on click outside
        document.addEventListener('click', (e) => {
          if (!desktopContainer.contains(e.target)) {
            dropdown?.classList.remove('is-open');
            btnProfile?.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <div class="mobile-user-card">
            <div class="mobile-user-info">
              <span class="mobile-avatar">👤</span>
              <span class="mobile-username">${user.username}</span>
            </div>
            <button class="btn btn-outline btn-sm mobile-signout-btn" id="btn-mobile-logout">
              Sign Out
            </button>
          </div>
        `;
        mobileContainer.querySelector('#btn-mobile-logout')?.addEventListener('click', () => {
          AuthService.logout();
          Toast.info('Signed out successfully');
        });
      }
    } else {
      // Logged out UI
      const btnHtml = `
        <button class="nav-signin-btn" id="btn-nav-signin" title="Sign In or Create Account">
          <span class="signin-icon" aria-hidden="true">👤</span>
          <span>Sign In</span>
        </button>
      `;

      if (desktopContainer) {
        desktopContainer.innerHTML = btnHtml;
        desktopContainer.querySelector('#btn-nav-signin')?.addEventListener('click', () => {
          AuthModal.open('login');
        });
      }

      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <button class="btn btn-primary w-full mobile-drawer-signin-btn" id="btn-mobile-signin">
            Sign In / Register
          </button>
        `;
        mobileContainer.querySelector('#btn-mobile-signin')?.addEventListener('click', () => {
          document.getElementById('mobile-nav-drawer')?.classList.remove('is-open');
          AuthModal.open('login');
        });
      }
    }
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
