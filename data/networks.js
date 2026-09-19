/**
 * CardSphere India - Payment Networks
 */

export const NETWORKS = [
  {
    id: 'rupay',
    name: 'RuPay',
    country: 'India (NPCI)',
    variants: ['Classic', 'Platinum', 'Select'],
    upiCompatible: true,
    upiNote: 'RuPay credit cards can be directly linked to UPI apps (BHIM, Google Pay, PhonePe, Paytm, Cred) for QR merchant payments.',
    acceptanceRate: '99% in India; Global via Discover/Diners Club & JCB alliances',
    color: '#097939',
    badgeText: 'RuPay UPI'
  },
  {
    id: 'visa',
    name: 'Visa',
    country: 'Global',
    variants: ['Classic', 'Gold', 'Platinum', 'Signature', 'Infinite'],
    upiCompatible: false,
    upiNote: 'UPI linking for credit cards in India is currently restricted to RuPay network by RBI guidelines.',
    acceptanceRate: 'Universal global acceptance (200+ countries)',
    color: '#1a1f71',
    badgeText: 'Visa'
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    country: 'Global',
    variants: ['Standard', 'Gold', 'Platinum', 'World', 'World Elite'],
    upiCompatible: false,
    upiNote: 'UPI linking for credit cards in India is currently restricted to RuPay network.',
    acceptanceRate: 'Universal global acceptance (210+ countries)',
    color: '#eb001b',
    badgeText: 'Mastercard'
  },
  {
    id: 'amex',
    name: 'American Express',
    country: 'United States / Global',
    variants: ['Green', 'Gold', 'Platinum', 'Centurion'],
    upiCompatible: false,
    upiNote: 'Not supported on UPI. Operates on proprietary closed-loop network.',
    acceptanceRate: 'High in tier 1/2 urban metros and online; moderate in tier 3 offline shops',
    color: '#006fcf',
    badgeText: 'Amex'
  },
  {
    id: 'diners',
    name: 'Diners Club International',
    country: 'Global (Discover Financial)',
    variants: ['Black', 'Privilege', 'Miles'],
    upiCompatible: false,
    upiNote: 'Not supported on UPI in India.',
    acceptanceRate: 'Accepted where Discover/Diners network is enabled. High lounge network globally.',
    color: '#004c8f',
    badgeText: 'Diners Club'
  }
];
