import { useState } from 'react'
import { Box, TextField, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function SearchBar({ onSearch, loading }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      onSearch(username.trim())
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
        mb: 4,
      }}
    >
      <TextField
        fullWidth
        placeholder="Enter GitHub username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GitHubIcon sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !username.trim()}
        startIcon={<SearchIcon />}
        sx={{
          px: 4,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </Button>
    </Box>
  )
}
