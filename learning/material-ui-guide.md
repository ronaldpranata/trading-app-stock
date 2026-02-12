# Material UI & MUI X Charts Guide

This project uses **Material UI (MUI)** for the UI component library and **MUI X Charts** for data visualization. This guide outlines how these libraries are configured and customized.

## Material UI (MUI) Core

We rely on MUI for the layout grid, typography, and interactive components.

### Key Concepts Used

1.  **Sx Prop**: We frequently use the `sx` prop for one-off styles. It has access to the theme values (spacing, palette, breakpoints).
    ```tsx
    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
    ```

2.  **Grid System (v2)**: We use the new `Grid` component (Size Grid) which replaces the legacy `item`/`container` props with `size`.
    ```tsx
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>...</Grid>
    </Grid>
    ```

3.  **Theming**: The specialized "Cyberpunk" dark theme is defined in `src/theme/index.ts`. It overrides default palette colors and component shapes.

4.  **Responsive Design**: We use standard MUI breakpoints (`xs`, `sm`, `md`, `lg`, `xl`) within `sx` props or Grid sizes to build mobile-first layouts.

---

## MUI X Charts Implementation

We migrated from Recharts to `@mui/x-charts` to ensure better performance, bundle size reduction, and visual consistency with the rest of the Material UI application.

### StockChartDisplay.tsx

The main stock chart uses the `LineChart` component.

#### 1. Data Formatting
MUI X Charts requires specific data structures. We separate the X-axis (timestamps) from the series data (prices).
- **Date Handling**: We convert ISO strings to `Date` objects for the X-axis data.
- **Value Formatters**: Custom formatters are used for axis ticks and tooltips.
  ```ts
  valueFormatter: (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}-${day}`;
  }
  ```

#### 2. Visual Customizations
We heavily customized the chart to match a specific "TradingView-like" aesthetic:
- **Catmull-Rom Smoothing**: `curve: 'catmullRom'` is used in the series config to smooth out jagged lines.
- **Dashed Grid**: Custom CSS targeting `.MuiChartsGrid-line` makes grid lines dashed.
- **Gradient Fill**: We use SVG `<defs>` inside the chart to create a gradient area fill that fades to transparent at the bottom.
  ```tsx
  <defs>
    <linearGradient id="priceGradient-up" ... >
      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
    </linearGradient>
  </defs>
  ```

#### 3. Animations
To mimic the "draw" effect of other libraries, we inject a CSS keyframe animation targeting the line path:
```tsx
sx={{
    '.MuiLineElement-root': {
        strokeDasharray: 2000,
        strokeDashoffset: 2000,
        animation: 'draw 1.5s ease-out forwards',
    },
    '@keyframes draw': {
        'to': { strokeDashoffset: 0 }
    }
}}
```
*Note: We add a `key={timeRange}` to the Chart component to force a re-mount and replay this animation when switching timeframes.*

### CompareView.tsx

The comparison chart follows similar principles but handles multiple series.
- **Data Normalization**: All stock prices are normalized to percentage change (starting at 0%) to allow fair comparison.
- **Strict Axis Domain**: We explicitly set `min` and `max` on the X-axis to match the data range exactly, preventing "floating" lines that don't reach the chart edges.

## Best Practices

- **Memoization**: Chart components are wrapped in `React.memo` to prevent unnecessary re-renders during parent updates (like live price ticking) that don't affect historical data.
- **Optimization**: For large datasets, we ensure the number of points passed to the chart is reasonable or use `tickMinStep` to control label density.
