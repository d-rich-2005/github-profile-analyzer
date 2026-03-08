import axios from 'axios'

const API_BASE = '/api'

export const analyzeProfile = async (username) => {
  const response = await axios.get(`${API_BASE}/analyze/${username}`)
  return response.data
}
