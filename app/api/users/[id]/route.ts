import { NextRequest } from "next/server";
import prisma from "@/lib/db";

// Update user by ID
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
    const { name, email, phoneNumber, companyName, roleId } = body;

    // Update user with Prisma
    const updatedUser = await prisma.user.update({
      where: {
        id: (await params).id,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(roleId && { roleId }),
        ...(phoneNumber && { phoneNumber }),
        ...(companyName && { companyName }),
        updatedAt: new Date(),
      },
    });

    return Response.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Update user error:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.user.delete({
      where: {
        id: (await params).id,
      },
    });

    return Response.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete user error:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
