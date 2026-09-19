/**
 * CardSphere India - Lounge Access Directory & Rules
 */

export const INDIAN_LOUNGES = [
  {
    city: 'New Delhi (DEL)',
    airport: 'Indira Gandhi International Airport',
    terminal: 'Terminal 3',
    loungeName: 'Encalm Lounge',
    type: 'Domestic & International',
    networks: ['RuPay Select', 'Visa Signature / Infinite', 'Mastercard World', 'Priority Pass', 'DreamFolks'],
    standardPrice: 1400,
    amenities: ['Buffet Dining', 'High-speed Wi-Fi', 'Bar Services', 'Showers', 'Workstations'],
    accessNotes: 'Most major banks now require ₹35,000 to ₹50,000 minimum spend in preceding calendar quarter.'
  },
  {
    city: 'Mumbai (BOM)',
    airport: 'Chhatrapati Shivaji Maharaj International Airport',
    terminal: 'Terminal 2',
    loungeName: 'Adani Lounge',
    type: 'Domestic & International',
    networks: ['Visa Infinite', 'Mastercard World Elite', 'RuPay Select', 'Priority Pass', 'Amex Platinum'],
    standardPrice: 1650,
    amenities: ['Fine Dining Buffet', 'Live Kitchen', 'Barista Coffee', 'Premium Spirits', 'Quiet Room'],
    accessNotes: 'Adani One digital pass integration. Certain cards allow guest access via reward point redemption.'
  },
  {
    city: 'Bengaluru (BLR)',
    airport: 'Kempegowda International Airport',
    terminal: 'Terminal 2',
    loungeName: '080 Lounge',
    type: 'Domestic & International',
    networks: ['Visa Signature / Infinite', 'Mastercard World', 'RuPay Select', 'Priority Pass'],
    standardPrice: 1500,
    amenities: ['Artisanal Food Stations', 'Cinema Pod', 'Whisky Lounge', 'Library', 'Sleep Pods (Extra)'],
    accessNotes: 'Widely praised for garden-terminal ambience. High demand during evening departure waves.'
  },
  {
    city: 'Hyderabad (HYD)',
    airport: 'Rajiv Gandhi International Airport',
    terminal: 'Main Terminal',
    loungeName: 'Encalm Lounge',
    type: 'Domestic & International',
    networks: ['Visa Signature', 'Visa Infinite', 'Mastercard World', 'RuPay Select', 'DreamFolks'],
    standardPrice: 1200,
    amenities: ['Hyderabadi Cuisine Buffet', 'Comfort Loungers', 'Flight Display Screens', 'Bar'],
    accessNotes: 'HDFC, ICICI, Axis and SBI cards require validation of quarterly spend threshold.'
  },
  {
    city: 'Kolkata (CCU)',
    airport: 'Netaji Subhash Chandra Bose International Airport',
    terminal: 'Terminal 2',
    loungeName: 'Travel Club Lounge',
    type: 'Domestic',
    networks: ['Visa Signature', 'Mastercard World', 'RuPay Platinum/Select', 'Priority Pass'],
    standardPrice: 1100,
    amenities: ['Hot Buffet', 'Beverages', 'Newspapers', 'Wi-Fi'],
    accessNotes: 'Accepts standard RuPay Platinum / Select and Visa Signature cards.'
  },
  {
    city: 'Chennai (MAA)',
    airport: 'Chennai International Airport',
    terminal: 'Terminal 1 & 4',
    loungeName: 'Travel Club Lounge',
    type: 'Domestic & International',
    networks: ['Visa Signature / Infinite', 'Mastercard World', 'RuPay Select', 'Priority Pass'],
    standardPrice: 1150,
    amenities: ['South Indian Buffet', 'Refreshments', 'Wi-Fi', 'Flight Information'],
    accessNotes: 'Terminal 4 features an updated wing with expanded seating.'
  },
  {
    city: 'Goa (GOX / GOI)',
    airport: 'Mopa (GOX) & Dabolim (GOI)',
    terminal: 'Terminal 1',
    loungeName: 'Encalm Lounge / Good Times Lounge',
    type: 'Domestic',
    networks: ['Visa Signature', 'Mastercard World', 'RuPay Select', 'DreamFolks'],
    standardPrice: 1250,
    amenities: ['Snacks & Buffet', 'Bar Services', 'Wi-Fi'],
    accessNotes: 'Mopa offers state-of-the-art lounge facilities.'
  }
];

export const LOUNGE_RULES_GUIDE = {
  quarterlyShift: {
    title: 'The Quarterly Spend Condition Shift (2024-2026)',
    description: 'To curb overcrowding at airport lounges, almost all major Indian banks (ICICI, HDFC, Axis, SBI) have moved away from unconditional complimentary access on mid-tier cards. Access now requires meeting a spend threshold in the previous calendar quarter.',
    examples: [
      { issuer: 'ICICI Bank', rule: 'Spend ₹50,000 in previous calendar quarter to unlock complimentary access for the next quarter (e.g. Coral, Rubyx, Sapphiro).' },
      { issuer: 'HDFC Bank', rule: 'Spend ₹35,000 - ₹50,000 in preceding calendar quarter on cards like Regalia Gold and Millennia. Infinia and Diners Black retain unlimited unconditional access.' },
      { issuer: 'Axis Bank', rule: 'Spend ₹50,000 in preceding 3 months on Magnus/Atlas/ACE for lounge benefit eligibility.' },
      { issuer: 'IDFC FIRST Bank', rule: 'Requires minimum ₹20,000 monthly spend for airport lounge perks on select variants.' }
    ]
  },
  guestPolicy: {
    title: 'Guest Access Policies',
    description: 'Primary cardholders can generally swipe only for themselves. Super-premium cards like HDFC Infinia and Axis Burgundy provide complimentary guest passes; other cards charge standard walk-in rates (₹1,000 to ₹1,800 + GST) for companions.'
  }
};
