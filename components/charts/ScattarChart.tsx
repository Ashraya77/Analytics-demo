// components/ScatterChart.tsx
"use client"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { sessions: 1200, bounce: 62 }, { sessions: 3400, bounce: 38 },
  { sessions: 800,  bounce: 71 }, { sessions: 5600, bounce: 28 },
  { sessions: 2100, bounce: 45 }, { sessions: 6800, bounce: 22 },
]

export function SessionsScatterChart() {
  return (
    <Card>
      <CardHeader><CardTitle>Sessions vs Bounce Rate</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sessions" name="Sessions" />
            <YAxis dataKey="bounce" name="Bounce %" unit="%" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="hsl(var(--primary))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}