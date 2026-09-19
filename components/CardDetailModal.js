/**
 * CardSphere India - CardDetailModal Component
 * Immersive detailed card view featuring:
 * - Large interactive 3D card canvas with dynamic textures
 * - 4 lighting presets (Studio, Midnight, Platinum, Cyber)
 * - 180° Flip button & Auto-rotate toggle
 * - [FLAT VIEW] / [3D VIEW] switcher
 * - 8 comprehensive tabs (Overview, Rewards, Cashback, Travel & Lounge, Shopping & Dining, UPI, Eligibility & Fees, Terms & Exclusions)
 * - Verified Date indicator & official issuer application link with disclaimer.
 */

import { Card3D } from './Card3D.js';
import { Card2D } from './Card2D.js';
import { StorageService } from '../services/StorageService.js';
import { Toast } from './Toast.js';

export class CardDetailModal {
  static modalEl = null;
  static activeCard3D = null;
  static currentCard = null;
  static currentMode = '3d';

  static init() {
    this.createDom();
  }

  static createDom() {
    if (document.getElementById('card-detail-modal')) return;

    this.modalEl = document.createElement('div');
    this.modalEl.id = 'card-detail-modal';
    this.modalEl.className = 'modal-backdrop';
    this.modalEl.setAttribute('role', 'dialog');
    this.modalEl.setAttribute('aria-modal', 'true');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.modalEl);

