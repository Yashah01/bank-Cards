/**
 * CardSphere India - Value Calculator Service
 * Calculates the Estimated Annual Value (Gross Benefit - Annual Fee & Costs = Net Annual Benefit)
 * Provides detailed breakdown for rewards, cashback, lounge access, welcome benefits, and fuel savings.
 */

export class ValueCalculatorService {
  /**
   * Calculates comprehensive annual value breakdown for a given card and spend pattern
   * @param {Object} card
   * @param {Object} spendInputs
   * @returns {Object}
   */
  static calculateCardAnnualValue(card, spendInputs = {}) {
    const {
      monthlySpend = 30000,
      onlineSpend = 12000,
      travelSpend = 3000,
      diningSpend = 4000,
      fuelSpend = 2500,
      upiSpend = 5000,
      intlSpend = 0
    } = spendInputs;

    const annualTotalSpend = monthlySpend * 12;
    const annualOnlineSpend = onlineSpend * 12;
    const annualTravelSpend = travelSpend * 12;
    const annualDiningSpend = diningSpend * 12;
    const annualFuelSpend = fuelSpend * 12;
    const annualUpiSpend = upiSpend * 12;
    const annualIntlSpend = intlSpend * 12;
    const annualOtherSpend = Math.max(0, annualTotalSpend - (annualOnlineSpend + annualTravelSpend + annualDiningSpend + annualFuelSpend + annualUpiSpend + annualIntlSpend));

    let grossRewardsValue = 0;
    let cashbackValue = 0;
    let loungeValue = 0;
    let welcomeBenefitValue = 0;
    let milestoneValue = 0;
    let fuelSavingsValue = 0;
    let forexSavingsValue = 0;

    // 1. Rewards and Cashback Calculation based on Card Type & Architecture
    if (card.id === 'icici-amazon-pay') {
      // 5% on Amazon / online, 2% utility, 1% other
      cashbackValue = (annualOnlineSpend * 0.05) + (annualDiningSpend * 0.02) + (annualOtherSpend * 0.01);
    } else if (card.id === 'sbi-cashback') {
      // 5% on online up to ₹5k/mo (₹60k/yr), 1% on other
      const monthlyOnlineCb = Math.min(5000, onlineSpend * 0.05);
      cashbackValue = (monthlyOnlineCb * 12) + (annualOtherSpend * 0.01);
    } else if (card.id === 'hdfc-infinia') {
      // 3.3% base, SmartBuy up to 10X (assume 33% on travel, 3.3% base on remainder)
      const travelRp = (annualTravelSpend * 0.165); // conservative 16.5% on SmartBuy flights
      const generalRp = (annualTotalSpend - annualTravelSpend - annualFuelSpend) * 0.033;
      grossRewardsValue = travelRp + generalRp;
    } else if (card.id === 'hdfc-millennia') {
      // 5% on 10 merchant partners (capped ₹1,000/mo), 1% on rest
      const partnerCashback = Math.min(1000, (onlineSpend + diningSpend) * 0.05) * 12;
      const baseCashback = Math.min(1000, annualOtherSpend * 0.01);
      cashbackValue = partnerCashback + baseCashback;
    } else if (card.id === 'axis-atlas') {
      // 5 EDGE Miles per ₹100 on travel, 2 on other. 1 EDGE Mile = ~₹2.0 in airline/hotel points
      const travelMiles = (annualTravelSpend / 100) * 5;
      const otherMiles = ((annualTotalSpend - annualTravelSpend - annualFuelSpend) / 100) * 2;
      grossRewardsValue = (travelMiles + otherMiles) * 2.0;
    } else if (card.id === 'axis-ace') {
      // 5% bill payments via GPay, 4% Swiggy/Zomato, 1.5% other
      const gpayCb = Math.min(500, (onlineSpend * 0.4 * 0.05) + (diningSpend * 0.04)) * 12;
      const restCb = (annualTotalSpend - (annualOnlineSpend * 0.4 + annualDiningSpend) - annualFuelSpend) * 0.015;
      cashbackValue = gpayCb + restCb;
    } else if (card.id === 'hdfc-swiggy') {
      const swiggyCb = Math.min(1500, diningSpend * 0.10) * 12;
      const onlineCb = Math.min(1500, onlineSpend * 0.05) * 12;
      const otherCb = annualOtherSpend * 0.01;
      cashbackValue = swiggyCb + onlineCb + otherCb;
    } else if (card.id === 'hdfc-tataneu-infinity') {
      const tataCb = (annualOnlineSpend * 0.07);
      const upiCb = Math.min(500, upiSpend * 0.015) * 12;
      const otherCb = annualOtherSpend * 0.015;
      cashbackValue = tataCb + upiCb + otherCb;
    } else if (card.id === 'federal-scapia') {
      const travelCoins = (annualTravelSpend * 0.10);
      const otherCoins = (annualTotalSpend - annualTravelSpend) * 0.02;
      grossRewardsValue = travelCoins + otherCoins;
    } else if (card.id === 'hsbc-live-plus') {
      const diningCb = Math.min(1000, (diningSpend + 2000) * 0.10) * 12;
      const otherCb = annualOtherSpend * 0.015;
      cashbackValue = diningCb + otherCb;
    } else {
      // Generic formula for points-based cards
      const basePct = parseFloat(card.rewards?.baseRate || '1.0') / 100;
      const pointVal = card.rewards?.pointValueInr || 0.25;
      grossRewardsValue = (annualTotalSpend * basePct) * pointVal;
    }

    // 2. Lounge Valuation (@ ₹1,200 standard lounge buffet & amenities value per visit)
    const LOUNGE_UNIT_VALUE = 1200;
    if (card.lounge?.domestic === 'Unlimited') {
      // Assume average frequent traveler utilizes 8 domestic visits/year
      loungeValue = 8 * LOUNGE_UNIT_VALUE;
    } else if (card.lounge?.domestic && card.lounge.domestic !== 'None') {
      const matches = card.lounge.domestic.match(/\d+/);
      const visits = matches ? parseInt(matches[0], 10) : 4;
      loungeValue = Math.min(visits, 8) * LOUNGE_UNIT_VALUE;
    }

    // 3. Welcome Benefits
    if (card.welcomeBenefits && card.welcomeBenefits.length > 0) {
      if (card.id === 'hdfc-infinia') welcomeBenefitValue = 12500;
      else if (card.id === 'axis-atlas') welcomeBenefitValue = 10000;
      else if (card.id === 'sbi-aurum') welcomeBenefitValue = 10000;
      else if (card.id === 'hdfc-regalia-gold') welcomeBenefitValue = 2500;
      else if (card.id === 'amex-platinum-travel') welcomeBenefitValue = 3500;
      else if (card.id === 'indusind-eazydiner') welcomeBenefitValue = 2995;
      else welcomeBenefitValue = Math.min(card.joiningFee || 500, 1500);
    }

    // 4. Milestone Benefits
    if (card.rewards?.milestoneRewards && card.rewards.milestoneRewards.length > 0) {
      card.rewards.milestoneRewards.forEach(m => {
        if (annualTotalSpend >= m.spend) {
          if (m.reward.includes('Taj') || m.reward.includes('10,000')) milestoneValue += 10000;
          else if (m.reward.includes('5,000')) milestoneValue += 5000;
          else if (m.reward.includes('2,000') || m.reward.includes('1,500')) milestoneValue += 1500;
          else if (m.reward.includes('1,000')) milestoneValue += 1000;
        }
      });
    }

    // 5. Fuel Surcharge Savings (1% waiver on fuel spend up to limit)
    if (card.fuel?.surchargeWaiver && !card.fuel.surchargeWaiver.includes('None')) {
      fuelSavingsValue = Math.min(1200, annualFuelSpend * 0.01);
    }

    // 6. Forex Savings vs Standard 3.5% Forex Cards
    const cardForex = parseFloat(card.travel?.forexMarkup || '3.5');
    if (annualIntlSpend > 0 && cardForex < 3.5) {
      const deltaRate = (3.5 - cardForex) / 100;
      forexSavingsValue = annualIntlSpend * deltaRate;
    }

    // --- Costs & Deductions ---
    // Check if annual fee is waived based on threshold
    let effectiveAnnualFee = card.annualFee;
    let isFeeWaived = false;

    if (card.feeWaiverThreshold > 0 && annualTotalSpend >= card.feeWaiverThreshold) {
      effectiveAnnualFee = 0;
      isFeeWaived = true;
    } else if (card.annualFee === 0) {
      effectiveAnnualFee = 0;
      isFeeWaived = true;
    }

    // GST on credit card annual fee (18% in India)
    const gstOnFee = effectiveAnnualFee * 0.18;
    const totalFeeWithGst = effectiveAnnualFee + gstOnFee;

    // Redemption costs (e.g. ₹99 + GST on HDFC/ICICI)
    const redemptionCost = (grossRewardsValue > 0 && card.fees?.rewardRedemption && card.fees.rewardRedemption.includes('99')) ? 117 : 0;

    // Gross Benefit Sum
    const totalGrossBenefit = Math.round(
      grossRewardsValue + cashbackValue + loungeValue + welcomeBenefitValue + milestoneValue + fuelSavingsValue + forexSavingsValue
    );

    // Total Costs
    const totalAnnualCost = Math.round(totalFeeWithGst + redemptionCost);

    // Net Estimated Benefit
    const netEstimatedValue = totalGrossBenefit - totalAnnualCost;

    return {
      cardId: card.id,
      cardName: card.cardName,
      annualTotalSpend,
      grossRewardsValue: Math.round(grossRewardsValue),
      cashbackValue: Math.round(cashbackValue),
      loungeValue: Math.round(loungeValue),
      welcomeBenefitValue: Math.round(welcomeBenefitValue),
      milestoneValue: Math.round(milestoneValue),
      fuelSavingsValue: Math.round(fuelSavingsValue),
      forexSavingsValue: Math.round(forexSavingsValue),
      totalGrossBenefit,
      effectiveAnnualFee,
      isFeeWaived,
      feeWaiverThreshold: card.feeWaiverThreshold,
      gstOnFee: Math.round(gstOnFee),
      redemptionCost,
      totalAnnualCost,
      netEstimatedValue,
      disclaimer: 'Estimated value is based on standard redemption valuations and regular spending patterns. Projections are not guaranteed returns.'
    };
  }
}
