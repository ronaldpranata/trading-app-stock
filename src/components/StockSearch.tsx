'use client';

import { useState } from 'react';
import { Search, Star, Bitcoin, TrendingUp } from 'lucide-react';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  currentSymbol: string;
}

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
  { symbol: 'META', name: 'Meta Platforms', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock' },
  { symbol: 'JPM', name: 'JPMorgan Chase', type: 'stock' },
  { symbol: 'V', name: 'Visa Inc.', type: 'stock' },
  { symbol: 'WMT', name: 'Walmart Inc.', type: 'stock' }
];

const popularCrypto = [
  { symbol: 'BTC-USD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH-USD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'BNB-USD', name: 'Binance Coin', type: 'crypto' },
  { symbol: 'XRP-USD', name: 'Ripple', type: 'crypto' },
  { symbol: 'SOL-USD', name: 'Solana', type: 'crypto' },
  { symbol: 'ADA-USD', name: 'Cardano', type: 'crypto' },
  { symbol: 'DOGE-USD', name: 'Dogecoin', type: 'crypto' },
  { symbol: 'DOT-USD', name: 'Polkadot', type: 'crypto' },
  { symbol: 'MATIC-USD', name: 'Polygon', type: 'crypto' },
  { symbol: 'LINK-USD', name: 'Chainlink', type: 'crypto' }
];

export default function StockSearch({ onSelectStock, currentSymbol }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto'>('stocks');

  const allItems = activeTab === 'stocks' ? popularStocks : popularCrypto;
  
  const filteredItems = allItems.filter(
    item => 
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Auto-detect if it's a crypto search
      const term = searchTerm.toUpperCase().trim();
      let finalSymbol = term;
      
      // If searching for common crypto names, convert to Yahoo Finance format
      const cryptoMap: Record<string, string> = {
        'BTC': 'BTC-USD',
        'BITCOIN': 'BTC-USD',
        'ETH': 'ETH-USD',
        'ETHEREUM': 'ETH-USD',
        'BNB': 'BNB-USD',
        'XRP': 'XRP-USD',
        'RIPPLE': 'XRP-USD',
        'SOL': 'SOL-USD',
        'SOLANA': 'SOL-USD',
        'ADA': 'ADA-USD',
        'CARDANO': 'ADA-USD',
        'DOGE': 'DOGE-USD',
        'DOGECOIN': 'DOGE-USD',
        'DOT': 'DOT-USD',
        'POLKADOT': 'DOT-USD',
        'MATIC': 'MATIC-USD',
        'POLYGON': 'MATIC-USD',
        'LINK': 'LINK-USD',
        'CHAINLINK': 'LINK-USD',
        'AVAX': 'AVAX-USD',
        'AVALANCHE': 'AVAX-USD',
        'SHIB': 'SHIB-USD',
        'UNI': 'UNI-USD',
        'UNISWAP': 'UNI-USD',
        'LTC': 'LTC-USD',
        'LITECOIN': 'LTC-USD',
        'ATOM': 'ATOM-USD',
        'COSMOS': 'ATOM-USD'
      };
      
      if (cryptoMap[term]) {
        finalSymbol = cryptoMap[term];
      }
      
      onSelectStock(finalSymbol);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const isCrypto = currentSymbol.includes('-USD') || currentSymbol.includes('-EUR');

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search stocks or crypto..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('stocks')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'stocks'
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Stocks
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'crypto'
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-400/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bitcoin className="w-4 h-4" />
              Crypto
            </button>
          </div>

          <div className="p-2 max-h-72 overflow-y-auto">
            <div className="text-xs text-gray-500 px-3 py-2 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Popular {activeTab === 'stocks' ? 'Stocks' : 'Cryptocurrencies'}
            </div>
            {filteredItems.map((item) => (
              <button
                key={item.symbol}
                onClick={() => handleSelect(item.symbol)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors ${
                  currentSymbol === item.symbol ? 'bg-blue-500/20 border border-blue-500/30' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.type === 'crypto' ? (
                    <Bitcoin className="w-4 h-4 text-orange-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span className="text-gray-400 text-sm">{item.name}</span>
                </div>
                {currentSymbol === item.symbol && (
                  <span className="text-xs text-blue-400">Selected</span>
                )}
              </button>
            ))}
            {searchTerm && !filteredItems.some(s => s.symbol === searchTerm.toUpperCase()) && (
              <button
                onClick={() => handleSelect(searchTerm.toUpperCase())}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-blue-400"
              >
                <Search className="w-4 h-4" />
                <span>Search for "{searchTerm.toUpperCase()}"</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
