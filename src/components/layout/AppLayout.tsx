import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

interface AppLayoutProps {
    children: React.ReactNode;
    headerProps: React.ComponentProps<typeof Header>;
}

export default function AppLayout({ children, headerProps }: AppLayoutProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', flexDirection: 'column' }}>
            <Header {...headerProps} />
            {children}
            <Footer />
        </Box>
    );
}
