"use server";

import prisma from "@/lib/db";
import { WebProjectDocs, WebProjectDesign, WebProjectDev } from "@/types";
import { revalidatePath } from "next/cache";
import { requireAuth } from "../_auth";

// UPDATE ITEM FROM DESIGN VIEWER
export async function updateWebProjectDesign(id: string, formData: FormData) {
  await requireAuth();
  const sitemap = formData.get("sitemap");
  const wireframes = formData.get("wireframes");
  const colorSchemeRaw = formData.get("colorScheme");
  const typographyRaw = formData.get("typography");
  const responsiveRaw = formData.get("responsive");

  const data = {
    sitemap: sitemap ? (sitemap as string) : undefined,
    wireframes: wireframes ? (wireframes as string) : undefined,
    colorScheme: colorSchemeRaw
      ? JSON.parse(colorSchemeRaw as string)
      : undefined,
    typography: typographyRaw ? JSON.parse(typographyRaw as string) : undefined,
    responsive: responsiveRaw ? responsiveRaw === "true" : undefined,
  };

  await prisma.webProject.update({
    where: { projectId: id },
    data,
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

// DELETE ITEM FROM COLOR SCHEME
export async function deleteColor(id: string, colorKey: string) {
  await requireAuth();
  const webProject = await prisma.webProject.findUnique({
    where: { projectId: id },
    select: { colorScheme: true },
  });

  if (!webProject) {
    throw new Error("Project not found");
  }

  const currentColor = (webProject.colorScheme as Record<string, number>) || {};
  delete currentColor[colorKey];

  await prisma.webProject.update({
    where: { projectId: id },
    data: { colorScheme: currentColor },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

// DELETE ITEM FROM FONTS
export async function deleteFont(id: string, fontKey: string) {
  await requireAuth();
  const webProject = await prisma.webProject.findUnique({
    where: { projectId: id },
    select: { typography: true },
  });

  if (!webProject) {
    throw new Error("Project not found");
  }

  const currentFont = (webProject.typography as Record<string, number>) || {};
  delete currentFont[fontKey];

  await prisma.webProject.update({
    where: { projectId: id },
    data: { typography: currentFont },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

// ADD ITEM TO COLOR SCHEME
export async function updateColorScheme(id: string, formData: FormData) {
  await requireAuth();
  const colorScheme = formData.get("colorScheme")
    ? JSON.parse(formData.get("colorScheme") as string)
    : {};

  await prisma.webProject.update({
    where: { projectId: id },
    data: { colorScheme },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

// ADD ITEM TO TYPOGRAPHY
export async function updateTypography(id: string, formData: FormData) {
  await requireAuth();
  const typography = formData.get("typography")
    ? JSON.parse(formData.get("typography") as string)
    : {};

  await prisma.webProject.update({
    where: { projectId: id },
    data: { typography },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

// UPDATE ITEM(S) FROM DEV VIEWER
export async function updateWebProjectDev(id: string, formData: FormData) {
  await requireAuth();
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

// ADD ITEM TO EXPENSE TABLE
export async function updateExpenses(id: string, formData: FormData) {
  await requireAuth();
  const expenses = formData.get("expenses")
    ? JSON.parse(formData.get("expenses") as string)
    : {};

  await prisma.webProject.update({
    where: { projectId: id },
    data: { expenses },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}

// DELETE ITEM FROM EXPENSE VIEWER
export async function deleteExpense(id: string, expenseKey: string) {
  await requireAuth();
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

// DELETE ITEM FROM CONTENT VIEWER
export async function deleteContent(id: string, contentIndex: string) {
  await requireAuth();
  const webProject = await prisma.webProject.findUnique({
    where: { projectId: id },
    select: { pages: true },
  });

  if (!webProject) {
    throw new Error("Page not found");
  }

  const currentContent = Array.isArray(webProject.pages)
    ? webProject.pages
    : [];
  const index = parseInt(contentIndex, 10);

  // Remove the item at the specified index
  const updatedContent = currentContent.filter((_, i) => i !== index);

  await prisma.webProject.update({
    where: { projectId: id },
    data: { pages: updatedContent },
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}
