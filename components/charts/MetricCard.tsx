import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function MetricCard({ title, value, change }: {
  title: string
  value: string
  change: string
}) {
  const isPositive = change.startsWith("+");
  const isNegative = change.startsWith("-");
  
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden group hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-muted-foreground/80">
            {title}
          </p>
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
            isPositive ? "bg-success/10 text-success" : 
            isNegative ? "bg-destructive/10 text-destructive" : 
            "bg-muted text-muted-foreground"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : 
             isNegative ? <TrendingDown className="h-3 w-3" /> : 
             <Minus className="h-3 w-3" />}
            {change.split(" ")[0]}
          </div>
        </div>
        
        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground/60 font-medium">
          {change.split(" ").slice(1).join(" ")}
        </p>
      </CardContent>
    </Card>
  )
}