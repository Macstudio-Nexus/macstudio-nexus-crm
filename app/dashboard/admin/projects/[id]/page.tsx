import prisma from "@/lib/db";
import ProjectContactViewer from "@/components/ui/projects/ProjectContactViewer";
import ProjectDocumentsViewer from "@/components/ui/projects/ProjectDocumentsViewer";
import ProjectExpensesViewer from "@/components/ui/projects/ProjectExpensesViewer";
import { BasicContact, WebProjectDocs } from "@/types";
import { Key } from "lucide-react";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: id },
    include: { Contacts: true, webProject: true },
  });

  const contact: BasicContact = {
    name: project?.Contacts.name,
    email: project?.Contacts.email,
    phoneNumber: project?.Contacts.phoneNumber,
    companyName: project?.Contacts.companyName,
  };

  const docs: WebProjectDocs = {
    questionnaire: project?.webProject?.questionnaire,
    quote: project?.webProject?.quote,
    contract: project?.webProject?.contract,
    invoice: project?.webProject?.invoice,
  };

  return (
    <>
      <div className="flex flex-col gap-20 text-text-light font-plex w-full min-h-screen px-5 lg:px-8 py-5 lg:py-8">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-3xl lg:text-5xl 2xl:text-7xl text-accent font-semibold">
            {project?.title}
          </h1>
          <h2 className="text-3xl">
            Company:{" "}
            <span className="text-accent">{project?.Contacts.companyName}</span>
          </h2>
        </div>
        <div className="items-center justify-center hidden lg:flex">
          <div className="grid grid-cols-[1fr_1fr_auto] grid-rows-4 place-items-start space-x-5">
            <div>
              <ProjectContactViewer {...contact} />
            </div>
            <div>
              <ProjectDocumentsViewer {...docs} />
            </div>
            <div>
              <ProjectExpensesViewer
                expenses={
                  project?.webProject?.expenses as Record<string, number>
                }
                id={id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
