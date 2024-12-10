"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Investment } from "@/db/schema";
import { cn } from "@/lib/utils";
import { AddInvestmentDialog } from "./add-investment-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { updateInvestmentPricing } from "@/app/(app)/dashboard/actions";

interface InvestmentListProps {
  investments: Investment[];
}

export function InvestmentList({ investments }: InvestmentListProps) {
  async function handleUpdatePrice(investment: Investment) {
    const formData = new FormData();
    formData.append("investmentId", investment.id);
    // In a real app, you would fetch the current price from an API
    const mockNewPrice =
      Number(investment.currentPrice) * (1 + (Math.random() - 0.5) * 0.02);
    formData.append("currentPrice", mockNewPrice.toString());
    await updateInvestmentPricing(formData);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investments</CardTitle>
        <AddInvestmentDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((investment) => {
            const value =
              Number(investment.shares) * Number(investment.currentPrice);
            const cost =
              Number(investment.shares) * Number(investment.averageCost);
            const gainLoss = value - cost;
            const gainLossPercent = (gainLoss / cost) * 100;

            return (
              <div
                key={investment.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{investment.symbol}</h3>
                    <span className="text-sm text-muted-foreground">
                      {investment.name}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {Number(investment.shares).toFixed(6)} shares @ $
                    {Number(investment.currentPrice).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${value.toFixed(2)}</div>
                    <div
                      className={cn(
                        "text-sm",
                        gainLoss >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {gainLoss >= 0 ? "+" : ""}${gainLoss.toFixed(2)} (
                      {gainLoss >= 0 ? "+" : ""}
                      {gainLossPercent.toFixed(2)}%)
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdatePrice(investment)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {investments.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">
              No investments yet. Add one to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
