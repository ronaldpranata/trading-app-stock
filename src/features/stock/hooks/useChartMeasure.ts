'use client';

import { useState, useCallback } from 'react';

interface ClickPoint {
  date: string;
  price: number;
  index: number;
}

interface MeasurementResult {
  startPoint: ClickPoint;
  endPoint: ClickPoint;
  priceChange: number;
  percentChange: number;
  days: number;
  isGain: boolean;
}

export function useChartMeasure() {
  const [isActive, setIsActive] = useState(false);
  const [firstClick, setFirstClick] = useState<ClickPoint | null>(null);
  const [secondClick, setSecondClick] = useState<ClickPoint | null>(null);
  const [result, setResult] = useState<MeasurementResult | null>(null);

  const handleClick = useCallback((point: ClickPoint) => {
    if (!isActive) return;

    if (!firstClick) {
      setFirstClick(point);
      setSecondClick(null);
      setResult(null);
    } else if (!secondClick) {
      setSecondClick(point);

      // Calculate result - ensure start is before end
      const start = firstClick.index < point.index ? firstClick : point;
      const end = firstClick.index < point.index ? point : firstClick;

      const priceChange = end.price - start.price;
      const percentChange = (priceChange / start.price) * 100;
      const days = Math.abs(end.index - start.index);

      setResult({
        startPoint: start,
        endPoint: end,
        priceChange,
        percentChange,
        days,
        isGain: priceChange >= 0
      });
    } else {
      // Reset and start new measurement
      setFirstClick(point);
      setSecondClick(null);
      setResult(null);
    }
  }, [isActive, firstClick, secondClick]);

  const clear = useCallback(() => {
    setFirstClick(null);
    setSecondClick(null);
    setResult(null);
  }, []);

  const toggle = useCallback(() => {
    if (isActive) {
      clear();
    }
    setIsActive(prev => !prev);
  }, [isActive, clear]);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
    clear();
  }, [clear]);

  return {
    isActive,
    firstClick,
    secondClick,
    result,
    handleClick,
    clear,
    toggle,
    activate,
    deactivate
  };
}
