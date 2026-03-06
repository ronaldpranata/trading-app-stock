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

## Deployment to Vercel

This repository is optimized for zero-configuration deployments on Vercel. 

1. **Connect your Git Repository** to Vercel.
2. Ensure the **Framework Preset** is set to `Next.js`.
3. Add your `FINNHUB_API_KEY` to the Vercel Environment Variables panel.
4. Click **Deploy**. Vercel will automatically build and serve the application on every git push.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
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
└── .env               # Environment Configs
```

## Tech Stack

- **Framework:** Next.js 
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Material UI (MUI) v5
- **Charts:** `@mui/x-charts`
- **Data APIs:** Yahoo Finance (`yahoo-finance2`), Finnhub API
- **Tooling:** Vitest, Biome/ESLint

## Disclaimer

⚠️ This application is for educational purposes only. It is not financial advice. Always do your own research before making investment decisions.
