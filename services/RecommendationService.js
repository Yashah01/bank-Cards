/**
 * CardSphere India - Card Recommendation Service
 * Implements a transparent 7-factor scoring engine (0-100) based strictly on suitability.
 * Provides detailed matching rationale, match factors, and explicit warnings about limitations.
 */

import { CARDS } from '../data/cards.js';
import { ValueCalculatorService } from './ValueCalculatorService.js';

export class RecommendationService {
  /**
   * Evaluates user responses and returns ranked recommendations with transparent scoring
   * @param {Object} userProfile
   * @returns {Array} List of scored and explained cards
   */
  static evaluateProfile(userProfile) {
    const scoredList = CARDS.map(card => {
      // 1. Eligibility Match (0 to 15 points)
      let eligibilityScore = 15;
      const limitations = [];
      const matchFactors = [];

      // Check income suitability
      const userMonthlyIncome = Number(userProfile.monthlyIncome || 0);
      if (card.secured) {
        // Secured card is 100% eligible for everyone
        eligibilityScore = 15;
        matchFactors.push('Guaranteed approval backed by Fixed Deposit with zero income proof needed.');
      } else if (card.incomeRequirement > 0 && userMonthlyIncome < card.incomeRequirement) {
        const deficit = (card.incomeRequirement - userMonthlyIncome) / card.incomeRequirement;
        eligibilityScore = Math.max(0, Math.round(15 - deficit * 20));
        limitations.push(`Requires ₹${card.incomeRequirement.toLocaleString('en-IN')}/mo income (your input: ₹${userMonthlyIncome.toLocaleString('en-IN')}/mo).`);
      } else {
        matchFactors.push(`Meets minimum income requirement of ₹${card.incomeRequirement.toLocaleString('en-IN')}/month.`);
      }

      // 2. Spending Match (0 to 20 points)
      let spendingScore = 10;
      const monthlySpend = Number(userProfile.monthlySpend || 25000);
      if (card.feeWaiverThreshold > 0) {
        const annualSpend = monthlySpend * 12;
        if (annualSpend >= card.feeWaiverThreshold) {
          spendingScore += 10;
          matchFactors.push(`Your annual spend (~₹${(annualSpend/100000).toFixed(1)}L) comfortably clears the ₹${(card.feeWaiverThreshold/100000).toFixed(1)}L annual fee waiver.`);
        } else {
          spendingScore += 4;
          limitations.push(`Annual spend of ₹${(card.feeWaiverThreshold/100000).toFixed(1)}L required to waive the ₹${card.annualFee.toLocaleString('en-IN')} annual fee.`);
        }
      } else if (card.annualFee === 0) {
        spendingScore += 10;
        matchFactors.push('Lifetime Free card with zero annual spend pressure.');
      }

      // 3. Rewards Match (0 to 15 points)
      let rewardsScore = 8;
      const rewardsPreference = userProfile.rewardsPreference || 'cashback'; // 'cashback' | 'travel_miles' | 'points'
      if (rewardsPreference === 'cashback' && card.category === 'Cashback') {
        rewardsScore += 7;
        matchFactors.push('Direct cashback automatically credited to your statement every month.');
      } else if (rewardsPreference === 'travel_miles' && card.category === 'Travel') {
        rewardsScore += 7;
        matchFactors.push('Accelerated air miles and hotel point transfers for frequent travelers.');
      } else if (card.rewards?.pointValueInr >= 0.5) {
        rewardsScore += 5;
        matchFactors.push(`High reward point redemption valuation (~₹${card.rewards.pointValueInr}/point).`);
      }

      // 4. Shopping Match (0 to 15 points)
      let shoppingScore = 5;
      const topShopping = userProfile.topShopping || [];
      if (topShopping.includes('amazon') && (card.id === 'icici-amazon-pay' || card.id === 'hdfc-millennia' || card.id === 'sbi-cashback')) {
        shoppingScore += 10;
        matchFactors.push('Top-tier 5% savings on Amazon shopping.');
      } else if (topShopping.includes('flipkart') && (card.id === 'axis-flipkart' || card.id === 'hdfc-millennia' || card.id === 'sbi-cashback')) {
        shoppingScore += 10;
        matchFactors.push('5% unlimited savings on Flipkart purchases.');
      } else if (topShopping.includes('swiggy') && (card.id === 'hdfc-swiggy' || card.id === 'axis-ace' || card.id === 'hsbc-live-plus')) {
        shoppingScore += 10;
        matchFactors.push('Exceptional 10% cashback on Swiggy food delivery and Instamart groceries.');
      } else if (topShopping.includes('zomato') && (card.id === 'axis-ace' || card.id === 'hsbc-live-plus' || card.id === 'indusind-eazydiner')) {
        shoppingScore += 10;
        matchFactors.push('High value back on Zomato and dining outings.');
      } else if (card.category === 'Cashback') {
        shoppingScore += 5;
      }

      // 5. Travel & Lounge Match (0 to 15 points)
      let travelScore = 0;
      const travelFrequency = userProfile.travelFrequency || 'none'; // 'frequent' | 'occasional' | 'none'
      const needsLounge = userProfile.needsLounge || false;
      const hasIntlSpend = (Number(userProfile.internationalSpend || 0) > 0);

      if (needsLounge || travelFrequency !== 'none') {
        if (card.lounge?.domestic === 'Unlimited') {
          travelScore += 12;
          matchFactors.push('Unlimited complimentary domestic airport lounge access.');
        } else if (card.lounge?.domestic && card.lounge.domestic !== 'None') {
          travelScore += 8;
          matchFactors.push(`${card.lounge.domestic} lounge visits.`);
          if (card.lounge.spendRequirement && card.lounge.spendRequirement !== 'None') {
            limitations.push(`Lounge condition: ${card.lounge.spendRequirement}`);
          }
        } else {
          travelScore += 1;
          if (needsLounge) {
            limitations.push('This card does not offer complimentary airport lounge visits.');
          }
        }
      } else {
        travelScore = 10; // Neutral if user doesn't travel
      }

      if (hasIntlSpend) {
        const forexNum = parseFloat(card.travel?.forexMarkup || '3.5');
        if (forexNum === 0.0) {
          travelScore += 3;
          matchFactors.push('Zero Forex Markup: Saves 3.5% + GST on international spending.');
        } else if (forexNum <= 2.0) {
          travelScore += 2;
          matchFactors.push(`Discounted forex markup of only ${card.travel.forexMarkup}.`);
        } else {
          limitations.push(`Standard 3.5% forex markup fee on foreign currency transactions.`);
        }
      }

      // 6. UPI Match (0 to 10 points)
      let upiScore = 5;
      const heavyUpiUser = userProfile.heavyUpiUser || false;
      if (heavyUpiUser) {
        if (card.upiSupported) {
          upiScore = 10;
          matchFactors.push('RuPay Credit Card: Can be linked directly to PhonePe, Google Pay, BHIM & Paytm for QR payments.');
        } else {
          upiScore = 2;
          limitations.push('Visa/Mastercard/Amex cannot be linked to UPI QR codes for merchant payments.');
        }
      } else {
        upiScore = 8;
      }

      // 7. Fee Efficiency (0 to 10 points)
      let feeScore = 5;
      const annualFeeTolerance = userProfile.annualFeeTolerance || 'free_only'; // 'free_only' | 'low' | 'any'
      if (annualFeeTolerance === 'free_only') {
        if (card.annualFee === 0) {
          feeScore = 10;
          matchFactors.push('Zero annual fee with no hidden conditions.');
        } else {
          feeScore = 1;
          limitations.push(`Annual fee of ₹${card.annualFee.toLocaleString('en-IN')} is required.`);
        }
      } else if (annualFeeTolerance === 'low') {
        if (card.annualFee <= 1000) {
          feeScore = 9;
          matchFactors.push(`Low nominal annual fee of ₹${card.annualFee.toLocaleString('en-IN')}.`);
        } else {
          feeScore = 4;
        }
      } else {
        feeScore = 8;
      }

      // Total Score Sum (0 to 100)
      const rawScore = eligibilityScore + spendingScore + rewardsScore + shoppingScore + travelScore + upiScore + feeScore;
      const normalizedScore = Math.min(100, Math.max(10, Math.round(rawScore)));

      // Synthesis of "Why this card matches your profile"
      let summaryHeadline = '';
      if (normalizedScore >= 85) {
        summaryHeadline = `Exceptional match for your spending habits and fee preferences.`;
      } else if (normalizedScore >= 70) {
        summaryHeadline = `Strong card choice with notable rewards across your preferred merchants.`;
      } else {
        summaryHeadline = `Moderate match. Consider your annual spending to offset the fees.`;
      }

      // Estimated Annual Net Value for this user
      const estimatedValue = ValueCalculatorService.calculateCardAnnualValue(card, {
        monthlySpend: monthlySpend,
        onlineSpend: Math.round(monthlySpend * 0.5),
        travelSpend: travelFrequency === 'frequent' ? 15000 : 3000,
        diningSpend: topShopping.includes('swiggy') || topShopping.includes('zomato') ? 6000 : 2000,
        fuelSpend: Number(userProfile.fuelSpend || 3000),
        upiSpend: heavyUpiUser ? 10000 : 2000,
        intlSpend: Number(userProfile.internationalSpend || 0)
      });

      return {
        card,
        matchScore: normalizedScore,
        summaryHeadline,
        matchFactors: matchFactors.slice(0, 4),
        limitations: limitations.slice(0, 3),
        scoreBreakdown: {
          eligibility: eligibilityScore,
          spending: spendingScore,
          rewards: rewardsScore,
          shopping: shoppingScore,
          travel: travelScore,
          upi: upiScore,
          feeEfficiency: feeScore
        },
        estimatedValue
      };
    });

    // Sort descending by match score
    return scoredList.sort((a, b) => b.matchScore - a.matchScore);
  }
}
