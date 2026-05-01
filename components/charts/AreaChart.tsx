"use client"

import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export function AreaChart() {
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    tooltip: { theme: "dark" },
    grid: { borderColor: "#ffffff10" },
  }

  const series = [
    {
      name: "Revenue",
      data: [4000, 3000, 5000, 4800, 7000, 6500, 9000],
    },
  ]

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={300}
    />
  )
}