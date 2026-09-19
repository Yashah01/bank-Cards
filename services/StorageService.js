/**
 * CardSphere India - Storage Service
 * Manages localStorage persistence for saved cards, comparisons, themes, and display modes.
 */

const STORAGE_KEYS = {
  SAVED_CARDS: 'cardsphere_saved_cards',
  COMPARISON_LIST: 'cardsphere_comparison_list',
  THEME: 'cardsphere_theme',
  DISPLAY_MODE: 'cardsphere_display_mode',
  RECENT_VIEWS: 'cardsphere_recent_views'
};

export class StorageService {
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`StorageService read error for key ${key}:`, e);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`StorageService write error for key ${key}:`, e);
    }
  }

  // --- Saved Cards ---
  static getSavedCardIds() {
    return this.get(STORAGE_KEYS.SAVED_CARDS, []);
  }

  static toggleSaveCard(cardId) {
    const saved = this.getSavedCardIds();
    const index = saved.indexOf(cardId);
    let isSaved = false;

    if (index > -1) {
      saved.splice(index, 1);
      isSaved = false;
    } else {
      saved.push(cardId);
      isSaved = true;
    }

    this.set(STORAGE_KEYS.SAVED_CARDS, saved);
    window.dispatchEvent(new CustomEvent('cardsphere:saved_changed', { detail: { cardId, isSaved, saved } }));
    return isSaved;
  }

  static isCardSaved(cardId) {
    return this.getSavedCardIds().includes(cardId);
  }

  // --- Comparison Tray ---
  static getComparisonIds() {
    return this.get(STORAGE_KEYS.COMPARISON_LIST, []);
  }

  static addToComparison(cardId) {
    const list = this.getComparisonIds();
    if (list.includes(cardId)) {
      return { success: false, reason: 'already_added', list };
    }
    if (list.length >= 4) {
      return { success: false, reason: 'max_reached', list };
    }
    list.push(cardId);
    this.set(STORAGE_KEYS.COMPARISON_LIST, list);
    window.dispatchEvent(new CustomEvent('cardsphere:comparison_changed', { detail: { list, added: cardId } }));
    return { success: true, list };
  }

  static removeFromComparison(cardId) {
    let list = this.getComparisonIds();
    list = list.filter(id => id !== cardId);
    this.set(STORAGE_KEYS.COMPARISON_LIST, list);
    window.dispatchEvent(new CustomEvent('cardsphere:comparison_changed', { detail: { list, removed: cardId } }));
    return list;
  }

  static clearComparison() {
    this.set(STORAGE_KEYS.COMPARISON_LIST, []);
    window.dispatchEvent(new CustomEvent('cardsphere:comparison_changed', { detail: { list: [], cleared: true } }));
  }

  // --- Theme ---
  static getTheme() {
    const saved = this.get(STORAGE_KEYS.THEME, null);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  static setTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
  }

  // --- Display Mode (3D vs Flat) ---
  static getDisplayMode() {
    return this.get(STORAGE_KEYS.DISPLAY_MODE, '3d');
  }

  static setDisplayMode(mode) {
    this.set(STORAGE_KEYS.DISPLAY_MODE, mode);
    window.dispatchEvent(new CustomEvent('cardsphere:display_mode_changed', { detail: { mode } }));
  }

  // --- Recent Views ---
  static addRecentView(cardId) {
    let recents = this.get(STORAGE_KEYS.RECENT_VIEWS, []);
    recents = [cardId, ...recents.filter(id => id !== cardId)].slice(0, 8);
    this.set(STORAGE_KEYS.RECENT_VIEWS, recents);
  }

  static getRecentViews() {
    return this.get(STORAGE_KEYS.RECENT_VIEWS, []);
  }
}
