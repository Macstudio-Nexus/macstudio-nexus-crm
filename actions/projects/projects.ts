"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "../_auth";
import { Project } from "@/types";

// GET ALL PROJECTS
export async function getProjects() {
  await requireAuth();
  const project = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return project;
}

// GET ALL WEB DEV PROJECTS
export async function getWebProjects() {
  await requireAuth();
  const webProjects = await prisma.project.findMany({
    where: {
      type: "web-dev",
    },
    include: {
      Contacts: true,
    },
    orderBy: { createdAt: "desc" },
  });
  revalidatePath("dashboard/admin/projects");
  return webProjects;
}

// GET ALL BRANDING PROJECTS
export async function getBrandProjects() {
  await requireAuth();
  const brandProjects = await prisma.project.findMany({
    where: {
      type: "branding",
    },
    include: {
      Contacts: true,
    },
  });
  revalidatePath("dashboard/admin/projects");
  return brandProjects;
}

// GET ALL FULL PACKAGE PROJECTS
export async function getFullProjects() {
  await requireAuth();
  const fullProjects = await prisma.project.findMany({
    where: {
      type: "full-package",
    },
  });
  revalidatePath("dashboard/admin/projects");
  return fullProjects;
}

// CREATE PROJECT
export async function createProject(formData: FormData) {
  await requireAuth();

  try {
    const title = formData.get("title") as string;
    const stage = formData.get("stage") as string;
    const type = formData.get("type") as string;
    const contactId = formData.get("contactId") as string;

    // Validate type
    if (!["web-dev", "branding", "fullpackage"].includes(type)) {
      throw new Error("Invalid project type");
    }

    const project = await prisma.project.create({
      data: {
        title,
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

    revalidatePath("/dashboard/admin/projects");
    return project;
  } catch (error) {
    console.error("Project creation error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create project"
    );
  }
}

// UPDATE PROJECT
export async function updateProject(id: string, formData: FormData) {
  const data: Project = {
    stage: formData.get("stage") as string,
    title: formData.get("title") as string,
    contactId: formData.get("contactId") as string,
    type: formData.get("title") as string,
  };

  await prisma.project.update({
    where: { id },
    data,
  });
}

// UPDATE STAGE ON PROJECT
export async function updateProjectStage(id: string, stage: string) {
  await requireAuth();

  // Validate stage
  const validStages = ["Not Started", "In Progress", "Completed"];
  if (!validStages.includes(stage)) {
    throw new Error("Invalid stage value");
  }

  try {
    await prisma.project.update({
      where: { id },
      data: { stage },
    });

    revalidatePath("/dashboard/admin/projects");
  } catch (error) {
    console.error("Stage update error:", error);
    throw new Error("Failed to update project stage");
  }
}

// DELETE PROJECT
export async function deleteProject(id: string) {
  await requireAuth();

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/dashboard/admin/projects");
}
