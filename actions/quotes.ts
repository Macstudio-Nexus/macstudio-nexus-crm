"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./_auth";

// GET ALL QUOTES
export async function getQuotes() {
  await requireAuth();
  const quotes = await prisma.quote.findMany({
    include: {
      contact: true,
      project: true,
    },
    orderBy: { date: "desc" },
  });
  return quotes;
}

// GET QUOTES BY PROJECT
export async function getQuotesByProject(projectId: string) {
  await requireAuth();
  const quotes = await prisma.quote.findMany({
    where: { projectId },
    include: {
      contact: true,
    },
    orderBy: { date: "desc" },
  });
  return quotes;
}

// GET QUOTES BY CONTACT
export async function getQuotesByContact(contactId: string) {
  await requireAuth();
  const quotes = await prisma.quote.findMany({
    where: { contactId },
    include: {
      project: true,
    },
    orderBy: { date: "desc" },
  });
  return quotes;
}

// CREATE QUOTE
export async function createQuote(formData: FormData) {
  await requireAuth();

  try {
    const contactId = formData.get("contactId") as string;
    const projectId = formData.get("projectId") as string;
    const expensesString = formData.get("expenses") as string;
    const expenses = JSON.parse(expensesString);

    // For now, we'll set link as empty string since you're setting up cloud storage
    // You can update this later when you implement PDF generation/storage
    const link = "";

    const quote = await prisma.quote.create({
      data: {
        contactId,
        projectId,
        expenses,
        link,
      },
      include: {
        contact: true,
        project: true,
      },
    });

    revalidatePath("/dashboard/admin/quotes");
    revalidatePath(`/dashboard/admin/projects/${projectId}`);
    return quote;
  } catch (error) {
    console.error("Quote creation error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create quote"
    );
  }
}

// UPDATE QUOTE
export async function updateQuote(id: string, formData: FormData) {
  await requireAuth();

  try {
    const expensesString = formData.get("expenses") as string;
    const expenses = JSON.parse(expensesString);
    const link = formData.get("link") as string;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        expenses,
        link,
      },
    });

    revalidatePath("/dashboard/admin/quotes");
    return quote;
  } catch (error) {
    console.error("Quote update error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update quote"
    );
  }
}

// DELETE QUOTE
export async function deleteQuote(id: string) {
  await requireAuth();

  await prisma.quote.delete({
    where: { id },
  });

  revalidatePath("/dashboard/admin/quotes");
}
