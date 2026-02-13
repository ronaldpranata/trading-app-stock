import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, CurrencyBitcoin } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { searchStocks, SearchResult } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useStock, useUI } from '@/hooks';
import { 
    Box, 
    TextField, 
    InputAdornment, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    Typography, 
    Paper, 
    CircularProgress,
    Stack,
    Chip,
    ListItemIcon
} from '@mui/material';

interface StockSearchProps {
    onSelectStock?: (symbol: string) => void;
    currentSymbol?: string;
}

export default function StockSearch({ onSelectStock, currentSymbol }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { load, addComparison } = useStock();
  const { isCompareMode } = useUI();

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchStocks(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    
    if (onSelectStock) {
        onSelectStock(symbol);
    } else {
        if (isCompareMode) {
          addComparison(symbol);
        } else {
          load(symbol);
        }
    }
  };

  return (
    <Box ref={searchRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        placeholder="Search stocks..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            bgcolor: 'action.hover',
            '& fieldset': { border: 'none' },
            '& input': { py: 1.5 }
          }
        }}
      />

      {showResults && (query || results.length > 0) && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 50,
            maxHeight: 384, // 96 * 4
            overflowY: 'auto',
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          {isLoading ? (
            <Box p={2} textAlign="center">
              <CircularProgress size={24} />
            </Box>
          ) : results.length > 0 ? (
            <List disablePadding>
              {results.map((result) => (
                <ListItem key={result.symbol} disablePadding>
                  <ListItemButton 
                    onClick={() => handleSelect(result.symbol)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {result.type === 'CRYPTOCURRENCY' ? (
                            <CurrencyBitcoin sx={{ fontSize: 20, color: "#f59e0b" }} />
                        ) : (
                            <TrendingUp sx={{ fontSize: 20, color: "#3b82f6" }} />
                        )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" gap={1}>
                             <Typography fontWeight="bold" color="text.primary">
                                {result.symbol}
                             </Typography>
                             <Chip 
                                label={result.type} 
                                size="small" 
                                color="default" 
                                variant="outlined" 
                                sx={{ height: 20, fontSize: '0.65rem' }} 
                            />
                        </Stack>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {result.name}
                        </Typography>
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                        {result.region}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : query ? (
            <Box p={2} textAlign="center">
              <Typography color="text.secondary">No results found for "{query}"</Typography>
            </Box>
          ) : null}
        </Paper>
      )}
    </Box>
  );
}
