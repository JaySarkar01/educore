import { NextResponse } from "next/server"
import { getPublicSystemSettings } from "@/app/actions/settings"

export async function GET() {
  const settings = await getPublicSystemSettings()
  return NextResponse.json(settings)
}