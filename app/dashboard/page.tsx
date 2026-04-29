import {
  Users,
  MousePointerClick,
  Timer,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


type Metric = {
  label: string
  value: string
  delta: string
  deltaUp: boolean
  icon: React.ElementType
}

type PageRow = {
  path: string
  sessions: string
  delta: string
  deltaUp: boolean
}

type GoalRow = {
  name: string
  pct: number
}


const metrics: Metric[] = [
  { label: "Total users",        value: "84,291",  delta: "+12.4%", deltaUp: true,  icon: Users },
  { label: "Sessions",           value: "213,047", delta: "+8.1%",  deltaUp: true,  icon: MousePointerClick },
  { label: "Avg. session",       value: "4m 38s",  delta: "-2.3%",  deltaUp: false, icon: Timer },
  { label: "Bounce rate",        value: "34.7%",   delta: "-1.2pts",deltaUp: true,  icon: TrendingDown },
]

const topPages: PageRow[] = [
  { path: "/home",     sessions: "42,180", delta: "+8.2%",  deltaUp: true  },
  { path: "/pricing",  sessions: "18,340", delta: "+14.5%", deltaUp: true  },
  { path: "/docs",     sessions: "14,920", delta: "-3.1%",  deltaUp: false },
  { path: "/blog",     sessions: "11,250", delta: "+5.8%",  deltaUp: true  },
  { path: "/login",    sessions: "9,870",  delta: "+1.2%",  deltaUp: true  },
]

const goals: GoalRow[] = [
  { name: "Sign-ups",          pct: 78 },
  { name: "Free trial starts", pct: 61 },
  { name: "Upgrade clicks",    pct: 44 },
  { name: "Demo requests",     pct: 32 },
]


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Analytics overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Last 30 days · Apr 1 – Apr 29, 2026</p>
        </div>
        <Badge variant="secondary" className="text-xs">Live</Badge>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {m.label}
              </CardTitle>
              <m.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{m.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${m.deltaUp ? "text-emerald-600" : "text-red-500"}`}>
                {m.deltaUp
                  ? <ArrowUpRight className="h-3 w-3" />
                  : <ArrowDownRight className="h-3 w-3" />}
                {m.delta} vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row — slot in your own charts here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sessions chart — replace CardContent with your chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sessions over time</CardTitle>
            <CardDescription className="text-xs">Daily sessions, last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-center justify-center rounded-md bg-muted/50 text-sm text-muted-foreground border border-dashed">
              Chart goes here
            </div>
          </CardContent>
        </Card>

        {/* Traffic source chart — replace CardContent with your chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Traffic sources</CardTitle>
            <CardDescription className="text-xs">Session share by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-center justify-center rounded-md bg-muted/50 text-sm text-muted-foreground border border-dashed">
              Chart goes here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top pages</CardTitle>
            <CardDescription className="text-xs">Ranked by sessions this period</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 text-xs">Path</TableHead>
                  <TableHead className="text-right text-xs">Sessions</TableHead>
                  <TableHead className="text-right pr-6 text-xs">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map((row) => (
                  <TableRow key={row.path}>
                    <TableCell className="pl-6 font-mono text-xs">{row.path}</TableCell>
                    <TableCell className="text-right text-sm">{row.sessions}</TableCell>
                    <TableCell className={`text-right pr-6 text-xs font-medium ${row.deltaUp ? "text-emerald-600" : "text-red-500"}`}>
                      {row.delta}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Goal completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Goal completion</CardTitle>
            <CardDescription className="text-xs">% of target reached this period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {goals.map((g) => (
              <div key={g.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{g.name}</span>
                  <span className="text-muted-foreground">{g.pct}%</span>
                </div>
                <Progress value={g.pct} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}