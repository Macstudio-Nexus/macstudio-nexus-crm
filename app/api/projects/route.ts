import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all Projects
export async function GET() {
  const projects = await prisma.projects.findMany();
  return NextResponse.json(projects);
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const { title, description, domain, type, contactId, siteId} = await request.json();

    const project = await prisma.projects.create({
      data: {
        title,
        description,
        domain,
        type,
        contactId,
        siteId: siteId || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
