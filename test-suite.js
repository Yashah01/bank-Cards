/**
 * CardSphere India - Automated Verification Test Runner
 */

import { CardDataService } from './services/CardDataService.js';
import { RecommendationService } from './services/RecommendationService.js';
import { ValueCalculatorService } from './services/ValueCalculatorService.js';
import { OfferDataService } from './services/OfferDataService.js';
import { AuthService } from './services/AuthService.js';
import { INDIAN_LOUNGES } from './data/lounges.js';

async function runTests() {
  console.log('--- STARTING AUTOMATED SERVICE & DATA TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`✕ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Data Service Card Count & Issuer Coverage
  const allCards = await CardDataService.getCards();
  assert(allCards.length >= 130, `Master Catalog contains comprehensive active retail cards (Found: ${allCards.length})`);

  const expectedIssuers = ['hdfc', 'sbi', 'axis', 'icici', 'idfc', 'kotak', 'indusind', 'amex', 'sc', 'rbl', 'yes', 'au', 'bob', 'hsbc', 'federal'];
  const allIssuersPresent = expectedIssuers.every(bankId => allCards.some(c => c.bankId === bankId));
  assert(allIssuersPresent, 'All 15 master directory banking issuers are actively represented with credit cards');

  // Verify Diners Club, Standard Chartered, and Yes Bank presence
  assert(allCards.some(c => c.id === 'sc-ultimate'), 'Standard Chartered Ultimate card is present and indexed');
  assert(allCards.some(c => c.id === 'yes-marquee'), 'Yes Bank Marquee card is present and indexed');
  assert(allCards.some(c => c.network === 'Diners Club'), 'Diners Club network cards are present and indexed');
  assert(allCards.some(c => c.id === 'hdfc-diners-black'), 'HDFC Diners Club Black card is present and indexed');
  assert(allCards.some(c => c.id === 'bob-eterna'), 'BOBCARD Eterna card is present and indexed');
  assert(allCards.some(c => c.id === 'au-zenith-plus'), 'AU Zenith+ Metal card is present and indexed');

  // 2. Search Accuracy
  const amazonResults = await CardDataService.searchCards('Amazon');
  assert(amazonResults.length > 0 && amazonResults.some(c => c.id === 'icici-amazon-pay'), 'Search for "Amazon" correctly surfaces Amazon Pay ICICI');

  const upiResults = await CardDataService.searchCards('UPI');
  assert(upiResults.length > 0 && upiResults.every(c => c.upiSupported), 'Search for "UPI" surfaces RuPay UPI supported cards');

  const forexResults = await CardDataService.searchCards('zero forex');
  assert(forexResults.some(c => c.travel?.forexMarkup === '0.0%'), 'Search for "zero forex" surfaces 0% forex cards');

  // 3. Multi-Faceted Filters
  const rupayFiltered = await CardDataService.filterCards({ upiOnly: true });
  assert(rupayFiltered.length > 0 && rupayFiltered.every(c => c.upiSupported), 'Filter upiOnly: true returns strictly UPI-supported cards');

  const feeFiltered = await CardDataService.filterCards({ maxAnnualFee: 1000 });
  assert(feeFiltered.every(c => c.annualFee <= 1000), 'Filter maxAnnualFee: 1000 returns cards under ₹1,000');

  const freeFiltered = await CardDataService.filterCards({ lifetimeFreeOnly: true });
  assert(freeFiltered.every(c => c.annualFee === 0), 'Filter lifetimeFreeOnly: true returns strictly ₹0 cards');

  // 4. Value Calculator Engine
  const infinia = allCards.find(c => c.id === 'hdfc-infinia');
  const infiniaVal = ValueCalculatorService.calculateCardAnnualValue(infinia, {
    monthlySpend: 100000,
    onlineSpend: 40000,
    travelSpend: 20000,
    diningSpend: 10000,
    fuelSpend: 5000,
    upiSpend: 5000,
    intlSpend: 5000
  });

  assert(infiniaVal.totalGrossBenefit > 20000, `Infinia gross annual benefit calculation (> ₹20k: ₹${infiniaVal.totalGrossBenefit})`);
  assert(infiniaVal.isFeeWaived === true, 'Infinia fee is correctly marked waived when annual spend >= 10 Lakhs');
  assert(infiniaVal.effectiveAnnualFee === 0, 'Effective annual fee is 0 when waived');

  const amazonCard = allCards.find(c => c.id === 'icici-amazon-pay');
  const amazonVal = ValueCalculatorService.calculateCardAnnualValue(amazonCard, {
    monthlySpend: 30000,
    onlineSpend: 15000,
    travelSpend: 2000,
    diningSpend: 3000,
    fuelSpend: 2000,
    upiSpend: 5000,
    intlSpend: 0
  });
  assert(amazonVal.totalAnnualCost === 0, 'Amazon Pay ICICI has ₹0 total annual cost (Lifetime Free)');
  assert(amazonVal.netEstimatedValue > 0, `Amazon Pay ICICI net benefit is positive (₹${amazonVal.netEstimatedValue})`);

  // 5. Recommendation Engine (7-Factor Suitability)
  const recommendations = RecommendationService.evaluateProfile({
    occupation: 'salaried',
    monthlyIncome: 120000,
    monthlySpend: 50000,
    rewardsPreference: 'cashback',
    topShopping: ['amazon', 'swiggy'],
    travelFrequency: 'occasional',
    needsLounge: true,
    heavyUpiUser: true,
    fuelSpend: 3000,
    internationalSpend: 0,
    annualFeeTolerance: 'low'
  });

  assert(recommendations.length > 0, 'Recommendation engine returns scored list of cards');
  assert(recommendations[0].matchScore >= 70, `Top recommended card has strong match score (Score: ${recommendations[0].matchScore}%)`);
  assert(recommendations[0].matchFactors.length > 0, 'Top recommendation includes key match factors (pros)');
  assert(typeof recommendations[0].summaryHeadline === 'string', 'Top recommendation includes transparent summary headline');

  // 6. Offers Engine
  const offers = await OfferDataService.getOffers();
  assert(offers.length >= 10, `Offers database contains at least 10 active partner offers (Found: ${offers.length})`);
  assert(offers.every(o => o.promoCode && o.discount), 'All offers have valid promo codes and discount values');

  // 7. Lounge Directory
  assert(INDIAN_LOUNGES.length >= 6, `Lounge directory covers key Indian airports (Found: ${INDIAN_LOUNGES.length})`);

  // 8. User Authentication Service (Username & Password)
  // Test seeded demo user login
  const demoLogin = AuthService.login('demo_user', 'cardsphere123');
  assert(demoLogin.success === true, 'Seeded demo user login succeeds');
  assert(AuthService.isLoggedIn() === true, 'User is marked as logged in');
  assert(AuthService.getCurrentUser()?.username === 'demo_user', 'Active session reflects logged in user');

  // Test logout
  AuthService.logout();
  assert(AuthService.isLoggedIn() === false, 'User session cleared on logout');
  assert(AuthService.getCurrentUser() === null, 'Current user is null after logout');

  // Test sign up
  const signupResult = AuthService.signup('yash_finance', 'securepass123');
  assert(signupResult.success === true, 'New user sign up succeeds with username and password');
  assert(AuthService.isLoggedIn() === true, 'User is auto-authenticated after sign up');
  assert(AuthService.getCurrentUser()?.username === 'yash_finance', 'Session reflects newly created account');

  // Test duplicate username rejection
  const dupSignup = AuthService.signup('yash_finance', 'anotherpass');
  assert(dupSignup.success === false, 'Duplicate username registration is rejected');

  // Test incorrect password
  AuthService.logout();
  const badLogin = AuthService.login('yash_finance', 'wrongpass');
  assert(badLogin.success === false, 'Login with incorrect password is rejected');

  // Test valid login
  const goodLogin = AuthService.login('yash_finance', 'securepass123');
  assert(goodLogin.success === true, 'Login with correct username and password succeeds');

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
