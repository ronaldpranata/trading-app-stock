import { Paper, PaperProps } from "@mui/material";

interface PaperBoxProps extends PaperProps {
  children: React.ReactNode;
}

export default function PaperBox({ children, sx, ...props }: PaperBoxProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper", ...sx }}
      {...props}
    >
      {children}
    </Paper>
  );
}
