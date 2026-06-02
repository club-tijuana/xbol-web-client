import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { getSessionCookieEnv } from "@/config/serverEnv";
import {
  createSessionCookie,
  SESSION_COOKIE_EXPIRES_IN_MS,
  verifySessionCookie,
} from "@/services/sessionCookie";

export const runtime = "nodejs";

const createSessionSchema = z.object({
  idToken: z.string().min(1),
});

function getCookieOptions() {
  const sessionCookieEnv = getSessionCookieEnv();
  const secure = process.env.NODE_ENV === "production"
    ? true
    : sessionCookieEnv.FIREBASE_SESSION_COOKIE_SECURE ?? false;

  return {
    httpOnly: true,
    maxAge: SESSION_COOKIE_EXPIRES_IN_MS / 1000,
    path: process.env.NEXT_PUBLIC_BASE_PATH || "/",
    sameSite: "lax" as const,
    secure,
  };
}

function getSessionCookieName() {
  return getSessionCookieEnv().FIREBASE_SESSION_COOKIE_NAME;
}

function getConfigurationErrorResponse(error: unknown) {
  if (!(error instanceof ZodError)) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Server authentication is not configured.",
      details: error.issues.map((issue) => issue.message),
    },
    { status: 500 },
  );
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(getSessionCookieName())?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await verifySessionCookie(sessionCookie);

    return NextResponse.json({ user });
  } catch (error) {
    const configurationErrorResponse = getConfigurationErrorResponse(error);

    if (configurationErrorResponse) {
      return configurationErrorResponse;
    }

    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const body = createSessionSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!body.success) {
    return NextResponse.json({ error: "idToken is required" }, { status: 400 });
  }

  try {
    const sessionCookie = await createSessionCookie(body.data.idToken);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(getSessionCookieName(), sessionCookie, getCookieOptions());

    return response;
  } catch (error) {
    const configurationErrorResponse = getConfigurationErrorResponse(error);

    if (configurationErrorResponse) {
      return configurationErrorResponse;
    }

    return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ ok: true });

    response.cookies.set(getSessionCookieName(), "", {
      ...getCookieOptions(),
      maxAge: 0,
    });

    return response;
  } catch (error) {
    const configurationErrorResponse = getConfigurationErrorResponse(error);

    if (configurationErrorResponse) {
      return configurationErrorResponse;
    }

    throw error;
  }
}
