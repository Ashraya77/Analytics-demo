// components/AreaChart.tsx
"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { week: "Wk1", users: 1800 }, { week: "Wk2", users: 2200 },
  { week: "Wk3", users: 1950 }, { week: "Wk4", users: 2800 },
  { week: "Wk5", users: 3100 }, { week: "Wk6", users: 2750 },
  { week: "Wk7", users: 3400 }, { week: "Wk8", users: 3900 },
]

export function WeeklyUsersChart() {
  return (
    <Card>
      <CardHeader><CardTitle>Weekly Active Users</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#userGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}