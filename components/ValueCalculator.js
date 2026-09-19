/**
 * CardSphere India - ValueCalculator Component
 * Interactive real-time Estimated Annual Value calculator with sliders for
 * online shopping, travel, dining, fuel, UPI, and international spends.
 * Features waterfall breakdown chart and net savings indicator.
 */

import { CARDS } from '../data/cards.js';
import { ValueCalculatorService } from '../services/ValueCalculatorService.js';

export class ValueCalculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedCardId = 'hdfc-infinia';

    this.spends = {
      monthlySpend: 45000,
      onlineSpend: 18000,
      travelSpend: 6000,
      diningSpend: 5000,
      fuelSpend: 3000,
      upiSpend: 8000,
      intlSpend: 2000
    };

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.updateCalculation();
  }

  render() {
    this.container.innerHTML = `
      <div class="calculator-container">
        
        <div class="calculator-header">
          <span class="calc-tag">VALUE SIMULATOR</span>
          <h2 class="calc-title">Estimated Annual Value Calculator</h2>
          <p class="calc-subtitle">Simulate real-world financial returns by adjusting your monthly spend allocation across categories.</p>
        </div>

        <!-- Card Selector Header -->
        <div class="calc-card-selector-row">
          <label class="calc-selector-label" for="calc-select-card">Select Card to Evaluate:</label>
          <select id="calc-select-card" class="form-select calc-card-select">
            ${CARDS.map(c => `
              <option value="${c.id}" ${c.id === this.selectedCardId ? 'selected' : ''}>
                ${c.cardName} (${c.issuer}) — ${c.annualFee === 0 ? 'Free' : `₹${c.annualFee}/yr`}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="calc-layout-grid">
          
          <!-- LEFT: Spending Input Sliders -->
          <div class="calc-inputs-col">
            <h3 class="calc-section-title">Your Monthly Spend Pattern</h3>

            <!-- 1. Online Shopping -->
            <div class="calc-slider-group">
              <div class="calc-slider-header">
                <span class="calc-slider-label">🛒 Online Shopping (Amazon, Flipkart, etc.)</span>
                <span class="calc-slider-readout" id="readout-online">₹${this.spends.onlineSpend.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" id="slider-calc-online" min="0" max="100000" step="1000" value="${this.spends.onlineSpend}" class="custom-range-slider">
            </div>

            <!-- 2. Dining & Food Delivery -->
            <div class="calc-slider-group">
              <div class="calc-slider-header">
                <span class="calc-slider-label">🍽️ Dining & Food Delivery (Swiggy, Zomato)</span>
                <span class="calc-slider-readout" id="readout-dining">₹${this.spends.diningSpend.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" id="slider-calc-dining" min="0" max="50000" step="500" value="${this.spends.diningSpend}" class="custom-range-slider">
            </div>

            <!-- 3. Travel & Flights -->
            <div class="calc-slider-group">
              <div class="calc-slider-header">
                <span class="calc-slider-label">✈️ Travel (Flights, Hotels, Trains)</span>
                <span class="calc-slider-readout" id="readout-travel">₹${this.spends.travelSpend.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" id="slider-calc-travel" min="0" max="80000" step="1000" value="${this.spends.travelSpend}" class="custom-range-slider">
            </div>

            <!-- 4. UPI Merchant QR -->
            <div class="calc-slider-group">
              <div class="calc-slider-header">
                <span class="calc-slider-label">⚡ UPI Merchant QR Payments</span>
                <span class="calc-slider-readout" id="readout-upi">₹${this.spends.upiSpend.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" id="slider-calc-upi" min="0" max="50000" step="500" value="${this.spends.upiSpend}" class="custom-range-slider">
            </div>

            <!-- 5. Fuel Spending -->
            <div class="calc-slider-group">
              <div class="calc-slider-header">
                <span class="calc-slider-label">⛽ Monthly Fuel (Petrol/Diesel)</span>
                <span class="calc-slider-readout" id="readout-fuel">₹${this.spends.fuelSpend.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" id="slider-calc-fuel" min="0" max="25000" step="500" value="${this.spends.fuelSpend}" class="custom-range-slider">
            </div>

            <!-- 6. International Forex -->
            <div class="calc-slider-group">
              <div class="calc-slider-header">
                <span class="calc-slider-label">🌍 International / Foreign Currency</span>
                <span class="calc-slider-readout" id="readout-intl">₹${this.spends.intlSpend.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" id="slider-calc-intl" min="0" max="60000" step="1000" value="${this.spends.intlSpend}" class="custom-range-slider">
            </div>

            <div class="total-monthly-banner">
              <span>Total Estimated Monthly Spend:</span>
              <strong id="readout-total-monthly">₹${this.spends.monthlySpend.toLocaleString('en-IN')} / mo</strong>
            </div>

          </div>

          <!-- RIGHT: Real-Time Results & Breakdown -->
          <div class="calc-results-col" id="calc-results-output">
            <!-- Dynamically populated -->
          </div>

        </div>

        <div class="calc-disclaimer-bar">
          <p><strong>Disclaimer:</strong> Figures shown are estimated projections based on typical user redemption behaviors and standard valuations. They do not constitute a financial guarantee or warranty from CardSphere India.</p>
        </div>

      </div>
    `;
  }

  bindEvents() {
    // Select card
    this.container.querySelector('#calc-select-card')?.addEventListener('change', (e) => {
      this.selectedCardId = e.target.value;
      this.updateCalculation();
    });

    // Sliders
    const setupSlider = (sliderId, readoutId, key) => {
      const slider = this.container.querySelector(`#${sliderId}`);
      const readout = this.container.querySelector(`#${readoutId}`);
      if (slider && readout) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.spends[key] = val;
          readout.textContent = `₹${val.toLocaleString('en-IN')}`;
          this.recalculateTotalSpend();
          this.updateCalculation();
        });
      }
    };

    setupSlider('slider-calc-online', 'readout-online', 'onlineSpend');
    setupSlider('slider-calc-dining', 'readout-dining', 'diningSpend');
    setupSlider('slider-calc-travel', 'readout-travel', 'travelSpend');
    setupSlider('slider-calc-upi', 'readout-upi', 'upiSpend');
    setupSlider('slider-calc-fuel', 'readout-fuel', 'fuelSpend');
    setupSlider('slider-calc-intl', 'readout-intl', 'intlSpend');
  }

  recalculateTotalSpend() {
    this.spends.monthlySpend = 
      this.spends.onlineSpend + 
      this.spends.diningSpend + 
      this.spends.travelSpend + 
      this.spends.upiSpend + 
      this.spends.fuelSpend + 
      this.spends.intlSpend + 
      3000; // base offline retail buffer

    const readout = this.container.querySelector('#readout-total-monthly');
    if (readout) {
      readout.textContent = `₹${this.spends.monthlySpend.toLocaleString('en-IN')} / mo`;
    }
  }

  updateCalculation() {
    const card = CARDS.find(c => c.id === this.selectedCardId);
    if (!card) return;

    const val = ValueCalculatorService.calculateCardAnnualValue(card, this.spends);
    const outputEl = this.container.querySelector('#calc-results-output');
    if (!outputEl) return;

    outputEl.innerHTML = `
      <div class="results-card-surface">
        
        <div class="results-net-value-header">
          <span class="net-value-tag">ESTIMATED NET ANNUAL BENEFIT</span>
          <div class="net-value-number ${val.netEstimatedValue >= 0 ? 'positive' : 'negative'}">
            ${val.netEstimatedValue >= 0 ? `+₹${val.netEstimatedValue.toLocaleString('en-IN')}` : `₹${val.netEstimatedValue.toLocaleString('en-IN')}`}
          </div>
          <span class="net-value-sub">Net financial return after deducting annual fee and taxes</span>
        </div>

        <!-- Waterfall Calculation Breakdown Table -->
        <h4 class="breakdown-title">Value Breakdown (Annualized)</h4>
        
        <div class="breakdown-list">
          <div class="breakdown-row gain">
            <span class="row-label">Rewards & Points Earned</span>
            <span class="row-val">+₹${val.grossRewardsValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row gain">
            <span class="row-label">Direct Cashback</span>
            <span class="row-val">+₹${val.cashbackValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row gain">
            <span class="row-label">Airport Lounge Perks (Buffet & Space)</span>
            <span class="row-val">+₹${val.loungeValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row gain">
            <span class="row-label">Welcome Gift / Onboarding Voucher</span>
            <span class="row-val">+₹${val.welcomeBenefitValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row gain">
            <span class="row-label">Spend Milestone Bonuses</span>
            <span class="row-val">+₹${val.milestoneValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row gain">
            <span class="row-label">Fuel Surcharge Waivers Saved</span>
            <span class="row-val">+₹${val.fuelSavingsValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row gain">
            <span class="row-label">Forex Markup Savings vs 3.5%</span>
            <span class="row-val">+₹${val.forexSavingsValue.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-divider"></div>

          <div class="breakdown-row summary-gross">
            <span class="row-label"><strong>Gross Estimated Benefits</strong></span>
            <span class="row-val text-success"><strong>+₹${val.totalGrossBenefit.toLocaleString('en-IN')}</strong></span>
          </div>

          <!-- Deductions -->
          <div class="breakdown-row deduction">
            <span class="row-label">
              Annual Card Fee
              ${val.isFeeWaived ? '<span class="tag-waived">WAIVED ON SPEND</span>' : ''}
            </span>
            <span class="row-val">-₹${val.effectiveAnnualFee.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row deduction">
            <span class="row-label">18% GST on Annual Fee</span>
            <span class="row-val">-₹${val.gstOnFee.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-row deduction">
            <span class="row-label">Redemption Fees / Processing</span>
            <span class="row-val">-₹${val.redemptionCost.toLocaleString('en-IN')}</span>
          </div>

          <div class="breakdown-divider"></div>

          <div class="breakdown-row summary-net">
            <span class="row-label"><strong>NET ANNUAL BENEFIT</strong></span>
            <span class="row-val text-accent"><strong>₹${val.netEstimatedValue.toLocaleString('en-IN')} / year</strong></span>
          </div>
        </div>

        <div class="calc-actions-cta">
          <a href="#card/${card.id}" class="btn btn-primary btn-block">Explore ${card.cardName} →</a>
        </div>

      </div>
    `;
  }
}
