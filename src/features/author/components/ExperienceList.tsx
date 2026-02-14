import { Typography, Stack, Box, Divider } from "@mui/material";
import { Work } from "@mui/icons-material";
import PaperBox from "./PaperBox";
import SectionHeader from "./SectionHeader";
import { AuthorProfile } from "@/types/author";

interface ExperienceListProps {
  author: AuthorProfile;
}

export default function ExperienceList({ author }: ExperienceListProps) {
  return (
    <PaperBox>
      <SectionHeader
        title="Employment History"
        icon={Work}
        iconColor="success.light"
      />

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
            <Box component="ul" sx={{ pl: 2, mt: 1, color: "text.secondary" }}>
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
    </PaperBox>
  );
}
