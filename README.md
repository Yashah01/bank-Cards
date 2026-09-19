# CardSphere India 🇮🇳 — Discover. Compare. Choose.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-66FCF1?style=for-the-badge&logo=vercel&logoColor=black)](https://cardsphere-india.vercel.app)
[![Tests](https://img.shields.io/badge/Tests-37_Passed-10B981?style=for-the-badge&logo=node.js&logoColor=white)](test-suite.js)
[![Cards Indexed](https://img.shields.io/badge/Cards_Indexed-135_Active_Cards-38BDF8?style=for-the-badge&logo=credit-card&logoColor=white)](data/cards.js)
[![Issuers](https://img.shields.io/badge/Issuers-15_Banks-F59E0B?style=for-the-badge)](data/banks.js)

**CardSphere India** is an interactive, high-performance financial-technology web platform designed to help users discover, visualize in 3D, compare, and calculate the net real-world value of credit cards across the Indian retail banking ecosystem.

🌐 **Live Production Website**: [https://cardsphere-india.vercel.app](https://cardsphere-india.vercel.app)

---

## 🌟 Key Features

### 1. 🎴 Photorealistic Interactive 3D & Flat Card Showcase
- **Three.js WebGL Engine**: Physically rendered cards featuring metallic gold/silver sheens, holo-foil reflections, embedded microchips, and contactless glyphs.
- **Lighting Presets**: Toggle between Studio, Midnight Cyan, Platinum Chrome, and Cyber Neon lighting environments.
- **Interactive Controls**: 180° front/back card flip, auto-rotation, and smooth 2D flat vs. 3D spatial mode switching.

### 2. 💳 Comprehensive Master Directory (135 Active Retail Cards)
Modular, structured directory covering **135 active retail credit cards** across **15 Indian banking institutions**:
- **HDFC Bank** (18 cards): Infinia Metal, Diners Club Black, Regalia Gold, Millennia, Tata Neu Infinity/Plus, Swiggy, BizBlack, etc.
- **SBI Card** (18 cards): AURUM, Elite, Prime, Cashback SBI, SimplyCLICK, BPCL Octane, Miles Elite, IRCTC Premier, etc.
- **Axis Bank** (17 cards): Reserve, Magnus, Atlas, Select, ACE, Airtel Axis, Flipkart Axis, Kiwi Virtual RuPay, etc.
- **ICICI Bank** (13 cards): Emeralde Private Metal, Sapphiro, Rubyx, Coral, Amazon Pay ICICI, MakeMyTrip, HPCL, etc.
- **Kotak Mahindra Bank** (11 cards): White Reserve, White, Zen, League, Mojo, PVR Kotak, Myntra Kotak, etc.
- **IDFC FIRST Bank** (9 cards): FIRST Wealth, FIRST Select, Millennia, Classic, WOW, FIRST Power+, etc.
- **IndusInd Bank** (9 cards): Pioneer Heritage, Legend, Pinnacle, EazyDiner Signature/Platinum, Tiger, etc.
- **American Express** (6 cards): Platinum Charge, Platinum Travel, Gold Charge, MRCC, SmartEarn, Corporate.
- **Standard Chartered Bank** (5 cards): Ultimate, Smart, Rewards, EaseMyTrip, Super Value Titanium.
- **RBL Bank** (6 cards): Icon, Platinum Maxima, World Safari, Shoprite, Play, Bajaj Finserv Binge.
- **Yes Bank** (6 cards): Private, Marquee, Reserv, First Exclusive, Premia, BYOC.
- **AU Small Finance Bank** (5 cards): Zenith+, Zenith, Vetta, Altura Plus, LIT.
- **Bank of Baroda (BOBCARD)** (5 cards): Eterna, Premier, Select, Easy, Etihad Guest Signature.
- **HSBC India** (2 cards): HSBC Cashback, HSBC Platinum.
- **Federal Bank & Others** (5 cards): Federal Celesta, Federal Imperio, Federal Scapia, OneCard Metal, PNB RuPay Select.

### 3. 🔍 Multi-Faceted Filters & Instant Search
- **RuPay on UPI**: Filter exclusively for UPI-linkable credit cards.
- **Zero Forex Markup**: Isolate 0% foreign transaction markup travel cards.
- **Lifetime Free (LTF)**: Filter strictly ₹0 annual fee cards.
- **Smart Queries**: Natural search across rewards, airport lounges, brands (Amazon, Swiggy, Tata, Vistara), and network tiers (Visa Infinite, Mastercard World, RuPay Select, Diners Club).

### 4. ⚖️ Side-by-Side Comparison Matrix
- Compare up to **4 cards simultaneously** across reward structures, airport lounge rules, milestone spend waivers, forex rates, insurance, and eligibility.
- One-click **Difference Highlighting** to instantly spot variance between cards.
- Persistent comparison dock across all pages and views.

### 5. 🧮 Net Reward Value Calculator
- Input personalized monthly spending across categories (Online, Travel, Dining, Fuel, UPI, International).
- Calculates gross reward points/cashback in Indian Rupees (₹), factors in milestone bonuses and fee waivers, deducts annual fees, and presents **true Net Annual Benefit**.

### 6. 🎯 7-Factor Recommendation Engine
- Tailors card recommendations based on occupation, income tier, monthly spend volume, category preferences, and brand loyalty with transparent score breakdown and pros.

### 7. ✈️ Airport Lounge Directory & Spending Criteria
- Real-time terminal-by-terminal lounge access criteria across Mumbai (BOM), Delhi (DEL), Bengaluru (BLR), Chennai (MAA), Hyderabad (HYD), Kolkata (CCU), and Goa (GOI).
- Clear indicators for complimentary vs. quarterly spend requirements.

### 8. 🏷️ Curated Merchant Partner Offers
- Live cardholder deals across Swiggy, Zomato, Amazon, MakeMyTrip, BookMyShow, and Blinkit with promo codes and minimum order values.

### 9. 👤 User Authentication & Saved Favorites
- Minimalist, secure **Username & Password** authentication system with instant session persistence in `localStorage`.
- Quick-switch tabs for **Log In** and **Sign Up** with password show/hide visibility toggle.
- Bookmark cards to a dedicated **Saved Favorites** tray.

---

## 🛠️ Architecture & Tech Stack

```
bank-Cards/
├── index.html                   # Semantic HTML5 SPA shell & meta SEO
├── main.js                      # Central router, state management & UI coordinator
├── style.css                    # Design system (Cyber-Fintech theme, glassmorphism)
├── vercel.json                  # Vercel deployment configuration & SPA rewrites
├── test-suite.js                # Automated verification suite (37 tests)
├── components/
│   ├── AmbientBackground.js     # Three.js floating particle constellation
│   ├── AuthModal.js             # Username & password authentication modal
│   ├── Card2D.js                # High-fidelity flat card component with network logos
│   ├── Card3D.js                # Three.js 3D mesh, PBR textures, chip & magnetic stripe
│   ├── CardDetailModal.js       # 8-tab immersive card inspection modal
│   ├── CardGrid.js              # Responsive card grid supporting 2D & 3D rendering
│   ├── Comparison.js            # Full matrix comparison table with difference highlighting
│   ├── ComparisonTray.js        # Floating comparison dock tray
│   ├── DisplayToggle.js         # Global [FLAT VIEW] / [3D VIEW] controller
│   ├── EducationalSection.js    # Credit card masterclass guides (UPI, Lounge, Forex)
│   ├── Filters.js               # Multi-category sidebar filter system
│   ├── LoungeSection.js         # Indian airport lounge explorer
│   ├── OffersSection.js         # Curated merchant deals & promo codes
│   ├── RecommendationWizard.js  # Interactive multi-step recommendation questionnaire
│   ├── SearchBar.js             # Global navbar search with instant autocomplete
│   ├── ThemeManager.js          # Dark & Light theme manager with persistent storage
│   ├── Toast.js                 # Floating notifications system
│   └── ValueCalculator.js       # Dynamic net annual reward calculation interface
├── services/
│   ├── AuthService.js           # User registration, login, session & localStorage manager
│   ├── CardDataService.js       # Query, filtering, and indexing service
│   ├── OfferDataService.js      # Merchant discount retrieval service
│   ├── RecommendationService.js # 7-factor algorithmic suitability evaluator
│   ├── StorageService.js        # Universal localStorage persistence helper
│   └── ValueCalculatorService.js# Formula engine for gross benefits & fee waivers
└── data/
    ├── banks.js                 # 15 bank profiles, brand tokens & UPI capabilities
    ├── lounges.js               # Airport lounge index for major Indian airports
    ├── offers.js                # Curated merchant promotional offers
    ├── cards.js                 # Master aggregator importing modular issuer catalogs
    └── cards/
        ├── hdfc.js              # 18 HDFC Bank cards
        ├── sbi.js               # 18 SBI Cards
        ├── axis.js              # 17 Axis Bank cards
        ├── icici.js             # 13 ICICI Bank cards
        ├── kotak.js             # 11 Kotak Mahindra Bank cards
        ├── idfc.js              # 9 IDFC FIRST Bank cards
        ├── indusind.js          # 9 IndusInd Bank cards
        ├── amex.js              # 6 American Express cards
        ├── sc.js                # 5 Standard Chartered cards
        ├── rbl.js               # 6 RBL Bank cards
        ├── yes.js               # 6 Yes Bank cards
        ├── au.js                # 5 AU Small Finance Bank cards
        ├── bob.js               # 5 Bank of Baroda (BOBCARD) cards
        └── hsbc_federal_others.js # 7 HSBC, Federal, OneCard & PNB cards
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/Yashah01/bank-Cards.git
cd bank-Cards

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173/
```

### Production Build

```bash
# Build optimized production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

### Run Automated Verification Test Suite

```bash
node test-suite.js
```

Expected Output:
```text
--- STARTING AUTOMATED SERVICE & DATA TESTS ---
✓ PASS: Master Catalog contains comprehensive active retail cards (Found: 135)
✓ PASS: All 15 master directory banking issuers are actively represented with credit cards
✓ PASS: Standard Chartered Ultimate card is present and indexed
✓ PASS: Yes Bank Marquee card is present and indexed
✓ PASS: Diners Club network cards are present and indexed
...
✓ PASS: Login with correct username and password succeeds

--- TEST SUMMARY: 37 PASSED, 0 FAILED ---
```

---

## 🌐 Deployment to Vercel

The project is pre-configured with `vercel.json` for one-command zero-config deployment:

```bash
npx vercel --prod
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
