import { Typography } from "@mui/material";
import { Work } from "@mui/icons-material";
import PaperBox from "./PaperBox";
import SectionHeader from "./SectionHeader";
import { AuthorProfile } from "@/features/author/types";

interface AboutSectionProps {
  author: AuthorProfile;
}

export default function AboutSection({ author }: AboutSectionProps) {
  return (
    <PaperBox>
      <SectionHeader title="Profile" icon={Work} iconColor="primary.light" />
      {author?.about?.intro && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {author.about.intro}
        </Typography>
      )}
      {author?.about?.description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {author.about.description}
        </Typography>
      )}
    </PaperBox>
  );
}
