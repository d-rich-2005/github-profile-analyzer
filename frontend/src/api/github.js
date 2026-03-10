import axios from 'axios'

// Use environment variable for production, fallback to proxy for local dev
const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const analyzeProfile = async (username) => {
  const response = await axios.get(`${API_BASE}/analyze/${username}`)
  return response.data
}
