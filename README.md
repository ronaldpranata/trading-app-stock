# Stock Price Prediction App

A real-time stock price prediction web application built with Next.js that uses technical and fundamental analysis to predict stock price movements.

## Features

- 📈 **Real-time Price Updates** - Stock prices update every second
- 📊 **Technical Analysis** - RSI, MACD, Bollinger Bands, Moving Averages, Stochastic Oscillator, ATR
- 💼 **Fundamental Analysis** - P/E Ratio, P/B Ratio, ROE, Debt/Equity, Revenue Growth, Profit Margin
- 🤖 **AI Prediction Engine** - Combines technical and fundamental signals to predict price direction
- 🎯 **Target Price & Stop Loss** - Calculated based on ATR volatility
- 📉 **Interactive Charts** - 60-day price chart with technical indicators overlay

## Free Stock APIs Used

This app supports multiple free stock data APIs:

### 1. Finnhub (Recommended)
- **Free tier**: 60 API calls per minute
- **Features**: Real-time quotes, historical data, company fundamentals
- **Sign up**: https://finnhub.io/register

### 2. Alpha Vantage
- **Free tier**: 25 API calls per day
- **Features**: Real-time quotes, historical data, technical indicators
- **Sign up**: https://www.alphavantage.co/support/#api-key

### 3. Simulated Data (Default)
- No API key required
- Great for development and testing
- Realistic price movements and fundamentals

## Getting Started

### 1. Install Dependencies

```bash
cd app
npm install
```

### 2. Set Up API Keys (Optional)

Copy the environment example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
FINNHUB_API_KEY=your_finnhub_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
```

> **Note**: If no API keys are provided, the app will use simulated data which is perfect for development.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Indicators Explained

| Indicator | Description | Signal |
|-----------|-------------|--------|
| **RSI** | Relative Strength Index (14 periods) | <30 Oversold (Buy), >70 Overbought (Sell) |
| **MACD** | Moving Average Convergence Divergence | Histogram > 0 Bullish, < 0 Bearish |
| **SMA** | Simple Moving Average (20, 50, 200) | Price above = Bullish, below = Bearish |
| **Bollinger Bands** | Volatility bands (20 periods, 2 std dev) | Touch lower = Buy, touch upper = Sell |
| **Stochastic** | Momentum oscillator | <20 Oversold, >80 Overbought |
| **ATR** | Average True Range | Measures volatility for stop loss |

## Fundamental Metrics Explained

| Metric | Description | Good Value |
|--------|-------------|------------|
| **P/E Ratio** | Price to Earnings | <15 Undervalued, >30 Overvalued |
| **P/B Ratio** | Price to Book | <1 Below book value |
| **ROE** | Return on Equity | >20% Strong |
| **Debt/Equity** | Leverage ratio | <0.5 Conservative |
| **Revenue Growth** | Year-over-year growth | >20% Strong growth |
| **Profit Margin** | Net profit percentage | >20% High profitability |

## Prediction Algorithm

The prediction engine combines:
- **60% Technical Score** - Based on technical indicator signals
- **40% Fundamental Score** - Based on fundamental analysis

Signals are weighted by strength and type (bullish/bearish) to generate:
- Overall direction (BULLISH / BEARISH / NEUTRAL)
- Confidence percentage
- Target price (based on ATR)
- Stop loss level (based on ATR)



## Supported Stocks

The app supports any US stock symbol. Popular pre-configured stocks include:
- AAPL (Apple)
- GOOGL (Alphabet)
- MSFT (Microsoft)
- AMZN (Amazon)
- TSLA (Tesla)
- META (Meta)
- NVDA (NVIDIA)
- JPM (JPMorgan)
- V (Visa)
- WMT (Walmart)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: SCSS (7-1 Pattern), Material UI
- **Charts**: Recharts
- **Icons**: Lucide React

## Disclaimer

⚠️ **This application is for educational purposes only.** The predictions and analysis provided are not financial advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions.

## License

MIT
