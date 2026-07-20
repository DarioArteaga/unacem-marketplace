import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type RevalidateBody = {
  secret?: string;
  paths?: string[];
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as RevalidateBody;
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || body.secret !== expected) {
    return NextResponse.json({ detail: "No autorizado", status_code: 401 }, { status: 401 });
  }
  const paths = body.paths?.length ? body.paths : ["/"];
  for (const path of paths) {
    revalidatePath(path);
  }
  return NextResponse.json({ detail: "ok", paths });
}
