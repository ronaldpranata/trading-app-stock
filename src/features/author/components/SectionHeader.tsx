import { Typography, Avatar, Box } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface SectionHeaderProps {
  title: string;
  icon: SvgIconComponent;
  iconColor?: string;
  textColor?: string;
}

export default function SectionHeader({
  title,
  icon: Icon,
  iconColor = "primary.light",
  textColor,
}: SectionHeaderProps) {
  return (
    <Typography
      variant="h5"
      fontWeight="bold"
      gutterBottom
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        color: textColor,
      }}
    >
      <Avatar
        sx={{
          bgcolor: iconColor,
          width: 32,
          height: 32,
        }}
      >
        <Icon fontSize="small" sx={{ color: textColor ? "white" : undefined }} />
      </Avatar>
      {title}
    </Typography>
  );
}
