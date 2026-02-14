import { Typography, Stack, Box, Chip } from "@mui/material";
import { Code } from "@mui/icons-material";
import PaperBox from "./PaperBox";
import SectionHeader from "./SectionHeader";
import { AuthorProfile } from "@/types/author";

interface SkillsListProps {
  author: AuthorProfile;
}

export default function SkillsList({ author }: SkillsListProps) {
  return (
    <PaperBox>
      <SectionHeader
        title="Technical Skills"
        icon={Code}
        iconColor="secondary.light"
      />

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
    </PaperBox>
  );
}
