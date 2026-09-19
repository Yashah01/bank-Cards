/**
 * CardSphere India - EducationalSection Component (/learn)
 * Interactive, clean fintech guides explaining Indian card mechanisms,
 * RuPay on UPI, lounge access spend rules, credit scores, and fee waivers.
 */

export class EducationalSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTopic = 'rupay-upi';
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }

  render() {
    const topics = [
      { id: 'rupay-upi', title: 'RuPay on UPI Explained', icon: '⚡' },
      { id: 'credit-vs-debit', title: 'Credit vs Debit Cards', icon: '💳' },
      { id: 'secured-cards', title: 'Secured (FD-Backed) Cards', icon: '🔒' },
      { id: 'networks-compared', title: 'RuPay vs Visa vs Mastercard vs Amex', icon: '🌐' },
      { id: 'rewards-vs-cashback', title: 'Decoding Rewards vs Cashback', icon: '🪙' },
      { id: 'lounge-rules-2026', title: 'Airport Lounge Rules in 2026', icon: '✈️' },
      { id: 'forex-markup', title: 'Forex Markup & Zero Forex Cards', icon: '🌍' },
      { id: 'credit-score-cibil', title: 'Mastering Your CIBIL Score', icon: '📈' },
      { id: 'virtual-ncmc', title: 'Virtual Cards & NCMC Transit', icon: '📱' }
    ];

    this.container.innerHTML = `
      <div class="learn-page-wrapper">
        
        <div class="learn-header-banner">
          <span class="learn-tag">FINANCIAL LITERACY HUB</span>
          <h1 class="learn-title">Demystifying India's Card Ecosystem</h1>
          <p class="learn-subtitle">Actionable guides written without financial jargon to help you make informed decisions about fees, rewards, credit building, and smart payments.</p>
        </div>

        <div class="learn-layout-grid">
          
          <!-- LEFT: Topics Navigation List -->
          <nav class="learn-nav-sidebar" aria-label="Educational Guides">
            ${topics.map(t => `
              <button class="learn-topic-btn ${this.activeTopic === t.id ? 'active' : ''}" data-topic="${t.id}">
                <span class="topic-icon">${t.icon}</span>
                <span class="topic-title">${t.title}</span>
              </button>
            `).join('')}
          </nav>

          <!-- RIGHT: Topic Content Display Area -->
          <article class="learn-content-panel" id="learn-article-body">
            ${this.renderTopicContent(this.activeTopic)}
          </article>

        </div>

      </div>
    `;
  }

  bindEvents() {
    this.container.querySelectorAll('.learn-topic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.learn-topic-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTopic = btn.getAttribute('data-topic');
        const articleBody = this.container.querySelector('#learn-article-body');
        if (articleBody) {
          articleBody.innerHTML = this.renderTopicContent(this.activeTopic);
        }
      });
    });
  }

  renderTopicContent(topicId) {
    switch (topicId) {
      case 'rupay-upi':
        return `
          <div class="learn-article">
            <h2>RuPay on UPI: The Payment Revolution</h2>
            <p class="article-lead">In 2022, the Reserve Bank of India (RBI) and NPCI introduced credit card linking on UPI. Until then, credit cards were confined to physical swiping machines or web payment gateways.</p>
            
            <h3>How It Works</h3>
            <p>You can link any RuPay credit card to leading UPI apps like BHIM, Google Pay, PhonePe, Paytm, or Cred. Once linked, when you scan any merchant's QR code (P2M), your credit card appears as a payment source alongside your savings bank account.</p>

            <div class="learn-feature-box">
              <h4>Key Benefits of RuPay UPI:</h4>
              <ul>
                <li><strong>Interest-Free Credit Period:</strong> Enjoy up to 50 days of interest-free credit on chai, groceries, fuel, and local retail stores.</li>
                <li><strong>Earn Rewards on Small Spends:</strong> Spends as small as ₹50 now earn reward points or cashback (e.g. Tata Neu Infinity awards 1.5% NeuCoins on UPI).</li>
                <li><strong>No Bank Account Drain:</strong> Keeps your primary savings account free from hundreds of micro-debit line entries.</li>
              </ul>
            </div>

            <h3>Crucial Limitation: No Peer-to-Peer (P2P) Transfers</h3>
            <p>You cannot send money via RuPay credit cards to personal phone numbers or family/friends (P2P). It is strictly enabled for registered merchant QR codes (P2M).</p>
          </div>
        `;

      case 'credit-vs-debit':
        return `
          <div class="learn-article">
            <h2>Credit Cards vs Debit Cards: Choosing Wisely</h2>
            <p class="article-lead">While both look identical in your wallet, the fundamental financial mechanic is completely opposite.</p>
            
            <div class="comparison-cards-split">
              <div class="split-col">
                <h3>Debit Cards</h3>
                <ul>
                  <li>Directly deducts your own hard-earned money from your savings account.</li>
                  <li>Zero debt risk, but limited fraud protection (stolen funds take weeks to recover).</li>
                  <li>Minimal reward rates (usually 0.25% to 0.5% at best).</li>
                  <li>Does NOT contribute to building your CIBIL score.</li>
                </ul>
              </div>
              <div class="split-col">
                <h3>Credit Cards</h3>
                <ul>
                  <li>Bank pays on your behalf from a pre-approved credit line. You settle 20-50 days later.</li>
                  <li>Superior fraud liability: You can dispute unauthorized transactions before any money leaves your pocket.</li>
                  <li>Substantial reward rates (1.5% to 33%), airport lounge access, and merchant discounts.</li>
                  <li>Builds a pristine credit profile when paid in full every month.</li>
                </ul>
              </div>
            </div>

            <div class="learn-tip-box">
              <strong>Golden Rule:</strong> Treat your credit card like a debit card. Never spend money you do not already have in your savings account, and always pay the <em>Total Amount Due</em> by the due date.
            </div>
          </div>
        `;

      case 'secured-cards':
        return `
          <div class="learn-article">
            <h2>Secured (FD-Backed) Credit Cards</h2>
            <p class="article-lead">If you have zero credit history, are a student, freelancer, homemaker, or have a damaged CIBIL score, regular unsecured cards will often reject your application. Secured cards are the ultimate solution.</p>

            <h3>How Secured Cards Work</h3>
            <p>You deposit a fixed amount (e.g. ₹2,000 to ₹50,000) into a bank Fixed Deposit. The bank issues a credit card with a credit limit equal to 90%–100% of your deposit.</p>

            <div class="learn-feature-box">
              <h4>Why This is a Win-Win:</h4>
              <ul>
                <li><strong>Guaranteed Approval:</strong> 100% approval with zero income documents, salary slips, or ITR required.</li>
                <li><strong>Your FD Continues Earning Interest:</strong> Your deposit earns up to 7.5% p.a. bank interest while acting as card collateral.</li>
                <li><strong>Credit Score Engine:</strong> Timely monthly repayments are reported to CIBIL and Experian, building a 750+ score within 6 to 9 months.</li>
              </ul>
            </div>

            <p>Popular Indian examples include <strong>IDFC FIRST WOW!</strong> (Lifetime free, zero forex) and <strong>OneCard Secured</strong> (BoB/Federal FD).</p>
          </div>
        `;

      case 'networks-compared':
        return `
          <div class="learn-article">
            <h2>RuPay vs Visa vs Mastercard vs American Express</h2>
            <p class="article-lead">Payment networks facilitate the transmission of transaction data between the merchant, acquiring bank, and issuing bank.</p>

            <div class="network-summary-table-wrap">
              <table class="network-summary-table">
                <thead>
                  <tr>
                    <th>Network</th>
                    <th>Origin</th>
                    <th>Domestic Acceptance</th>
                    <th>UPI Support</th>
                    <th>Global Strength</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>RuPay</strong></td>
                    <td>India (NPCI)</td>
                    <td>99.9% (Everywhere)</td>
                    <td><strong class="text-accent">YES (Exclusive)</strong></td>
                    <td>Growing via Discover/Diners/JCB alliances</td>
                  </tr>
                  <tr>
                    <td><strong>Visa</strong></td>
                    <td>United States</td>
                    <td>Universal</td>
                    <td>No</td>
                    <td>Unmatched global acceptance (200+ countries)</td>
                  </tr>
                  <tr>
                    <td><strong>Mastercard</strong></td>
                    <td>United States</td>
                    <td>Universal</td>
                    <td>No</td>
                    <td>Unmatched global acceptance (210+ countries)</td>
                  </tr>
                  <tr>
                    <td><strong>American Express</strong></td>
                    <td>United States</td>
                    <td>High in Tier 1/2 Metros</td>
                    <td>No</td>
                    <td>High-end concierge, premium travel & hotel perks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;

      case 'rewards-vs-cashback':
        return `
          <div class="learn-article">
            <h2>Decoding Reward Points vs Cashback</h2>
            <p class="article-lead">Should you opt for direct cashback or accumulate reward points? It depends on your lifestyle.</p>

            <h3>1. Cashback Cards (Simple & Transparent)</h3>
            <p>Direct monetary credit applied to your monthly bill. Ideal for people who prefer simplicity without managing point catalogues or transfer partner ratios. Examples: <em>SBI Cashback, Amazon Pay ICICI, Axis ACE</em>.</p>

            <h3>2. Reward Point / Air Mile Cards (High Potential Value)</h3>
            <p>Points can be transferred to frequent flyer programs (Singapore Airlines, Accor ALL, Marriott Bonvoy). While they require effort to maximize, the effective return can reach <strong>10% to 30%</strong> for business class travel or 5-star hotel stays. Examples: <em>HDFC Infinia, Axis Atlas, Amex Platinum Travel</em>.</p>
          </div>
        `;

      case 'lounge-rules-2026':
        return `
          <div class="learn-article">
            <h2>Airport Lounge Access Rules in 2026</h2>
            <p class="article-lead">Overcrowding at major Indian airport lounges (Delhi T3 Encalm, Bengaluru 080, Mumbai T2) prompted a massive regulatory and bank policy overhaul.</p>

            <h3>The Spend-Linked Criteria Shift</h3>
            <p>Gone are the days when a ₹500 annual fee card offered unconditional free lounge visits. Today, almost every major bank requires you to spend between <strong>₹35,000 and ₹50,000 in the previous calendar quarter</strong> to unlock lounge passes for the subsequent quarter.</p>

            <div class="learn-tip-box">
              <strong>Tip for Unconditional Access:</strong> Only super-premium cards like <em>HDFC Infinia, SBI AURUM, and AU Zenith+</em> continue to provide unconditional complimentary lounge entry without quarterly spend hurdles.
            </div>
          </div>
        `;

      case 'forex-markup':
        return `
          <div class="learn-article">
            <h2>Forex Markup Fees & Zero Forex Cards</h2>
            <p class="article-lead">When you swipe an Indian payment card abroad or buy from international websites in USD/EUR/GBP, banks charge a foreign transaction fee.</p>

            <p>Standard credit cards charge <strong>3.5% + 18% GST = ~4.13%</strong> in extra fees on every foreign currency transaction! On a ₹2 Lakh international trip, you are handing ₹8,260 directly to the bank in hidden fees.</p>

            <h3>Zero Forex Cards</h3>
            <p>Cards like <strong>Federal Scapia, IDFC WOW!, and AU Zenith+ (0.99%)</strong> eliminate or dramatically reduce this fee, saving travelers thousands of rupees.</p>
          </div>
        `;

      case 'credit-score-cibil':
        return `
          <div class="learn-article">
            <h2>Mastering Your CIBIL Credit Score (300 to 900)</h2>
            <p class="article-lead">A credit score above 750 unlocks the best credit cards, fastest home loan approvals, and lowest interest rates in India.</p>

            <div class="learn-feature-box">
              <h4>The 4 Pillars of a 780+ CIBIL Score:</h4>
              <ol>
                <li><strong>100% On-Time Payments (35% weight):</strong> Never miss a due date. Even a 3-day delay on a ₹500 balance leaves a negative mark for 3 years.</li>
                <li><strong>Credit Utilization Ratio under 30% (30% weight):</strong> If your total limit is ₹1 Lakh, keep your reported statement balance under ₹30,000.</li>
                <li><strong>Credit Age & History (15% weight):</strong> Keep your oldest credit card active (even if rarely used) to maintain a long credit history.</li>
                <li><strong>Avoid Hard Inquiry Spam (10% weight):</strong> Do not apply for 5 credit cards in the same week. Each application triggers a hard inquiry that dips your score.</li>
              </ol>
            </div>
          </div>
        `;

      case 'virtual-ncmc':
        return `
          <div class="learn-article">
            <h2>Virtual Cards & NCMC Transit Cards</h2>
            <p class="article-lead">Modern Indian fintech emphasizes contactless convenience and digital security.</p>

            <h3>Virtual Credit Cards</h3>
            <p>Instantly generated within mobile banking apps with a unique CVV and separate online transaction limits. Perfect for trial subscriptions or unknown websites without exposing your physical card details.</p>

            <h3>NCMC (National Common Mobility Card)</h3>
            <p>An interoperable contactless smart card standard introduced by the Ministry of Housing and Urban Affairs. Allows you to tap and enter Delhi Metro, Mumbai Metro, Bengaluru Namma Metro, and public buses seamlessly from your payment card balance.</p>
          </div>
        `;

      default:
        return '<p>Select an educational guide from the sidebar.</p>';
    }
  }
}
