'use client';

import { CandlestickAnalysis, CandlestickPattern } from '@/types/stock';
import { Card } from '@/components/ui';
import { CandlestickChart, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface CandlestickPatternsDisplayProps {
  analysis: CandlestickAnalysis | null | undefined;
}

export default function CandlestickPatternsDisplay({ analysis }: CandlestickPatternsDisplayProps) {
  if (!analysis) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CandlestickChart className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Candlestick Patterns</h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No candlestick data available</p>
        </div>
      </Card>
    );
  }

  const { patterns, overallBias, score, recentPatterns } = analysis;

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getBiasIcon = (bias: string) => {
    switch (bias) {
      case 'bullish': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'bearish': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getPatternColor = (direction: string) => {
    switch (direction) {
      case 'bullish': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'bearish': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    }
  };

  const getReliabilityLabel = (reliability: number) => {
    if (reliability >= 0.8) return 'Very High';
    if (reliability >= 0.65) return 'High';
    if (reliability >= 0.5) return 'Moderate';
    return 'Low';
  };

  const bullishPatterns = patterns.filter(p => p.direction === 'bullish');
  const bearishPatterns = patterns.filter(p => p.direction === 'bearish');
  const neutralPatterns = patterns.filter(p => p.direction === 'neutral');

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CandlestickChart className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Candlestick Patterns</h3>
        </div>
        <div className="flex items-center gap-2">
          {getBiasIcon(overallBias)}
          <span className={`font-semibold ${getBiasColor(overallBias)}`}>
            {overallBias.charAt(0).toUpperCase() + overallBias.slice(1)}
          </span>
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Pattern Score</span>
          <span className={`text-lg font-bold ${
            score >= 60 ? 'text-green-400' : score <= 40 ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {score.toFixed(0)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              score >= 60 ? 'bg-green-500' : score <= 40 ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Pattern Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-500/10 rounded-lg p-2 text-center border border-green-500/20">
          <div className="text-xl font-bold text-green-400">{bullishPatterns.length}</div>
          <div className="text-xs text-green-400/70">Bullish</div>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-2 text-center border border-yellow-500/20">
          <div className="text-xl font-bold text-yellow-400">{neutralPatterns.length}</div>
          <div className="text-xs text-yellow-400/70">Neutral</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-2 text-center border border-red-500/20">
          <div className="text-xl font-bold text-red-400">{bearishPatterns.length}</div>
          <div className="text-xs text-red-400/70">Bearish</div>
        </div>
      </div>

      {/* Recent Patterns */}
      {recentPatterns.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Recent Patterns (Last 5 Days)
          </h4>
          <div className="space-y-2">
            {recentPatterns.map((pattern, index) => (
              <PatternCard key={`recent-${index}`} pattern={pattern} />
            ))}
          </div>
        </div>
      )}

      {/* All Patterns */}
      {patterns.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            All Detected Patterns ({patterns.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...patterns]
              .sort((a, b) => b.reliability - a.reliability)
              .slice(0, 10)
              .map((pattern, index) => (
                <PatternCard key={`all-${index}`} pattern={pattern} compact />
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400">
          <p className="text-sm">No significant patterns detected</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-800/50">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Pattern Reliability</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Very High (80%+)</span>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">High (65-79%)</span>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Moderate (50-64%)</span>
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded">Low (&lt;50%)</span>
        </div>
      </div>
    </Card>
  );
}

// Pattern Card Component
function PatternCard({ pattern, compact = false }: { pattern: CandlestickPattern; compact?: boolean }) {
  const getPatternColor = (direction: string) => {
    switch (direction) {
      case 'bullish': return 'bg-green-500/10 border-green-500/30';
      case 'bearish': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-yellow-500/10 border-yellow-500/30';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.8) return 'text-green-400';
    if (reliability >= 0.65) return 'text-blue-400';
    if (reliability >= 0.5) return 'text-yellow-400';
    return 'text-gray-400';
  };

  if (compact) {
    return (
      <div className={`p-2 rounded-lg border ${getPatternColor(pattern.direction)}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getDirectionColor(pattern.direction)}`}>
            {pattern.name}
          </span>
          <span className={`text-xs ${getReliabilityColor(pattern.reliability)}`}>
            {(pattern.reliability * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${getPatternColor(pattern.direction)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`font-medium ${getDirectionColor(pattern.direction)}`}>
          {pattern.name}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${
            pattern.direction === 'bullish' ? 'bg-green-500/20 text-green-400' :
            pattern.direction === 'bearish' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {pattern.direction}
          </span>
          <span className={`text-xs font-medium ${getReliabilityColor(pattern.reliability)}`}>
            {(pattern.reliability * 100).toFixed(0)}% reliable
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400">{pattern.description}</p>
    </div>
  );
}
