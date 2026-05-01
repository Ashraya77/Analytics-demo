"use client"

import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function PieChart() {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels: ["Direct", "Organic", "Referral", "Social"],
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    tooltip: { theme: "dark" },
  }

  const series = [400, 300, 200, 100]

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={300}
    />
  )
}