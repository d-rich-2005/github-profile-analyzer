import { Card, CardContent, Avatar, Typography, Box, Chip, Link } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BusinessIcon from '@mui/icons-material/Business'
import LinkIcon from '@mui/icons-material/Link'
import PeopleIcon from '@mui/icons-material/People'
import StarIcon from '@mui/icons-material/Star'
import ForkRightIcon from '@mui/icons-material/ForkRight'

export default function ProfileCard({ user, stats }) {
  if (!user) return null

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Avatar
            src={user.avatar_url}
            alt={user.name || user.login}
            sx={{ width: 120, height: 120, border: '3px solid #30363d' }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {user.name || user.login}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              @{user.login}
            </Typography>
            {user.bio && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {user.bio}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {user.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {user.location}
                  </Typography>
                </Box>
              )}
              {user.company && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {user.company}
                  </Typography>
                </Box>
              )}
              {user.blog && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LinkIcon fontSize="small" color="action" />
                  <Link href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" color="primary">
                    {user.blog}
                  </Link>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={<PeopleIcon />}
                label={`${user.followers} followers`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<PeopleIcon />}
                label={`${user.following} following`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<StarIcon />}
                label={`${stats?.total_stars || 0} stars`}
                size="small"
                variant="outlined"
                color="warning"
              />
              <Chip
                icon={<ForkRightIcon />}
                label={`${stats?.total_forks || 0} forks`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
