import { useState } from 'react';
import { 
  Grid, 
  Card,  
  Typography, 
  Box, 
  Stack, 
  TextField,
  InputAdornment,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { TrendingUp, Lock } from '@mui/icons-material';
import { useAuth } from '@/hooks';

export default function LoginForm(){   
   const theme = useTheme();
   const { login, error } = useAuth();
   const [password, setPassword] = useState("");
   const [isLoggingIn, setIsLoggingIn] = useState(false);
   const [localError, setLocalError] = useState("");

   const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setIsLoggingIn(true);
    
    const errorMsg = await login(password);
    setIsLoggingIn(false);
    
    if (errorMsg) {
      setLocalError(errorMsg);
    } else {
      setPassword("");
    }
  };

   return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
        <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4 }}>
          <Stack alignItems="center" mb={4} spacing={2}>
             <Box sx={{ p: 2, borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, boxShadow: 3 }}>
                <TrendingUp sx={{ color: "white", fontSize: 32 }} />
             </Box>
             <Typography variant="h5" fontWeight="bold" align="center" sx={{ background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
               Stock Predictor AI
             </Typography>
             <Typography variant="body2" color="text.secondary">Enter password to access</Typography>
          </Stack>

          <form onSubmit={handleLoginSubmit}>
            <Stack spacing={3}>
              <TextField 
                fullWidth
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                disabled={isLoggingIn}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {localError && (
                <Alert severity="error">{localError}</Alert>
              )}

              <Button 
                fullWidth 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={isLoggingIn}
                sx={{ background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}
              >
                {isLoggingIn ? "Authenticating..." : "Access Application"}
              </Button>
            </Stack>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="caption" color="text.secondary">🔒 Protected access only</Typography>
          </Box>
        </Card>
      </Box>
    );
  }
