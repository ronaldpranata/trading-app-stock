'use client';

import { TechnicalIndicators } from '@/types/stock';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';

interface TechnicalAnalysisProps {
  indicators: TechnicalIndicators | null;
  currentPrice: number;
}

export default function TechnicalAnalysis({ indicators, currentPrice }: TechnicalAnalysisProps) {
  if (!indicators) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Technical Analysis</h3>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const getRSIColor = (rsi: number) => {
    if (rsi < 30) return 'text-green-400';
    if (rsi > 70) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi < 30) return 'Oversold';
    if (rsi > 70) return 'Overbought';
    return 'Neutral';
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-400" />
        Technical Analysis
      </h3>
      
      <div className="space-y-4">
        {/* Yearly Performance */}
        {indicators.yearlyMetrics && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">1-Year Performance</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <div className="text-[10px] text-gray-500">Return</div>
                <div className={`text-sm font-bold ${indicators.yearlyMetrics.yearlyReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {indicators.yearlyMetrics.yearlyReturn >= 0 ? '+' : ''}{indicators.yearlyMetrics.yearlyReturn.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Volatility</div>
                <div className="text-sm font-bold text-white">{indicators.yearlyMetrics.volatility.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Sharpe</div>
                <div className={`text-sm font-bold ${indicators.yearlyMetrics.sharpeRatio > 1 ? 'text-green-400' : 'text-white'}`}>
                  {indicators.yearlyMetrics.sharpeRatio.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Max DD</div>
                <div className="text-sm font-bold text-red-400">-{indicators.yearlyMetrics.maxDrawdown.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Moving Averages */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-2">Moving Averages</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-gray-500">SMA20</div>
              <div className={`text-sm font-bold ${currentPrice > indicators.sma20 ? 'text-green-400' : 'text-red-400'}`}>
                ${indicators.sma20.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">SMA50</div>
              <div className={`text-sm font-bold ${currentPrice > indicators.sma50 ? 'text-green-400' : 'text-red-400'}`}>
                ${indicators.sma50.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">SMA200</div>
              <div className={`text-sm font-bold ${currentPrice > indicators.sma200 ? 'text-green-400' : 'text-red-400'}`}>
                ${indicators.sma200.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-[10px]">
            {indicators.sma50 > indicators.sma200 ? (
              <span className="text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Golden Cross Active
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> Death Cross Active
              </span>
            )}
          </div>
        </div>

        {/* RSI */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">RSI (14)</span>
            <span className={`text-xs px-2 py-0.5 rounded ${getRSIColor(indicators.rsi)} bg-gray-700/50`}>
              {getRSILabel(indicators.rsi)}
            </span>
          </div>
          <div className={`text-2xl font-bold ${getRSIColor(indicators.rsi)}`}>
            {indicators.rsi.toFixed(1)}
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                indicators.rsi < 30 ? 'bg-green-500' : 
                indicators.rsi > 70 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${indicators.rsi}%` }}
            />
          </div>
        </div>

        {/* MACD */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-2">MACD</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-gray-500">MACD</div>
              <div className="text-sm font-bold text-white">{indicators.macd.macdLine.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Signal</div>
              <div className="text-sm font-bold text-white">{indicators.macd.signalLine.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Histogram</div>
              <div className={`text-sm font-bold ${indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {indicators.macd.histogram.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Bollinger & Stochastic */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-400 mb-2">Bollinger Bands</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Upper</span>
                <span className="text-red-400">${indicators.bollingerBands.upper.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Middle</span>
                <span className="text-white">${indicators.bollingerBands.middle.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lower</span>
                <span className="text-green-400">${indicators.bollingerBands.lower.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-400 mb-2">Stochastic</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">%K</span>
                <span className={`${
                  indicators.stochastic.k < 20 ? 'text-green-400' : 
                  indicators.stochastic.k > 80 ? 'text-red-400' : 'text-white'
                }`}>{indicators.stochastic.k.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">%D</span>
                <span className="text-white">{indicators.stochastic.d.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ATR</span>
                <span className="text-white">${indicators.atr.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Indicators */}
        {(indicators.adx !== undefined || indicators.cci !== undefined) && (
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-400 mb-2">Extended Indicators</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {indicators.adx !== undefined && (
                <div>
                  <div className="text-[10px] text-gray-500">ADX</div>
                  <div className={`font-bold ${indicators.adx > 25 ? 'text-green-400' : 'text-gray-400'}`}>
                    {indicators.adx.toFixed(0)}
                  </div>
                </div>
              )}
              {indicators.williamsR !== undefined && (
                <div>
                  <div className="text-[10px] text-gray-500">W%R</div>
                  <div className={`font-bold ${
                    indicators.williamsR < -80 ? 'text-green-400' : 
                    indicators.williamsR > -20 ? 'text-red-400' : 'text-white'
                  }`}>{indicators.williamsR.toFixed(0)}</div>
                </div>
              )}
              {indicators.cci !== undefined && (
                <div>
                  <div className="text-[10px] text-gray-500">CCI</div>
                  <div className={`font-bold ${
                    indicators.cci < -100 ? 'text-green-400' : 
                    indicators.cci > 100 ? 'text-red-400' : 'text-white'
                  }`}>{indicators.cci.toFixed(0)}</div>
                </div>
              )}
              {indicators.roc !== undefined && (
                <div>
                  <div className="text-[10px] text-gray-500">ROC</div>
                  <div className={`font-bold ${indicators.roc > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {indicators.roc > 0 ? '+' : ''}{indicators.roc.toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
