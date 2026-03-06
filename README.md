# Stock Predictor AI - Trading App

A Next.js web application for stock price prediction using technical and fundamental analysis.

## Features

- 📈 **Real-time Engine**: Live stock quotes aggregated from Yahoo Finance & Finnhub.
- 📊 **Advanced Technicals**: Wilder's Smoothing for ATR, RSI Divergence, MACD, Bollinger Bands, and Elliott Wave parsing.
- 💰 **Deep Fundamentals**: EV/EBITDA valuation, PEG/DCF divergence penalties, and conditional P/E tracking.
- 🧠 **Sentiment Analysis**: Keyword detection powered by Volumetric Score Density multipliers.
- 🤖 **Quant Prediction Model**: ADX-Weighted regime detection, Historical Risk/Reward Sharpe adjustments, and Support/Resistance (S/R) Target Snapping.
- 📉 **Terminal-Grade Charting**: Interactive zero-interpolation point-scale charting via `@mui/x-charts` with 1D/1W micro-intervals.
- 🖥 **Professional UI**: High-density layouts, persistent global ticker anchors, and compact grid spacing designed for rapid quantitative analysis.
- 🔒 **Security**: API Rate Limiting (100 req/min) and strict HTTP security headers.

## Deployment to GitHub Pages

### Option 1: Manual Deployment

1. **Build the app:**
   ```bash
   cd app
   npm ci
   npm run build
   ```

2. **Copy to your stock-analyzer repo:**
   ```bash
   # Create trading-app folder in your stock-analyzer repo
   mkdir -p /path/to/stock-analyzer/trading-app
   
   # Copy the built files
   cp -r out/* /path/to/stock-analyzer/trading-app/
   ```

3. **Commit and push:**
   ```bash
   cd /path/to/stock-analyzer
   git add .
   git commit -m "Deploy trading app"
   git push
   ```

4. **Access your app:**
   ```
   https://ronaldpranata.github.io/stock-analyzer/trading-app/
   ```

### Option 2: Using the Deploy Script

```bash
./deploy.sh
```

Then follow the instructions printed by the script.

## Development

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   │   ├── ui/        # Reusable UI components
│   │   └── charts/    # Chart-related components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and constants
│   ├── types/         # TypeScript types
│   └── utils/         # Analysis utilities
├── public/            # Static assets
└── out/               # Built static files
```

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Material UI (MUI) v5
- **Charts:** `@mui/x-charts`
- **Data APIs:** Yahoo Finance (`yahoo-finance2`), Finnhub API
- **Tooling:** Vitest, Biome/ESLint

## Disclaimer

⚠️ This application is for educational purposes only. It is not financial advice. Always do your own research before making investment decisions.
