'use client';

import { FundamentalData } from '@/types/stock';
import { formatNumber, getPEGInterpretation } from '@/utils/fundamentalAnalysis';
import { Building2, TrendingUp, TrendingDown, Bitcoin, Zap } from 'lucide-react';

interface FundamentalAnalysisProps {
  data: FundamentalData | null;
  currentPrice: number;
  symbol?: string;
}

function isCrypto(symbol: string): boolean {
  return symbol?.includes('-USD') || symbol?.includes('-EUR') || symbol?.includes('-GBP') || false;
}

export default function FundamentalAnalysis({ data, currentPrice, symbol = '' }: FundamentalAnalysisProps) {
  const isCryptoAsset = isCrypto(symbol);
  
  if (!data) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Fundamental Analysis</h3>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const fiftyTwoWeekPosition = data.fiftyTwoWeekHigh > data.fiftyTwoWeekLow 
    ? ((currentPrice - data.fiftyTwoWeekLow) / (data.fiftyTwoWeekHigh - data.fiftyTwoWeekLow)) * 100
    : 50;

  const pegInterpretation = getPEGInterpretation(data.pegRatio || 0);

  // Crypto view
  if (isCryptoAsset) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Bitcoin className="w-4 h-4 text-orange-400" />
          Crypto Metrics
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="text-[10px] text-gray-500">Market Cap</div>
              <div className="text-lg font-bold text-white">${formatNumber(data.marketCap)}</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="text-[10px] text-gray-500">Beta</div>
              <div className={`text-lg font-bold ${data.beta > 1.5 ? 'text-red-400' : 'text-white'}`}>
                {data.beta.toFixed(2)}
              </div>
            </div>
          </div>

          {data.fiftyTwoWeekHigh > 0 && (
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-400 mb-2">52-Week Range</div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400">${formatNumber(data.fiftyTwoWeekLow)}</span>
                <span className="text-green-400">${formatNumber(data.fiftyTwoWeekHigh)}</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
                <div className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full" />
                <div className="absolute h-3 w-0.5 bg-white -top-0.5 rounded" style={{ left: `${Math.min(100, Math.max(0, fiftyTwoWeekPosition))}%` }} />
              </div>
            </div>
          )}

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
            <p className="text-[10px] text-orange-400">
              Traditional metrics (P/E, PEG) don't apply to crypto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Stock view
  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-purple-400" />
        Fundamental Analysis
      </h3>
      
      <div className="space-y-3">
        {/* Market Cap */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Market Cap</span>
            <span className="text-lg font-bold text-white">${formatNumber(data.marketCap)}</span>
          </div>
        </div>

        {/* PEG Ratio - Featured */}
        <div className={`rounded-lg p-3 border ${
          data.pegRatio > 0 && data.pegRatio < 1 ? 'bg-green-500/10 border-green-500/30' :
          data.pegRatio > 2 ? 'bg-red-500/10 border-red-500/30' :
          'bg-gray-800/30 border-gray-700'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-300">PEG Ratio</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${pegInterpretation.color}`}>
              {data.pegRatio > 0 ? data.pegRatio.toFixed(2) : 'N/A'}
            </span>
            <span className={`text-xs ${pegInterpretation.color}`}>{pegInterpretation.label}</span>
          </div>
          {data.pegRatio > 0 && (
            <div className="text-[10px] text-gray-500 mt-1">
              P/E ({data.peRatio.toFixed(1)}) ÷ Growth ({data.epsGrowth?.toFixed(1)}%)
            </div>
          )}
        </div>

        {/* Valuation Grid */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox label="P/E Ratio" value={data.peRatio} format={(v) => v > 0 ? v.toFixed(1) : 'N/A'} 
            good={15} bad={35} inverse />
          <MetricBox label="P/B Ratio" value={data.pbRatio} format={(v) => v > 0 ? v.toFixed(2) : 'N/A'} 
            good={1} bad={5} inverse />
          <MetricBox label="EPS" value={data.eps} format={(v) => `$${v?.toFixed(2) || 'N/A'}`} />
          <MetricBox label="EPS Growth" value={data.epsGrowth} format={(v) => v !== undefined ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : 'N/A'} 
            good={10} bad={0} />
        </div>

        {/* Profitability */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox label="ROE" value={data.roe} format={(v) => `${v.toFixed(1)}%`} good={15} bad={5} />
          <MetricBox label="Profit Margin" value={data.profitMargin} format={(v) => `${v.toFixed(1)}%`} good={15} bad={5} />
        </div>

        {/* Growth & Health */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox label="Revenue Growth" value={data.revenueGrowth} 
            format={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`} good={10} bad={0} />
          <MetricBox label="Debt/Equity" value={data.debtToEquity} format={(v) => v.toFixed(2)} 
            good={0.5} bad={2} inverse />
        </div>

        {/* Other */}
        <div className="grid grid-cols-3 gap-2">
          <MetricBox label="Beta" value={data.beta} format={(v) => v.toFixed(2)} small />
          <MetricBox label="Div Yield" value={data.dividendYield} format={(v) => `${v.toFixed(2)}%`} small />
          <MetricBox label="Avg Vol" value={data.avgVolume} format={(v) => formatNumber(v)} small />
        </div>

        {/* 52-Week Range */}
        {data.fiftyTwoWeekHigh > 0 && (
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-400 mb-2">52-Week Range</div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-400">${data.fiftyTwoWeekLow.toFixed(2)}</span>
              <span className="text-green-400">${data.fiftyTwoWeekHigh.toFixed(2)}</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
              <div className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full" />
              <div className="absolute h-3 w-0.5 bg-white -top-0.5 rounded" style={{ left: `${Math.min(100, Math.max(0, fiftyTwoWeekPosition))}%` }} />
            </div>
            <div className="text-center text-[10px] text-gray-500 mt-1">
              Current: ${currentPrice.toFixed(2)} ({fiftyTwoWeekPosition.toFixed(0)}%)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Metric Box Component
function MetricBox({ 
  label, 
  value, 
  format, 
  good, 
  bad, 
  inverse = false,
  small = false
}: { 
  label: string; 
  value: number | undefined; 
  format: (v: number) => string;
  good?: number;
  bad?: number;
  inverse?: boolean;
  small?: boolean;
}) {
  const getColor = () => {
    if (value === undefined || value === 0) return 'text-white';
    if (good !== undefined && bad !== undefined) {
      const isGood = inverse ? value < good : value > good;
      const isBad = inverse ? value > bad : value < bad;
      if (isGood) return 'text-green-400';
      if (isBad) return 'text-red-400';
    }
    return 'text-white';
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-2">
      <div className="text-[10px] text-gray-500">{label}</div>
      <div className={`${small ? 'text-xs' : 'text-sm'} font-bold ${getColor()}`}>
        {value !== undefined ? format(value) : 'N/A'}
      </div>
    </div>
  );
}
