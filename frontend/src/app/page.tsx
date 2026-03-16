import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          FightClip AI
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          AI-Powered Fight Clip Analysis & Management
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" size="large">
            Get Started
          </Button>
          <Button variant="outlined" size="large">
            Learn More
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 8, display: 'grid', gridTemplateColumns: { xs: '1', md: '3' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload & Analyze
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload fight clips and let AI analyze them for techniques, strategies, and highlights.
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Organize Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Build your personal library of fight clips with smart categorization and tagging.
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Share & Compare
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share clips with others and compare techniques across different fighters.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
