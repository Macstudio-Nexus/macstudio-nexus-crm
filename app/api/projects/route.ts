import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all Projects
export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

// POST create project
export async function POST(request: NextRequest) {
  try {
    const { title, description, stage, type, contactId } = await request.json();

    // Validate type
    if (!["web-dev", "branding", "fullpackage"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid project type" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        contactId,
        stage,
        ...(type === "web-dev" && {
          webProject: {
            create: {},
          },
        }),
        ...(type === "branding" && {
          brandingProject: {
            create: {},
          },
        }),
      },
      include: {
        webProject: true,
        brandingProject: true,
        Contacts: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
