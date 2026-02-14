
export const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "demo";
export const FINNHUB_PROFILE_API = "https://finnhub.io/api/v1/stock/profile2";
export const FINNHUB_METRICS_API = "https://finnhub.io/api/v1/stock/metric";

export const INDUSTRY_DISCOUNT_RATES = {
  Technology: { discount: 0.095 },
  Healthcare: { discount: 0.085 },
  "Financial Services": { discount: 0.075 },
  Industrials: { discount: 0.08 },
  "Consumer Cyclical": { discount: 0.09 },
  "Consumer Defensive": { discount: 0.07 },
  Utilities: { discount: 0.065 },
  Energy: { discount: 0.09 },
  "Basic Materials": { discount: 0.085 },
  "Real Estate": { discount: 0.078 },
  "Communication Services": { discount: 0.092 },
  Default: { discount: 0.085 },
};

export const PERPETUAL_GROWTH_RATE = 0.025;
