import { NextRequest } from "next/server";
import prisma from "@/lib/db";

// Update web dev project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let body;
    try {
      const text = await request.text();
      console.log("Raw request body:", text);
      body = JSON.parse(text);
    } catch (error) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }
    const {
      sitemap,
      wireframes,
      colorScheme,
      typography,
      responsive,
      domain,
      githubLink,
      vercelLink,
      integrations,
      projectNotes,
      expenses,
      questionnaire,
      quote,
      contract,
      invoice,
    } = body;

    const { id } = await params;

    // Update web dev project with prisma
    const updatedWebProject = await prisma.webProject.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(sitemap && { sitemap }),
        ...(wireframes && { wireframes }),
        ...(colorScheme && { colorScheme }),
        ...(typography && { typography }),
        ...(responsive && { responsive }),
        ...(domain && { domain }),
        ...(githubLink && { githubLink }),
        ...(vercelLink && { vercelLink }),
        ...(integrations && { integrations }),
        ...(projectNotes && { projectNotes }),
        ...(expenses && { expenses }),
        ...(questionnaire && { questionnaire }),
        ...(quote && { quote }),
        ...(contract && { contract }),
        ...(invoice && { invoice }),
      },
    });

    return Response.json({
      success: true,
      contact: updatedWebProject,
    });
  } catch (error: unknown) {
    console.error("Update contact error:", error);
    return Response.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}


// delete web project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    await prisma.webProject.delete({
      where: {
        id: (await params).id,
      },
    });

    return Response.json({
      success: true,
      message: "Web project deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete web project error:", error);
    return Response.json({ error: "Failed to delete web project" }, { status: 500 });
  }
}
