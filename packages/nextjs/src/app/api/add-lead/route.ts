import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  try {
    if (!email) throw new Error("Se requiere un email");
    await sql`INSERT INTO Leads (Email) VALUES (${email}), INSERT INTO Leads(name) VALUES(${name});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const leads = await sql`SELECT * FROM Leads;`;
  return NextResponse.json({ leads }, { status: 200 });
}
