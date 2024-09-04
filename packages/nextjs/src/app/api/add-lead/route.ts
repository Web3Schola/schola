import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, name } = await request.json();

  try {
    if (!email) throw new Error("Se requiere un email");
    await sql`INSERT INTO Leads (Email, name) VALUES (${email}, ${name});`;
    return NextResponse.json(
      { message: "Lead añadido con éxito" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al añadir el lead" },
      { status: 500 },
    );
  }
}
