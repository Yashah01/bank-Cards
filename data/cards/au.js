/**
 * CardSphere India - AU Small Finance Bank Credit Cards
 * Extracted from Comprehensive Card Directory (Master Extract - Page 9)
 */

export const AU_CARDS = [
  {
    id: 'au-zenith-plus',
    issuer: 'AU Small Finance Bank',
    bankId: 'au',
    cardName: 'AU Zenith+ Metal Edition',
    category: 'Super-premium',
    cardType: 'Credit',
    network: 'Visa',
    networkTier: 'Infinite',
    variant: 'Metal',
    colorTheme: {
      primary: '#1D132B',
      secondary: '#361D52',
      accent: '#E5A93C',
      textColor: '#FFFFFF',
      metallic: true,
      sheen: 'gold-metal'
    },
    annualFee: 4999,
    joiningFee: 4999,
    renewalFee: 4999,
    feeWaiverThreshold: 800000,
    incomeRequirement: 200000,
    ageRequirement: 21,
    secured: false,
    fdRequirement: 0,
    virtualAvailable: true,
    contactless: true,
    upiSupported: false,
    rewards: {
      baseRate: '2.0%',
      description: '16 Lounges/yr (4 domestic + 4 intl/qtr); 2 RP/₹100; premium metal form factor; 0.99% forex markup; 1 RP = ₹1 on travel.',
      pointsPerHundred: 2.0,
      pointValueInr: 1.0,
      redemptionOptions: '1 Reward Point = ₹1.00 for flight/hotel bookings or brand vouchers on AU Rewardz.',
      milestoneRewards: [
        { spend: 800000, reward: 'Annual fee waiver for subsequent year' },
        { spend: 1200000, reward: 'Complimentary luxury hotel stay voucher worth ₹10,000' }
      ]
    },
    cashback: { baseRate: '1.0%', categories: '2 RP per ₹100 on dining, international, and travel; 1 RP per ₹100 on other retail', monthlyCap: 'No cap' },
    lounge: {
      domestic: '16 visits/year',
      international: '16 visits/year',
      spendRequirement: 'Spend ₹20,000 in preceding calendar month',
      frequency: '4 complimentary domestic visits & 4 international lounge visits per calendar quarter',
      program: 'Priority Pass & Visa Infinite Lounge Program',
      guestAccess: false
    },
    travel: {
      forexMarkup: '0.99%',
      travelPartners: 'Air India, Vistara, Taj Hotels',
      hotelBenefits: 'Taj Epicure membership tier, luxury hotel perks'
    },
    shopping: { amazon: '1 point per ₹100', flipkart: '1 point per ₹100', myntra: '2 points per ₹100', otherPartners: 'Duty-free and international retail' },
    fuel: { surchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹4,000', maxWaiver: '₹1,000 per statement cycle' },
    dining: { discount: 'Up to 20% discount on 2,500+ restaurants under Culinary Treats', program: 'AU Culinary' },
    welcomeBenefits: [
      '5,000 bonus Reward Points (worth ₹5,000) upon realization of joining fee',
      'Complimentary Taj Epicure membership tier'
    ],
    partnerOffers: [
      'Lowest forex markup in premium card segment (0.99% + GST)',
      'Complimentary golf games and lessons (up to 4 per quarter)'
    ],
    eligibility: { employment: 'Salaried or Self-Employed', income: '₹2,00,000+ monthly net salary or ₹24L+ ITR', age: '21 to 65 years', creditHistory: 'CIBIL 750+' },
    fees: { apr: '36.0% p.a.', latePayment: 'Up to ₹1,200', foreignMarkup: '0.99% + GST', cashWithdrawal: '2.5% or ₹500', rewardRedemption: 'Free' },
    terms: ['Points valid for 3 years'],
    exclusions: ['Fuel, wallet, rent, government transactions excluded.'],
    source: 'Comprehensive Card Directory - Master Extract (Page 9)',
    sourceUrl: 'https://www.aubank.in',
    lastUpdated: '15 Sep 2026',
    dataStatus: 'Verified'
  },
  {
    id: 'au-zenith',
    issuer: 'AU Small Finance Bank',
    bankId: 'au',
    cardName: 'AU Bank Zenith Credit Card',
    category: 'Dining',
    cardType: 'Credit',
    network: 'Visa',
    networkTier: 'Signature',
    variant: 'Standard',
    colorTheme: {
      primary: '#31124D',
      secondary: '#1C062E',
      accent: '#C084FC',
      textColor: '#FFFFFF',
      metallic: false,
      sheen: 'purple-gloss'
    },
    annualFee: 3999,
    joiningFee: 3999,
    renewalFee: 3999,
    feeWaiverThreshold: 500000,
    incomeRequirement: 100000,
    ageRequirement: 21,
    secured: false,
    fdRequirement: 0,
    virtualAvailable: true,
    contactless: true,
    upiSupported: false,
    rewards: {
      baseRate: '1.25%',
      description: '16 Lounges (4/qtr); Zomato Pro; Taj Epicure tier; 10 RP per ₹100 on dining/travel; 5 RP per ₹100 on grocery.',
      pointsPerHundred: 5.0,
      pointValueInr: 0.25,
      redemptionOptions: '1 RP = ₹0.25 for flight bookings or brand vouchers.',
      milestoneRewards: [
        { spend: 500000, reward: 'Annual fee waiver on ₹5 Lakh annual spend' },
        { spend: 800000, reward: 'Taj Hotels voucher worth ₹5,000' }
      ]
    },
    cashback: { baseRate: '1.0%', categories: '10 points per ₹100 on Dining, International, and Travel; 5 points per ₹100 on Grocery and Departmental', monthlyCap: 'No cap' },
    lounge: {
      domestic: '16 visits/year',
      international: '8 visits/year',
      spendRequirement: 'Spend ₹20,000 in preceding calendar month for domestic lounge access',
      frequency: '4 complimentary domestic visits per quarter & 2 international visits per quarter via Priority Pass',
      program: 'Priority Pass & Visa Signature Lounge Program',
      guestAccess: false
    },
    travel: { forexMarkup: '1.99%', travelPartners: 'Air India, Vistara', hotelBenefits: 'Taj Epicure membership tier' },
    shopping: { amazon: '5 points per ₹100', flipkart: '5 points per ₹100', myntra: '5 points per ₹100', otherPartners: 'Departmental and grocery stores' },
    fuel: { surchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹4,000', maxWaiver: '₹400 per statement cycle' },
    dining: { discount: '10 points per ₹100 on dining outings', program: 'AU Culinary' },
    welcomeBenefits: [
      'Welcome vouchers worth ₹4,000 upon realization of joining fee',
      'Complimentary Taj Epicure membership tier'
    ],
    partnerOffers: [
      'Buy 1 Get 1 free movie ticket on BookMyShow (up to ₹250 off, twice per month)',
      'Complimentary golf games (2 per quarter)'
    ],
    eligibility: { employment: 'Salaried or Self-Employed', income: '₹1,00,000+ monthly net salary or ₹12L+ ITR', age: '21 to 65 years', creditHistory: 'CIBIL 740+' },
    fees: { apr: '42.0% p.a.', latePayment: 'Up to ₹1,200', foreignMarkup: '1.99% + GST', cashWithdrawal: '2.5% or ₹500', rewardRedemption: 'Free' },
    terms: ['Points valid for 3 years'],
    exclusions: ['Fuel, wallet, rent, government transactions excluded.'],
    source: 'Comprehensive Card Directory - Master Extract (Page 9)',
    sourceUrl: 'https://www.aubank.in',
    lastUpdated: '15 Sep 2026',
    dataStatus: 'Verified'
  },
  {
    id: 'au-vetta',
    issuer: 'AU Small Finance Bank',
    bankId: 'au',
    cardName: 'AU Bank Vetta Credit Card',
    category: 'Lifestyle',
    cardType: 'Credit',
    network: 'Visa',
    networkTier: 'Platinum',
    variant: 'Standard',
    colorTheme: {
      primary: '#1E1B4B',
      secondary: '#0F172A',
      accent: '#A855F7',
      textColor: '#FFFFFF',
      metallic: false,
      sheen: 'gloss'
    },
    annualFee: 2999,
    joiningFee: 2999,
    renewalFee: 2999,
    feeWaiverThreshold: 150000,
    incomeRequirement: 50000,
    ageRequirement: 21,
    secured: false,
    fdRequirement: 0,
    virtualAvailable: true,
    contactless: true,
    upiSupported: false,
    rewards: {
      baseRate: '1.0%',
      description: '4 Lounges/qtr; 4 RP/₹100 on grocery/departmental; 1,000 bonus points on milestones; ₹1,000 voucher on card activation.',
      pointsPerHundred: 4.0,
      pointValueInr: 0.25,
      redemptionOptions: '1 RP = ₹0.25 for brand vouchers or flight tickets.',
      milestoneRewards: [
        { spend: 100000, reward: '1,000 bonus Reward Points every calendar quarter on spending ₹1 Lakh+' },
        { spend: 150000, reward: 'Annual fee waiver on ₹1.5 Lakh annual spend' }
      ]
    },
    cashback: { baseRate: '0.75%', categories: '4 points per ₹100 on Grocery and Departmental stores; 2 points per ₹100 on other retail', monthlyCap: 'No cap' },
    lounge: {
      domestic: '16 visits/year',
      international: 'None',
      spendRequirement: 'Spend ₹20,000 in preceding calendar month',
      frequency: '4 complimentary domestic airport lounge visits per calendar quarter',
      program: 'Visa Platinum Lounge Program',
      guestAccess: false
    },
    travel: { forexMarkup: '2.99%', travelPartners: 'None', hotelBenefits: 'None' },
    shopping: { amazon: '2 points per ₹100', flipkart: '2 points per ₹100', myntra: '2 points per ₹100', otherPartners: 'Grocery and departmental stores' },
    fuel: { surchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹4,000', maxWaiver: '₹250 per statement cycle' },
    dining: { discount: 'Dining discounts via AU Treats', program: 'AU Treats' },
    welcomeBenefits: ['Gift voucher worth ₹1,000 on spending ₹30,000 within 60 days of card issuance'],
    partnerOffers: [
      'Buy 1 Get 1 free movie ticket on BookMyShow (up to ₹150 off, once per month)',
      '1,000 bonus Reward Points on quarterly milestone spends'
    ],
    eligibility: { employment: 'Salaried or Self-Employed', income: '₹50,000+ monthly net salary or ₹6L+ ITR', age: '21 to 65 years', creditHistory: 'CIBIL 720+' },
    fees: { apr: '42.0% p.a.', latePayment: 'Up to ₹1,200', foreignMarkup: '2.99% + GST', cashWithdrawal: '2.5% or ₹500', rewardRedemption: 'Free' },
    terms: ['Points valid for 24 months'],
    exclusions: ['Fuel, wallet, rent, government transactions excluded.'],
    source: 'Comprehensive Card Directory - Master Extract (Page 9)',
    sourceUrl: 'https://www.aubank.in',
    lastUpdated: '15 Sep 2026',
    dataStatus: 'Verified'
  },
  {
    id: 'au-altura-plus',
    issuer: 'AU Small Finance Bank',
    bankId: 'au',
    cardName: 'AU Bank Altura Plus Credit Card',
    category: 'Cashback',
    cardType: 'Credit',
    network: 'Visa',
    networkTier: 'Platinum',
    variant: 'Standard',
    colorTheme: {
      primary: '#065F46',
      secondary: '#022C22',
      accent: '#34D399',
      textColor: '#FFFFFF',
      metallic: false,
      sheen: 'matte'
    },
    annualFee: 499,
    joiningFee: 499,
    renewalFee: 499,
    feeWaiverThreshold: 80000,
    incomeRequirement: 25000,
    ageRequirement: 21,
    secured: false,
    fdRequirement: 0,
    virtualAvailable: true,
    contactless: true,
    upiSupported: false,
    rewards: {
      baseRate: '1.5%',
      description: '1.5% CB on POS; 2 Lounges (2 per quarter); 500 bonus points on joining; 2X rewards on online spends; fee waiver on ₹80k spend.',
      pointsPerHundred: 2.0,
      pointValueInr: 0.25,
      redemptionOptions: '1 RP = ₹0.25 statement credit or brand vouchers.',
      milestoneRewards: [
        { spend: 20000, reward: '500 bonus Reward Points on spending ₹20,000 in a calendar month' },
        { spend: 80000, reward: 'Annual fee waiver on ₹80,000 annual spend' }
      ]
    },
    cashback: { baseRate: '1.5%', categories: '1.5% cashback on merchant POS swipes; 2X reward points on online shopping', monthlyCap: '₹100 per statement cycle on POS cashback' },
    lounge: {
      domestic: '8 visits/year',
      international: 'None',
      spendRequirement: 'Spend ₹20,000 in preceding calendar month',
      frequency: '2 complimentary domestic airport lounge visits per calendar quarter',
      program: 'Visa Lounge Program',
      guestAccess: false
    },
    travel: { forexMarkup: '3.5%', travelPartners: 'None', hotelBenefits: 'None' },
    shopping: { amazon: '2X points', flipkart: '2X points', myntra: '2X points', otherPartners: 'Merchant POS terminals' },
    fuel: { surchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹4,000', maxWaiver: '₹150 per statement cycle' },
    dining: { discount: 'AU dining perks', program: 'AU Treats' },
    welcomeBenefits: ['500 bonus Reward Points upon spending ₹10,000 within 60 days'],
    partnerOffers: ['Complimentary domestic airport lounge access (2/quarter) on meeting spend criterion'],
    eligibility: { employment: 'Salaried or Self-Employed', income: '₹25,000+ monthly net salary or ₹3.6L+ ITR', age: '21 to 60 years', creditHistory: 'CIBIL 700+' },
    fees: { apr: '42.0% p.a.', latePayment: 'Up to ₹1,200', foreignMarkup: '3.5% + GST', cashWithdrawal: '2.5% or ₹500', rewardRedemption: 'Free' },
    terms: ['Points valid for 2 years'],
    exclusions: ['Fuel, wallet, rent, government transactions excluded.'],
    source: 'Comprehensive Card Directory - Master Extract (Page 9)',
    sourceUrl: 'https://www.aubank.in',
    lastUpdated: '15 Sep 2026',
    dataStatus: 'Verified'
  },
  {
    id: 'au-lit',
    issuer: 'AU Small Finance Bank',
    bankId: 'au',
    cardName: 'AU LIT Credit Card',
    category: 'Customizable',
    cardType: 'Credit',
    network: 'Visa',
    networkTier: 'Platinum',
    variant: 'Customizable',
    colorTheme: {
      primary: '#312E81',
      secondary: '#1E1B4B',
      accent: '#38BDF8',
      textColor: '#FFFFFF',
      metallic: false,
      sheen: 'cyan-glow'
    },
    annualFee: 0,
    joiningFee: 0,
    renewalFee: 0,
    feeWaiverThreshold: 0,
    incomeRequirement: 20000,
    ageRequirement: 21,
    secured: false,
    fdRequirement: 0,
    virtualAvailable: true,
    contactless: true,
    upiSupported: true,
    rewards: {
      baseRate: '1.0%',
      description: 'India\'s first customizable card; pay per feature; toggle 5% cashback, lounge access pack, or 10X reward multipliers on demand; lifetime free base card.',
      pointsPerHundred: 1.0,
      pointValueInr: 0.25,
      redemptionOptions: 'Points converted to statement credit or vouchers via AU 0101 app.',
      milestoneRewards: [{ spend: 0, reward: 'Lifetime Free base card with modular micro-subscriptions' }]
    },
    cashback: {
      baseRate: '1.0%',
      categories: 'Configure up to 5% cashback on travel, dining, grocery, or electronics. Enable 5X or 10X reward point multipliers.',
      monthlyCap: 'Customizable based on active 30-day or 90-day feature packs'
    },
    lounge: {
      domestic: 'Customizable pack',
      international: 'None',
      spendRequirement: 'Activate Lounge Pack on AU 0101 app',
      frequency: 'Pay nominal fee (e.g., ₹149 to ₹299) to unlock 1 to 4 lounge visits per quarter',
      program: 'Visa Lounge Program',
      guestAccess: false
    },
    travel: { forexMarkup: '3.5%', travelPartners: 'None', hotelBenefits: 'None' },
    shopping: { amazon: 'Up to 5% with active shopping pack', flipkart: 'Up to 5%', myntra: 'Up to 5%', otherPartners: 'Configurable on mobile app' },
    fuel: { surchargeWaiver: '1% waiver on fuel transactions between ₹400 and ₹4,000 with Fuel Pack', maxWaiver: '₹150 per statement cycle' },
    dining: { discount: 'Up to 5% cashback when Dining Pack is enabled', program: 'AU LIT Perks' },
    welcomeBenefits: ['Lifetime Free base card with instant digital virtual card in AU 0101 app'],
    partnerOffers: [
      'Micro-customization: switch features on/off dynamically for 30 or 90 days',
      'Available on RuPay variant for UPI merchant scanning'
    ],
    eligibility: { employment: 'Salaried or Self-Employed', income: '₹20,000+ monthly net salary or ₹2.5L+ ITR', age: '21 to 60 years', creditHistory: 'CIBIL 690+' },
    fees: { apr: '42.0% p.a.', latePayment: 'Up to ₹1,200', foreignMarkup: '3.5% + GST', cashWithdrawal: '2.5% or ₹500', rewardRedemption: 'Free' },
    terms: ['Features auto-expire unless renewed on AU 0101 app'],
    exclusions: ['Fuel, wallet, rent, government transactions excluded from base earnings.'],
    source: 'Comprehensive Card Directory - Master Extract (Page 9)',
    sourceUrl: 'https://www.aubank.in',
    lastUpdated: '15 Sep 2026',
    dataStatus: 'Verified'
  }
];
