import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all branding projects
export async function GET() {
  const project = await prisma.project.findMany({
    where: {
      type: "branding",
    },
    include: {
      Contacts: true,
    },
  });
  return NextResponse.json(project);
}
