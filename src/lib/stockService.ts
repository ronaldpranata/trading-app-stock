
import YahooFinance from "yahoo-finance2";
import { StockData, FundamentalData, HistoricalData, StockQuote } from "@/types/stock";
import { 
  FINNHUB_API_KEY, 
  FINNHUB_PROFILE_API, 
  FINNHUB_METRICS_API, 
  INDUSTRY_DISCOUNT_RATES, 
  PERPETUAL_GROWTH_RATE 
} from "@/config/financialConstants";

const yahooFinance = new YahooFinance();

interface YahooQuoteSummary {
  price?: {
    marketCap?: number;
    regularMarketPrice?: number;
  };
  summaryDetail?: {
    trailingPE?: number;
    priceToSales?: number;
    previousClose?: number;
    dividendYield?: number;
    beta?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    averageDailyVolume10Day?: number;
  };
  financialData?: {
    epsForward?: number;
    epsTrailingTwelveMonths?: number;
    freeCashflow?: number;
    growth?: number;
    targetHighPrice?: number;
    targetMeanPrice?: number;
    targetLowPrice?: number;
    debtToEquity?: number;
    returnOnEquity?: number;
    revenueGrowth?: number;
    earningsGrowth?: number;
    earningsQuarterlyGrowth?: number;
  };
  defaultKeyStatistics?: {
    pegRatio?: number;
    sharesOutstanding?: number;
    priceToBook?: number;
    enterpriseToEbitda?: number;
    profitMargins?: number;
    trailingEps?: number;
  };
  summaryProfile?: {
    industry?: string;
  };
  earningsTrend?: {
    trend?: Array<{
      period: string; // "0y", "+1y", "+5y", "-5y"
      growth?: number | null;
      earningsEstimate?: {
        avg?: number | null;
        growth?: number | null;
      };
    }>;
  };
}

export class StockService {
  // Check if symbol is cryptocurrency
  static isCrypto(symbol: string): boolean {
    return (
      symbol.includes("-USD") ||
      symbol.includes("-EUR") ||
      symbol.includes("-GBP")
    );
  }