    // Close on backdrop click or ESC key
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  static open(card) {
    this.init();
    this.currentCard = card;
    StorageService.addRecentView(card.id);

    const isSaved = StorageService.isCardSaved(card.id);
    const inCompare = StorageService.getComparisonIds().includes(card.id);
    this.currentMode = StorageService.getDisplayMode();

    this.modalEl.innerHTML = `
      <div class="modal-card-dialog">
        
        <!-- Modal Top Bar -->
        <div class="modal-top-bar">
          <div class="modal-badge-group">
            <span class="modal-issuer-tag">${card.issuer}</span>
            <span class="modal-tier-tag">${card.network} ${card.networkTier || ''}</span>
            <span class="modal-verified-pill" title="Verified against official bank documentation">
              ✓ Verified: ${card.lastUpdated}
            </span>
          </div>
          <button class="modal-close-btn" id="modal-close-x" aria-label="Close modal">&times;</button>
        </div>

        <!-- Main Modal Layout: 2-Column Desktop Grid -->
        <div class="modal-grid-layout">
          
          <!-- LEFT COLUMN: 3D / 2D Showcase & Interactive Controls -->
          <div class="modal-showcase-col">
            
            <!-- View Mode Switcher -->
            <div class="showcase-controls-bar">
              <div class="display-mode-switch" role="group" aria-label="Card Display View">
                <button class="switch-opt ${this.currentMode === '3d' ? 'active' : ''}" id="btn-showcase-3d">3D View</button>
                <button class="switch-opt ${this.currentMode === 'flat' ? 'active' : ''}" id="btn-showcase-flat">Flat View</button>
              </div>

              <!-- Lighting Presets (Visible in 3D mode) -->
              <div class="lighting-presets-selector ${this.currentMode === 'flat' ? 'hidden' : ''}" id="lighting-bar">
                <span class="preset-label">Light:</span>
                <button class="preset-btn active" data-preset="studio" title="Studio Softbox">Studio</button>
                <button class="preset-btn" data-preset="midnight" title="Midnight Cyan">Midnight</button>
                <button class="preset-btn" data-preset="platinum" title="Platinum Chrome">Platinum</button>
                <button class="preset-btn" data-preset="cyber" title="Cyber Teal/Purple">Cyber</button>
              </div>
            </div>

            <!-- Card Visual Stage Container -->
            <div class="showcase-stage" id="showcase-stage">
              <div class="card-3d-mount" id="modal-3d-mount"></div>
              <div class="card-flat-mount ${this.currentMode === '3d' ? 'hidden' : ''}" id="modal-flat-mount">
                ${Card2D.render(card, { size: 'lg', interactive: true })}
              </div>
            </div>

            <!-- 3D Action Controls: Flip & Auto-Rotate -->
            <div class="showcase-bottom-actions">
              <button class="btn btn-outline btn-sm" id="btn-card-flip">
                🔄 Flip Card (Front / Back)
              </button>
              <button class="btn btn-outline btn-sm" id="btn-card-autorotate">
                💫 Auto Rotate
              </button>
            </div>

            <!-- Quick Action Buttons -->
            <div class="modal-cta-group">
              <button class="btn ${inCompare ? 'btn-primary' : 'btn-outline'} flex-1" id="modal-btn-compare">
                ${inCompare ? '✓ In Comparison' : '+ Add to Compare'}
              </button>
              <button class="btn ${isSaved ? 'btn-danger' : 'btn-outline'}" id="modal-btn-save" title="Save to Favorites">
                ${isSaved ? '❤️ Saved' : '🤍 Save Card'}
              </button>
              <a href="${card.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary flex-1" id="modal-btn-apply">
                Apply on Bank Site ↗
              </a>
            </div>

            <div class="modal-compliance-notice">
              <p>Offer availability may change. Verify official terms with ${card.issuer} before applying.</p>
            </div>

          </div>

          <!-- RIGHT COLUMN: Multi-tab Information Engine -->
          <div class="modal-info-col">
            
            <div class="modal-header-info">
              <h2 class="modal-card-title">${card.cardName}</h2>
              <p class="modal-card-subtitle">${card.category} Card by ${card.issuer}</p>
            </div>

            <!-- Navigation Tabs Bar -->
            <div class="modal-tabs-nav" role="tablist">
              <button class="tab-link active" data-tab="tab-overview" role="tab" aria-selected="true">Overview</button>
              <button class="tab-link" data-tab="tab-rewards" role="tab" aria-selected="false">Rewards</button>
              <button class="tab-link" data-tab="tab-cashback" role="tab" aria-selected="false">Cashback</button>
              <button class="tab-link" data-tab="tab-travel" role="tab" aria-selected="false">Travel & Lounge</button>
              <button class="tab-link" data-tab="tab-shopping" role="tab" aria-selected="false">Shopping & Dining</button>
              <button class="tab-link" data-tab="tab-upi" role="tab" aria-selected="false">RuPay UPI</button>
              <button class="tab-link" data-tab="tab-eligibility" role="tab" aria-selected="false">Eligibility & Fees</button>
              <button class="tab-link" data-tab="tab-terms" role="tab" aria-selected="false">Terms & Exclusions</button>
            </div>

            <!-- Tab Content Panels -->
            <div class="modal-tab-panels">
              
              <!-- 1. OVERVIEW TAB -->
              <div class="tab-panel active" id="tab-overview" role="tabpanel">
                <div class="overview-stats-grid">
                  <div class="stat-card">
                    <span class="stat-label">Annual Fee</span>
                    <span class="stat-value ${card.annualFee === 0 ? 'text-free' : ''}">
                      ${card.annualFee === 0 ? '₹0 (Lifetime Free)' : `₹${card.annualFee.toLocaleString('en-IN')}`}
                    </span>
                    <span class="stat-sub">${card.feeWaiverThreshold > 0 ? `Waived on ₹${(card.feeWaiverThreshold/100000).toFixed(1)}L spend` : ''}</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-label">Joining Fee</span>
                    <span class="stat-value">${card.joiningFee === 0 ? '₹0' : `₹${card.joiningFee.toLocaleString('en-IN')}`}</span>
                    <span class="stat-sub">One-time initial fee</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-label">Reward Rate</span>
                    <span class="stat-value text-accent">${card.rewards?.baseRate || '1.0%'}</span>
                    <span class="stat-sub">${card.rewards?.description ? 'Base return' : ''}</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-label">Domestic Lounge</span>
                    <span class="stat-value">${card.lounge?.domestic || 'None'}</span>
                    <span class="stat-sub">${card.lounge?.frequency || ''}</span>
                  </div>
                </div>

                <h4 class="section-subheading">Welcome Benefits</h4>
                <ul class="benefit-list">
                  ${card.welcomeBenefits?.map(wb => `<li>✓ ${wb}</li>`).join('') || '<li>Standard welcome onboarding perks.</li>'}
                </ul>

                <h4 class="section-subheading">Primary Value Proposition</h4>
                <p class="modal-desc-para">${card.rewards?.description || 'Optimal value across routine retail and lifestyle spends.'}</p>
              </div>

              <!-- 2. REWARDS TAB -->
              <div class="tab-panel" id="tab-rewards" role="tabpanel">
                <h4 class="section-subheading">Earning Structure</h4>
                <p class="modal-desc-para">${card.rewards?.description || '1 reward point per ₹100 spent.'}</p>

                <div class="reward-valuation-box">
                  <span class="val-title">Point Value in INR:</span>
                  <span class="val-number">1 Point ≈ ₹${(card.rewards?.pointValueInr || 0.25).toFixed(2)}</span>
                  <p class="val-desc">${card.rewards?.redemptionOptions || 'Redeemable on official bank portal.'}</p>
                </div>

                <h4 class="section-subheading">Milestone Benefits Timeline</h4>
                ${card.rewards?.milestoneRewards?.length ? `
                  <div class="milestone-timeline">
                    ${card.rewards.milestoneRewards.map(m => `
                      <div class="milestone-step">
                        <div class="milestone-spend">₹${(m.spend / 100000).toFixed(1)} Lakhs Spend</div>
                        <div class="milestone-reward">${m.reward}</div>
                      </div>
                    `).join('')}
                  </div>
                ` : '<p class="text-muted">No spend-based milestone vouchers on this variant.</p>'}
              </div>

              <!-- 3. CASHBACK TAB -->
              <div class="tab-panel" id="tab-cashback" role="tabpanel">
                <div class="highlight-callout">
                  <span class="callout-title">Base Cashback: ${card.cashback?.baseRate || '1.0%'}</span>
                  <p>${card.cashback?.categories || 'Cashback credited automatically against monthly statements.'}</p>
                </div>

                <h4 class="section-subheading">Monthly Cappings</h4>
                <p class="modal-desc-para">${card.cashback?.monthlyCap || 'No maximum monthly limit on base cashback earning.'}</p>

                <h4 class="section-subheading">Cashback Exclusions</h4>
                <p class="modal-desc-para">${card.exclusions?.join(' ') || 'Fuel, wallet reloads, rent payments, and cash withdrawals excluded.'}</p>
              </div>

              <!-- 4. TRAVEL & LOUNGE TAB -->
              <div class="tab-panel" id="tab-travel" role="tabpanel">
                <div class="lounge-details-grid">
                  <div class="lounge-card">
                    <span class="lounge-badge-header">Domestic Lounges</span>
                    <span class="lounge-count">${card.lounge?.domestic || 'None'}</span>
                    <p class="lounge-rules">${card.lounge?.spendRequirement || 'Standard access conditions apply.'}</p>
                  </div>
                  <div class="lounge-card">
                    <span class="lounge-badge-header">International Lounges</span>
                    <span class="lounge-count">${card.lounge?.international || 'None'}</span>
                    <p class="lounge-rules">${card.lounge?.program || 'Priority Pass / DreamFolks network'}</p>
                  </div>
                </div>

                <div class="forex-callout-box">
                  <span class="forex-markup-title">Foreign Currency Transaction Markup:</span>
                  <span class="forex-markup-val ${card.travel?.forexMarkup === '0.0%' ? 'text-accent' : ''}">
                    ${card.travel?.forexMarkup || '3.5% + GST'}
                  </span>
                  <span class="forex-note">${card.travel?.forexMarkup === '0.0%' ? '✓ ZERO Forex Markup: Save ~₹3,500 on every ₹1 Lakh spent abroad!' : 'Standard bank conversion fee applies.'}</span>
                </div>

                <h4 class="section-subheading">Airline & Hotel Partnerships</h4>
                <p class="modal-desc-para">${card.travel?.travelPartners || 'Partner flight and hotel bookings through bank concierge or portal.'}</p>
              </div>

              <!-- 5. SHOPPING & DINING TAB -->
              <div class="tab-panel" id="tab-shopping" role="tabpanel">
                <div class="partner-grid">
                  <div class="partner-box">
                    <span class="partner-name">Amazon</span>
                    <span class="partner-perk">${card.shopping?.amazon || 'Standard points'}</span>
                  </div>
                  <div class="partner-box">
                    <span class="partner-name">Flipkart</span>
                    <span class="partner-perk">${card.shopping?.flipkart || 'Standard points'}</span>
                  </div>
                  <div class="partner-box">
                    <span class="partner-name">Myntra / Fashion</span>
                    <span class="partner-perk">${card.shopping?.myntra || 'Standard points'}</span>
                  </div>
                  <div class="partner-box">
                    <span class="partner-name">Food Delivery</span>
                    <span class="partner-perk">${card.dining?.discount || 'Dining Delights'}</span>
                  </div>
                </div>

                <h4 class="section-subheading">Fuel Surcharge Waiver</h4>
                <p class="modal-desc-para">${card.fuel?.surchargeWaiver || '1% surcharge waiver on fuel spends.'} (Max waiver: ${card.fuel?.maxWaiver || '₹250/month'})</p>
              </div>

              <!-- 6. UPI TAB -->
              <div class="tab-panel" id="tab-upi" role="tabpanel">
                ${card.upiSupported ? `
                  <div class="upi-status-box upi-enabled">
                    <span class="upi-icon">⚡</span>
                    <div class="upi-text">
                      <span class="upi-title">RuPay Credit Card on UPI Supported</span>
                      <p>You can link this credit card directly to BHIM, Google Pay, PhonePe, Paytm, and Cred to make seamless merchant QR code payments from your credit line!</p>
                    </div>
                  </div>
                  <h4 class="section-subheading">UPI Merchant Rules</h4>
                  <ul class="benefit-list">
                    <li>✓ Accepted at millions of UPI merchant QR codes across India.</li>
                    <li>✓ Enjoy interest-free credit periods up to 50 days on your daily UPI transactions.</li>
                    <li>✓ Peer-to-peer (P2P) transfers to personal bank accounts are restricted by NPCI guidelines.</li>
                  </ul>
                ` : `
                  <div class="upi-status-box upi-disabled">
                    <span class="upi-icon">ℹ️</span>
                    <div class="upi-text">
                      <span class="upi-title">UPI Credit Linking Not Available</span>
                      <p>This card operates on the ${card.network} network. Under current RBI regulations, only RuPay credit cards can be linked for UPI merchant QR code payments.</p>
                    </div>
                  </div>
                `}
              </div>

              <!-- 7. ELIGIBILITY & FEES TAB -->
              <div class="tab-panel" id="tab-eligibility" role="tabpanel">
                <div class="eligibility-table-wrapper">
                  <table class="eligibility-table">
                    <tr><td>Minimum Monthly Income</td><td><strong>${card.secured ? '₹0 (Backed by FD)' : (card.incomeRequirement > 0 ? `₹${card.incomeRequirement.toLocaleString('en-IN')}/mo` : 'Flexible')}</strong></td></tr>
                    <tr><td>Age Requirement</td><td>${card.ageRequirement || 21} - 65 Years</td></tr>
                    <tr><td>Employment Type</td><td>${card.eligibility?.employment || 'Salaried or Self-Employed'}</td></tr>
                    <tr><td>CIBIL Score Guideline</td><td>${card.eligibility?.creditHistory || '750+ Recommended'}</td></tr>
                    <tr><td>Annual Percentage Rate (APR)</td><td>${card.fees?.apr || '42.0% p.a.'}</td></tr>
                    <tr><td>Late Payment Charges</td><td>${card.fees?.latePayment || 'Up to ₹1,300'}</td></tr>
                    <tr><td>ATM Cash Advance Fee</td><td>${card.fees?.cashWithdrawal || '2.5% or ₹500'}</td></tr>
                  </table>
                </div>
              </div>

              <!-- 8. TERMS & EXCLUSIONS TAB -->
              <div class="tab-panel" id="tab-terms" role="tabpanel">
                <div class="exclusions-box">
                  <h4 class="section-subheading text-warning">Reward Point Exclusions</h4>
                  <p>In accordance with issuer guidelines, the following transaction categories strictly do NOT earn reward points or cashback:</p>
                  <ul class="exclusion-list">
                    ${card.exclusions?.map(e => `<li>✕ ${e}</li>`).join('') || `
                      <li>✕ Fuel purchases and surcharge levies</li>
                      <li>✕ Wallet top-ups (Paytm, Mobikwik, Amazon Pay wallet reloads)</li>
                      <li>✕ Rental payments via third-party portals</li>
                      <li>✕ Government fees and tax utilities</li>
                    `}
                  </ul>
                </div>

                <div class="terms-disclaimer-box">
                  <span class="disclaimer-title">Transparency Notice:</span>
                  <p>CardSphere India is an independent informational discovery platform. We do not issue cards or guarantee approvals. Final interest rates, limits, and approval criteria are determined solely by ${card.issuer}.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    `;

    this.modalEl.classList.add('is-open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Mount 3D Card
    this.mount3DCard(card);

    // Bind all modal events
    this.attachModalEvents(card);
  }

  static mount3DCard(card) {
    const mountEl = this.modalEl.querySelector('#modal-3d-mount');
    if (!mountEl) return;

    if (this.activeCard3D) {
      this.activeCard3D.dispose();
      this.activeCard3D = null;
    }

    if (this.currentMode === '3d') {
      this.activeCard3D = new Card3D(mountEl, card, {
        height: 280,
        interactive: true,
        autoRotate: false,
        lightingPreset: 'studio'
      });
    }
  }

  static attachModalEvents(card) {
    // Close button
    const closeBtn = this.modalEl.querySelector('#modal-close-x');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Display mode switch (3D vs Flat)
    const btn3d = this.modalEl.querySelector('#btn-showcase-3d');
    const btnFlat = this.modalEl.querySelector('#btn-showcase-flat');
    const mount3D = this.modalEl.querySelector('#modal-3d-mount');
    const mountFlat = this.modalEl.querySelector('#modal-flat-mount');
    const lightingBar = this.modalEl.querySelector('#lighting-bar');

    btn3d.addEventListener('click', () => {
      this.currentMode = '3d';
      btn3d.classList.add('active');
      btnFlat.classList.remove('active');
      mount3D.classList.remove('hidden');
      mountFlat.classList.add('hidden');
      lightingBar.classList.remove('hidden');
      if (!this.activeCard3D) {
        this.mount3DCard(card);
      }
    });

    btnFlat.addEventListener('click', () => {
      this.currentMode = 'flat';
      btnFlat.classList.add('active');
      btn3d.classList.remove('active');
      mount3D.classList.add('hidden');
      mountFlat.classList.remove('hidden');
      lightingBar.classList.add('hidden');
    });

    // Lighting Presets
    this.modalEl.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modalEl.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.getAttribute('data-preset');
        if (this.activeCard3D) {
          this.activeCard3D.setLightingPreset(preset);
        }
      });
    });

    // Flip Card button
    const flipBtn = this.modalEl.querySelector('#btn-card-flip');
    if (flipBtn) {
      flipBtn.addEventListener('click', () => {
        if (this.currentMode === '3d' && this.activeCard3D) {
          this.activeCard3D.flip();
        } else {
          // Toggle flip in Flat view
          const flatCard = this.modalEl.querySelector('.card-2d-container');
          if (flatCard) flatCard.classList.toggle('is-flipped');
        }
      });
    }

    // Auto-rotate toggle
    let autoRotate = false;
    const autoRotateBtn = this.modalEl.querySelector('#btn-card-autorotate');
    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        autoRotateBtn.classList.toggle('btn-primary', autoRotate);
        autoRotateBtn.classList.toggle('btn-outline', !autoRotate);
        if (this.activeCard3D) {
          this.activeCard3D.setAutoRotate(autoRotate);
        }
      });
    }

    // Modal Tabs Navigation
    this.modalEl.querySelectorAll('.tab-link').forEach(tab => {
      tab.addEventListener('click', () => {
        this.modalEl.querySelectorAll('.tab-link').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.modalEl.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const targetPanel = this.modalEl.querySelector(`#${tab.getAttribute('data-tab')}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // Compare button in modal
    const compareBtn = this.modalEl.querySelector('#modal-btn-compare');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        const inCompare = StorageService.getComparisonIds().includes(card.id);
        if (inCompare) {
          StorageService.removeFromComparison(card.id);
          compareBtn.classList.remove('btn-primary');
          compareBtn.classList.add('btn-outline');
          compareBtn.textContent = '+ Add to Compare';
          Toast.info('Removed from comparison');
        } else {
          const res = StorageService.addToComparison(card.id);
          if (res.success) {
            compareBtn.classList.remove('btn-outline');
            compareBtn.classList.add('btn-primary');
            compareBtn.textContent = '✓ In Comparison';
            Toast.success('Added to comparison');
          } else {
            Toast.warning('Maximum 4 cards in comparison. Remove one first.');
          }
        }
      });
    }

    // Save button in modal
    const saveBtn = this.modalEl.querySelector('#modal-btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const isSaved = StorageService.toggleSaveCard(card.id);
        saveBtn.classList.toggle('btn-danger', isSaved);
        saveBtn.classList.toggle('btn-outline', !isSaved);
        saveBtn.textContent = isSaved ? '❤️ Saved' : '🤍 Save Card';
        Toast.success(isSaved ? 'Card added to Favorites' : 'Card removed from Favorites');
      });
    }
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('is-open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (this.activeCard3D) {
      this.activeCard3D.dispose();
      this.activeCard3D = null;
    }

    // Clear hash if it was a card detail URL
    if (window.location.hash.startsWith('#card/')) {
      window.history.pushState(null, '', window.location.pathname + '#cards');
    }
  }
}
