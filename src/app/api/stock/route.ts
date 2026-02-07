import { NextRequest, NextResponse } from 'next/server';

// Yahoo Finance API for quotes and historical data
const YAHOO_CHART_API = 'https://query1.finance.yahoo.com/v8/finance/chart';
const YAHOO_QUOTE_API = 'https://query1.finance.yahoo.com/v7/finance/quote';

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

// Fetch fundamentals from Yahoo Finance (more accurate for PEG ratio)
async function fetchYahooFundamentals(symbol: string) {
  try {
    const url = `${YAHOO_QUOTE_API}?symbols=${symbol}`;
    console.log('Fetching Yahoo fundamentals from:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Yahoo Finance fundamentals error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const quote = data.quoteResponse?.result?.[0];
    
    if (!quote) {
      console.error('No quote data in Yahoo fundamentals response');
      return null;
    }

    console.log('Yahoo Finance fundamentals for', symbol, ':', JSON.stringify({
      trailingPE: quote.trailingPE,
      forwardPE: quote.forwardPE,
      pegRatio: quote.pegRatio,
      priceToBook: quote.priceToBook,
      epsTrailingTwelveMonths: quote.epsTrailingTwelveMonths,
      epsForward: quote.epsForward,
      marketCap: quote.marketCap,
    }));

    return {
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE || 0,
      forwardPE: quote.forwardPE || 0,
      pbRatio: quote.priceToBook || 0,
      pegRatio: quote.pegRatio || 0, // Yahoo provides PEG directly!
      eps: quote.epsTrailingTwelveMonths || 0,
      epsForward: quote.epsForward || 0,
      dividendYield: (quote.dividendYield || 0) * 100, // Yahoo returns as decimal
      beta: quote.beta || 1,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      avgVolume: quote.averageDailyVolume10Day || quote.averageVolume || 0,
    };
  } catch (error) {
    console.error('Yahoo Finance fundamentals error:', error);
    return null;
  }
}

// Fetch fundamentals - combine Yahoo and Finnhub for best data
async function fetchFundamentals(symbol: string) {
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
    
    // Fetch from both Yahoo and Finnhub in parallel
    const [yahooData, finnhubProfileData, finnhubMetricsData] = await Promise.all([
      fetchYahooFundamentals(symbol),
      fetch(`${FINNHUB_PROFILE_API}?symbol=${symbol}&token=${FINNHUB_API_KEY}`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : {})
        .catch(() => ({})),
      fetch(`${FINNHUB_METRICS_API}?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`, { cache: 'no-store' })
        .then(res => res.ok ? res.json() : { metric: {} })
        .catch(() => ({ metric: {} }))
    ]);

    const finnhubProfile = finnhubProfileData as { marketCapitalization?: number };
    const metrics = (finnhubMetricsData as { metric?: Record<string, number> }).metric || {};

    // Use Yahoo data as primary source (more accurate for PEG)
    // Fall back to Finnhub for missing data
    
    // P/E Ratio - prefer Yahoo's trailing P/E
    const peRatio = yahooData?.peRatio || metrics.peTTM || metrics.peBasicExclExtraTTM || 0;
    const forwardPE = yahooData?.forwardPE || metrics.peNormalizedAnnual || 0;
    
    // PEG Ratio - Yahoo provides this directly and it's usually accurate
    // Yahoo calculates PEG using: P/E ratio / 5-year expected EPS growth rate
    // This is the standard industry calculation
    let pegRatio = yahooData?.pegRatio || 0;
    let pegSource = yahooData?.pegRatio ? 'Yahoo Finance (direct)' : '';
    
    // EPS Growth Rate for PEG calculation
    // For established companies: use 5-year or 3-year historical growth
    // For young companies: use forward estimates or revenue growth as proxy
    let epsGrowthAnnual = 0;
    let growthSource = '';
    
    // Priority 1: 5-year EPS growth (most reliable for established companies)
    if (metrics.epsGrowth5Y && metrics.epsGrowth5Y !== 0) {
      epsGrowthAnnual = metrics.epsGrowth5Y;
      growthSource = '5-year EPS growth';
    }
    // Priority 2: 3-year EPS growth (good for moderately established companies)
    else if (metrics.epsGrowth3Y && metrics.epsGrowth3Y !== 0) {
      epsGrowthAnnual = metrics.epsGrowth3Y;
      growthSource = '3-year EPS growth';
    }
    // Priority 3: Forward EPS growth (analyst estimates - good for young companies)
    else if (yahooData?.eps && yahooData?.epsForward && yahooData.eps !== 0) {
      // Forward EPS is typically 1-year forward estimate from analysts
      epsGrowthAnnual = ((yahooData.epsForward - yahooData.eps) / Math.abs(yahooData.eps)) * 100;
      growthSource = 'Forward EPS estimate';
    }
    // Priority 4: TTM YoY growth (recent but can be volatile)
    else if (metrics.epsGrowthTTMYoy && metrics.epsGrowthTTMYoy > 0) {
      epsGrowthAnnual = metrics.epsGrowthTTMYoy;
      growthSource = 'TTM YoY growth';
    }
    // Priority 5: Revenue growth as proxy (for pre-profit or young companies)
    else if (metrics.revenueGrowth5Y && metrics.revenueGrowth5Y > 0) {
      // Use revenue growth as a proxy for earnings growth potential
      // This is common for young/growth companies that aren't yet profitable
      epsGrowthAnnual = metrics.revenueGrowth5Y;
      growthSource = '5-year revenue growth (proxy)';
    }
    else if (metrics.revenueGrowth3Y && metrics.revenueGrowth3Y > 0) {
      epsGrowthAnnual = metrics.revenueGrowth3Y;
      growthSource = '3-year revenue growth (proxy)';
    }
    else if (metrics.revenueGrowthTTMYoy && metrics.revenueGrowthTTMYoy > 0) {
      epsGrowthAnnual = metrics.revenueGrowthTTMYoy;
      growthSource = 'TTM revenue growth (proxy)';
    }
    
    // Calculate PEG if Yahoo doesn't provide it directly
    if (pegRatio === 0 && peRatio > 0 && epsGrowthAnnual > 0) {
      // PEG = P/E Ratio / Annual Growth Rate (in percentage)
      // Example: P/E of 30 with 15% annual growth = 30/15 = 2.0 PEG
      pegRatio = peRatio / epsGrowthAnnual;
      pegSource = `Calculated from ${growthSource}`;
    }
    
    // Alternative: Forward PEG for young companies
    // Uses forward P/E and forward growth estimates
    if (pegRatio === 0 && forwardPE > 0 && epsGrowthAnnual > 0) {
      pegRatio = forwardPE / epsGrowthAnnual;
      pegSource = `Forward PEG (${growthSource})`;
    }
    
    // Handle edge cases for PEG
    if (pegRatio < 0 || !isFinite(pegRatio)) {
      pegRatio = 0; // Negative or invalid PEG doesn't make sense
      pegSource = 'N/A (negative growth or no data)';
    } else if (pegRatio > 10) {
      pegRatio = 10; // Cap extremely high values (indicates very low/negative growth)
      pegSource += ' (capped at 10)';
    }

    // For display purposes, also get TTM growth (more recent but volatile)
    const epsGrowthTTM = metrics.epsGrowthTTMYoy || 0;
    
    // Use the best available growth for the main epsGrowth field
    const epsGrowth = epsGrowthAnnual || epsGrowthTTM;
    
    // Log for debugging
    console.log('PEG calculation for', symbol, ':', JSON.stringify({
      yahooPEG: yahooData?.pegRatio,
      calculatedPEG: pegRatio,
      pegSource,
      peRatio,
      forwardPE,
      epsGrowth5Y: metrics.epsGrowth5Y,
      epsGrowth3Y: metrics.epsGrowth3Y,
      epsGrowthTTMYoy: metrics.epsGrowthTTMYoy,
      revenueGrowth5Y: metrics.revenueGrowth5Y,
      revenueGrowth3Y: metrics.revenueGrowth3Y,
      revenueGrowthTTMYoy: metrics.revenueGrowthTTMYoy,
      epsGrowthAnnual,
      growthSource,
      forwardEPS: yahooData?.epsForward,
      trailingEPS: yahooData?.eps,
    }));

    return {
      marketCap: yahooData?.marketCap || (finnhubProfile.marketCapitalization ? finnhubProfile.marketCapitalization * 1000000 : 0),
      peRatio: parseFloat(peRatio.toFixed(2)),
      pbRatio: parseFloat((yahooData?.pbRatio || metrics.pbAnnual || 0).toFixed(2)),
      pegRatio: parseFloat(pegRatio.toFixed(2)),
      eps: parseFloat((yahooData?.eps || metrics.epsBasicExclExtraItemsTTM || 0).toFixed(2)),
      epsGrowth: parseFloat(epsGrowth.toFixed(2)),
      dividendYield: parseFloat((yahooData?.dividendYield || metrics.dividendYieldIndicatedAnnual || 0).toFixed(2)),
      beta: parseFloat((yahooData?.beta || metrics.beta || 1).toFixed(2)),
      fiftyTwoWeekHigh: parseFloat((yahooData?.fiftyTwoWeekHigh || metrics['52WeekHigh'] || 0).toFixed(2)),
      fiftyTwoWeekLow: parseFloat((yahooData?.fiftyTwoWeekLow || metrics['52WeekLow'] || 0).toFixed(2)),
      avgVolume: yahooData?.avgVolume || (metrics['10DayAverageTradingVolume'] ? Math.round(metrics['10DayAverageTradingVolume'] * 1000000) : 0),
      debtToEquity: parseFloat((metrics.totalDebtToEquityQuarterly || metrics.totalDebtToEquityAnnual || 0).toFixed(2)),
      roe: parseFloat((metrics.roeRfy || metrics.roeTTM || 0).toFixed(2)),
      revenueGrowth: parseFloat((metrics.revenueGrowth5Y || metrics.revenueGrowthTTMYoy || 0).toFixed(2)),
      profitMargin: parseFloat((metrics.netProfitMarginTTM || metrics.netProfitMarginAnnual || 0).toFixed(2))
    };
  } catch (error) {
    console.error('Fundamentals fetch error:', error);
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
        const fundamentals = await fetchFundamentals(symbol);
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