  // Fetch basic quote data from Yahoo Finance
  static async fetchExpectedQuote(symbol: string): Promise<StockQuote | null> {
    try {
      console.log(`Fetching quote for ${symbol}`);
      const data = await yahooFinance.quote(symbol);
      if (data) {
        return {
          symbol: data.symbol,
          price: data.regularMarketPrice || 0,
          change: data.regularMarketChange || 0,
          changePercent: data.regularMarketChangePercent || 0,
          high: data.regularMarketDayHigh || 0,
          low: data.regularMarketDayLow || 0,
          open: data.regularMarketOpen || 0,
          previousClose: data.regularMarketPreviousClose || 0,
          volume: data.regularMarketVolume || 0,
          timestamp: data.regularMarketTime
            ? new Date(data.regularMarketTime).getTime()
            : Date.now(),
          simulated: false,
        };
      }
      return null;
    } catch (error) {
      console.error(`Yahoo Finance quote error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch summary data from Yahoo Finance
  static async fetchYahooSummary(symbol: string): Promise<YahooQuoteSummary | null> {
    try {
      console.log(`Fetching summary for ${symbol}`);
      // Yahoo Finance library returns 'any', cast to our interface
      const result = await yahooFinance.quoteSummary(symbol, {
        modules: [
          "price",
          "summaryDetail",
          "financialData",
          "recommendationTrend",
          "defaultKeyStatistics",
          "summaryProfile",
          "earningsTrend",
        ],
      });
      return result as unknown as YahooQuoteSummary;
    } catch (error) {
      console.error(`Yahoo Finance summary error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch historical data from Yahoo Finance
  static async fetchHistorical(symbol: string): Promise<HistoricalData[]> {
    try {
      const now = new Date();
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate(),
      );
      console.log(
        `Fetching historical for ${symbol} from ${oneYearAgo.toISOString().split("T")[0]} to ${now.toISOString().split("T")[0]}`,
      );

      const result = await yahooFinance.historical(symbol, {
        period1: oneYearAgo,
        period2: now,
        interval: "1d",
      });

      return result.map((h: any) => ({
        date: h.date.toISOString().split("T")[0],
        open: h.open,
        high: h.high,
        low: h.low,
        close: h.close,
        volume: h.volume,
      }));
    } catch (error) {
      console.error(`Yahoo Finance historical error for ${symbol}:`, error);
      return [];
    }
  }

  // Fetch fundamentals - combine Yahoo and Finnhub
  static async fetchFundamentals(symbol: string): Promise<FundamentalData> {
    const isCryptoSymbol = this.isCrypto(symbol);

    if (isCryptoSymbol) {
      return {
        marketCap: 0,
        peRatio: 0,
        pbRatio: 0,
        psRatio: 0,
        pegRatio: 0,
        eps: 0,
        epsGrowth: 0,
        dividendYield: 0,
        beta: 1.5,
        fiftyTwoWeekHigh: 0,
        fiftyTwoWeekLow: 0,
        avgVolume: 0,
        debtToEquity: 0,
        roe: 0,
        revenueGrowth: 0,
        profitMargin: 0,
        evToEbitda: 0,
        dcf: { source: "analyst", bull: 0, base: 0, bear: 0 },
      };
    }

    try {
      console.log("Fetching fundamentals for:", symbol);

      const [yahooData, finnhubProfileData, finnhubMetricsData] =
        await Promise.all([
          this.fetchYahooSummary(symbol),
          fetch(
            `${FINNHUB_PROFILE_API}?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
            { cache: "no-store" },
          )
            .then((res) => (res.ok ? res.json() : {}))
            .catch(() => ({})),
          fetch(
            `${FINNHUB_METRICS_API}?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`,
            { cache: "no-store" },
          )
            .then((res) => (res.ok ? res.json() : { metric: {} }))
            .catch(() => ({ metric: {} })),
        ]);

      const finnhubProfile = finnhubProfileData as {
        marketCapitalization?: number;
      };
      const metrics =
        (finnhubMetricsData as { metric?: Record<string, number> }).metric || {};

      const summary: YahooQuoteSummary = yahooData || {};
      const price = summary.price || {};
      const summaryDetail = summary.summaryDetail || {};
      const financialData = summary.financialData || {};
      const keyStats = summary.defaultKeyStatistics || {};
      const summaryProfile = summary.summaryProfile || {};
      const earningsTrend = summary.earningsTrend?.trend || [];

      const peRatio = summaryDetail.trailingPE || metrics.peTTM || 0;
      
      // --- EPS Growth Calculation Strategy ---
      const trend5y = earningsTrend.find(t => t.period === '+5y')?.growth;
      const trend1y = earningsTrend.find(t => t.period === '+1y')?.growth;
      const trend0y = earningsTrend.find(t => t.period === '0y')?.growth;
      
      const earningsGrowthRaw = 
        trend5y || 
        trend1y || 
        trend0y || 
        financialData.earningsGrowth || 
        financialData.earningsQuarterlyGrowth || 
        metrics.epsGrowth5Y;

      const epsGrowth =
        (earningsGrowthRaw !== undefined && earningsGrowthRaw !== null
          ? earningsGrowthRaw * 100 
          : (financialData.epsForward && financialData.epsTrailingTwelveMonths
              ? ((financialData.epsForward - financialData.epsTrailingTwelveMonths) /
                  Math.abs(financialData.epsTrailingTwelveMonths)) *
                100
              : 0)) || 0;

      let pegRatio = keyStats.pegRatio || 0;
      if (pegRatio === 0 && peRatio > 0 && epsGrowth > 0) {
        pegRatio = peRatio / epsGrowth;
      }

      const psRatio = summaryDetail.priceToSales || metrics.psTTM || 0;
      const evToEbitda =
        keyStats.enterpriseToEbitda ||
        metrics.enterpriseValueOverEBITDAAnnual ||
        0;

      // --- Two-Stage DCF Calculation ---
      const dcf: FundamentalData["dcf"] = {
        source: "analyst",
        bull: 0,
        base: 0,
        bear: 0,
      };

      const industry = summaryProfile.industry || "Default";
      const rates =
        INDUSTRY_DISCOUNT_RATES[industry as keyof typeof INDUSTRY_DISCOUNT_RATES] ||
        INDUSTRY_DISCOUNT_RATES["Default"];
      console.log(`Using DCF discount rate for ${industry}: ${rates.discount}`);

      const fcf = financialData.freeCashflow;
      const sharesOutstanding = keyStats.sharesOutstanding;
      
      const highGrowthRate = Math.min(
        0.5,
        (financialData.revenueGrowth || (epsGrowth / 100))
      );
      const perpetualGrowthRate = PERPETUAL_GROWTH_RATE;

      if (fcf && sharesOutstanding && fcf > 0 && highGrowthRate > 0) {
        const fcfPerShare = fcf / sharesOutstanding;
        const currentPrice =
          price.regularMarketPrice || summaryDetail.previousClose || 0;

        const scenarios = {
          bull: {
            discount: rates.discount - 0.01,
            highGrowth: highGrowthRate * 1.2,
            perpetualGrowth: perpetualGrowthRate + 0.005,
          },
          base: {
            discount: rates.discount,
            highGrowth: highGrowthRate,
            perpetualGrowth: perpetualGrowthRate,
          },
          bear: {
            discount: rates.discount + 0.01,
            highGrowth: highGrowthRate * 0.8,
            perpetualGrowth: perpetualGrowthRate - 0.005,
          },
        };

        const calculateDcf = (
          discountRate: number,
          highGrowth: number,
          perpetualGrowth: number,
        ) => {
          if (discountRate <= perpetualGrowth) {
            return 0;
          }

          let pvTotal = 0;
          let futureFcf = fcfPerShare;

          for (let i = 1; i <= 5; i++) {
            futureFcf *= 1 + highGrowth;
            pvTotal += futureFcf / Math.pow(1 + discountRate, i);
          }

          const terminalValue =
            (futureFcf * (1 + perpetualGrowth)) /
            (discountRate - perpetualGrowth);
          const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, 5);

          const result = pvTotal + pvTerminalValue;
          return isFinite(result) ? result : 0;
        };

        dcf.source = "calculated";
        dcf.bull = Math.min(
          calculateDcf(
            scenarios.bull.discount,
            scenarios.bull.highGrowth,
            scenarios.bull.perpetualGrowth,
          ),
          currentPrice * 7,
        );
        dcf.base = Math.min(
          calculateDcf(
            scenarios.base.discount,
            scenarios.base.highGrowth,
            scenarios.base.perpetualGrowth,
          ),
          currentPrice * 5,
        );
        dcf.bear = Math.min(
          calculateDcf(
            scenarios.bear.discount,
            scenarios.bear.highGrowth,
            scenarios.bear.perpetualGrowth,
          ),
          currentPrice * 3,
        );

        if (dcf.bull < 0) dcf.bull = 0;
        if (dcf.base < 0) dcf.base = 0;
        if (dcf.bear < 0) dcf.bear = 0;
      }

      if (dcf.base === 0) {
        dcf.source = "analyst";
        dcf.bull = financialData.targetHighPrice || 0;
        dcf.base = financialData.targetMeanPrice || 0;
        dcf.bear = financialData.targetLowPrice || 0;
      }

      return {
        marketCap:
          price.marketCap ||
          (finnhubProfile.marketCapitalization
            ? finnhubProfile.marketCapitalization * 1000000
            : 0),
        peRatio: parseFloat(peRatio.toFixed(2)),
        pbRatio: parseFloat(
          (keyStats.priceToBook || metrics.pbAnnual || 0).toFixed(2),
        ),
        psRatio: parseFloat(psRatio.toFixed(2)),
        pegRatio: parseFloat(pegRatio.toFixed(2)),
        eps: parseFloat((keyStats.trailingEps || 0).toFixed(2)),
        epsGrowth: parseFloat(epsGrowth.toFixed(2)),
        dividendYield: parseFloat(
          ((summaryDetail.dividendYield || 0) * 100).toFixed(2),
        ),
        beta: parseFloat((summaryDetail.beta || metrics.beta || 1).toFixed(2)),
        fiftyTwoWeekHigh: parseFloat(
          (summaryDetail.fiftyTwoWeekHigh || 0).toFixed(2),
        ),
        fiftyTwoWeekLow: parseFloat(
          (summaryDetail.fiftyTwoWeekLow || 0).toFixed(2),
        ),
        avgVolume:
          summaryDetail.averageDailyVolume10Day ||
          (metrics["10DayAverageTradingVolume"]
            ? Math.round(metrics["10DayAverageTradingVolume"] * 1000000)
            : 0),
        debtToEquity: parseFloat(
          (
            financialData.debtToEquity ||
            metrics.totalDebtToEquityQuarterly ||
            0
          ).toFixed(2),
        ),
        roe: parseFloat(((financialData.returnOnEquity || 0) * 100).toFixed(2)),
        revenueGrowth: parseFloat(
          ((financialData.revenueGrowth || 0) * 100).toFixed(2),
        ),
        profitMargin: parseFloat(
          ((keyStats.profitMargins || 0) * 100).toFixed(2),
        ),
        evToEbitda: parseFloat(evToEbitda.toFixed(2)),
        dcf,
      };
    } catch (error) {
      console.error("Fundamentals fetch error:", error);
      return this.generateSimulatedFundamentals(symbol);
    }
  }

  // Fetch news
  static async fetchNews(symbol: string) {
    try {
      console.log(`Fetching news for ${symbol}`);
      const result = await yahooFinance.search(symbol, { newsCount: 10 });
      return result.news || [];
    } catch (error) {
      console.error(`Yahoo Finance news error for ${symbol}:`, error);
      return [];
    }
  }

  // Search stocks
  static async searchSymbols(query: string) {
    try {
      console.log(`Searching for ${query}`);
      const result = await yahooFinance.search(query, {
        quotesCount: 10,
        newsCount: 0,
      });
      return result.quotes
        .filter((q: any) => q.isYahooFinance)
        .map((q: any) => ({
          symbol: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          type: q.quoteType || "EQUITY",
          region: q.exchange || "US",
          currency: "USD",
        }));
    } catch (error) {
      console.error(`Yahoo Finance search error for ${query}:`, error);
      return [];
    }
  }

  // Simulation Methods
  static generateSimulatedQuote(symbol: string): StockQuote {
    const basePrice = 100 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;

    return {
      symbol,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
      high: parseFloat((basePrice * 1.02).toFixed(2)),
      low: parseFloat((basePrice * 0.98).toFixed(2)),
      open: parseFloat((basePrice - change / 2).toFixed(2)),
      previousClose: parseFloat((basePrice - change).toFixed(2)),
      volume: Math.floor(10000000 + Math.random() * 50000000),
      timestamp: Date.now(),
      simulated: true,
    };
  }

  static generateSimulatedHistorical(symbol: string): HistoricalData[] {
    console.log("Generating simulated historical data for:", symbol);
    const data: HistoricalData[] = [];
    let price = 100 + Math.random() * 100;

    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const change = (Math.random() - 0.48) * 0.03 * price;
      const open = price;
      const close = Math.max(price + change, 1);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);

      data.push({
        date: date.toISOString().split("T")[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(10000000 + Math.random() * 50000000),
      });

      price = close;
    }

    return data;
  }

  static generateSimulatedFundamentals(symbol: string): FundamentalData {
    const peRatio = 15 + Math.random() * 25;
    const epsGrowth = 5 + Math.random() * 20;
    const baseDcf = 180 + Math.random() * 100;

    return {
      marketCap: 10000000000 + Math.random() * 500000000000,
      peRatio,
      pbRatio: 1 + Math.random() * 8,
      psRatio: 1 + Math.random() * 4,
      pegRatio: peRatio / epsGrowth,
      eps: 2 + Math.random() * 10,
      epsGrowth,
      dividendYield: Math.random() * 3,
      beta: 0.7 + Math.random() * 1,
      fiftyTwoWeekHigh: 150 + Math.random() * 50,
      fiftyTwoWeekLow: 80 + Math.random() * 20,
      avgVolume: 5000000 + Math.random() * 30000000,
      debtToEquity: Math.random() * 1.5,
      roe: 8 + Math.random() * 25,
      revenueGrowth: -5 + Math.random() * 25,
      profitMargin: 5 + Math.random() * 25,
      evToEbitda: 8 + Math.random() * 12,
      dcf: {
        source: "analyst",
        bull: baseDcf * 1.2,
        base: baseDcf,
        bear: baseDcf * 0.8,
      },
    };
  }
}
