import { cookies } from "next/headers";

const COOKIE = "user_prefs";

export async function POST(req: Request) {
  const prefs = await req.json();
  const cookieStore = await cookies();

  const existing = cookieStore.get(COOKIE);
  const currentPrefs = existing ? JSON.parse(existing.value) : {};
  const updatedPrefs = { ...currentPrefs, ...prefs };

  cookieStore.set(COOKIE, JSON.stringify(updatedPrefs), {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return Response.json({ ok: true });
}
