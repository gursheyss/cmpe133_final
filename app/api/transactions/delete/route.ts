import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { transactionId } = await request.json();
    if (!transactionId) {
      return new NextResponse("Transaction ID is required", { status: 400 });
    }

    const result = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          eq(transactions.id, transactionId),
          eq(transactions.isExternal, false)
        )
      )
      .returning();

    if (!result.length) {
      return new NextResponse("Transaction not found or cannot be deleted", {
        status: 404,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
