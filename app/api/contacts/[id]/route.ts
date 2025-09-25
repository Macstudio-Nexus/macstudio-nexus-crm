import { NextRequest } from "next/server";
import prisma from "@/lib/db";

// Update contact by ID
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
    const { name, email, phoneNumber, industry, domain, meetingNotes, source, stage } = body;

    // Update contact with Prisma
    const updatedContact = await prisma.contact.update({
      where: {
        id: (await params).id,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(industry && { industry }),
        ...(domain && { domain }),
        ...(meetingNotes && { meetingNotes }),
        ...(source && { source }),
        ...(stage && { stage }),
        updatedAt: new Date(),
      },
    });

    return Response.json({
      success: true,
      contact: updatedContact,
    });
  } catch (error: unknown) {
    console.error("Update contact error:", error);
    return Response.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

// Delete contact by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.contact.delete({
      where: {
        id: (await params).id,
      },
    });

    return Response.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete Contact error:", error);
    return Response.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
