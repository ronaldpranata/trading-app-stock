'use client';
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // blue-500
      light: '#60a5fa', // blue-400
      dark: '#2563eb', // blue-600
    },
    secondary: {
      main: '#a855f7', // purple-500
      light: '#c084fc', // purple-400
      dark: '#9333ea', // purple-600
    },
    background: {
      default: '#030712', // gray-950
      paper: '#111827', // gray-900
    },
    success: {
      main: '#22c55e', // green-500
      light: '#4ade80', // green-400
      dark: '#16a34a', // green-600
    },
    error: {
      main: '#ef4444', // red-500
      light: '#f87171', // red-400
      dark: '#dc2626', // red-600
    },
    warning: {
      main: '#eab308', // yellow-500
      light: '#facc15', // yellow-400
      dark: '#ca8a04', // yellow-600
    },
    text: {
      primary: '#f3f4f6', // gray-100
      secondary: '#9ca3af', // gray-400
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12, // Match rounded-xl
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 24, 39, 0.5)', // gray-900/50
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(31, 41, 55, 0.5)', // gray-800/50
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #3b82f6, #9333ea)', // blue-500 to purple-600
          '&:hover': {
             background: 'linear-gradient(to right, #2563eb, #7e22ce)',
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    }
  },
});

export default theme;
