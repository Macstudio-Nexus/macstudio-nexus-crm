import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST create user
export async function POST(request: NextRequest) {
  try {
    const { name, email, phoneNumber, companyName, roleId } = await request.json();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        companyName,
        roleId,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
