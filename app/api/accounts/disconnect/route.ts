import { auth } from "@/lib/auth";
import { disconnectExternalAccount } from "@/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { accountId } = await request.json();
    if (!accountId) {
      return new NextResponse("Account ID is required", { status: 400 });
    }

    await disconnectExternalAccount(session.user.id, accountId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting account:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
