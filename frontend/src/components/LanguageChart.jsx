import { Card, CardContent, Typography } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = [
  '#3572A5', // Python blue
  '#f1e05a', // JavaScript yellow
  '#e34c26', // HTML orange
  '#563d7c', // CSS purple
  '#00ADD8', // Go cyan
  '#b07219', // Java brown
  '#178600', // C# green
  '#f34b7d', // C++ pink
  '#701516', // Ruby red
  '#438eff', // TypeScript blue
]

export default function LanguageChart({ languages }) {
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Languages
          </Typography>
          <Typography color="text.secondary">No language data available</Typography>
        </CardContent>
      </Card>
    )
  }

  const data = Object.entries(languages)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Languages
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
