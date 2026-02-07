// API service for fetching stock data
// Uses API routes in development

import { StockQuote, HistoricalData, FundamentalData } from '@/types/stock';

// Check if symbol is cryptocurrency
function isCrypto(symbol: string): boolean {
  return symbol.includes('-USD') || symbol.includes('-EUR') || symbol.includes('-GBP');
}

// Fetch quote
export async function fetchQuote(symbol: string): Promise<StockQuote> {
  try {
    const url = '/api/stock?symbol=' + symbol + '&type=quote&refresh=true';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch quote');
    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    return generateSimulatedQuote(symbol);
  }
}

// Fetch historical data
export async function fetchHistorical(symbol: string): Promise<HistoricalData[]> {
  try {
    const url = '/api/stock?symbol=' + symbol + '&type=historical&refresh=true';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch historical');
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical:', error);
    return generateSimulatedHistorical(symbol);
  }
}

// Fetch fundamentals
export async function fetchFundamentals(symbol: string): Promise<FundamentalData> {
  try {
    const url = '/api/stock?symbol=' + symbol + '&type=fundamental&refresh=true';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch fundamentals');
    return await response.json();
  } catch (error) {
    console.error('Error fetching fundamentals:', error);
    return generateSimulatedFundamentals(symbol);
  }
}

// Fetch all data at once
export async function fetchAllStockData(symbol: string) {
  const [quote, historical, fundamentals] = await Promise.all([
    fetchQuote(symbol),
    fetchHistorical(symbol),
    fetchFundamentals(symbol)
  ]);
  
  return { quote, historical, fundamentals };
}

// Simulated data generators (fallback)
function generateSimulatedQuote(symbol: string): StockQuote {
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

function generateSimulatedHistorical(symbol: string): HistoricalData[] {
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

function generateSimulatedFundamentals(symbol: string): FundamentalData {
  const isCryptoSymbol = isCrypto(symbol);
  
  if (isCryptoSymbol) {
    return {
      marketCap: 100000000000 + Math.random() * 500000000000,
      peRatio: 0,
      pbRatio: 0,
      psRatio: 0,
      pegRatio: 0,
      eps: 0,
      epsGrowth: 0,
      dividendYield: 0,
      beta: 1.5 + Math.random() * 1,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      avgVolume: 1000000000 + Math.random() * 5000000000,
      debtToEquity: 0,
      roe: 0,
      revenueGrowth: 0,
      profitMargin: 0,
      evToEbitda: 0,
      dcf: {
        source: 'analyst',
        bull: 0,
        base: 0,
        bear: 0,
      },
    };
  }
  
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
      source: 'analyst',
      bull: baseDcf * 1.2,
      base: baseDcf,
      bear: baseDcf * 0.8,
    },
  };
}
