"use client";

import { useEffect, useState, useCallback } from "react";
import StockSearch from "@/components/StockSearch";
import PriceTicker from "@/components/PriceTicker";
import StockChart from "@/components/StockChart";
import TechnicalAnalysis from "@/components/TechnicalAnalysis";
import FundamentalAnalysis from "@/components/FundamentalAnalysis";
import PredictionDisplay from "@/components/PredictionDisplay";
import ElliottWaveDisplay from "@/components/ElliottWaveDisplay";
import CandlestickPatternsDisplay from "@/components/CandlestickPatternsDisplay";
import CompareView from "@/components/CompareView";
import {
  Card,
  Button,
  ButtonGroup,
  ToggleButton,
  MetricBox,
  ScoreBar,
} from "@/components/ui";
import {
  RefreshCw,
  TrendingUp,
  BarChart3,
  Brain,
  Play,
  Pause,
  Clock,
  LayoutGrid,
  GitCompare,
  X,
  Plus,
  LogOut,
  Lock,
} from "lucide-react";
import { formatNumber } from "@/lib/formatters";
import { useAuth, useStock, useUI, useAutoRefresh } from "@/hooks";
import type { ActiveTab } from "@/store";

export default function Home() {
  // Custom hooks
  const auth = useAuth();
  const stock = useStock();
  const ui = useUI();

  // Local state for login form
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Auto refresh setup
  const handleRefresh = useCallback(() => {
    stock.refresh();
  }, [stock]);

  useAutoRefresh({
    symbol: stock.symbol,
    onRefresh: handleRefresh,
    interval: 10000,
  });

  // Initial stock load
  useEffect(() => {
    if (auth.isAuthenticated && !stock.primaryStock) {
      stock.load("AAPL");
    }
  }, [auth.isAuthenticated, stock.primaryStock, stock]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    
    const success = await auth.login(password);
    setIsLoggingIn(false);
    
    if (!success) {
      setLoginError(auth.error || "Invalid password");
    } else {
      setPassword("");
    }
  };

  const handleSymbolChange = (symbol: string) => {
    if (ui.isCompareMode) {
      stock.addComparison(symbol);
    } else {
      stock.load(symbol);
    }
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "technical", label: "Technical" },
    { id: "fundamental", label: "Fundamental" },
    { id: "prediction", label: "Prediction" },
  ];

  // Loading state
  if (auth.isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Stock Predictor AI
              </h1>
              <p className="text-gray-400 text-sm">Enter password to access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                    autoFocus
                    disabled={isLoggingIn}
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "Authenticating..." : "Access Application"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">🔒 Protected access only</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const predictionDirection = stock.primaryStock?.prediction?.direction || "NEUTRAL";

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stock Predictor AI
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <ButtonGroup>
                <ToggleButton
                  active={ui.viewMode === "single"}
                  onClick={() => ui.setViewMode("single")}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Single
                </ToggleButton>
                <ToggleButton
                  active={ui.viewMode === "compare"}
                  onClick={() => ui.setViewMode("compare")}
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </ToggleButton>
              </ButtonGroup>

              {/* Search */}
              <div className="w-56">
                <StockSearch
                  onSelectStock={handleSymbolChange}
                  currentSymbol={stock.symbol}
                />
              </div>

              {/* Refresh Controls */}
              <Button
                onClick={stock.refresh}
                disabled={stock.isLoading}
                variant="ghost"
              >
                <RefreshCw
                  className={`w-4 h-4 ${stock.isLoading ? "animate-spin" : ""}`}
                />
              </Button>

              <Button
                onClick={ui.toggleAutoRefresh}
                variant={ui.autoRefreshEnabled ? "success" : "ghost"}
              >
                {ui.autoRefreshEnabled ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              {/* Logout Button */}
              <Button onClick={auth.logout} variant="ghost" title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Compare Mode: Stock Pills */}
      {ui.isCompareMode && (
        <div className="border-b border-gray-800/50 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Comparing:</span>

              {/* Primary Stock */}
              <StockPill
                symbol={stock.symbol}
                change={stock.primaryStock?.quote?.changePercent}
                color="blue"
              />

              {/* Compare Stocks */}
              {stock.compareStocks.map((s, index) => (
                <StockPill
                  key={s.symbol}
                  symbol={s.symbol}
                  change={s.quote?.changePercent}
                  color={index === 0 ? "purple" : "orange"}
                  onRemove={() => stock.removeCompare(s.symbol)}
                />
              ))}

              {stock.canAddMoreComparisons && (
                <button className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-600 rounded-full text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors">
                  <Plus className="w-3 h-3" />
                  <span className="text-sm">Add Stock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="border-b border-gray-800/30 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-blue-400" />
                <span className="text-gray-400">Symbol:</span>
                <span className="text-white font-bold">{stock.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-purple-400" />
                <span className="text-gray-400">Signal:</span>
                <span
                  className={`font-semibold ${
                    predictionDirection === "BULLISH"
                      ? "text-green-400"
                      : predictionDirection === "BEARISH"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {stock.isLoading ? "..." : predictionDirection}
                </span>
              </div>
              {ui.lastRefreshFormatted && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-3 h-3" />
                  {ui.lastRefreshFormatted}
                </div>
              )}
            </div>
            {ui.autoRefreshEnabled && (
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Auto-refresh ON
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {ui.isCompareMode ? (
          <CompareView
            primaryStock={stock.primaryStock || { symbol: "", isLoading: false, error: null, quote: null, historicalData: [], fundamentalData: null, technicalIndicators: null, prediction: null }}
            compareStocks={stock.compareStocks}
          />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-800/30 p-1 rounded-xl w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => ui.setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    ui.activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {ui.activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <PriceTicker
                    quote={stock.primaryStock?.quote || null}
                    isLoading={stock.isLoading}
                  />
                  <StockChart
                    data={stock.primaryStock?.historicalData || []}
                    indicators={stock.primaryStock?.technicalIndicators || null}
                    currentPrice={stock.currentPrice}
                    symbol={stock.symbol}
                    isLoading={stock.isLoading}
                  />
                </div>
                <div className="space-y-4">
                  <QuickStats
                    quote={stock.primaryStock?.quote || null}
                    fundamentals={stock.primaryStock?.fundamentalData || null}
                    prediction={stock.primaryStock?.prediction || null}
                  />
                </div>
              </div>
            )}

            {ui.activeTab === "technical" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TechnicalAnalysis
                    indicators={stock.primaryStock?.technicalIndicators || null}
                    currentPrice={stock.currentPrice}
                  />
                  <ElliottWaveDisplay
                    elliottWave={stock.primaryStock?.technicalIndicators?.elliottWave}
                    currentPrice={stock.currentPrice}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <CandlestickPatternsDisplay
                    analysis={stock.primaryStock?.technicalIndicators?.candlestickAnalysis}
                  />
                </div>
              </div>
            )}

            {ui.activeTab === "fundamental" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FundamentalAnalysis
                  data={stock.primaryStock?.fundamentalData || null}
                  currentPrice={stock.currentPrice}
                  symbol={stock.symbol}
                />
                <KeyMetrics fundamentals={stock.primaryStock?.fundamentalData || null} />
              </div>
            )}

            {ui.activeTab === "prediction" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PredictionDisplay
                  prediction={stock.primaryStock?.prediction || null}
                  currentPrice={stock.currentPrice}
                />
                <SignalsSummary
                  signals={stock.primaryStock?.prediction?.signals || []}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/30 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-500 text-xs">
            ⚠️ For educational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Stock Pill Component
function StockPill({
  symbol,
  change,
  color,
  onRemove,
}: {
  symbol: string;
  change?: number;
  color: "blue" | "purple" | "orange";
  onRemove?: () => void;
}) {
  const colorStyles = {
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorStyles[color]}`}
    >
      <span className="font-bold">{symbol}</span>
      {change !== undefined && (
        <span className={change >= 0 ? "text-green-400" : "text-red-400"}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      )}
      {onRemove && (
        <button onClick={onRemove} className="text-gray-400 hover:text-white">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Quick Stats Component
function QuickStats({
  quote,
  fundamentals,
  prediction,
}: {
  quote: any;
  fundamentals: any;
  prediction: any;
}) {
  if (!quote) return null;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Stats</h3>
      <div className="space-y-3">
        {prediction && (
          <div
            className={`p-3 rounded-lg ${
              prediction.direction === "BULLISH"
                ? "bg-green-500/10 border border-green-500/20"
                : prediction.direction === "BEARISH"
                  ? "bg-red-500/10 border border-red-500/20"
                  : "bg-yellow-500/10 border border-yellow-500/20"
            }`}
          >
            <div className="text-xs text-gray-400 mb-1">AI Prediction</div>
            <div
              className={`text-lg font-bold ${
                prediction.direction === "BULLISH"
                  ? "text-green-400"
                  : prediction.direction === "BEARISH"
                    ? "text-red-400"
                    : "text-yellow-400"
              }`}
            >
              {prediction.direction}
            </div>
            <div className="text-xs text-gray-400">
              {prediction.confidence.toFixed(0)}% confidence
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {fundamentals?.marketCap > 0 && (
            <MetricBox
              label="Market Cap"
              value={fundamentals.marketCap}
              format={(v) => `$${formatNumber(v as number)}`}
            />
          )}
          {fundamentals?.peRatio > 0 && (
            <MetricBox
              label="P/E Ratio"
              value={fundamentals.peRatio}
              format={(v) => (v as number).toFixed(1)}
            />
          )}
          {fundamentals?.pegRatio > 0 && (
            <MetricBox
              label="PEG Ratio"
              value={fundamentals.pegRatio}
              format={(v) => (v as number).toFixed(2)}
              colorize
              thresholds={{ good: 1, bad: 2, inverse: true }}
            />
          )}
          {prediction?.targetPrice && (
            <MetricBox
              label="Target"
              value={prediction.targetPrice}
              format={(v) => `$${(v as number).toFixed(2)}`}
            />
          )}
        </div>

        <div className="pt-2 border-t border-gray-800/50 space-y-2">
          <ScoreBar
            label="Technical Score"
            score={prediction?.technicalScore || 50}
          />
          <ScoreBar
            label="Fundamental Score"
            score={prediction?.fundamentalScore || 50}
          />
        </div>
      </div>
    </Card>
  );
}

// Key Metrics Component
function KeyMetrics({ fundamentals }: { fundamentals: any }) {
  if (!fundamentals) return null;

  const metrics = [
    {
      label: "ROE",
      value: fundamentals.roe,
      suffix: "%",
      thresholds: { good: 15, bad: 5 },
    },
    {
      label: "Profit Margin",
      value: fundamentals.profitMargin,
      suffix: "%",
      thresholds: { good: 15, bad: 5 },
    },
    {
      label: "Revenue Growth",
      value: fundamentals.revenueGrowth,
      suffix: "%",
      thresholds: { good: 10, bad: 0 },
    },
    {
      label: "Debt/Equity",
      value: fundamentals.debtToEquity,
      thresholds: { good: 0.5, bad: 2, inverse: true },
    },
    { label: "Beta", value: fundamentals.beta },
    { label: "Dividend Yield", value: fundamentals.dividendYield, suffix: "%" },
  ];

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Key Metrics</h3>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-400">{m.label}</span>
            <span
              className={`text-sm font-bold ${
                m.thresholds
                  ? m.thresholds.inverse
                    ? m.value < m.thresholds.good
                      ? "text-green-400"
                      : m.value > m.thresholds.bad
                        ? "text-red-400"
                        : "text-white"
                    : m.value > m.thresholds.good
                      ? "text-green-400"
                      : m.value < m.thresholds.bad
                        ? "text-red-400"
                        : "text-white"
                  : "text-white"
              }`}
            >
              {m.value?.toFixed(2) || "N/A"}
              {m.suffix || ""}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Signals Summary Component
function SignalsSummary({
  signals,
}: {
  signals: Array<{
    name: string;
    type: string;
    strength: number;
    description: string;
  }>;
}) {
  const bullish = signals.filter((s) => s.type === "bullish");
  const bearish = signals.filter((s) => s.type === "bearish");

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Signals Summary
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">
            {bullish.length}
          </div>
          <div className="text-xs text-green-400/70">Bullish Signals</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
          <div className="text-2xl font-bold text-red-400">
            {bearish.length}
          </div>
          <div className="text-xs text-red-400/70">Bearish Signals</div>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {signals.slice(0, 10).map((signal, i) => (
          <div
            key={i}
            className={`text-xs p-2 rounded ${
              signal.type === "bullish"
                ? "bg-green-500/10 text-green-400"
                : signal.type === "bearish"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-500/10 text-gray-400"
            }`}
          >
            <div className="font-medium">{signal.name}</div>
            <div className="opacity-70 text-[10px]">{signal.description}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
