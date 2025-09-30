import { NextRequest } from "next/server";
import prisma from "@/lib/db";

// Delete project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.projects.delete({
      where: {
        id: (await params).id,
      },
    });

    return Response.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete project error:", error);
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}