import { Card, CardContent, Typography, Stack } from '@mui/material';
// Key Metrics Component
interface KeyMetricsProps {
  fundamentals: any;
}
export default function KeyMetrics({ fundamentals }:KeyMetricsProps) {
  if (!fundamentals) return null;

  const metrics = [
    {
      label: "ROE",
      value: fundamentals.roe,
      suffix: "%",
      thresholds: { good: 15, bad: 5 },
    },
    {
      label: "Profit Margin",
      value: fundamentals.profitMargin,
      suffix: "%",
      thresholds: { good: 15, bad: 5 },
    },
    {
      label: "Revenue Growth",
      value: fundamentals.revenueGrowth,
      suffix: "%",
      thresholds: { good: 10, bad: 0 },
    },
    {
      label: "Debt/Equity",
      value: fundamentals.debtToEquity,
      thresholds: { good: 0.5, bad: 2, inverse: true },
    },
    { label: "Beta", value: fundamentals.beta },
    { label: "Dividend Yield", value: fundamentals.dividendYield, suffix: "%" },
  ];

  const getColor = (val: number, thresholds: any) => {
     if(!thresholds) return 'text.primary';
     const isGood = thresholds.inverse ? val < thresholds.good : val > thresholds.good;
     const isBad = thresholds.inverse ? val > thresholds.bad : val < thresholds.bad;
     if(isGood) return 'success.main';
     if(isBad) return 'error.main';
     return 'text.primary';
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Key Metrics</Typography>
        <Stack spacing={1}>
          {metrics.map((m) => (
            <Stack key={m.label} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">{m.label}</Typography>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                color={m.thresholds ? getColor(m.value, m.thresholds) : 'text.primary'}
              >
                {m.value?.toFixed(2) || "N/A"}{m.suffix || ""}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

