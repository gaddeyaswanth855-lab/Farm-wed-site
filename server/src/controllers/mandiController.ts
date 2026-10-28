import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';

export async function getLatestMandiPrices(req: Request, res: Response, next: NextFunction) {
  try {
    const { commodity, district, state } = req.query;

    let sql = `SELECT * FROM mandi_prices WHERE 1=1`;
    const params: any[] = [];

    if (commodity && String(commodity).trim() !== '') {
      params.push(`%${commodity}%`);
      sql += ` AND commodity ILIKE $${params.length}`;
    }

    if (district && String(district).trim() !== '') {
      params.push(`%${district}%`);
      sql += ` AND district ILIKE $${params.length}`;
    }

    if (state && String(state).trim() !== '') {
      params.push(`%${state}%`);
      sql += ` AND state ILIKE $${params.length}`;
    }

    sql += ` ORDER BY modal_price DESC LIMIT 50`;

    const result = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
}

export async function calculateArbitrage(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      commodity = 'Onion',
      quantityQuintals = 50,
      localPricePerQuintal = 2200,
      destinationPricePerQuintal = 2950,
      distanceKm = 180,
      destinationMarket = 'Vashi APMC (Navi Mumbai)'
    } = req.body;

    const qty = Number(quantityQuintals);
    const localRate = Number(localPricePerQuintal);
    const destRate = Number(destinationPricePerQuintal);
    const dist = Number(distanceKm);

    // Gross revenue at destination
    const grossDestRevenue = qty * destRate;
    const grossLocalRevenue = qty * localRate;

    // Logistics & Transactional Expenses
    // Freight: ₹3.20 per quintal per km for rural transport trucks
    const freightCost = Math.round(dist * 3.20 * qty);
    // APMC Mandi cess, loading, unloading, weighing: ₹55 per quintal
    const handlingMandiFees = Math.round(qty * 55);
    // In-transit moisture shrinkage / handling loss (estimated 2.0%)
    const transitLossQuintals = Math.round(qty * 0.02 * 10) / 10;
    const transitLossValue = Math.round(transitLossQuintals * destRate);

    const totalTransitExpenses = freightCost + handlingMandiFees + transitLossValue;
    const netDestRevenue = grossDestRevenue - totalTransitExpenses;
    const netArbitrageProfit = netDestRevenue - grossLocalRevenue;
    const netProfitPerQuintal = Math.round(netArbitrageProfit / qty);

    const isProfitable = netArbitrageProfit > 0;

    return res.status(200).json({
      success: true,
      data: {
        commodity,
        quantityQuintals: qty,
        localMarketRevenue: grossLocalRevenue,
        destinationMarket,
        destinationGrossRevenue: grossDestRevenue,
        expensesBreakdown: {
          freightCost,
          handlingMandiFees,
          transitLossQuintals,
          transitLossValue,
          totalTransitExpenses
        },
        netDestinationRevenue: netDestRevenue,
        netArbitrageProfit,
        netProfitPerQuintal,
        isProfitable,
        recommendation: isProfitable 
          ? `Transit Arbitrage is RECOMMENDED: Transporting ${qty} quintals to ${destinationMarket} yields a net extra profit of ₹${netArbitrageProfit.toLocaleString('en-IN')} (₹${netProfitPerQuintal}/quintal after freight & APMC cess).`
          : `LOCAL SALE PREFERRED: Transport freight and transit shrinkage (₹${totalTransitExpenses.toLocaleString('en-IN')}) will erase the price difference. Better to liquidate at local APMC or utilize on-farm storage.`
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function calculateStorageBreakeven(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      commodity = 'Soybean',
      quantityQuintals = 40,
      currentPricePerQuintal = 4680,
      storageMonths = 3,
      isPerishable = false
    } = req.body;

    const qty = Number(quantityQuintals);
    const currPrice = Number(currentPricePerQuintal);
    const months = Number(storageMonths);

    // Current harvest gate value
    const currentInventoryValue = qty * currPrice;

    // Storage cost per quintal per month
    const monthlyRentPerQuintal = isPerishable ? 140 : 45;
    const totalStorageRent = qty * monthlyRentPerQuintal * months;

    // Opportunity finance cost: 7% p.a. KCC interest on tied-up working capital
    const annualInterestRate = 0.07;
    const financeCost = Math.round(currentInventoryValue * (annualInterestRate / 12) * months);

    // Handling & Warehouse Insurance (1.0% of commodity value)
    const insuranceFee = Math.round(currentInventoryValue * 0.01);

    const totalHoldingCost = totalStorageRent + financeCost + insuranceFee;
    const totalBreakevenValue = currentInventoryValue + totalHoldingCost;
    const breakevenPricePerQuintal = Math.round(totalBreakevenValue / qty);

    // Anticipated Off-Season Surge (historical off-season modal prices +25% to +35%)
    const anticipatedSurgeMultiplier = isPerishable ? 1.40 : 1.25;
    const anticipatedFuturePrice = Math.round(currPrice * anticipatedSurgeMultiplier);
    const anticipatedFutureRevenue = qty * anticipatedFuturePrice;
    const projectedNetGain = anticipatedFutureRevenue - totalBreakevenValue;

    return res.status(200).json({
      success: true,
      data: {
        commodity,
        quantityQuintals: qty,
        currentInventoryValue,
        storageMonths: months,
        holdingCostBreakdown: {
          totalStorageRent,
          financeCostKCC: financeCost,
          insuranceAndHandling: insuranceFee,
          totalHoldingCost
        },
        breakevenPricePerQuintal,
        priceHikeNeededToBreakeven: breakevenPricePerQuintal - currPrice,
        anticipatedFuturePrice,
        projectedNetGain,
        eNWRFinancingAvailable: {
          pledgeLoanPercentage: '75%',
          availableCashAdvance: Math.round(currentInventoryValue * 0.75),
          interestSubventionRate: '7.0% per annum under Kisan Credit Card scheme'
        },
        advice: projectedNetGain > 0 
          ? `STORAGE ADVANTAGEOUS: Storing for ${months} months requires a breakeven price of ₹${breakevenPricePerQuintal}/q. Projected off-season rate is ₹${anticipatedFuturePrice}/q, leaving a projected net windfall of ₹${projectedNetGain.toLocaleString('en-IN')}. You can pledge the warehouse receipt (e-NWR) for an immediate ₹${Math.round(currentInventoryValue * 0.75).toLocaleString('en-IN')} bank advance.`
          : `SELL AT CURRENT MARKET: Holding costs will outpace likely price gains.`
      }
    });
  } catch (err) {
    next(err);
  }
}
