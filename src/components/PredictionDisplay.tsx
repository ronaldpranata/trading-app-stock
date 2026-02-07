'use client';

import { PredictionResult, PredictionTimeframe } from '@/types/stock';
import { useState } from 'react';
import { Brain, Target, Shield, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
  currentPrice: number;
}

const TIMEFRAME_LABELS: Record<PredictionTimeframe, string> = {
  day: '1D',
  week: '1W',
  month: '1M',
  quarter: '3M',
  year: '1Y'
};

export default function PredictionDisplay({ prediction, currentPrice }: PredictionDisplayProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>('week');

  if (!prediction) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">AI Prediction</h3>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const selectedPrediction = prediction.timeframePredictions.find(p => p.timeframe === selectedTimeframe) 
    || prediction.timeframePredictions[0];

  const getDirectionIcon = (direction: string) => {
    if (direction === 'BULLISH') return <TrendingUp className="w-5 h-5" />;
    if (direction === 'BEARISH') return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getDirectionColor = (direction: string) => {
    if (direction === 'BULLISH') return 'text-green-400';
    if (direction === 'BEARISH') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getBgColor = (direction: string) => {
    if (direction === 'BULLISH') return 'bg-green-500/10 border-green-500/30';
    if (direction === 'BEARISH') return 'bg-red-500/10 border-red-500/30';
    return 'bg-yellow-500/10 border-yellow-500/30';
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        AI Prediction
      </h3>

      {/* Timeframe Selector */}
      <div className="flex gap-1 mb-4 bg-gray-800/30 p-1 rounded-lg">
        {prediction.timeframePredictions.map(tp => (
          <button
            key={tp.timeframe}
            onClick={() => setSelectedTimeframe(tp.timeframe)}
            className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
              selectedTimeframe === tp.timeframe
                ? `${getBgColor(tp.direction)} ${getDirectionColor(tp.direction)}`
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {TIMEFRAME_LABELS[tp.timeframe]}
          </button>
        ))}
      </div>

      {/* Main Prediction */}
      <div className={`rounded-lg p-4 border ${getBgColor(selectedPrediction.direction)} mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={getDirectionColor(selectedPrediction.direction)}>
              {getDirectionIcon(selectedPrediction.direction)}
            </div>
            <span className={`text-2xl font-bold ${getDirectionColor(selectedPrediction.direction)}`}>
              {selectedPrediction.direction}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Confidence</div>
            <div className={`text-xl font-bold ${getDirectionColor(selectedPrediction.direction)}`}>
              {selectedPrediction.confidence.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              selectedPrediction.direction === 'BULLISH' ? 'bg-green-500' :
              selectedPrediction.direction === 'BEARISH' ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${selectedPrediction.confidence}%` }}
          />
        </div>
      </div>

      {/* Price Targets */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <Target className="w-3 h-3" />
            Target Price
          </div>
          <div className="text-lg font-bold text-white">${selectedPrediction.targetPrice.toFixed(2)}</div>
          <div className={`text-xs ${selectedPrediction.expectedChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {selectedPrediction.expectedChangePercent >= 0 ? '+' : ''}{selectedPrediction.expectedChangePercent.toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
            <Shield className="w-3 h-3" />
            Stop Loss
          </div>
          <div className="text-lg font-bold text-white">${selectedPrediction.stopLoss.toFixed(2)}</div>
          <div className="text-xs text-gray-400">
            R/R: {selectedPrediction.riskRewardRatio.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ScoreBar label="Technical" score={prediction.technicalScore} />
        <ScoreBar label="Fundamental" score={prediction.fundamentalScore} />
      </div>

      {/* All Timeframes Overview */}
      <div className="bg-gray-800/30 rounded-lg p-3">
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <Clock className="w-3 h-3" />
          All Timeframes
        </div>
        <div className="grid grid-cols-5 gap-1">
          {prediction.timeframePredictions.map(tp => (
            <div key={tp.timeframe} className="text-center">
              <div className="text-[10px] text-gray-500">{TIMEFRAME_LABELS[tp.timeframe]}</div>
              <div className={`text-xs font-bold ${getDirectionColor(tp.direction)}`}>
                {tp.direction === 'BULLISH' ? '↑' : tp.direction === 'BEARISH' ? '↓' : '→'}
              </div>
              <div className={`text-[10px] ${tp.expectedChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tp.expectedChangePercent >= 0 ? '+' : ''}{tp.expectedChangePercent.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      {prediction.recommendation && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-xs text-blue-400 font-medium mb-1">AI Recommendation</div>
          <p className="text-xs text-gray-300 leading-relaxed">{prediction.recommendation}</p>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getColor = () => {
    if (score >= 60) return 'bg-green-500';
    if (score <= 40) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getTextColor = () => {
    if (score >= 60) return 'text-green-400';
    if (score <= 40) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-400">{label}</span>
        <span className={`text-xs font-bold ${getTextColor()}`}>{score.toFixed(0)}</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
