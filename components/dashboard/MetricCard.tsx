// components/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricCard({ title, value, change }: {
  title: string
  value: string
  change: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  )
}