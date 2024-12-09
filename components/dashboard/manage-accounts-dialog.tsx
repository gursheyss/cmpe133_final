"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Settings2, Loader2 } from "lucide-react";
import type { ExternalAccount } from "@/db/schema";

interface ManageAccountsDialogProps {
  accounts: ExternalAccount[];
}

export function ManageAccountsDialog({ accounts }: ManageAccountsDialogProps) {
  const [open, setOpen] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDisconnect = async (accountId: string) => {
    try {
      setDisconnectingId(accountId);
      const response = await fetch("/api/accounts/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      toast.success("Account disconnected successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to disconnect account", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings2 className="w-4 h-4 mr-2" />
          Manage Accounts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage External Accounts</DialogTitle>
          <DialogDescription>
            View and manage your connected external accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No external accounts connected
            </p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {account.provider} • {account.type}
                    {account.lastFour && ` • ••••${account.lastFour}`}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDisconnect(account.id)}
                  disabled={disconnectingId === account.id}
                >
                  {disconnectingId === account.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Disconnect"
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
