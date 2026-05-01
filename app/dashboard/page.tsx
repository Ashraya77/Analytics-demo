import { AreaChart } from "@/components/charts/AreaChart"
import { BarChart } from "@/components/charts/BarChart"
import { PieChart } from "@/components/charts/PieChart"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$45,231", change: "+20.1%" },
          { label: "Active Users",  value: "2,350",   change: "+15.3%" },
          { label: "New Signups",   value: "1,247",   change: "+8.7%"  },
          { label: "Churn Rate",    value: "3.2%",    change: "-1.1%"  },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-background p-5 space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-green-500">{stat.change} this month</p>
          </div>
        ))}
      </div>

      {/* Area chart — full width */}
      <div className="rounded-xl border bg-background p-5">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Revenue over time</h2>
        <AreaChart />
      </div>

      {/* Bar + Pie side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-background p-5">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">New users</h2>
          <BarChart />
        </div>

        <div className="rounded-xl border bg-background p-5">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Traffic sources</h2>
          <PieChart />
        </div>
      </div>
    </div>
  )
}