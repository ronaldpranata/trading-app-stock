"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Avatar,
  Chip,
  Paper,
  Button,
  Divider,
} from "@mui/material";

import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  Code2,
  GraduationCap,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuthor } from "@/hooks";

export default function AuthorPage() {
  const { author, isLoading, error } = useAuthor();

  const initials = (author?.name || "RK")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

  if (error) {
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
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
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
                  <MapPin size={18} />
                  <Typography variant="body2">
                    {author?.location || ""}
                  </Typography>
                </Stack>

                <Stack spacing={2} mb={4}>
                  <Button
                    variant="contained"
                    startIcon={<Linkedin />}
                    href={author?.socials?.linkedin || "#"}
                    target="_blank"
                    fullWidth
                  >
                    Connect on LinkedIn
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Github />}
                    href={author?.socials?.github || "#"}
                    target="_blank"
                    fullWidth
                  >
                    Follow on GitHub
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box textAlign="left">
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Contact
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    <Stack
                      direction="row"
                      gap={2}
                      alignItems="center"
                      color="text.secondary"
                    >
                      <Mail size={18} />
                      <Typography variant="body2">
                        {author?.contact?.email || ""}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={4}>
                {/* About Section */}
                <Paper
                  elevation={0}
                  sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.light", width: 32, height: 32 }}
                    >
                      <Briefcase size={18} />
                    </Avatar>
                    Profile
                  </Typography>
                  {author?.about?.intro && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {author.about.intro}
                    </Typography>
                  )}
                  {author?.about?.description && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {author.about.description}
                    </Typography>
                  )}
                </Paper>

                {/* Featured Project */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      color: "primary.main",
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      <Code2 size={18} color="white" />
                    </Avatar>
                    Featured Project: {author?.featuredProject?.title || ""}
                  </Typography>
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
                        {(author?.featuredProject?.keyFeatures || []).map(
                          (f) => (
                            <Typography key={f} component="li" variant="body2">
                              {f}
                            </Typography>
                          ),
                        )}
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
                          <Chip
                            key={t}
                            label={t}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Skills Section */}
                <Paper
                  elevation={0}
                  sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      sx={{ bgcolor: "secondary.light", width: 32, height: 32 }}
                    >
                      <Code2 size={18} />
                    </Avatar>
                    Technical Skills
                  </Typography>

                  <Stack spacing={3} mt={2}>
                    {(author?.skills || []).map((cat) => (
                      <Box key={cat.category}>
                        <Typography variant="subtitle2" gutterBottom>
                          {cat.category}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {cat.items.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                {/* Experience */}
                <Paper
                  elevation={0}
                  sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      sx={{ bgcolor: "success.light", width: 32, height: 32 }}
                    >
                      <Briefcase size={18} />
                    </Avatar>
                    Employment History
                  </Typography>

                  <Stack spacing={4} mt={2}>
                    {(author?.experience || []).map((exp, idx) => (
                      <Box key={`${exp.role}-${idx}`}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                          flexWrap="wrap"
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {exp.role}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {exp.period}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="primary.main">
                          {exp.company}
                        </Typography>
                        <Box
                          component="ul"
                          sx={{ pl: 2, mt: 1, color: "text.secondary" }}
                        >
                          {(exp.details || []).map((d, i) => (
                            <Typography
                              key={`${exp.role}-detail-${i}`}
                              component="li"
                              variant="body2"
                            >
                              {d}
                            </Typography>
                          ))}
                        </Box>
                        {idx < (author.experience?.length || 0) - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                {/* Education */}
                <Paper
                  elevation={0}
                  sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      sx={{ bgcolor: "info.light", width: 32, height: 32 }}
                    >
                      <GraduationCap size={18} />
                    </Avatar>
                    Education
                  </Typography>

                  <Stack spacing={3} mt={2}>
                    {(author?.education || []).map((edu, idx) => (
                      <Box key={`${edu.degree}-${idx}`}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                          flexWrap="wrap"
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {edu.degree}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {edu.period}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="primary.main">
                          {edu.institution}
                        </Typography>
                        {edu.details && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                          >
                            {edu.details}
                          </Typography>
                        )}
                        {idx < (author.education?.length || 0) - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AppLayout>
  );
}
