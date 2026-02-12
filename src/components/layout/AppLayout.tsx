import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import StockAnalysisManager from "@/features/stock/components/StockAnalysisManager";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', flexDirection: 'column' }}>
      <StockAnalysisManager />
      <Header />
      {children}
      <Footer />
    </Box>
  );
}
