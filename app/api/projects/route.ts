import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all Projects
export async function GET() {
  const projects = await prisma.projects.findMany();
  return NextResponse.json(projects);
}

// POST create site
export async function POST(request: NextRequest) {
  try {
    const { title, description, domain, type, userId, siteId} = await request.json();

    const project = await prisma.projects.create({
      data: {
        title,
        description, 
        domain, 
        type,
        userId, 
        siteId: siteId || null,
        updatedAt: new Date() 
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
