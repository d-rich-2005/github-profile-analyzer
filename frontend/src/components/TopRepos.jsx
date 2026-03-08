import { Card, CardContent, Typography, Box, Chip, Link, Grid } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import ForkRightIcon from '@mui/icons-material/ForkRight'

const LANGUAGE_COLORS = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  Ruby: '#701516',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
}

export default function TopRepos({ repos }) {
  if (!repos || repos.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Top Repositories
          </Typography>
          <Typography color="text.secondary">No repositories found</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Top Repositories
        </Typography>
        <Grid container spacing={2}>
          {repos.map((repo) => (
            <Grid item xs={12} md={6} key={repo.name}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #30363d',
                  height: '100%',
                  '&:hover': {
                    borderColor: '#58a6ff',
                  },
                }}
              >
                <Link
                  href={repo.url}
                  target="_blank"
                  underline="hover"
                  color="primary"
                  fontWeight={600}
                >
                  {repo.name}
                </Link>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 40,
                  }}
                >
                  {repo.description || 'No description'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  {repo.language && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e',
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {repo.language}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16, color: '#8b949e' }} />
                    <Typography variant="caption" color="text.secondary">
                      {repo.stars}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ForkRightIcon sx={{ fontSize: 16, color: '#8b949e' }} />
                    <Typography variant="caption" color="text.secondary">
                      {repo.forks}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
