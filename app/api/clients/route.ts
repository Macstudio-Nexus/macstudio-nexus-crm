import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all clients
export async function GET() {
  const clients = await prisma.contact.findMany({
  where: {
    stage: "client",
  },
})
  return NextResponse.json(clients);
}