import prisma from "@/lib/db";
import { WebProjectDocs, WebProjectDesign, WebProjectDev } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateWebProjectDesign(id: string, formData: FormData) {
  const data: WebProjectDesign = {
    sitemap: formData.get("sitemap") as string | undefined,
    wireframes: formData.get("wireframes") as string | undefined,
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
    domain: formData.get("domain") as string | undefined,
    githubLink: formData.get("githubLink") as string | undefined,
    pages: formData.get("pages")
      ? JSON.parse(formData.get("pages") as string)
      : undefined,
    integrations: formData.get("integrations")
      ? JSON.parse(formData.get("integrations") as string)
      : undefined,
    vercelLink: formData.get("vercelLink") as string | undefined,
  };

  await prisma.webProject.update({
    where: { id },
    data,
  });

  revalidatePath(`/dashboard/admin/projects/${id}`);
}
