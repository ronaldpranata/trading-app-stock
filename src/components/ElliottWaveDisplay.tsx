'use client';

import { ElliottWaveAnalysis } from '@/types/stock';
import { Waves, Target, AlertTriangle } from 'lucide-react';

interface ElliottWaveDisplayProps {
  elliottWave: ElliottWaveAnalysis | undefined;
  currentPrice: number;
}

export default function ElliottWaveDisplay({ elliottWave, currentPrice }: ElliottWaveDisplayProps) {
  if (!elliottWave) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          Elliott Wave
        </h3>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const waveColors: Record<number, string> = {
    1: 'text-blue-400',
    2: 'text-purple-400',
    3: 'text-green-400',
    4: 'text-yellow-400',
    5: 'text-red-400'
  };

  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Waves className="w-4 h-4 text-cyan-400" />
        Elliott Wave Analysis
      </h3>

      {/* Current Wave Status */}
      <div className={`rounded-lg p-3 mb-3 border ${
        elliottWave.trendDirection === 'up' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs text-gray-400">Current Wave</span>
            <div className={`text-2xl font-bold ${waveColors[elliottWave.currentWave] || 'text-white'}`}>
              Wave {elliottWave.currentWave}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">Trend</span>
            <div className={`text-lg font-bold ${elliottWave.trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {elliottWave.trendDirection === 'up' ? '↑ UP' : '↓ DOWN'}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Progress</span>
            <span>{(elliottWave.waveProgress * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${elliottWave.trendDirection === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${elliottWave.waveProgress * 100}%` }}
            />
          </div>
        </div>

        <div className="text-[10px] text-gray-400">
          {elliottWave.waveType === 'impulse' ? 'Impulse' : 'Corrective'} • {elliottWave.wavePhase} phase
        </div>
      </div>

      {/* Wave Pattern Visual */}
      <div className="bg-gray-800/30 rounded-lg p-3 mb-3">
        <div className="text-xs text-gray-400 mb-2">Wave Pattern</div>
        <div className="flex items-end justify-between h-12 px-2">
          {[1, 2, 3, 4, 5].map(wave => {
            const heights = { 1: 40, 2: 25, 3: 100, 4: 60, 5: 80 };
            const isActive = wave === elliottWave.currentWave;
            return (
              <div key={wave} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-4 rounded-t transition-all ${
                    isActive ? 'bg-cyan-400' : wave < elliottWave.currentWave ? 'bg-gray-500' : 'bg-gray-700'
                  }`}
                  style={{ height: `${heights[wave as keyof typeof heights] * 0.4}px` }}
                />
                <span className={`text-[10px] ${isActive ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>
                  {wave}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-800/30 rounded-lg p-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
            <Target className="w-3 h-3 text-green-400" />
            Wave Target
          </div>
          <div className="text-sm font-bold text-green-400">
            ${elliottWave.nextWaveTarget.toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-500">
            {((elliottWave.nextWaveTarget - currentPrice) / currentPrice * 100).toFixed(1)}% from current
          </div>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Invalidation
          </div>
          <div className="text-sm font-bold text-red-400">
            ${elliottWave.invalidationLevel.toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-500">
            {((elliottWave.invalidationLevel - currentPrice) / currentPrice * 100).toFixed(1)}% from current
          </div>
        </div>
      </div>

      {/* Fibonacci Levels */}
      {elliottWave.fibonacciLevels.length > 0 && (
        <div className="bg-gray-800/30 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-2">Key Fibonacci Levels</div>
          <div className="space-y-1">
            {elliottWave.fibonacciLevels.slice(0, 4).map((fib, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-gray-500">{fib.label}</span>
                <span className={`font-medium ${
                  fib.type === 'retracement' ? 'text-yellow-400' : 'text-cyan-400'
                }`}>
                  ${fib.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-gray-400">Analysis Confidence</span>
        <span className={`font-bold ${
          elliottWave.confidence > 70 ? 'text-green-400' : 
          elliottWave.confidence > 50 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {elliottWave.confidence.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}
