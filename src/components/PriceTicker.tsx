'use client';

import { StockQuote } from '@/types/stock';
import { TrendingUp, TrendingDown, Wifi, Database, Bitcoin } from 'lucide-react';

interface PriceTickerProps {
  quote: StockQuote | null;
  isLoading: boolean;
}

function isCrypto(symbol: string): boolean {
  return symbol.includes('-USD') || symbol.includes('-EUR') || symbol.includes('-GBP');
}

function formatPrice(price: number): string {
  if (price < 0.01) return price.toFixed(8);
  if (price < 1) return price.toFixed(4);
  if (price < 100) return price.toFixed(2);
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(volume: number, isCryptoAsset: boolean): string {
  if (isCryptoAsset) {
    if (volume >= 1e12) return (volume / 1e12).toFixed(1) + 'T';
    if (volume >= 1e9) return (volume / 1e9).toFixed(1) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
  }
  return (volume / 1000000).toFixed(1) + 'M';
}

export default function PriceTicker({ quote, isLoading }: PriceTickerProps) {
  if (isLoading || !quote) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-10 bg-gray-800 rounded w-24" />
          <div className="h-6 bg-gray-800 rounded w-32" />
        </div>
      </div>
    );
  }

  const isPositive = quote.change >= 0;
  const isCryptoAsset = isCrypto(quote.symbol);

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Symbol & Price */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isCryptoAsset ? (
              <Bitcoin className="w-5 h-5 text-orange-400" />
            ) : (
              <TrendingUp className="w-5 h-5 text-blue-400" />
            )}
            <span className="text-xl font-bold text-white">{quote.symbol}</span>
            {quote.simulated ? (
              <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Database className="w-3 h-3" />SIM
              </span>
            ) : (
              <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Wifi className="w-3 h-3" />LIVE
              </span>
            )}
          </div>
          
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white">${formatPrice(quote.price)}</span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{formatPrice(quote.change)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: OHLV */}
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-gray-500">O</span>
            <span className="text-white ml-1">${formatPrice(quote.open)}</span>
          </div>
          <div>
            <span className="text-gray-500">H</span>
            <span className="text-green-400 ml-1">${formatPrice(quote.high)}</span>
          </div>
          <div>
            <span className="text-gray-500">L</span>
            <span className="text-red-400 ml-1">${formatPrice(quote.low)}</span>
          </div>
          <div>
            <span className="text-gray-500">Vol</span>
            <span className="text-white ml-1">{quote.volume > 0 ? formatVolume(quote.volume, isCryptoAsset) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
