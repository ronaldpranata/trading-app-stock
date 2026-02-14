import { memo } from "react";
import { usePathname } from "next/navigation";
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
  Refresh,
  TrendingUp,
  GridView,
  CompareArrows,
  Logout,
} from "@mui/icons-material";
import StockSearch from "@/features/stock/components/StockSearch";
import { useAuth, useStock, useUI } from "@/hooks";

function Header() {
  const theme = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { refresh, isLoading } = useStock();
  const { viewMode, setViewMode } = useUI();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const isAuthorPage = pathname === "/author";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(20px)",
        background: "rgba(17, 24, 39, 0.8)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          gap={2}
          width="100%"
        >
          <Stack direction="row" alignItems="center" gap={2} minWidth={200}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              <TrendingUp fontSize="small" sx={{ color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Stock Predictor AI
            </Typography>
          </Stack>

          <Box flex={1} />

          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            width={{ xs: "100%", md: "auto" }}
            flexWrap="wrap"
          >
            {/* View Mode Toggle */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <ButtonGroup variant="outlined" size="small">
                <Button
                  variant={viewMode === "single" ? "contained" : "outlined"}
                  onClick={() => setViewMode("single")}
                  startIcon={<GridView fontSize="small" />}
                >
                  Single
                </Button>
                <Button
                  variant={viewMode === "compare" ? "contained" : "outlined"}
                  onClick={() => setViewMode("compare")}
                  startIcon={<CompareArrows fontSize="small" />}
                >
                  Compare
                </Button>
              </ButtonGroup>
            </Box>

            {/* Search */}
            {!isAuthorPage && (
              <Box sx={{ width: { xs: "100%", md: 300 } }}>
                <StockSearch />
              </Box>
            )}

            {/* Mobile View Mode */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                width: "100%",
                gap: 1,
              }}
            >
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

            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              ml={{ xs: "auto", md: 0 }}
            >
              {/* Refresh Controls */}
              <IconButton onClick={refresh} disabled={isLoading} size="small">
                <Refresh
                  fontSize="small"
                  className={isLoading ? "animate-spin" : ""}
                />
              </IconButton>

              {/* Logout Button */}
              <IconButton onClick={logout} size="small" title="Logout">
                <Logout fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default memo(Header);
