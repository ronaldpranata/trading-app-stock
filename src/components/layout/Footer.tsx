import { Box, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3, mt: 'auto', bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Stack spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            ⚠️ For educational purposes only. Not financial advice.
          </Typography>
          <Link href="/author" style={{ textDecoration: 'none' }}>
            <Typography variant="caption" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              About the Author
            </Typography>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
