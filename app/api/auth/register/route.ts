import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth-utils";
import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema } from "@/lib/zod";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password, name } = await registerSchema.parseAsync(json);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "Email already registered" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
    });

    return new NextResponse(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Something went wrong",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
