/**
 * CardSphere India - Card2D Component
 * Renders an ultra-sharp, accessible, responsive CSS/SVG physical card simulation.
 */

export class Card2D {
  /**
   * Renders the 2D Flat Card HTML
   * @param {Object} card
   * @param {Object} options { isFlipped: boolean, interactive: boolean, size: 'sm'|'md'|'lg' }
   * @returns {string} HTML markup
   */
  static render(card, options = {}) {
    const { isFlipped = false, interactive = false, size = 'md' } = options;
    const isRuPayUpi = card.upiSupported;
    const theme = card.colorTheme || {};
    const primaryColor = theme.primary || '#1A1C23';
    const secondaryColor = theme.secondary || '#2E384D';
    const accentColor = theme.accent || '#66FCF1';
    const textColor = theme.textColor || '#FFFFFF';
    const isMetallic = theme.metallic || false;

    const networkBadge = this.getNetworkBadge(card.network, card.networkTier);
    const bankLogo = this.getBankLogo(card.issuer, card.bankId);

    return `
      <div class="card-2d-container size-${size} ${interactive ? 'is-interactive' : ''} ${isFlipped ? 'is-flipped' : ''}" 
           data-card-id="${card.id}" 
           role="img" 
           aria-label="${card.cardName} by ${card.issuer}">
        <div class="card-2d-inner">
          
          <!-- FRONT FACE -->
          <div class="card-2d-face card-2d-front ${isMetallic ? 'metallic-foil' : ''}" 
               style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: ${textColor}; border-color: ${accentColor}33;">
            
            <!-- Metallic / Glass Glare Effect -->
            <div class="card-glare-layer" aria-hidden="true"></div>

            <!-- Top Row: Bank Branding & Contactless Icon -->
            <div class="card-header-row">
              <div class="card-bank-brand">
                ${bankLogo}
              </div>
              <div class="card-top-right">
                ${isRuPayUpi ? '<span class="card-upi-pill">⚡ UPI LINKED</span>' : ''}
                <div class="contactless-icon" title="Contactless Enabled" aria-label="Contactless Enabled">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                    <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                    <path d="M15.5 21.5a12 12 0 0 1 0-19" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Middle Row: EMV Chip & Card Name -->
            <div class="card-chip-row">
              <div class="emv-chip" aria-hidden="true">
                <div class="chip-circuit"></div>
              </div>
              <div class="card-badge-pill" style="border-color: ${accentColor}; color: ${accentColor};">
                ${card.variant || card.category}
              </div>
            </div>

            <!-- Card Number (Simulated / Masked) -->
            <div class="card-number-row" aria-label="Demo Card Number">
              <span class="num-block">••••</span>
              <span class="num-block">••••</span>
              <span class="num-block">••••</span>
              <span class="num-block">4291</span>
            </div>

            <!-- Bottom Row: Cardholder, Expiry, & Network Logo -->
            <div class="card-footer-row">
              <div class="cardholder-info">
                <span class="card-label">CARDHOLDER</span>
                <span class="card-holder-name">RAHUL SHARMA</span>
              </div>
              <div class="card-expiry-info">
                <span class="card-label">VALID THRU</span>
                <span class="card-expiry-val">08/29</span>
              </div>
              <div class="card-network-brand">
                ${networkBadge}
              </div>
            </div>

          </div>

          <!-- BACK FACE -->
          <div class="card-2d-face card-2d-back" 
               style="background: linear-gradient(135deg, #11141a 0%, ${primaryColor} 100%); color: #FFFFFF;">
            
            <div class="card-magstripe" aria-hidden="true"></div>

            <div class="card-back-body">
              <div class="card-signature-panel">
                <div class="signature-strip">
                  <span class="signature-text">Authorized Signature</span>
                </div>
                <div class="cvv-box" title="Simulated CVV">
                  <span class="cvv-label">CVV</span>
                  <span class="cvv-value">842</span>
                </div>
              </div>

              <div class="card-back-disclaimer">
                <p>CardSphere India Demonstration Card. For informational and educational purposes only. Never share CVV or OTP with anyone.</p>
                <div class="issuer-support-info">
                  <span>Helpline: 1800-XXX-XXXX</span>
                  <span>${card.issuer}</span>
                </div>
              </div>

              <div class="card-back-network">
                ${networkBadge}
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  static getNetworkBadge(network, tier = '') {
    const net = (network || '').toLowerCase();
    if (net.includes('rupay')) {
      return `
        <div class="network-logo rupay-logo" title="RuPay ${tier}">
          <span class="rupay-text">RuPay</span>
          <span class="rupay-tier">${tier || 'Select'}</span>
        </div>
      `;
    }
    if (net.includes('visa')) {
      return `
        <div class="network-logo visa-logo" title="Visa ${tier}">
          <span class="visa-wordmark">VISA</span>
          ${tier ? `<span class="network-sub">${tier}</span>` : ''}
        </div>
      `;
    }
    if (net.includes('mastercard')) {
      return `
        <div class="network-logo mastercard-logo" title="Mastercard ${tier}">
          <div class="mc-circles">
            <span class="mc-red"></span>
            <span class="mc-yellow"></span>
          </div>
          ${tier ? `<span class="network-sub">${tier}</span>` : ''}
        </div>
      `;
    }
    if (net.includes('amex') || net.includes('american express')) {
      return `
        <div class="network-logo amex-logo" title="American Express">
          <span class="amex-box">AMEX</span>
        </div>
      `;
    }
    if (net.includes('diners')) {
      return `
        <div class="network-logo diners-logo" title="Diners Club">
          <span class="diners-circle"></span>
          <span class="diners-text">Diners Club</span>
        </div>
      `;
    }
    return `<span class="generic-network">${network}</span>`;
  }

  static getBankLogo(issuer, bankId) {
    const bId = (bankId || '').toLowerCase();
    const shortNames = {
      hdfc: 'HDFC BANK',
      icici: 'ICICI Bank',
      axis: 'AXIS BANK',
      sbi: 'SBI Card',
      kotak: 'Kotak',
      idfc: 'IDFC FIRST',
      federal: 'FEDERAL BANK',
      amex: 'AMERICAN EXPRESS',
      onecard: 'OneCard',
      bob: 'Bank of Baroda',
      pnb: 'PNB',
      au: 'AU SMALL FINANCE',
      hsbc: 'HSBC',
      indusind: 'IndusInd Bank',
      rbl: 'RBL BANK',
      sc: 'STANDARD CHARTERED',
      yes: 'YES BANK'
    };

    const displayName = shortNames[bId] || issuer || 'BANK';
    return `<span class="bank-wordmark bank-${bId}">${displayName}</span>`;
  }
}
