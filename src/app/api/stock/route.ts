import { NextRequest, NextResponse } from 'next/server';

// Yahoo Finance API for quotes and historical data
const YAHOO_CHART_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Finnhub API for fundamentals (free tier)
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const FINNHUB_PROFILE_API = 'https://finnhub.io/api/v1/stock/profile2';
const FINNHUB_METRICS_API = 'https://finnhub.io/api/v1/stock/metric';

// Check if symbol is cryptocurrency
function isCrypto(symbol: string): boolean {
  return symbol.includes('-USD') || symbol.includes('-EUR') || symbol.includes('-GBP');
}

// Fetch quote from Yahoo Finance
async function fetchYahooQuote(symbol: string) {
  try {
    const url = `${YAHOO_CHART_API}/${symbol}?interval=1d&range=1d`;
    console.log('Fetching quote from:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Yahoo Finance error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) {
      console.error('No result in Yahoo response');
      return null;
    }

    const meta = result.meta;
    if (!meta) {
      console.error('No meta in Yahoo result');
      return null;
    }

    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose || meta.chartPreviousClose || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;

    return {
      symbol: meta.symbol || symbol,
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      high: meta.regularMarketDayHigh || currentPrice * 1.01,
      low: meta.regularMarketDayLow || currentPrice * 0.99,
      open: meta.regularMarketOpen || previousClose,
      previousClose: parseFloat(previousClose.toFixed(2)),
      volume: meta.regularMarketVolume || 0,
      timestamp: Date.now(),
      simulated: false
    };
  } catch (error) {
    console.error('Yahoo Finance quote error:', error);
    return null;
  }
}

// Fetch historical data from Yahoo Finance (1 year)
async function fetchYahooHistorical(symbol: string) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - (365 * 24 * 60 * 60);
    
    const url = `${YAHOO_CHART_API}/${symbol}?period1=${oneYearAgo}&period2=${now}&interval=1d`;
    console.log('Fetching historical from:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Yahoo Finance historical error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) {
      console.error('No result in Yahoo historical response');
      return [];
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0];
    if (!quote || timestamps.length === 0) {
      console.error('No quote data in Yahoo historical response');
      return [];
    }

    const historicalData = [];
    
    for (let i = 0; i < timestamps.length; i++) {
      const open = quote.open?.[i];
      const high = quote.high?.[i];
      const low = quote.low?.[i];
      const close = quote.close?.[i];
      const volume = quote.volume?.[i];
      
      if (open == null || high == null || low == null || close == null) continue;
      
      const date = new Date(timestamps[i] * 1000);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume || 0
      });
    }

    console.log(`Fetched ${historicalData.length} historical records for ${symbol}`);
    return historicalData;
  } catch (error) {
    console.error('Yahoo Finance historical error:', error);
    return [];
  }
}

