import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  PiggyBank,
  Settings,
  LogOut,
  Receipt,
} from "lucide-react";
import Link from "next/link";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: <Receipt className="w-6 h-6" />,
  },
  {
    title: "Budgets",
    href: "/budgets",
    icon: <PiggyBank className="w-6 h-6" />,
  },
  {
    title: "Investments",
    href: "/investments",
    icon: <LineChart className="w-6 h-6" />,
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: <Wallet className="w-6 h-6" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-6 h-6" />,
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-background border-r">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">FinanceGuard</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-2 px-2"
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut();
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
    </div>
  );
}
