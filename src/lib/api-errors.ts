import { NextResponse } from "next/server";
import { getAuthorizationStatus } from "@/lib/auth-context";

export const toApiErrorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unexpected error.";
  const status = getAuthorizationStatus(error) ?? 400;

  return NextResponse.json({ error: message }, { status });
};
