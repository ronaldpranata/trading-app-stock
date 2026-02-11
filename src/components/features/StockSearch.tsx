'use client';

import { useState } from 'react';
import { Search, Star, Bitcoin, TrendingUp } from 'lucide-react';
import { 
  TextField, 
  InputAdornment, 
  Paper, 
  List, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  Box,
  Tabs,
  Tab,
  ClickAwayListener
} from '@mui/material';

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
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = stocks, 1 = crypto

  const allItems = activeTab === 0 ? popularStocks : popularCrypto;
  
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
      const term = searchTerm.toUpperCase().trim();
      let finalSymbol = term;
      
      const cryptoMap: Record<string, string> = {
        'BTC': 'BTC-USD', 'BITCOIN': 'BTC-USD',
        'ETH': 'ETH-USD', 'ETHEREUM': 'ETH-USD',
        'BNB': 'BNB-USD',
        'XRP': 'XRP-USD', 'RIPPLE': 'XRP-USD',
        'SOL': 'SOL-USD', 'SOLANA': 'SOL-USD',
        'ADA': 'ADA-USD', 'CARDANO': 'ADA-USD',
        'DOGE': 'DOGE-USD', 'DOGECOIN': 'DOGE-USD',
        'DOT': 'DOT-USD', 'POLKADOT': 'DOT-USD',
        'MATIC': 'MATIC-USD', 'POLYGON': 'MATIC-USD',
        'LINK': 'LINK-USD', 'CHAINLINK': 'LINK-USD',
        'AVAX': 'AVAX-USD', 'AVALANCHE': 'AVAX-USD',
        'SHIB': 'SHIB-USD',
        'UNI': 'UNI-USD', 'UNISWAP': 'UNI-USD',
        'LTC': 'LTC-USD', 'LITECOIN': 'LTC-USD',
        'ATOM': 'ATOM-USD', 'COSMOS': 'ATOM-USD'
      };
      
      if (cryptoMap[term]) {
        finalSymbol = cryptoMap[term];
      }
      
      onSelectStock(finalSymbol);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Search stocks or crypto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} className="text-gray-400" />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 3,
                bgcolor: 'background.paper',
                '& fieldset': { borderColor: 'rgba(75, 85, 99, 0.5)' },
              }
            }}
          />
        </form>

        {isOpen && (
          <Paper 
            elevation={8} 
            sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              mt: 1, 
              zIndex: 50, 
              maxHeight: 400, 
              overflow: 'hidden',
              borderRadius: 3,
              border: '1px solid rgba(75, 85, 99, 0.5)'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={(_, val) => setActiveTab(val)}
              variant="fullWidth"
              textColor="inherit"
              indicatorColor={activeTab === 0 ? "primary" : "secondary"}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                label="Stocks" 
                icon={<TrendingUp size={16} />} 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab 
                label="Crypto" 
                icon={<Bitcoin size={16} />} 
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            </Tabs>

            <Box sx={{ p: 1, maxHeight: 300, overflowY: 'auto' }}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star size={12} /> Popular {activeTab === 0 ? 'Stocks' : 'Cryptocurrencies'}
              </Typography>
              
              <List disablePadding>
                {filteredItems.map((item) => (
                  <ListItemButton
                    key={item.symbol}
                    onClick={() => handleSelect(item.symbol)}
                    selected={currentSymbol === item.symbol}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.type === 'crypto' ? (
                        <Bitcoin size={20} className="text-orange-400" />
                      ) : (
                        <TrendingUp size={20} className="text-blue-400" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                          {item.symbol}
                        </Box>
                      }
                      secondary={item.name}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                    {currentSymbol === item.symbol && (
                      <Typography variant="caption" color="primary">Selected</Typography>
                    )}
                  </ListItemButton>
                ))}
                
                {searchTerm && !filteredItems.some(s => s.symbol === searchTerm.toUpperCase()) && (
                  <ListItemButton
                    onClick={() => handleSelect(searchTerm.toUpperCase())}
                    sx={{ borderRadius: 2, mt: 1, color: 'primary.main' }}
                  >
                    <ListItemIcon>
                        <Search size={20} />
                    </ListItemIcon>
                    <ListItemText primary={`Search for "${searchTerm.toUpperCase()}"`} />
                  </ListItemButton>
                )}
              </List>
            </Box>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
