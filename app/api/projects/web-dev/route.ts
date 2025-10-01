import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all web dev projects
export async function GET() {
  const project = await prisma.project.findMany({
    where: {
      type: "web-dev",
    },
    include: {
      Contacts: true,
    },
  });
  return NextResponse.json(project);
}

// POST create
