import { Card, CardContent, Typography, Box } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

export default function AISummary({ summary }) {
  if (!summary) return null

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #161b22 0%, #1a1f26 100%)',
        border: '1px solid #238636',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: '#238636' }} />
          <Typography variant="h6" fontWeight={600}>
            AI Developer Profile
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          {summary}
        </Typography>
      </CardContent>
    </Card>
  )
}
