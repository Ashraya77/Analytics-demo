import React from 'react'
import { AreaChart } from "@/components/charts/AreaChart"
import { BarChart } from "@/components/charts/BarChart"
import { PieChart } from "@/components/charts/PieChart"
import { MetricCard } from "@/components/charts/MetricCard"

const DashboardOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section with title and optional action */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back. Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month" },
          { label: "Active Users",  value: "2,350",      change: "+15.3% from last month" },
          { label: "New Signups",   value: "1,247",      change: "+8.7% from last week"  },
          { label: "Churn Rate",    value: "3.2%",       change: "-1.1% from last month"  },
        ].map((stat) => (
          <MetricCard 
            key={stat.label} 
            title={stat.label} 
            value={stat.value} 
            change={stat.change} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart — main focus */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Revenue Analytics</h2>
            <span className="text-xs text-muted-foreground font-medium">Monthly view</span>
          </div>
          <div className="p-6 pt-2">
            <AreaChart />
          </div>
        </div>

        {/* Traffic sources */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/50">
            <h2 className="text-sm font-semibold text-foreground">Traffic Sources</h2>
          </div>
          <div className="p-6">
            <PieChart />
          </div>
        </div>
      </div>

      {/* New users chart */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border/50">
          <h2 className="text-sm font-semibold text-foreground">User Growth</h2>
        </div>
        <div className="p-6 pt-2">
          <BarChart />
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview