   
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
import { TrendingUp, Lock } from 'lucide-react';

interface BoxLoginProps {
   handleLogin: (e: React.FormEvent) => void;
   password: string;
   setPassword: (password: string) => void;
   isLoggingIn: boolean;
   loginError: string;
}

export default function BoxLogin({ handleLogin, password, setPassword, isLoggingIn, loginError }: BoxLoginProps){   
   const theme = useTheme();
   return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
        <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4 }}>
          <Stack alignItems="center" mb={4} spacing={2}>
             <Box sx={{ p: 2, borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, boxShadow: 3 }}>
                <TrendingUp color="white" size={32} />
             </Box>
             <Typography variant="h5" fontWeight="bold" align="center" sx={{ background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
               Stock Predictor AI
             </Typography>
             <Typography variant="body2" color="text.secondary">Enter password to access</Typography>
          </Stack>

          <form onSubmit={handleLogin}>
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
                      <Lock size={20} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />

              {loginError && (
                <Alert severity="error">{loginError}</Alert>
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
