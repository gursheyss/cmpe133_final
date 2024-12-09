"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Transaction } from "@/db/schema";

interface OverviewProps {
  transactions: Transaction[];
}

interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

export function Overview({ transactions }: OverviewProps) {
  const monthlyData = transactions.reduce<MonthlyData[]>((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;

    const existingMonth = acc.find((item) => item.name === monthYear);
    if (existingMonth) {
      if (transaction.type === "income") {
        existingMonth.income += Number(transaction.amount);
      } else {
        existingMonth.expenses += Math.abs(Number(transaction.amount));
      }
    } else {
      acc.push({
        name: monthYear,
        income: transaction.type === "income" ? Number(transaction.amount) : 0,
        expenses:
          transaction.type === "expense"
            ? Math.abs(Number(transaction.amount))
            : 0,
      });
    }

    return acc;
  }, []);

  monthlyData.sort((a, b) => {
    const [monthA, yearA] = a.name.split(" ");
    const [monthB, yearB] = b.name.split(" ");
    return (
      new Date(`${monthA} 1, ${yearA}`).getTime() -
      new Date(`${monthB} 1, ${yearB}`).getTime()
    );
  });

  const recentData = monthlyData.slice(-6);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={recentData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          contentStyle={{
            background: "#1f2937",
            border: "none",
            borderRadius: "6px",
          }}
          labelStyle={{ color: "#ffffff" }}
        />
        <Bar
          dataKey="income"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          name="Income"
        />
        <Bar
          dataKey="expenses"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
