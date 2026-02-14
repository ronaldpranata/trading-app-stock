"use client";

import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import AppLayout from "@/components/layout/AppLayout";
import { useAuthor } from "@/hooks";
import ProfileCard from "@/features/author/components/ProfileCard";
import AboutSection from "@/features/author/components/AboutSection";
import FeaturedProject from "@/features/author/components/FeaturedProject";
import SkillsList from "@/features/author/components/SkillsList";
import ExperienceList from "@/features/author/components/ExperienceList";
import EducationList from "@/features/author/components/EducationList";

export default function AuthorPage() {
  const { author, isLoading, error } = useAuthor();

  if (isLoading) {
    return (
      <AppLayout>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h6">Loading author...</Typography>
          </Container>
        </Box>
      </AppLayout>
    );
  }

  if (error || !author) {
    return (
      <AppLayout>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
          <Container maxWidth="lg">
            <Typography color="error">
              Failed to load author profile.
            </Typography>
          </Container>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Left Column: Profile Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <ProfileCard author={author} />
            </Grid>

            {/* Right Column: Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={4}>
                <AboutSection author={author} />
                <FeaturedProject author={author} />
                <SkillsList author={author} />
                <ExperienceList author={author} />
                <EducationList author={author} />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AppLayout>
  );
}
