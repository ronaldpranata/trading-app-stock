import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {children}
            <Footer />
        </Box>
    );
}
