import { NextRequest, NextResponse } from "next/server";
import { StockService } from "@/features/stock/services/stockService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol")?.toUpperCase() || "AAPL";
  const type = searchParams.get("type") || "quote";

  console.log(`API Request: symbol=${symbol}, type=${type}`);

  try {
    switch (type) {
      case "quote": {
        const quote = await StockService.fetchExpectedQuote(symbol);
        if (quote) {
          return NextResponse.json(quote);
        }
        console.log("Using simulated quote data");
        return NextResponse.json(StockService.generateSimulatedQuote(symbol));
      }

      case "historical": {
        const historical = await StockService.fetchHistorical(symbol);
        if (historical.length > 0) {
          return NextResponse.json(historical);
        }
        console.log("Using simulated historical data");
        return NextResponse.json(StockService.generateSimulatedHistorical(symbol));
      }

      case "fundamental": {
        const fundamentals = await StockService.fetchFundamentals(symbol);
        return NextResponse.json(fundamentals);
      }

      case "news": {
        const news = await StockService.fetchNews(symbol);
        return NextResponse.json(news);
      }

      case "aggregated": {
        const [quote, historical, fundamentals, news] = await Promise.all([
          StockService.fetchExpectedQuote(symbol),
          StockService.fetchHistorical(symbol),
          StockService.fetchFundamentals(symbol),
          StockService.fetchNews(symbol)
        ]);
        
        return NextResponse.json({
          symbol,
          quote: quote || StockService.generateSimulatedQuote(symbol),
          historicalData: historical.length > 0 ? historical : StockService.generateSimulatedHistorical(symbol),
          fundamentalData: fundamentals || StockService.generateSimulatedFundamentals(symbol),
          news: news || []
        });
      }

      case "search": {
        const query = searchParams.get("query");
        if (!query) return NextResponse.json([]);
        const results = await StockService.searchSymbols(query);
        return NextResponse.json(results);
      }

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);

    // Return simulated data on error
    switch (type) {
      case "quote":
        return NextResponse.json(StockService.generateSimulatedQuote(symbol));
      case "historical":
        return NextResponse.json(StockService.generateSimulatedHistorical(symbol));
      case "fundamental":
        return NextResponse.json(StockService.generateSimulatedFundamentals(symbol));
      case "aggregated":
        return NextResponse.json({
            symbol,
            quote: StockService.generateSimulatedQuote(symbol),
            historicalData: StockService.generateSimulatedHistorical(symbol),
            fundamentalData: StockService.generateSimulatedFundamentals(symbol),
            news: []
        });
      case "news":
        return NextResponse.json([]); // Return empty array for news error
      case "search":
        return NextResponse.json([]);
      default:
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
}