// Fetch fundamentals from Finnhub
async function fetchFinnhubFundamentals(symbol: string) {
  const isCryptoSymbol = isCrypto(symbol);
  
  // For crypto, return basic data
  if (isCryptoSymbol) {
    const cryptoMarketCaps: Record<string, number> = {
      'BTC-USD': 1200000000000,
      'ETH-USD': 400000000000,
      'BNB-USD': 80000000000,
      'XRP-USD': 30000000000,
      'SOL-USD': 60000000000,
      'ADA-USD': 15000000000,
      'DOGE-USD': 20000000000,
    };
    
    return {
      marketCap: cryptoMarketCaps[symbol] || 10000000000,
      peRatio: 0,
      pbRatio: 0,
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
      profitMargin: 0
    };
  }

  try {
    console.log('Fetching fundamentals for:', symbol);
    
    // Fetch both profile and metrics
    const [profileRes, metricsRes] = await Promise.all([
      fetch(`${FINNHUB_PROFILE_API}?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
        cache: 'no-store'
      }),
      fetch(`${FINNHUB_METRICS_API}?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`, {
        cache: 'no-store'
      })
    ]);

    const profile = profileRes.ok ? await profileRes.json() : {};
    const metricsData = metricsRes.ok ? await metricsRes.json() : {};
    const metrics = metricsData.metric || {};

    // Calculate PEG ratio
    const peRatio = metrics.peBasicExclExtraTTM || metrics.peNormalizedAnnual || 0;
    const epsGrowth = metrics.epsGrowth5Y || metrics.epsGrowthTTMYoy || 15;
    const pegRatio = peRatio > 0 && epsGrowth > 0 ? peRatio / epsGrowth : 0;

    return {
      marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : 0,
      peRatio: peRatio,
      pbRatio: metrics.pbAnnual || metrics.pbQuarterly || 0,
      pegRatio: pegRatio,
      eps: metrics.epsBasicExclExtraItemsTTM || metrics.epsInclExtraItemsTTM || 0,
      epsGrowth: epsGrowth,
      dividendYield: metrics.dividendYieldIndicatedAnnual || 0,
      beta: metrics.beta || 1,
      fiftyTwoWeekHigh: metrics['52WeekHigh'] || 0,
      fiftyTwoWeekLow: metrics['52WeekLow'] || 0,
      avgVolume: metrics['10DayAverageTradingVolume'] ? metrics['10DayAverageTradingVolume'] * 1000000 : 0,
      debtToEquity: metrics.totalDebtToEquityQuarterly || metrics.totalDebtToEquityAnnual || 0,
      roe: metrics.roeRfy || metrics.roeTTM || 0,
      revenueGrowth: metrics.revenueGrowth5Y || metrics.revenueGrowthTTMYoy || 0,
      profitMargin: metrics.netProfitMarginTTM || metrics.netProfitMarginAnnual || 0
    };
  } catch (error) {
    console.error('Finnhub fundamentals error:', error);
    return generateSimulatedFundamentals(symbol);
  }
}

// Generate simulated data as fallback
function generateSimulatedQuote(symbol: string) {
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
    simulated: true
  };
}

function generateSimulatedHistorical(symbol: string) {
  console.log('Generating simulated historical data for:', symbol);
  const data = [];
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
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(10000000 + Math.random() * 50000000)
    });
    
    price = close;
  }
  
  return data;
}

function generateSimulatedFundamentals(symbol: string) {
  const peRatio = 15 + Math.random() * 25;
  const epsGrowth = 5 + Math.random() * 20;
  
  return {
    marketCap: 10000000000 + Math.random() * 500000000000,
    peRatio,
    pbRatio: 1 + Math.random() * 8,
    pegRatio: peRatio / epsGrowth,
    eps: 2 + Math.random() * 10,
    epsGrowth,
    dividendYield: Math.random() * 3,
    beta: 0.7 + Math.random() * 1,
    fiftyTwoWeekHigh: 0,
    fiftyTwoWeekLow: 0,
    avgVolume: 5000000 + Math.random() * 30000000,
    debtToEquity: Math.random() * 1.5,
    roe: 8 + Math.random() * 25,
    revenueGrowth: -5 + Math.random() * 25,
    profitMargin: 5 + Math.random() * 25
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol')?.toUpperCase() || 'AAPL';
  const type = searchParams.get('type') || 'quote';

  console.log(`API Request: symbol=${symbol}, type=${type}`);

  try {
    switch (type) {
      case 'quote': {
        const quote = await fetchYahooQuote(symbol);
        if (quote) {
          return NextResponse.json(quote);
        }
        console.log('Using simulated quote data');
        return NextResponse.json(generateSimulatedQuote(symbol));
      }

      case 'historical': {
        const historical = await fetchYahooHistorical(symbol);
        if (historical.length > 0) {
          return NextResponse.json(historical);
        }
        console.log('Using simulated historical data');
        return NextResponse.json(generateSimulatedHistorical(symbol));
      }

      case 'fundamental': {
        const fundamentals = await fetchFinnhubFundamentals(symbol);
        return NextResponse.json(fundamentals);
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    
    // Return simulated data on error
    switch (type) {
      case 'quote':
        return NextResponse.json(generateSimulatedQuote(symbol));
      case 'historical':
        return NextResponse.json(generateSimulatedHistorical(symbol));
      case 'fundamental':
        return NextResponse.json(generateSimulatedFundamentals(symbol));
      default:
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
}
