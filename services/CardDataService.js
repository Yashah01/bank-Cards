/**
 * CardSphere India - Card Data Service
 * Provides an asynchronous abstraction layer over card discovery, multi-faceted filtering,
 * debounced search, and sorting. Ready for backend REST API integration.
 */

import { CARDS } from '../data/cards.js';

export class CardDataService {
  /**
   * Fetches all cards (simulating asynchronous backend API call)
   * @returns {Promise<Array>}
   */
  static async getCards() {
    // In production, this can call: const res = await fetch('/api/v1/cards'); return res.json();
    return Promise.resolve([...CARDS]);
  }

  /**
   * Fetches an individual card by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  static async getCardById(id) {
    const card = CARDS.find(c => c.id === id);
    return Promise.resolve(card ? { ...card } : null);
  }

  /**
   * Fetches multiple cards by array of IDs
   * @param {Array<string>} ids
   * @returns {Promise<Array>}
   */
  static async getCardsByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return Promise.resolve([]);
    const matched = CARDS.filter(c => ids.includes(c.id));
    return Promise.resolve(matched.map(c => ({ ...c })));
  }

  /**
   * Global search with weighted keyword scoring
   * @param {string} query
   * @returns {Promise<Array>}
   */
  static async searchCards(query) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return this.getCards();
    }

    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/);

    const scored = CARDS.map(card => {
      let score = 0;
      const cardName = card.cardName.toLowerCase();
      const issuer = card.issuer.toLowerCase();
      const network = card.network.toLowerCase();
      const category = card.category.toLowerCase();
      const cardType = card.cardType.toLowerCase();
      const rewardsDesc = card.rewards?.description?.toLowerCase() || '';
      const cashbackDesc = card.cashback?.categories?.toLowerCase() || '';
      const shoppingDesc = JSON.stringify(card.shopping || {}).toLowerCase();
      const travelDesc = JSON.stringify(card.travel || {}).toLowerCase();

      tokens.forEach(token => {
        if (cardName.includes(token)) score += 10;
        if (issuer.includes(token)) score += 8;
        if (network.includes(token)) score += 6;
        if (category.includes(token)) score += 6;
        if (cardType.includes(token)) score += 5;

        // Specific high-intent fintech search terms
        if (token === 'upi' && card.upiSupported) score += 12;
        if (token === 'lounge' && card.lounge?.domestic !== 'None') score += 10;
        if ((token === 'forex' || token === 'zero') && card.travel?.forexMarkup === '0.0%') score += 12;
        if ((token === 'free' || token === 'lifetime') && card.annualFee === 0) score += 12;
        if (token === 'secured' && card.secured) score += 12;
        if (token === 'cashback' && (card.category === 'Cashback' || card.cashback?.baseRate)) score += 8;
        if (token === 'metal' && (card.variant?.toLowerCase().includes('metal') || card.colorTheme?.metallic)) score += 8;

        if (rewardsDesc.includes(token)) score += 3;
        if (cashbackDesc.includes(token)) score += 3;
        if (shoppingDesc.includes(token)) score += 4;
        if (travelDesc.includes(token)) score += 4;
      });

      return { card, score };
    });

    const filtered = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => ({ ...item.card }));

    return Promise.resolve(filtered);
  }

  /**
   * Filter and sort cards
   * @param {Object} criteria
   * @param {string} sortBy
   * @returns {Promise<Array>}
   */
  static async filterCards(criteria = {}, sortBy = 'recommended') {
    let result = [...CARDS];

    // Bank / Issuer filter (multi-select)
    if (criteria.issuers && criteria.issuers.length > 0) {
      result = result.filter(c => criteria.issuers.includes(c.bankId));
    }

    // Card Type filter (Credit, Debit, Secured, Prepaid, Virtual)
    if (criteria.cardTypes && criteria.cardTypes.length > 0) {
      result = result.filter(c => criteria.cardTypes.includes(c.cardType));
    }

    // Category filter (Cashback, Travel, Super-premium, Premium, Dining, UPI, Lifestyle, Secured)
    if (criteria.categories && criteria.categories.length > 0) {
      result = result.filter(c => criteria.categories.includes(c.category));
    }

    // Network filter (RuPay, Visa, Mastercard, American Express)
    if (criteria.networks && criteria.networks.length > 0) {
      result = result.filter(c => criteria.networks.includes(c.network));
    }

    // UPI Supported filter
    if (criteria.upiOnly) {
      result = result.filter(c => c.upiSupported === true);
    }

    // Secured / FD-backed filter
    if (criteria.securedOnly) {
      result = result.filter(c => c.secured === true);
    }

    // Annual Fee range
    if (typeof criteria.maxAnnualFee === 'number') {
      result = result.filter(c => c.annualFee <= criteria.maxAnnualFee);
    }

    // Zero Annual Fee only
    if (criteria.lifetimeFreeOnly) {
      result = result.filter(c => c.annualFee === 0);
    }

    // Lounge access required
    if (criteria.hasLounge) {
      result = result.filter(c => c.lounge && c.lounge.domestic && c.lounge.domestic !== 'None');
    }

    // Low / Zero Forex
    if (criteria.lowForexOnly) {
      result = result.filter(c => {
        const rate = parseFloat(c.travel?.forexMarkup || '3.5');
        return rate <= 2.0;
      });
    }

    // Minimum Income requirement ceiling
    if (typeof criteria.maxIncomeRequirement === 'number') {
      result = result.filter(c => c.incomeRequirement <= criteria.maxIncomeRequirement);
    }

    // Text search term inside filters
    if (criteria.searchTerm && criteria.searchTerm.trim().length > 0) {
      const term = criteria.searchTerm.trim().toLowerCase();
      result = result.filter(c => 
        c.cardName.toLowerCase().includes(term) ||
        c.issuer.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term) ||
        (c.shopping && JSON.stringify(c.shopping).toLowerCase().includes(term))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'fee_asc':
          return a.annualFee - b.annualFee;
        case 'fee_desc':
          return b.annualFee - a.annualFee;
        case 'reward_rate':
          return (b.rewards?.pointValueInr || 0) - (a.rewards?.pointValueInr || 0);
        case 'income_asc':
          return a.incomeRequirement - b.incomeRequirement;
        case 'lounge_visits':
          const aLounge = a.lounge?.domestic === 'Unlimited' ? 99 : parseInt(a.lounge?.domestic || 0, 10);
          const bLounge = b.lounge?.domestic === 'Unlimited' ? 99 : parseInt(b.lounge?.domestic || 0, 10);
          return bLounge - aLounge;
        case 'popular':
          // Prioritize high-demand consumer cards
          const popularWeight = {
            'icici-amazon-pay': 10,
            'hdfc-infinia': 9,
            'sbi-cashback': 9,
            'axis-atlas': 8,
            'axis-ace': 8,
            'federal-scapia': 8,
            'hdfc-tataneu-infinity': 8,
            'idfc-first-wow': 7
          };
          return (popularWeight[b.id] || 0) - (popularWeight[a.id] || 0);
        case 'recommended':
        default:
          return 0; // Natural curated order
      }
    });

    return Promise.resolve(result);
  }

  /**
   * Returns top featured cards for Hero / Home page showcase
   * @returns {Promise<Array>}
   */
  static async getFeaturedCards() {
    const featuredIds = [
      'hdfc-infinia',
      'icici-amazon-pay',
      'axis-atlas',
      'sbi-cashback',
      'hdfc-tataneu-infinity',
      'federal-scapia'
    ];
    return this.getCardsByIds(featuredIds);
  }
}
