"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import type { Transaction } from "@/db/schema";

interface OverviewProps {
  transactions: Transaction[];
}

interface DailyData {
  name: string;
  date: Date;
  balance: number;
  income: number;
  expenses: number;
}

export function Overview({ transactions }: OverviewProps) {
  // Group transactions by date
  const dailyData = transactions.reduce<DailyData[]>((acc, transaction) => {
    const date = new Date(transaction.date);
    // Reset time to midnight for consistent grouping
    date.setHours(0, 0, 0, 0);
    const dateStr = format(date, "MMM d");

    const existingDay = acc.find(
      (item) => item.date.getTime() === date.getTime()
    );
    const amount = Number(transaction.amount);

    if (existingDay) {
      existingDay.balance += amount;
      if (transaction.type === "income") {
        existingDay.income += amount;
      } else {
        existingDay.expenses += Math.abs(amount);
      }
    } else {
      acc.push({
        name: dateStr,
        date,
        balance: amount,
        income: transaction.type === "income" ? amount : 0,
        expenses: transaction.type === "expense" ? Math.abs(amount) : 0,
      });
    }

    return acc;
  }, []);

  // Sort by date
  dailyData.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate running balance
  let runningBalance = 0;
  for (const data of dailyData) {
    runningBalance += data.balance;
    data.balance = runningBalance;
  }

  // Get the last 30 days of data
  const recentData = dailyData.slice(-30);

  // Find min and max values for better Y-axis scaling
  const minBalance = Math.min(...recentData.map((d) => d.balance));
  const maxBalance = Math.max(...recentData.map((d) => d.balance));
  const yAxisDomain = [
    Math.floor(minBalance - Math.abs(minBalance * 0.1)),
    Math.ceil(maxBalance + Math.abs(maxBalance * 0.1)),
  ];

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={recentData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={yAxisDomain}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              background: "#1f2937",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#ffffff" }}
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              undefined,
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorBalance)"
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
