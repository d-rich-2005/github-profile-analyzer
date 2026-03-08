import { Card, CardContent, Typography, Box } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CommitHeatmap({ activity }) {
  if (!activity || activity.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Commit Activity
          </Typography>
          <Typography color="text.secondary">No commit data available</Typography>
        </CardContent>
      </Card>
    )
  }

  // Group by month for cleaner visualization
  const monthlyData = activity.reduce((acc, item) => {
    const date = new Date(item.date)
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!acc[monthKey]) {
      acc[monthKey] = 0
    }
    acc[monthKey] += item.count
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, commits]) => ({
    month,
    commits,
  }))

  const totalCommits = activity.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Commit Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCommits} commits this year
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#8b949e', fontSize: 12 }}
              axisLine={{ stroke: '#30363d' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8b949e', fontSize: 12 }}
              axisLine={{ stroke: '#30363d' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 8,
              }}
              labelStyle={{ color: '#c9d1d9' }}
            />
            <Bar
              dataKey="commits"
              fill="#238636"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
