"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./_auth";

// GET ALL PROJECTS
export async function getProjects() {
  await requireAuth();
  const project = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
  return project;
}

