import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";
import {
  packages,
  projects,
  budgetOptions,
  estimate,
  validDate,
  statuses,
} from "../../portfolio-data";
const schema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(180),
    phone: z.string().trim().max(35).default(""),
    company: z.string().trim().max(140).default(""),
    packageId: z
      .string()
      .refine((v) => v === "custom" || packages.some((p) => p.id === v)),
    addons: z.array(z.string()).max(4),
    projectId: z
      .string()
      .refine((v) => v === "none" || projects.some((p) => p.id === v)),
    dateMode: z.enum(["Flexible", "Preferred date"]),
    date: z.string().max(10),
    location: z.string().trim().min(2).max(160),
    budget: z.string().refine((v) => budgetOptions.includes(v)),
    message: z.string().trim().min(15).max(2500),
    consent: z.literal("on"),
  })
  .superRefine((v, c) => {
    if (
      v.packageId === "custom"
        ? v.addons.length > 0
        : estimate(v.packageId, v.addons) === null
    )
      c.addIssue({
        code: "custom",
        message: "Choose compatible, unique add-ons.",
      });
    if (v.dateMode === "Preferred date" && !validDate(v.date))
      c.addIssue({ code: "custom", message: "Choose a valid preferred date." });
  });
const sameOrigin = (req: Request) =>
  req.headers.get("origin") === new URL(req.url).origin;
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json(
      { error: "This request is not allowed." },
      { status: 403 },
    );
  if (Number(req.headers.get("content-length") || 0) > 18000)
    return NextResponse.json(
      { error: "Your brief is too long." },
      { status: 413 },
    );
  let raw;
  try {
    const text = await req.text();
    if (text.length > 18000)
      return NextResponse.json(
        { error: "Your brief is too long." },
        { status: 413 },
      );
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Please submit a valid brief." },
      { status: 400 },
    );
  }
  const p = schema.safeParse(raw);
  if (!p.success)
    return NextResponse.json(
      {
        error:
          "Please check your contact details, package, add-ons, date, project notes, and consent. Include at least 15 characters about your story.",
      },
      { status: 400 },
    );
  const { consent, ...data } = p.data;
  const id = crypto.randomUUID(),
    reference = "CL-" + id.slice(0, 8).toUpperCase();
  try {
    await getDb()
      .insert(inquiries)
      .values({
        ...data,
        date: data.dateMode === "Preferred date" ? data.date : "",
        addons: JSON.stringify(data.addons),
        estimate: estimate(data.packageId, data.addons),
        id,
        reference,
        status: "New",
        createdAt: new Date().toISOString(),
      });
    return NextResponse.json({ reference }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We could not save your brief. Please try again." },
      { status: 500 },
    );
  }
}
// Owner-private Sites access plus ChatGPT identity protects this inbox.
// Add an explicit administrator allowlist before making the site public.
export async function GET() {
  if (!(await getChatGPTUser()))
    return NextResponse.json(
      { error: "Sign in is required." },
      { status: 401 },
    );
  const data = await getDb()
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));
  return NextResponse.json(
    { inquiries: data },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function PATCH(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 },
    );
  if (!(await getChatGPTUser()))
    return NextResponse.json(
      { error: "Sign in is required." },
      { status: 401 },
    );
  let raw;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const p = z
    .object({
      id: z.string().uuid(),
      status: z.string().refine((v) => statuses.includes(v)),
    })
    .safeParse(raw);
  if (!p.success)
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const updated = await getDb()
    .update(inquiries)
    .set({ status: p.data.status })
    .where(eq(inquiries.id, p.data.id))
    .returning({ id: inquiries.id });
  return NextResponse.json({ updated: updated.length > 0 });
}
