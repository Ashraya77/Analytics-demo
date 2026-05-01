"use client"

import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function BarChart() {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      foreColor: "var(--muted-foreground)",
    },
    colors: ["var(--chart-2)"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    grid: { borderColor: "var(--border)" },
    tooltip: { theme: "dark" },
  }

  const series = [
    {
      name: "New Users",
      data: [120, 98, 175, 140, 210, 185, 260],
    },
  ]

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={300}
    />
  )
}
