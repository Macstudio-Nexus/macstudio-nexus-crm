"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./_auth";

// GET ALL CONTACTS
export async function getContacts() {
  await requireAuth();
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
  return contacts;
}

export async function getClients() {
  await requireAuth();
  const clients = await prisma.contact.findMany({
    where: {
      stage: "client",
    },
  });
  return clients;
}

// CREATE CONTACT
export async function createContact(formData: FormData) {
  await requireAuth();

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    companyName: formData.get("companyName") as string,
    domain: formData.get("domain") as string,
    meetingNotes: formData.get("meetingNotes") as string,
    source: formData.get("source") as string,
    stage: formData.get("stage") as string,
  };

  const contact = await prisma.contact.create({ data });
  revalidatePath("/dashboard/admin/contacts");
  return contact;
}

// UPDATE CONTACT
export async function updateContact(id: string, formData: FormData) {
  await requireAuth();

  const updates: Record<string, any> = {};

  const fields = [
    "name",
    "email",
    "phoneNumber",
    "industry",
    "domain",
    "meetingNotes",
    "source",
    "stage",
    "companyName",
  ];
  fields.forEach((field) => {
    const value = formData.get(field);
    if (value) updates[field] = value;
  });

  const contact = await prisma.contact.update({
    where: { id },
    data: { ...updates, updatedAt: new Date() },
  });

  revalidatePath("/dashboard/admin/contacts");
  return contact;
}

// DELETE CONTACT
export async function deleteContact(id: string) {
  await requireAuth();

  await prisma.contact.delete({
    where: { id },
  });

  revalidatePath("/dashboard/admin/contacts");
}
