import yahooFinance from "yahoo-finance2";

async function run() {
  try {
    const result = await yahooFinance.search("AAPL", { quotesCount: 5, newsCount: 0 });
    console.log("Quotes raw:", JSON.stringify(result.quotes, null, 2));
    
    const filtered = result.quotes
        .filter((q: any) => q.isYahooFinance)
        .map((q: any) => ({
          symbol: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          type: q.quoteType || "EQUITY",
          region: q.exchange || "US",
          currency: "USD",
        }));
    console.log("Quotes filtered:", JSON.stringify(filtered, null, 2));
  } catch (error) {
    console.error(error);
  }
}

run();
