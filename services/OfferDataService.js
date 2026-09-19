/**
 * CardSphere India - Offer Data Service
 * Provides access to merchant promotions, discount codes, validity windows, and terms.
 */

import { OFFERS } from '../data/offers.js';

export class OfferDataService {
  static async getOffers(filter = {}) {
    let result = [...OFFERS];

    if (filter.category && filter.category !== 'All') {
      result = result.filter(o => o.category === filter.category);
    }

    if (filter.bankId) {
      result = result.filter(o => o.bankId === filter.bankId);
    }

    if (filter.status) {
      result = result.filter(o => o.status === filter.status);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(o => 
        o.merchant.toLowerCase().includes(q) ||
        o.discount.toLowerCase().includes(q) ||
        o.cardEligibility.toLowerCase().includes(q)
      );
    }

    return Promise.resolve(result);
  }

  static async getCategories() {
    const categories = ['All', ...new Set(OFFERS.map(o => o.category))];
    return Promise.resolve(categories);
  }
}
