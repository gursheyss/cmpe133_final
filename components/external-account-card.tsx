import type { ExternalAccount } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { Loader2, UnplugIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ExternalAccountCardProps {
  account: ExternalAccount;
}

export function ExternalAccountCard({ account }: ExternalAccountCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/accounts/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: account.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      router.refresh();
    } catch (error) {
      console.error("Error disconnecting account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {account.name}
          {account.lastFour && (
            <span className="text-muted-foreground ml-1">
              •••• {account.lastFour}
            </span>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDisconnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UnplugIcon className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(Number.parseFloat(account.balance))}
        </div>
        <p className="text-xs text-muted-foreground">
          {account.provider} • {account.type}
        </p>
      </CardContent>
    </Card>
  );
}
