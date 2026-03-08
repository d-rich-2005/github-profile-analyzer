import { useState } from 'react'
import { Container, Typography, Box, Alert, Grid, CircularProgress } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import LanguageChart from './components/LanguageChart'
import CommitHeatmap from './components/CommitHeatmap'
import TopRepos from './components/TopRepos'
import AISummary from './components/AISummary'
import { analyzeProfile } from './api/github'

export default function App() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (username) => {
    setLoading(true)
    setError(null)
    setProfileData(null)

    try {
      const data = await analyzeProfile(username)
      setProfileData(data)
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to analyze profile. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <GitHubIcon sx={{ fontSize: 48 }} />
          <Typography variant="h3" fontWeight={700}>
            GitHub Profile Analyzer
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Enter a GitHub username to get a visual breakdown of their coding profile,
          including languages, repositories, and an AI-generated developer summary.
        </Typography>
      </Box>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {profileData && !loading && (
        <Box sx={{ mt: 4 }}>
          <ProfileCard user={profileData.user} stats={profileData.stats} />

          <Box sx={{ mb: 3 }}>
            <AISummary summary={profileData.ai_summary} />
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <LanguageChart languages={profileData.languages} />
            </Grid>
            <Grid item xs={12} md={7}>
              <CommitHeatmap activity={profileData.commit_activity} />
            </Grid>
          </Grid>

          <TopRepos repos={profileData.top_repos} />
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mt: 6, py: 3, borderTop: '1px solid #30363d' }}>
        <Typography variant="body2" color="text.secondary">
          Built with React, FastAPI, and Claude AI
        </Typography>
      </Box>
    </Container>
  )
}
