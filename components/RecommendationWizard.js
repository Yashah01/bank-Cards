/**
 * CardSphere India - RecommendationWizard Component
 * Multi-step interactive questionnaire (/find-my-card) with transparent suitability scoring,
 * match factor highlights, and limitation callouts.
 */

import { RecommendationService } from '../services/RecommendationService.js';
import { Card2D } from './Card2D.js';
import { StorageService } from '../services/StorageService.js';
import { Toast } from './Toast.js';
import confetti from 'canvas-confetti';

export class RecommendationWizard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStep = 1;
    this.totalSteps = 4;

    this.profile = {
      occupation: 'salaried',
      monthlyIncome: 75000,
      monthlySpend: 35000,
      rewardsPreference: 'cashback',
      topShopping: ['amazon', 'swiggy'],
      travelFrequency: 'occasional',
      needsLounge: true,
      heavyUpiUser: true,
      fuelSpend: 2500,
      internationalSpend: 0,
      annualFeeTolerance: 'low',
      hasFd: false
    };

    this.results = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    if (this.results) {
      this.renderResults();
      return;
    }

    this.container.innerHTML = `
      <div class="wizard-container">
        
        <!-- Wizard Header -->
        <div class="wizard-header">
          <span class="wizard-tag">PERSONALIZED MATCH ENGINE</span>
          <h1 class="wizard-title">Find the Card That Fits Your Life</h1>
          <p class="wizard-subtitle">Answer 4 quick lifestyle questions. Our transparent algorithm evaluates eligibility, spend patterns, and rewards efficiency without bias.</p>
          
          <!-- Step Progress Bar -->
          <div class="wizard-progress-bar-wrap">
            <div class="wizard-progress-track">
              <div class="wizard-progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%;"></div>
            </div>
            <div class="wizard-steps-indicator">
              <span class="step-num ${this.currentStep >= 1 ? 'active' : ''}">1. Profile</span>
              <span class="step-num ${this.currentStep >= 2 ? 'active' : ''}">2. Spending</span>
              <span class="step-num ${this.currentStep >= 3 ? 'active' : ''}">3. Merchants</span>
              <span class="step-num ${this.currentStep >= 4 ? 'active' : ''}">4. Preferences</span>
            </div>
          </div>
        </div>

        <!-- Step Body -->
        <div class="wizard-body-card">
          ${this.renderStepContent()}
        </div>

        <!-- Wizard Navigation Buttons -->
        <div class="wizard-footer-nav">
          ${this.currentStep > 1 ? `
            <button class="btn btn-outline" id="btn-wiz-prev">← Previous</button>
          ` : '<div></div>'}

          ${this.currentStep < this.totalSteps ? `
            <button class="btn btn-primary" id="btn-wiz-next">Continue →</button>
          ` : `
            <button class="btn btn-primary btn-glow" id="btn-wiz-submit">Find My Best Match ⚡</button>
          `}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  renderStepContent() {
    switch (this.currentStep) {
      case 1:
        return `
          <div class="step-pane">
            <h3 class="step-title">Step 1: Employment & Income Profile</h3>
            <p class="step-desc">Used strictly to evaluate issuer eligibility criteria and fee waiver feasibility.</p>

            <div class="form-group-block">
              <label class="form-label">Primary Occupation</label>
              <div class="radio-card-grid">
                <label class="radio-card ${this.profile.occupation === 'salaried' ? 'selected' : ''}">
                  <input type="radio" name="occupation" value="salaried" ${this.profile.occupation === 'salaried' ? 'checked' : ''}>
                  <span class="radio-card-title">Salaried Professional</span>
                  <span class="radio-card-sub">Corporate / Government / Tech</span>
                </label>
                <label class="radio-card ${this.profile.occupation === 'business' ? 'selected' : ''}">
                  <input type="radio" name="occupation" value="business" ${this.profile.occupation === 'business' ? 'checked' : ''}>
                  <span class="radio-card-title">Self-Employed / Business</span>
                  <span class="radio-card-sub">Founder / Professional / Trader</span>
                </label>
                <label class="radio-card ${this.profile.occupation === 'student' ? 'selected' : ''}">
                  <input type="radio" name="occupation" value="student" ${this.profile.occupation === 'student' ? 'checked' : ''}>
                  <span class="radio-card-title">Student / New to Credit</span>
                  <span class="radio-card-sub">FD-backed or first card</span>
                </label>
                <label class="radio-card ${this.profile.occupation === 'homemaker' ? 'selected' : ''}">
                  <input type="radio" name="occupation" value="homemaker" ${this.profile.occupation === 'homemaker' ? 'checked' : ''}>
                  <span class="radio-card-title">Homemaker / Freelancer</span>
                  <span class="radio-card-sub">Household spending</span>
                </label>
              </div>
            </div>

            <div class="form-group-block">
              <div class="slider-label-row">
                <label class="form-label" for="wiz-income-slider">Monthly Take-Home Income</label>
                <span class="slider-readout" id="readout-income">₹${this.profile.monthlyIncome.toLocaleString('en-IN')} / mo</span>
              </div>
              <input type="range" id="wiz-income-slider" min="0" max="350000" step="10000" value="${this.profile.monthlyIncome}" class="custom-range-slider">
              <div class="slider-scale">
                <span>₹0 (FD Route)</span>
                <span>₹50,000</span>
                <span>₹1.5 Lakh</span>
                <span>₹3.5 Lakh+</span>
              </div>
            </div>
          </div>
        `;

      case 2:
        return `
          <div class="step-pane">
            <h3 class="step-title">Step 2: Monthly Spending Habits</h3>
            <p class="step-desc">Helps us evaluate reward rate multipliers and automatic annual fee waivers.</p>

            <div class="form-group-block">
              <div class="slider-label-row">
                <label class="form-label" for="wiz-spend-slider">Approx. Total Monthly Credit / UPI Spends</label>
                <span class="slider-readout" id="readout-spend">₹${this.profile.monthlySpend.toLocaleString('en-IN')} / mo</span>
              </div>
              <input type="range" id="wiz-spend-slider" min="5000" max="250000" step="5000" value="${this.profile.monthlySpend}" class="custom-range-slider">
              <div class="slider-scale">
                <span>₹5,000</span>
                <span>₹50,000</span>
                <span>₹1 Lakh</span>
                <span>₹2.5 Lakh+</span>
              </div>
            </div>

            <div class="form-group-block">
              <label class="form-label">How often do you travel by air?</label>
              <div class="radio-card-grid grid-3">
                <label class="radio-card ${this.profile.travelFrequency === 'none' ? 'selected' : ''}">
                  <input type="radio" name="travelFrequency" value="none" ${this.profile.travelFrequency === 'none' ? 'checked' : ''}>
                  <span class="radio-card-title">Rarely / Never</span>
                  <span class="radio-card-sub">Primarily local spends</span>
                </label>
                <label class="radio-card ${this.profile.travelFrequency === 'occasional' ? 'selected' : ''}">
                  <input type="radio" name="travelFrequency" value="occasional" ${this.profile.travelFrequency === 'occasional' ? 'checked' : ''}>
                  <span class="radio-card-title">2 to 5 times / year</span>
                  <span class="radio-card-sub">Vacations & domestic trips</span>
                </label>
                <label class="radio-card ${this.profile.travelFrequency === 'frequent' ? 'selected' : ''}">
                  <input type="radio" name="travelFrequency" value="frequent" ${this.profile.travelFrequency === 'frequent' ? 'checked' : ''}>
                  <span class="radio-card-title">Frequent Flyer (6+)</span>
                  <span class="radio-card-sub">Business & international</span>
                </label>
              </div>
            </div>

            <div class="form-group-block">
              <label class="form-label">Do you pay local merchants via UPI daily?</label>
              <div class="radio-card-grid grid-2">
                <label class="radio-card ${this.profile.heavyUpiUser ? 'selected' : ''}">
                  <input type="radio" name="heavyUpiUser" value="yes" ${this.profile.heavyUpiUser ? 'checked' : ''}>
                  <span class="radio-card-title">⚡ Yes, Heavy UPI User</span>
                  <span class="radio-card-sub">Want RuPay credit card linked to UPI</span>
                </label>
                <label class="radio-card ${!this.profile.heavyUpiUser ? 'selected' : ''}">
                  <input type="radio" name="heavyUpiUser" value="no" ${!this.profile.heavyUpiUser ? 'checked' : ''}>
                  <span class="radio-card-title">💳 No, mostly card swipes</span>
                  <span class="radio-card-sub">Visa / Mastercard / Amex is fine</span>
                </label>
              </div>
            </div>
          </div>
        `;

      case 3:
        return `
          <div class="step-pane">
            <h3 class="step-title">Step 3: Preferred Merchant Ecosystems</h3>
            <p class="step-desc">Select the platforms where you spend the most money to trigger co-branded 5% to 10% cashbacks.</p>

            <div class="merchant-selector-grid">
              ${[
                { id: 'amazon', label: 'Amazon India', sub: '5% with ICICI / Millennia' },
                { id: 'flipkart', label: 'Flipkart & Cleartrip', sub: '5% with Axis Flipkart' },
                { id: 'swiggy', label: 'Swiggy & Instamart', sub: '10% with Swiggy HDFC' },
                { id: 'zomato', label: 'Zomato & Blinkit', sub: 'Accelerated returns' },
                { id: 'tataneu', label: 'Tata Brands (BigBasket/Croma)', sub: 'Up to 10% NeuCoins' },
                { id: 'myntra', label: 'Myntra & Fashion', sub: 'Vouchers & 5% - 7.5% off' }
              ].map(m => `
                <div class="merchant-select-card ${this.profile.topShopping.includes(m.id) ? 'active' : ''}" data-merchant="${m.id}">
                  <span class="merchant-title">${m.label}</span>
                  <span class="merchant-sub">${m.sub}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="step-pane">
            <h3 class="step-title">Step 4: Rewards & Fee Preferences</h3>
            <p class="step-desc">Final details to align with your personal financial philosophy.</p>

            <div class="form-group-block">
              <label class="form-label">How do you prefer to receive rewards?</label>
              <div class="radio-card-grid grid-2">
                <label class="radio-card ${this.profile.rewardsPreference === 'cashback' ? 'selected' : ''}">
                  <input type="radio" name="rewardsPreference" value="cashback" ${this.profile.rewardsPreference === 'cashback' ? 'checked' : ''}>
                  <span class="radio-card-title">💰 Direct Cashback</span>
                  <span class="radio-card-sub">Statement credit automatically</span>
                </label>
                <label class="radio-card ${this.profile.rewardsPreference === 'travel_miles' ? 'selected' : ''}">
                  <input type="radio" name="rewardsPreference" value="travel_miles" ${this.profile.rewardsPreference === 'travel_miles' ? 'checked' : ''}>
                  <span class="radio-card-title">✈ Air Miles & Hotel Stays</span>
                  <span class="radio-card-sub">Marriott, Accor, Singapore Airlines</span>
                </label>
              </div>
            </div>

            <div class="form-group-block">
              <label class="form-label">Willingness to pay an Annual Fee?</label>
              <div class="radio-card-grid grid-3">
                <label class="radio-card ${this.profile.annualFeeTolerance === 'free_only' ? 'selected' : ''}">
                  <input type="radio" name="annualFeeTolerance" value="free_only" ${this.profile.annualFeeTolerance === 'free_only' ? 'checked' : ''}>
                  <span class="radio-card-title">₹0 Only</span>
                  <span class="radio-card-sub">Lifetime Free cards only</span>
                </label>
                <label class="radio-card ${this.profile.annualFeeTolerance === 'low' ? 'selected' : ''}">
                  <input type="radio" name="annualFeeTolerance" value="low" ${this.profile.annualFeeTolerance === 'low' ? 'checked' : ''}>
                  <span class="radio-card-title">Moderate (₹500 - ₹2,500)</span>
                  <span class="radio-card-sub">Fee easily waived on spend</span>
                </label>
                <label class="radio-card ${this.profile.annualFeeTolerance === 'any' ? 'selected' : ''}">
                  <input type="radio" name="annualFeeTolerance" value="any" ${this.profile.annualFeeTolerance === 'any' ? 'checked' : ''}>
                  <span class="radio-card-title">High Tier (₹5,000+)</span>
                  <span class="radio-card-sub">Ready for premium luxury perks</span>
                </label>
              </div>
            </div>

            <div class="form-group-block">
              <label class="custom-checkbox">
                <input type="checkbox" id="chk-needs-lounge" ${this.profile.needsLounge ? 'checked' : ''}>
                <span class="checkbox-box"></span>
                <span class="checkbox-label">✈ Complimentary airport lounge access is a mandatory priority for me</span>
              </label>
            </div>
          </div>
        `;
    }
  }

  bindEvents() {
    // Navigation Prev / Next
    this.container.querySelector('#btn-wiz-prev')?.addEventListener('click', () => {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.render();
      }
    });

    this.container.querySelector('#btn-wiz-next')?.addEventListener('click', () => {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.render();
      }
    });

    this.container.querySelector('#btn-wiz-submit')?.addEventListener('click', () => {
      this.calculateResults();
    });

    // Step 1: Occupation & Income
    this.container.querySelectorAll('input[name="occupation"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.profile.occupation = e.target.value;
      });
    });

    const incomeSlider = this.container.querySelector('#wiz-income-slider');
    const incomeReadout = this.container.querySelector('#readout-income');
    if (incomeSlider && incomeReadout) {
      incomeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.profile.monthlyIncome = val;
        incomeReadout.textContent = `₹${val.toLocaleString('en-IN')} / mo`;
      });
    }

    // Step 2: Spend & Travel
    const spendSlider = this.container.querySelector('#wiz-spend-slider');
    const spendReadout = this.container.querySelector('#readout-spend');
    if (spendSlider && spendReadout) {
      spendSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.profile.monthlySpend = val;
        spendReadout.textContent = `₹${val.toLocaleString('en-IN')} / mo`;
      });
    }

    this.container.querySelectorAll('input[name="travelFrequency"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.profile.travelFrequency = e.target.value;
      });
    });

    this.container.querySelectorAll('input[name="heavyUpiUser"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.profile.heavyUpiUser = e.target.value === 'yes';
      });
    });

    // Step 3: Merchant selector
    this.container.querySelectorAll('.merchant-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const m = card.getAttribute('data-merchant');
        const idx = this.profile.topShopping.indexOf(m);
        if (idx > -1) {
          this.profile.topShopping.splice(idx, 1);
          card.classList.remove('active');
        } else {
          this.profile.topShopping.push(m);
          card.classList.add('active');
        }
      });
    });

    // Step 4: Preferences
    this.container.querySelectorAll('input[name="rewardsPreference"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.profile.rewardsPreference = e.target.value;
      });
    });

    this.container.querySelectorAll('input[name="annualFeeTolerance"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.profile.annualFeeTolerance = e.target.value;
      });
    });

    this.container.querySelector('#chk-needs-lounge')?.addEventListener('change', (e) => {
      this.profile.needsLounge = e.target.checked;
    });
  }

  calculateResults() {
    this.results = RecommendationService.evaluateProfile(this.profile);
    this.renderResults();

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  }

  renderResults() {
    const topMatches = this.results.slice(0, 3);

    this.container.innerHTML = `
      <div class="recommendation-results-wrapper">
        
        <div class="results-header-banner">
          <span class="banner-pill">⚡ TAILORED RECOMMENDATIONS</span>
          <h2 class="results-title">Your Top 3 Matching Cards</h2>
          <p class="results-subtitle">Ranked by transparent 7-factor suitability (spending match, rewards rate, fee efficiency, lounge access, UPI support, and eligibility).</p>
          <button class="btn btn-outline btn-sm" id="btn-retake-quiz">↺ Retake Questionnaire</button>
        </div>

        <div class="recommendations-list">
          ${topMatches.map((rec, rank) => {
            const card = rec.card;
            const isSaved = StorageService.isCardSaved(card.id);
            const inCompare = StorageService.getComparisonIds().includes(card.id);

            return `
              <div class="recommendation-card rank-${rank + 1}">
                
                <!-- Rank and Score Banner -->
                <div class="rec-top-row">
                  <div class="rec-rank-badge">
                    <span class="rank-number">#${rank + 1}</span>
                    <span class="rank-label">${rank === 0 ? 'Top Overall Match' : 'Strong Alternative'}</span>
                  </div>
                  <div class="rec-score-meter" title="Match Score out of 100">
                    <span class="score-number">${rec.matchScore}%</span>
                    <span class="score-label">MATCH SCORE</span>
                  </div>
                </div>

                <!-- Card Main Layout -->
                <div class="rec-card-grid">
                  
                  <div class="rec-card-visual">
                    ${Card2D.render(card, { size: 'sm', interactive: false })}
                    <div class="rec-fee-tag">
                      ${card.annualFee === 0 ? 'Lifetime Free (₹0)' : `Annual Fee: ₹${card.annualFee.toLocaleString('en-IN')}`}
                    </div>
                  </div>

                  <div class="rec-card-details">
                    <span class="rec-card-issuer">${card.issuer}</span>
                    <h3 class="rec-card-title">
                      <a href="#card/${card.id}">${card.cardName}</a>
                    </h3>
                    
                    <div class="rec-summary-headline">
                      "${rec.summaryHeadline}"
                    </div>

                    <!-- Match Factors (Pros) -->
                    <div class="rec-factors-group">
                      <span class="factors-title text-success">✓ Key Match Factors:</span>
                      <ul class="factors-list">
                        ${rec.matchFactors.map(f => `<li>✓ ${f}</li>`).join('')}
                      </ul>
                    </div>

                    <!-- Potential Limitations (Cons) -->
                    ${rec.limitations.length > 0 ? `
                      <div class="rec-limitations-group">
                        <span class="factors-title text-warning">⚠️ Potential Limitations:</span>
                        <ul class="limitations-list">
                          ${rec.limitations.map(l => `<li>⚠️ ${l}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}

                    <!-- Estimated Annual Value Box -->
                    <div class="rec-value-box">
                      <span class="value-title">Estimated Net Annual Benefit:</span>
                      <span class="value-highlight">
                        ${rec.estimatedValue.netEstimatedValue > 0 ? `+₹${rec.estimatedValue.netEstimatedValue.toLocaleString('en-IN')}` : `₹${rec.estimatedValue.netEstimatedValue.toLocaleString('en-IN')}`} / year
                      </span>
                      <span class="value-sub">(Gross perks of ₹${rec.estimatedValue.totalGrossBenefit.toLocaleString('en-IN')} minus annual fees)</span>
                    </div>

                    <!-- Actions -->
                    <div class="rec-actions-bar">
                      <a href="#card/${card.id}" class="btn btn-secondary btn-sm">View Full Details</a>
                      <button class="btn ${inCompare ? 'btn-primary' : 'btn-outline'} btn-sm rec-btn-compare" data-card-id="${card.id}">
                        ${inCompare ? '✓ In Comparison' : '+ Compare'}
                      </button>
                      <button class="btn ${isSaved ? 'btn-danger' : 'btn-outline'} btn-sm rec-btn-save" data-card-id="${card.id}">
                        ${isSaved ? '❤️ Saved' : '🤍 Save'}
                      </button>
                      <a href="${card.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                        Apply on Bank Site ↗
                      </a>
                    </div>

                  </div>

                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    // Retake button
    this.container.querySelector('#btn-retake-quiz')?.addEventListener('click', () => {
      this.results = null;
      this.currentStep = 1;
      this.render();
    });

    // Save and compare buttons on results
    this.container.querySelectorAll('.rec-btn-save').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-card-id');
        const isSaved = StorageService.toggleSaveCard(id);
        btn.classList.toggle('btn-danger', isSaved);
        btn.classList.toggle('btn-outline', !isSaved);
        btn.textContent = isSaved ? '❤️ Saved' : '🤍 Save';
        Toast.success(isSaved ? 'Card added to Favorites' : 'Removed from Favorites');
      });
    });

    this.container.querySelectorAll('.rec-btn-compare').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-card-id');
        const inCompare = StorageService.getComparisonIds().includes(id);
        if (inCompare) {
          StorageService.removeFromComparison(id);
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline');
          btn.textContent = '+ Compare';
          Toast.info('Removed from comparison');
        } else {
          const res = StorageService.addToComparison(id);
          if (res.success) {
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
            btn.textContent = '✓ In Comparison';
            Toast.success('Added to comparison');
          } else {
            Toast.warning('Maximum 4 cards in comparison. Remove one first.');
          }
        }
      });
    });
  }
}
