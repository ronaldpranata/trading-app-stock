import { Typography, Stack, Box, Divider } from "@mui/material";
import { School } from "@mui/icons-material";
import PaperBox from "./PaperBox";
import SectionHeader from "./SectionHeader";
import { AuthorProfile } from "@/features/author/types";

interface EducationListProps {
  author: AuthorProfile;
}

export default function EducationList({ author }: EducationListProps) {
  return (
    <PaperBox>
      <SectionHeader title="Education" icon={School} iconColor="info.light" />

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
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {edu.details}
              </Typography>
            )}
            {idx < (author.education?.length || 0) - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Stack>
    </PaperBox>
  );
}
