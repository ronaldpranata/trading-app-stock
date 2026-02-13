import { NextResponse } from "next/server";
import { authorData } from "./authorData";

export async function GET() {
  return NextResponse.json(authorData);
}
