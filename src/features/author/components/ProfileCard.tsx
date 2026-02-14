import {
  Avatar,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Box,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Email,
  LocationOn,
} from "@mui/icons-material";
import { AuthorProfile } from "@/features/author/types";

interface ProfileCardProps {
  author: AuthorProfile;
}

export default function ProfileCard({ author }: ProfileCardProps) {
  const initials = (author?.name || "RK")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "background.paper",
        textAlign: "center",
        height: "100%",
        position: "sticky",
        top: 24,
      }}
    >
      <Avatar
        src="/author-profile.jpg"
        sx={{
          width: 150,
          height: 150,
          mb: 3,
          mx: "auto",
          bgcolor: "primary.main",
          fontSize: "3rem",
        }}
      >
        {initials}
      </Avatar>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {author?.name || ""}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {author?.title || ""}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
        mb={3}
        color="text.secondary"
      >
        <LocationOn fontSize="small" />
        <Typography variant="body2">{author?.location || ""}</Typography>
      </Stack>

      <Stack spacing={2} mb={4}>
        <Button
          variant="contained"
          startIcon={<LinkedIn />}
          href={author?.socials?.linkedin || "#"}
          target="_blank"
          fullWidth
        >
          Connect on LinkedIn
        </Button>
        <Button
          variant="outlined"
          startIcon={<GitHub />}
          href={author?.socials?.github || "#"}
          target="_blank"
          fullWidth
        >
          Follow on GitHub
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box textAlign="left">
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Contact
        </Typography>
        <Stack spacing={2} mt={2}>
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            color="text.secondary"
          >
            <Email fontSize="small" />
            <Typography variant="body2">
              {author?.contact?.email || ""}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
