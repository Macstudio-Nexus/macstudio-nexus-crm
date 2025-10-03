"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./_auth";

// GET ALL USERS
export async function getUsers() {
  await requireAuth();
  const users = await prisma.user.findMany({});

  return users;
}

// UPDATE USER
export async function updateUser(id: string, formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const roleId = parseInt(formData.get("roleId") as string);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      phoneNumber,
      roleId,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/admin/users");
  return updatedUser;
}

// DELETE USER
export async function deleteUser(id: string) {
  await requireAuth();

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/dashboard/admin/users");
}

// CREATE USER
export async function createUser(formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const roleId = parseInt(formData.get("roleId") as string);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phoneNumber,
      roleId,
    },
  });

  revalidatePath("/dashboard/admin/users");
  return user;
}
