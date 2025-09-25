import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all contacts
export async function GET() {
  const contacts = await prisma.contact.findMany();
  return NextResponse.json(contacts);
}

// POST create contact
export async function POST(request: NextRequest) {
  try {
    const { name, email, phoneNumber, industry, domain, meetingNotes, source, stage } = await request.json();

    const contacts = await prisma.contact.create({
      data: {
        name,
        email,
        phoneNumber,
        industry,
        domain,
        meetingNotes,
        source, 
        stage
      },
    });

    return NextResponse.json(contacts, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
