export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(`/api/stock?type=search&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}
