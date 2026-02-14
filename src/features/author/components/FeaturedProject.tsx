import { Typography, Box, Grid, Chip } from "@mui/material";
import { Code } from "@mui/icons-material";
import PaperBox from "./PaperBox";
import SectionHeader from "./SectionHeader";
import { AuthorProfile } from "@/features/author/types";

interface FeaturedProjectProps {
  author: AuthorProfile;
}

export default function FeaturedProject({ author }: FeaturedProjectProps) {
  return (
    <PaperBox
      sx={{
        border: 1,
        borderColor: "primary.main",
      }}
    >
      <SectionHeader
        title={`Featured Project: ${author?.featuredProject?.title || ""}`}
        icon={Code}
        iconColor="primary.main"
        textColor="primary.main"
      />
      {author?.featuredProject?.description && (
        <Typography variant="body1" paragraph>
          {author.featuredProject.description}
        </Typography>
      )}
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Key Features:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {(author?.featuredProject?.keyFeatures || []).map((f) => (
              <Typography key={f} component="li" variant="body2">
                {f}
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Tech Stack:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mt: 1,
            }}
          >
            {(author?.featuredProject?.techStack || []).map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" />
            ))}
          </Box>
        </Grid>
      </Grid>
    </PaperBox>
  );
}
