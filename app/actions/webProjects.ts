"use server";

import prisma from "@/lib/db";
import { WebProjectDocs, WebProjectDesign, WebProjectDev } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateWebProjectDesign(id: string, formData: FormData) {
  const data: WebProjectDesign = {
    sitemap: formData.get("sitemap") as string,
    wireframes: formData.get("wireframes") as string,
    colorScheme: formData.get("colorScheme")
      ? JSON.parse(formData.get("colorScheme") as string)
      : undefined,
    typography: formData.get("typography")
      ? JSON.parse(formData.get("typography") as string)
      : undefined,
    responsive: formData.get("responsive") === "true",
  };

  await prisma.webProject.update({
    where: { id },
    data,
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

export async function updateWebProjectDev(id: string, formData: FormData) {
  const data: WebProjectDev = {
    domain: formData.get("domain") as string,
    githubLink: formData.get("githubLink") as string,
    pages: formData.get("pages")
      ? JSON.parse(formData.get("pages") as string)
      : undefined,
    integrations: formData.get("integrations")
      ? JSON.parse(formData.get("integrations") as string)
      : undefined,
    vercelLink: formData.get("vercelLink") as string,
  };

  await prisma.webProject.update({
    where: { id },
    data,
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

export async function updateExpenses(id: string, formData: FormData) {
  const expenses = formData.get("expenses")
    ? JSON.parse(formData.get("expenses") as string)
    : {};

  await prisma.webProject.update({
    where: { projectId: id },
    data: { expenses },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

export async function deleteExpense(id: string, expenseKey: string) {
  const webProject = await prisma.webProject.findUnique({
    where: { projectId: id },
    select: { expenses: true },
  });

  if (!webProject) {
    throw new Error("Project not found");
  }

  const currentExpenses = (webProject.expenses as Record<string, number>) || {};
  delete currentExpenses[expenseKey];

  await prisma.webProject.update({
    where: { projectId: id },
    data: { expenses: currentExpenses },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

export async function updateContent(id: string, formData: FormData) {
  const content = formData.get("content")
    ? JSON.parse(formData.get("content") as string)
    : [];

  await prisma.webProject.update({
    where: { projectId: id },
    data: { pages: content },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

export async function deleteContent(id: string, contentIndex: string) {
  const webProject = await prisma.webProject.findUnique({
    where: { projectId: id },
    select: { pages: true },
  });

  if (!webProject) {
    throw new Error("Page not found");
  }

  const currentContent = Array.isArray(webProject.pages) ? webProject.pages : [];
  const index = parseInt(contentIndex, 10);

  // Remove the item at the specified index
  const updatedContent = currentContent.filter((_, i) => i !== index);

  await prisma.webProject.update({
    where: { projectId: id },
    data: { pages: updatedContent },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}
