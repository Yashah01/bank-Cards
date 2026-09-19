/**
 * CardSphere India - LoungeSection Component
 * Dedicated lounge-benefit directory and Indian airport terminal guide.
 * Highlights quarterly spend criteria shifts and participating network rules.
 */

import { INDIAN_LOUNGES, LOUNGE_RULES_GUIDE } from '../data/lounges.js';
import { CARDS } from '../data/cards.js';

export class LoungeSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    // Filter cards with domestic or international lounge access
    const loungeCards = CARDS.filter(c => c.lounge?.domestic && c.lounge.domestic !== 'None');

    this.container.innerHTML = `
      <div class="lounge-page-wrapper">
        
        <div class="lounge-header-banner">
          <span class="lounge-tag">AIRPORT PRIVILEGES</span>
          <h1 class="lounge-title">India Airport Lounge Access Directory</h1>
          <p class="lounge-subtitle">Understand spend-based access conditions, complimentary guest policies, and discover which payment cards grant entry at top Indian airports.</p>
        </div>

        <!-- Educational Alert on the Spend Shift -->
        <div class="lounge-alert-banner">
          <div class="alert-icon">⚠️</div>
          <div class="alert-body">
            <h4 class="alert-title">${LOUNGE_RULES_GUIDE.quarterlyShift.title}</h4>
            <p>${LOUNGE_RULES_GUIDE.quarterlyShift.description}</p>
            <div class="alert-bank-rules">
              ${LOUNGE_RULES_GUIDE.quarterlyShift.examples.map(ex => `
                <div class="bank-rule-item">
                  <strong>${ex.issuer}:</strong> ${ex.rule}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Major Indian Airport Lounges Grid -->
        <h2 class="lounge-section-heading">Major Indian Airport Lounges</h2>
        <div class="airports-grid">
          ${INDIAN_LOUNGES.map(lounge => `
            <div class="airport-card">
              <div class="airport-top">
                <span class="airport-city">${lounge.city}</span>
                <span class="airport-type-pill">${lounge.type}</span>
              </div>
              <h3 class="lounge-name">${lounge.loungeName}</h3>
              <p class="airport-location">${lounge.airport} • ${lounge.terminal}</p>

              <div class="lounge-amenities-tags">
                ${lounge.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
              </div>

              <div class="lounge-networks-block">
                <span class="block-label">Accepted Programs & Networks:</span>
                <div class="network-badge-list">
                  ${lounge.networks.map(n => `<span class="net-pill">${n}</span>`).join('')}
                </div>
              </div>

              <div class="lounge-notes-box">
                <span>💡 ${lounge.accessNotes}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Top Payment Cards for Airport Lounges -->
        <h2 class="lounge-section-heading" style="margin-top: 3rem;">Payment Cards Ranked by Lounge Access</h2>
        <div class="lounge-cards-table-wrapper">
          <table class="lounge-cards-table">
            <thead>
              <tr>
                <th>Payment Card</th>
                <th>Domestic Allowance</th>
                <th>International Lounge</th>
                <th>Quarterly Spend Condition</th>
                <th>Guest Access</th>
                <th>Annual Fee</th>
              </tr>
            </thead>
            <tbody>
              ${loungeCards.map(c => `
                <tr>
                  <td>
                    <a href="#card/${c.id}" class="card-link-title"><strong>${c.cardName}</strong></a>
                    <div class="card-link-sub">${c.issuer} • ${c.network}</div>
                  </td>
                  <td><span class="text-accent font-bold">${c.lounge.domestic}</span></td>
                  <td>${c.lounge.international || '— None'}</td>
                  <td>
                    <span class="condition-badge ${c.lounge.spendRequirement.includes('None') ? 'cond-free' : 'cond-spend'}">
                      ${c.lounge.spendRequirement}
                    </span>
                  </td>
                  <td>${c.lounge.guestAccess ? '<strong class="text-success">✓ Yes</strong>' : '✕ Standard walk-in fee'}</td>
                  <td>${c.annualFee === 0 ? '<span class="fee-free">Free</span>' : `₹${c.annualFee.toLocaleString('en-IN')}`}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;
  }
}
