/**
 * CardSphere India - Comparison Engine Component
 * Deep side-by-side comparison matrix (2 to 4 cards) with difference highlighting,
 * limitation callouts, swap card selectors, URL sharing, printing, and CSV export.
 */

import { Card2D } from './Card2D.js';
import { CardDataService } from '../services/CardDataService.js';
import { StorageService } from '../services/StorageService.js';
import { Toast } from './Toast.js';

export class Comparison {
  static currentCards = [];
  static highlightDifferences = false;

  /**
   * Initializes and renders the /compare view into target container
   * @param {HTMLElement} container
   */
  static async render(container) {
    const ids = StorageService.getComparisonIds();
    
    // Default to top 3 popular cards if none selected
    let targetIds = ids;
    if (targetIds.length < 2) {
      targetIds = ['hdfc-infinia', 'icici-amazon-pay', 'axis-atlas'];
      targetIds.forEach(id => {
        if (!ids.includes(id) && ids.length < 4) {
          StorageService.addToComparison(id);
        }
      });
    }

    this.currentCards = await CardDataService.getCardsByIds(targetIds);
    const allCards = await CardDataService.getCards();

    this.renderComparisonTable(container, allCards);
  }

  static renderComparisonTable(container, allCards) {
    const cards = this.currentCards;
    const canAddMore = cards.length < 4;

    const sections = [
      {
        title: 'Core Pricing & Fees',
        rows: [
          { label: 'Annual Fee', getVal: c => c.annualFee === 0 ? '<strong class="fee-free">₹0 (Lifetime Free)</strong>' : `₹${c.annualFee.toLocaleString('en-IN')}` },
          { label: 'Joining Fee', getVal: c => c.joiningFee === 0 ? '₹0 (Zero Fee)' : `₹${c.joiningFee.toLocaleString('en-IN')}` },
          { label: 'Annual Fee Waiver', getVal: c => c.feeWaiverThreshold > 0 ? `Spend ₹${(c.feeWaiverThreshold / 100000).toFixed(1)} Lakhs / year` : (c.annualFee === 0 ? 'No spend required (Lifetime Free)' : 'No waiver condition') },
          { label: 'Interest Rate (APR)', getVal: c => c.fees?.apr || 'N/A' },
          { label: 'Foreign Currency Markup', getVal: c => c.travel?.forexMarkup === '0.0%' ? '<strong class="text-accent">0.0% (Zero Forex)</strong>' : (c.travel?.forexMarkup || '3.5% + GST') },
          { label: 'Reward Redemption Fee', getVal: c => c.fees?.rewardRedemption || 'Free' }
        ]
      },
      {
        title: 'Rewards & Cashback',
        rows: [
          { label: 'Base Reward Rate', getVal: c => `<strong>${c.rewards?.baseRate || '1.0%'}</strong>` },
          { label: 'Direct Cashback', getVal: c => c.cashback?.baseRate ? `<strong>${c.cashback.baseRate}</strong> (${c.cashback.categories || 'Statement credit'})` : '— Not primarily a cashback card' },
          { label: 'Point Valuation in INR', getVal: c => c.rewards?.pointValueInr ? `1 Point = ₹${c.rewards.pointValueInr.toFixed(2)}` : 'N/A' },
          { label: 'Redemption Options', getVal: c => c.rewards?.redemptionOptions || 'Catalogue products' },
          { label: 'Welcome Benefits', getVal: c => c.welcomeBenefits?.length ? `✓ ${c.welcomeBenefits.join('<br>✓ ')}` : '— None' },
          { label: 'Milestone Rewards', getVal: c => c.rewards?.milestoneRewards?.length ? c.rewards.milestoneRewards.map(m => `Spend ₹${(m.spend/100000).toFixed(1)}L → ${m.reward}`).join('<br>') : '— No annual milestones' }
        ]
      },
      {
        title: 'Travel & Airport Lounges',
        rows: [
          { label: 'Domestic Airport Lounge', getVal: c => c.lounge?.domestic && c.lounge.domestic !== 'None' ? `<strong>✓ ${c.lounge.domestic}</strong>` : '— No domestic access' },
          { label: 'International Lounge', getVal: c => c.lounge?.international && c.lounge.international !== 'None' ? `<strong>✓ ${c.lounge.international}</strong>` : '— No international access' },
          { label: 'Lounge Spend Condition', getVal: c => c.lounge?.spendRequirement ? `<span class="lounge-cond">${c.lounge.spendRequirement}</span>` : 'Unconditional' },
          { label: 'Guest Access Included', getVal: c => c.lounge?.guestAccess ? '<strong class="text-success">✓ Complimentary Guest Access</strong>' : '— Extra charges for guests' },
          { label: 'Airline / Hotel Partners', getVal: c => c.travel?.travelPartners || 'None' }
        ]
      },
      {
        title: 'Digital & Payment Capabilities',
        rows: [
          { label: 'RuPay UPI Compatible', getVal: c => c.upiSupported ? '<span class="badge-upi-large">✓ YES (Link with BHIM, GPay, PhonePe, Paytm)</span>' : '— NO (Visa/Mastercard/Amex cannot link to UPI)' },
          { label: 'Virtual Card Available', getVal: c => c.virtualAvailable ? '✓ Instant virtual card in mobile app' : 'Physical card only' },
          { label: 'Contactless Tap to Pay', getVal: c => c.contactless ? '✓ Supported up to ₹5,000 without PIN' : '— Not supported' },
          { label: 'Network & Tier', getVal: c => `<strong>${c.network}</strong> (${c.networkTier || 'Standard'})` }
        ]
      },
      {
        title: 'Shopping, Dining & Fuel',
        rows: [
          { label: 'Amazon Benefit', getVal: c => c.shopping?.amazon || 'Standard reward rate' },
          { label: 'Flipkart Benefit', getVal: c => c.shopping?.flipkart || 'Standard reward rate' },
          { label: 'Dining Program & Discounts', getVal: c => c.dining?.discount || 'Standard discounts' },
          { label: 'Fuel Surcharge Waiver', getVal: c => c.fuel?.surchargeWaiver || '1% waiver' }
        ]
      },
      {
        title: 'Eligibility & Requirements',
        rows: [
          { label: 'Minimum Monthly Income', getVal: c => c.secured ? '<strong class="text-accent">₹0 (Backed by Fixed Deposit)</strong>' : (c.incomeRequirement > 0 ? `₹${c.incomeRequirement.toLocaleString('en-IN')} / month` : 'Flexible / Relationship based') },
          { label: 'Secured FD Requirement', getVal: c => c.secured ? `✓ Minimum ₹${c.fdRequirement.toLocaleString('en-IN')} Fixed Deposit` : '— Unsecured Card' },
          { label: 'Minimum Age', getVal: c => `${c.ageRequirement || 21} years` },
          { label: 'Employment Suitability', getVal: c => c.eligibility?.employment || 'Salaried or Self-Employed' }
        ]
      },
      {
        title: 'Important Limitations & Exclusions',
        rows: [
          { label: 'Excluded Categories', getVal: c => c.exclusions?.length ? `<span class="limitations-text">${c.exclusions.join(' ')}</span>` : 'Standard merchant restrictions' },
          { label: 'Monthly / Category Caps', getVal: c => c.cashback?.monthlyCap || 'Fair usage limits apply' }
        ]
      }
    ];

    container.innerHTML = `
      <div class="comparison-page-wrapper">
        
        <!-- Header Controls -->
        <div class="compare-header-bar">
          <div>
            <h1 class="compare-page-title">Side-by-Side Card Comparison</h1>
            <p class="compare-page-desc">Compare detailed fees, rewards, lounge conditions, and hidden limitations.</p>
          </div>
          <div class="compare-actions-group">
            <button class="btn btn-outline btn-sm" id="btn-highlight-diff" aria-pressed="${this.highlightDifferences}">
              ${this.highlightDifferences ? '✓ Differences Highlighted' : 'Highlight Differences'}
            </button>
            <button class="btn btn-outline btn-sm" id="btn-share-compare" title="Copy shareable comparison link">
              🔗 Share Link
            </button>
            <button class="btn btn-outline btn-sm" id="btn-print-compare" title="Print comparison">
              🖨️ Print
            </button>
            <button class="btn btn-outline btn-sm" id="btn-export-csv" title="Export to CSV">
              📥 Export CSV
            </button>
          </div>
        </div>

        <!-- Sticky Comparison Matrix Table -->
        <div class="comparison-table-scroll-container">
          <table class="comparison-table" id="matrix-table">
            <thead>
              <tr class="header-card-row">
                <th class="feature-col-header">
                  <div class="header-summary-cell">
                    <span class="compare-count">${cards.length} Cards Selected</span>
                    ${canAddMore ? `
                      <div class="add-card-dropdown-wrapper">
                        <select id="select-add-card" class="form-select add-card-select">
                          <option value="">+ Add Another Card</option>
                          ${allCards.filter(ac => !cards.some(c => c.id === ac.id)).map(ac => `
                            <option value="${ac.id}">${ac.cardName} (${ac.issuer})</option>
                          `).join('')}
                        </select>
                      </div>
                    ` : '<span class="max-badge">Maximum 4 cards</span>'}
                  </div>
                </th>
                ${cards.map((card, idx) => `
                  <th class="card-col-header" data-card-col="${idx}">
                    <div class="compare-card-top">
                      <button class="remove-col-btn" data-remove-id="${card.id}" title="Remove from comparison" aria-label="Remove ${card.cardName}">&times;</button>
                      
                      <div class="compare-card-visual">
                        ${Card2D.render(card, { size: 'sm', interactive: false })}
                      </div>

                      <span class="compare-card-issuer">${card.issuer}</span>
                      <h4 class="compare-card-title">
                        <a href="#card/${card.id}">${card.cardName}</a>
                      </h4>
                      <div class="compare-card-badge">${card.category}</div>

                      <!-- Swap selector -->
                      <div class="swap-selector-wrapper">
                        <select class="swap-card-select" data-swap-from="${card.id}" aria-label="Swap ${card.cardName}">
                          <option value="">⇄ Swap Card</option>
                          ${allCards.filter(ac => !cards.some(c => c.id === ac.id)).map(ac => `
                            <option value="${ac.id}">${ac.cardName}</option>
                          `).join('')}
                        </select>
                      </div>
                    </div>
                  </th>
                `).join('')}
              </tr>
            </thead>

            <tbody>
              ${sections.map(sec => `
                <tr class="section-divider-row">
                  <td colspan="${cards.length + 1}">
                    <h3 class="comparison-section-header">${sec.title}</h3>
                  </td>
                </tr>
                ${sec.rows.map(row => {
                  const values = cards.map(c => row.getVal(c));
                  // Check if values across cards differ
                  const isDifferent = new Set(values.map(v => v.replace(/<[^>]*>?/gm, '').trim())).size > 1;

                  return `
                    <tr class="comparison-data-row ${isDifferent ? 'row-has-difference' : 'row-identical'}">
                      <td class="feature-label-cell">
                        <span class="row-label-text">${row.label}</span>
                      </td>
                      ${values.map(val => `
                        <td class="feature-value-cell">
                          <div class="cell-content">${val}</div>
                        </td>
                      `).join('')}
                    </tr>
                  `;
                }).join('')}
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Bottom Actions & Disclaimers -->
        <div class="comparison-footer-disclaimer">
          <p><strong>Note on accuracy:</strong> Data is compiled from official issuer guidelines and product disclosure documents. Offers, fee waiver thresholds, and lounge access rules are subject to change by issuing banks. Always verify current schedule of charges with issuer prior to application.</p>
        </div>

      </div>
    `;

    this.attachTableEvents(container, allCards);
  }

  static attachTableEvents(container, allCards) {
    // Highlight differences toggle
    const highlightBtn = container.querySelector('#btn-highlight-diff');
    if (highlightBtn) {
      highlightBtn.addEventListener('click', () => {
        this.highlightDifferences = !this.highlightDifferences;
        container.querySelector('#matrix-table').classList.toggle('highlight-diff-active', this.highlightDifferences);
        highlightBtn.classList.toggle('btn-primary', this.highlightDifferences);
        highlightBtn.classList.toggle('btn-outline', !this.highlightDifferences);
        highlightBtn.setAttribute('aria-pressed', this.highlightDifferences ? 'true' : 'false');
      });
    }

    // Add card dropdown
    const addSelect = container.querySelector('#select-add-card');
    if (addSelect) {
      addSelect.addEventListener('change', (e) => {
        const newCardId = e.target.value;
        if (newCardId) {
          StorageService.addToComparison(newCardId);
          this.render(container);
        }
      });
    }

    // Remove column
    container.querySelectorAll('.remove-col-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-id');
        StorageService.removeFromComparison(id);
        this.render(container);
      });
    });

    // Swap card selector
    container.querySelectorAll('.swap-card-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const oldId = sel.getAttribute('data-swap-from');
        const newId = e.target.value;
        if (newId) {
          StorageService.removeFromComparison(oldId);
          StorageService.addToComparison(newId);
          this.render(container);
        }
      });
    });

    // Share link button
    const shareBtn = container.querySelector('#btn-share-compare');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const ids = this.currentCards.map(c => c.id).join(',');
        const shareUrl = `${window.location.origin}${window.location.pathname}#compare?cards=${ids}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            Toast.success('Comparison link copied to clipboard!');
          });
        } else {
          prompt('Copy this comparison link:', shareUrl);
        }
      });
    }

    // Print button
    const printBtn = container.querySelector('#btn-print-compare');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Export CSV button
    const exportBtn = container.querySelector('#btn-export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportCsv();
      });
    }
  }

  static exportCsv() {
    const cards = this.currentCards;
    if (!cards || cards.length === 0) return;

    let csv = `Feature,${cards.map(c => `"${c.cardName} (${c.issuer})"`).join(',')}\n`;
    csv += `Annual Fee,${cards.map(c => `"${c.annualFee}"`).join(',')}\n`;
    csv += `Joining Fee,${cards.map(c => `"${c.joiningFee}"`).join(',')}\n`;
    csv += `Network,${cards.map(c => `"${c.network}"`).join(',')}\n`;
    csv += `Reward Rate,${cards.map(c => `"${c.rewards?.baseRate || ''}"`).join(',')}\n`;
    csv += `Domestic Lounge,${cards.map(c => `"${c.lounge?.domestic || ''}"`).join(',')}\n`;
    csv += `Forex Markup,${cards.map(c => `"${c.travel?.forexMarkup || ''}"`).join(',')}\n`;
    csv += `UPI Supported,${cards.map(c => `"${c.upiSupported ? 'YES' : 'NO'}"`).join(',')}\n`;
    csv += `Minimum Income,${cards.map(c => `"${c.incomeRequirement}"`).join(',')}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CardSphere_Comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Toast.success('Comparison exported as CSV');
  }
}
