"use server";

import { signIn } from "@/lib/auth";

export async function signInAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
}

export async function signUpAction(
  prevState: { error: string | null },
  formData: FormData
) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return { error: data.error || "Registration failed" };
  }

  await signIn("credentials", {
    email,
    password,
    redirect: true,
  });

  return { error: null };
}
