"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Investment } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface InvestmentOverviewProps {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  assetAllocation: Record<string, number>;
  investments: Investment[];
}

const COLORS = {
  stock: "#0ea5e9",
  etf: "#22c55e",
  crypto: "#f59e0b",
  bond: "#6366f1",
  mutual_fund: "#ec4899",
} as const;

const ASSET_TYPE_LABELS = {
  stock: "Stocks",
  etf: "ETFs",
  crypto: "Crypto",
  bond: "Bonds",
  mutual_fund: "Mutual Funds",
} as const;

export function InvestmentOverview({
  totalValue,
  totalGainLoss,
  totalGainLossPercent,
  assetAllocation,
  investments,
}: InvestmentOverviewProps) {
  const pieData = Object.entries(assetAllocation).map(([type, value]) => ({
    name: ASSET_TYPE_LABELS[type as keyof typeof ASSET_TYPE_LABELS],
    value,
    type,
  }));

  const barData = investments.map((inv) => ({
    name: inv.symbol,
    value: Number(inv.shares) * Number(inv.currentPrice),
    gainLoss:
      Number(inv.shares) * (Number(inv.currentPrice) - Number(inv.averageCost)),
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value
                </p>
                <h2 className="text-2xl font-bold">${totalValue.toFixed(2)}</h2>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Gain/Loss
                </p>
                <h2
                  className={cn(
                    "text-2xl font-bold",
                    totalGainLoss >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {totalGainLoss >= 0 ? "+" : ""}${totalGainLoss.toFixed(2)} (
                  {totalGainLossPercent >= 0 ? "+" : ""}
                  {totalGainLossPercent.toFixed(2)}%)
                </h2>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`]}
                  />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[entry.type as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[entry.type as keyof typeof COLORS],
                  }}
                />
                <span className="text-sm">
                  {entry.name} ({((entry.value / totalValue) * 100).toFixed(1)}
                  %)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
