import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all sites
export async function GET() {
  const sites = await prisma.sites.findMany();
  return NextResponse.json(sites);
}

// POST create site
export async function POST(request: NextRequest) {
  try {
    const { name, domain, description, userId } = await request.json();

    const site = await prisma.sites.create({
      data: {
        name,
        domain,
        description,
        userId,
        updatedAt: new Date() 
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
