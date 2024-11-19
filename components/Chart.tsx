"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { calculatePercentage, convertFileSize } from "@/lib/utils";
import { useStorage } from "@/context/StorageContext";

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

export const Chart = () => {
  const used = useStorage();
  const percentage = calculatePercentage(used.storageUsed);

  const chartData = [
    { storage: percentage, fill: "white" }, // Pass percentage as data
  ];

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="chart-container">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + percentage * 3.6} // Correct angle calculation
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="polar-grid"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="storage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="chart-total-percentage"
                        >
                          {Math.round(percentage)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/70"
                        >
                          Espace utilisé
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Stockage Disponible</CardTitle>
        <CardDescription className="chart-description">
          {convertFileSize(used.storageUsed)} / 500Mo
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
