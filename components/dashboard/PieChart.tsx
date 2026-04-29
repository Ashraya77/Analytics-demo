// components/PieChart.tsx
"use client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Organic", value: 42 },
  { name: "Direct", value: 28 },
  { name: "Social", value: 18 },
  { name: "Email", value: 12 },
]
const COLORS = ["#3266ad", "#1d9e75", "#d85a30", "#7f77dd"]

export function TrafficPieChart() {
  return (
    <Card>
      <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}