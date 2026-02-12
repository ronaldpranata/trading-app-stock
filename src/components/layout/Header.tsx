import { memo } from "react";
import { 
  Box, 
  Stack, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  ButtonGroup, 
  IconButton, 
  useTheme,
} from "@mui/material";
import { 
  RefreshCw, 
  TrendingUp, 
  Play, 
  Pause, 
  LayoutGrid, 
  GitCompare, 
  LogOut, 
} from "lucide-react";
import StockSearch from "@/features/stock/components/StockSearch";
import { useAuth, useStock, useUI } from "@/hooks";

function Header() {
    const theme = useTheme();
    const { isAuthenticated, logout } = useAuth();
    const { symbol, refresh, isLoading, load, addComparison } = useStock();
    const { 
      viewMode, 
      setViewMode, 
      isCompareMode 
    } = useUI();

    const handleSelectStock = (newSymbol: string) => {
      if (isCompareMode) {
        addComparison(newSymbol);
      } else {
        load(newSymbol);
      }
    };

    if (!isAuthenticated) return null;

    return (
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', backdropFilter: 'blur(20px)', background: 'rgba(17, 24, 39, 0.8)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={2} width="100%">
            <Stack direction="row" alignItems="center" gap={2} minWidth={200}>
              <Box sx={{ p: 1, borderRadius: 2, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}>
                <TrendingUp size={20} color="white" />
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Stock Predictor AI
              </Typography>
            </Stack>

            <Box flex={1} />

            <Stack direction="row" alignItems="center" gap={2} width={{ xs: '100%', md: 'auto' }} flexWrap="wrap">
              {/* View Mode Toggle */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    variant={viewMode === "single" ? "contained" : "outlined"}
                    onClick={() => setViewMode("single")}
                    startIcon={<LayoutGrid size={16} />}
                  >
                    Single
                  </Button>
                  <Button
                    variant={viewMode === "compare" ? "contained" : "outlined"}
                    onClick={() => setViewMode("compare")}
                    startIcon={<GitCompare size={16} />}
                  >
                    Compare
                  </Button>
                </ButtonGroup>
              </Box>

              {/* Search */}
              <Box sx={{ width: { xs: '100%', md: 300 } }}>
                <StockSearch />
              </Box>
              
              {/* Mobile View Mode */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', gap: 1 }}>
                 <Button 
                    fullWidth 
                    variant={viewMode === "single" ? "contained" : "outlined"}
                    onClick={() => setViewMode("single")}
                 >
                    Single
                 </Button>
                 <Button 
                    fullWidth 
                    variant={viewMode === "compare" ? "contained" : "outlined"}
                    onClick={() => setViewMode("compare")}
                 >
                    Compare
                 </Button>
              </Box>

              <Stack direction="row" alignItems="center" gap={1} ml={{ xs: 'auto', md: 0 }}>
                  {/* Refresh Controls */}
                  <IconButton
                    onClick={refresh}
                    disabled={isLoading}
                    size="small"
                  >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                  </IconButton>



                  {/* Logout Button */}
                  <IconButton onClick={logout} size="small" title="Logout">
                    <LogOut size={18} />
                  </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    );
}

export default memo(Header);
