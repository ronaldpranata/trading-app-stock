"use client";

import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Stack, 
  Avatar, 
  Chip, 
  Paper, 
  Button,
  Divider
} from "@mui/material";
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Briefcase, 
  Code2, 
  GraduationCap
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth, useStock, useUI } from "@/hooks";
import { useCallback } from "react";

export default function AuthorPage() {
  // Reuse hooks for AppLayout props
  const auth = useAuth();
  const stock = useStock();
  const ui = useUI();



  const handleSymbolChange = (symbol: string) => {
    if (ui.isCompareMode) {
      stock.addComparison(symbol);
    } else {
      stock.load(symbol);
    }
  };

  return (
    <AppLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Left Column: Profile Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', textAlign: 'center', height: '100%', position: 'sticky', top: 24 }}>
                <Avatar 
                  src="/author-profile.jpg" // Placeholder if no image available, falling back to initials
                  sx={{ width: 150, height: 150, mb: 3, mx: 'auto', bgcolor: 'primary.main', fontSize: '3rem' }}
                >
                  RK
                </Avatar>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Ronald Pranata Kurniawan
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Senior Software Engineer | Singapore PR
                </Typography>
                
                <Stack direction="row" alignItems="center" justifyContent="center" gap={1} mb={3} color="text.secondary">
                  <MapPin size={18} />
                  <Typography variant="body2">Singapore</Typography>
                </Stack>

                <Stack spacing={2} mb={4}>
                  <Button 
                    variant="contained" 
                    startIcon={<Linkedin />} 
                    href="https://www.linkedin.com/in/ronaldpranata/" 
                    target="_blank"
                    fullWidth
                  >
                    Connect on LinkedIn
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Github />} 
                    href="https://github.com/ronaldpranata" 
                    target="_blank"
                    fullWidth
                  >
                    Follow on GitHub
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box textAlign="left">
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Contact
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    <Stack direction="row" gap={2} alignItems="center" color="text.secondary">
                      <Mail size={18} />
                      <Typography variant="body2">ronald_pranata@yahoo.co.id</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={4}>
                {/* About Section */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                      <Briefcase size={18} />
                    </Avatar>
                    Profile
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Senior Software Engineer with 15+ years of experience in enterprise application development. Subject Matter Expert in Front-End Development (Vue.js, React) with strong proficiency in Backend Architecture (Java Spring Boot, PHP, Node.js).
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Expert in integrating complex backend services with responsive, high-performance interfaces. Specialized in building secure, high-availability systems for the Finance and Digital Media sectors, with recent innovations in Generative AI integration. Proven track record in Technical Leadership, DevOps (CI/CD), and delivering large-scale digital transformation projects.
                  </Typography>
                </Paper>

                {/* Featured Project */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', border: 1, borderColor: 'primary.main' }}>
                   <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'primary.main' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <Code2 size={18} color="white" />
                    </Avatar>
                    Featured Project: Stock Predictor AI
                  </Typography>
                  <Typography variant="body1" paragraph>
                    A comprehensive stock analysis and prediction platform built to demonstrate advanced frontend architecture and data visualization capabilities.
                  </Typography>
                  <Grid container spacing={2} mb={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold">Key Features:</Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            <Typography component="li" variant="body2">Real-time stock data visualization</Typography>
                            <Typography component="li" variant="body2">Technical Analysis (SMA, RSI, MACD)</Typography>
                            <Typography component="li" variant="body2">AI-driven Price Predictions</Typography>
                            <Typography component="li" variant="body2">Advanced Charting with Recharts</Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" fontWeight="bold">Tech Stack:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {["Next.js", "TypeScript", "Material UI", "Recharts", "Redux", ].map(t => (
                                <Chip key={t} label={t} size="small" variant="outlined" />
                            ))}
                        </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Skills Section */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
                   <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                      <Code2 size={18} />
                    </Avatar>
                    Technical Skills
                  </Typography>
                  
                  <Stack spacing={3} mt={2}>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Frontend (Expert)</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {["Vue.js", "Nuxt.js (Composition API)","Pinia", "JavaScript (ES6+)", "HTML5", "CSS3", "Sass"].map((skill) => (
                            <Chip key={skill} label={skill} variant="filled" color="primary" size="small" />
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Frontend (Proficient)</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {["React.js", "Next.js", "React Native","Redux", "Material-UI", "Tailwind CSS", "Bootstrap", "D3.js"].map((skill) => (
                            <Chip key={skill} label={skill} variant="outlined" size="small" />
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Backend & API</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {["Java Spring Boot", "PHP", "Node.js", "NestJS", "RESTful API", "GraphQL", "MySQL"].map((skill) => (
                            <Chip key={skill} label={skill} variant="outlined" size="small" />
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>AI & Emerging Tech</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {["Google Gemini API", "OpenAI API", "ComfyUI", "Stable Diffusion"].map((skill) => (
                            <Chip key={skill} label={skill} variant="outlined" size="small" />
                            ))}
                        </Box>
                    </Box>
                     <Box>
                        <Typography variant="subtitle2" gutterBottom>DevOps</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {["Git", "GitHub Actions", "Docker", "AWS", "GCP", "Linux"].map((skill) => (
                            <Chip key={skill} label={skill} variant="outlined" size="small" />
                            ))}
                        </Box>
                    </Box>
                  </Stack>
                </Paper>

                {/* Experience */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
                   <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                      <Briefcase size={18} />
                    </Avatar>
                    Employment History
                  </Typography>
                  
                  <Stack spacing={4} mt={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight="bold">Senior Software Engineer</Typography>
                        <Typography variant="caption" color="text.secondary">Mar 2023 — Present</Typography>
                      </Stack>
                      <Typography variant="body2" color="primary.main">Dentsu, Singapore</Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
                        <Typography component="li" variant="body2">
                            <strong>Enterprise Platform Leadership (FWD & Prudential):</strong> Delivered critical platform enhancements achieving a 99% referral rate by architecting a high-performance, secure, and user-centric digital experience. Engineered a specialized internal logic engine using optimized Vanilla JavaScript.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Full-Stack Architecture:</strong> Crafted an award-winning digital ecosystem using Java Spring Boot integrated with Vue/Nuxt.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>AI & Generative Content Innovation:</strong> Architected an AI-powered storytelling platform using Nuxt 3 and Google Gemini to automate high-throughput content generation.
                        </Typography>
                         <Typography component="li" variant="body2">
                            <strong>DevOps:</strong> Streamlined deployment workflows using GitHub Actions and Docker.
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                         <Typography variant="subtitle1" fontWeight="bold">Software Engineer</Typography>
                         <Typography variant="caption" color="text.secondary">Jan 2017 — Feb 2023</Typography>
                      </Stack>
                      <Typography variant="body2" color="primary.main">Dentsu (formerly Isobar), Singapore</Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
                        <Typography component="li" variant="body2">
                            <strong>Banking Sector Experience (OCBC Bank):</strong> Developed high-precision financial calculator and banking micro-site ensuring 100% accuracy.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>Data Visualization:</strong> Developed data-driven customer intelligence portals using D3.js and Chart.js.
                        </Typography>
                        <Typography component="li" variant="body2">
                            <strong>API Integration:</strong> Engineered custom resource management ecosystems integrating third-party APIs.
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                         <Typography variant="subtitle1" fontWeight="bold">Web Application Developer</Typography>
                         <Typography variant="caption" color="text.secondary">Jan 2015 — Jan 2017</Typography>
                      </Stack>
                      <Typography variant="body2" color="primary.main">Islickmedia, Singapore</Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
                        <Typography component="li" variant="body2">
                            <strong>Third-Party API Integration:</strong> Designed complex API integrations for booking engines, transferable to financial transaction handling.
                        </Typography>
                         <Typography component="li" variant="body2">
                            <strong>Frontend & CMS Development:</strong> Delivered full-stack web applications meeting strict client specifications.
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                         <Typography variant="subtitle1" fontWeight="bold">Senior IT Specialist</Typography>
                         <Typography variant="caption" color="text.secondary">Jan 2013 — Jan 2015</Typography>
                      </Stack>
                      <Typography variant="body2" color="primary.main">PT Prima Teknologi, Jakarta</Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
                        <Typography component="li" variant="body2">
                            <strong>Digital Transformation:</strong> Spearheaded web-based authorization system improving operational efficiency by 50%.
                        </Typography>
                         <Typography component="li" variant="body2">
                            <strong>High-Impact Web Development:</strong> Delivered responsive landing pages for major telecom clients (Indosat, XL).
                        </Typography>
                      </Box>
                    </Box>
                     <Divider />
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                         <Typography variant="subtitle1" fontWeight="bold">Web Developer</Typography>
                         <Typography variant="caption" color="text.secondary">Jan 2010 — Jun 2012</Typography>
                      </Stack>
                      <Typography variant="body2" color="primary.main">PT Doxadigital, Jakarta</Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1, color: 'text.secondary' }}>
                        <Typography component="li" variant="body2">
                            Analyzed business requirements and deployed custom web solutions using PHP and MySQL.
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>

                {/* Education */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
                   <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', width: 32, height: 32 }}>
                      <GraduationCap size={18} />
                    </Avatar>
                    Education
                  </Typography>
                  
                  <Stack spacing={3} mt={2}>
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                            <Typography variant="subtitle1" fontWeight="bold">MSc Information Systems</Typography>
                            <Typography variant="caption" color="text.secondary">Jun 2024 — Jan 2026</Typography>
                        </Stack>
                        <Typography variant="body2" color="primary.main">Nanyang Technological University, Singapore</Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Specialized in Enterprise Architecture, HCI, and Internet Programming. <br/>
                            <strong>GPA: 4.0/5.0</strong>
                        </Typography>
                    </Box>
                    <Divider />
                    <Box>
                         <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
                            <Typography variant="subtitle1" fontWeight="bold">Bachelor of Computer Science</Typography>
                            <Typography variant="caption" color="text.secondary">Jul 2005 — Jul 2009</Typography>
                        </Stack>
                        <Typography variant="body2" color="primary.main">BINUS University, Jakarta</Typography>
                         <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Activities: BNCC (Bina Nusantara Computer Club), HIMTI. <br/>
                            Graduated with High Merit.
                        </Typography>
                    </Box>
                  </Stack>
                </Paper>

              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AppLayout>
  );
}
