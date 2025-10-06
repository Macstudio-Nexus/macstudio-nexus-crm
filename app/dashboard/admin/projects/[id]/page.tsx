import prisma from "@/lib/db";
import ProjectContactViewer from "@/components/ui/projects/ProjectContactViewer";
import ProjectDocumentsViewer from "@/components/ui/projects/ProjectDocumentsViewer";
import ProjectExpensesViewer from "@/components/ui/projects/ProjectExpensesViewer";
import ProjectContentViewer from "@/components/ui/projects/ProjectContentViewer";
import {
  BasicContact,
  WebProjectDocs,
  Content,
  WebProjectDesign,
} from "@/types";
import { Key } from "lucide-react";
import ProjectDesignViewer from "@/components/ui/projects/ProjectDesignViewer";

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

  const design: WebProjectDesign = {
    sitemap: project?.webProject?.sitemap ?? null,
    wireframes: project?.webProject?.wireframes ?? null,
    colorScheme: project?.webProject?.colorScheme as Record<
      string,
      string
    > | null,
    typography: project?.webProject?.typography as Record<
      string,
      string
    > | null,
    responsive: project?.webProject?.responsive ?? null,
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
        <div className="items-center justify-center hidden xl:flex">
          <div className="flex flex-col 2xl:grid 2xl:grid-cols-[minmax(300px,400px)_minmax(300px,400px)_minmax(250px,400px)] 2xl:grid-rows-[auto_minmax(250px,auto)] items-stretch gap-5 max-w-fit">
            <div>
              <ProjectContactViewer {...contact} />
            </div>
            <div>
              <ProjectDocumentsViewer {...docs} />
            </div>
            <ProjectExpensesViewer
              expenses={project?.webProject?.expenses as Record<string, number>}
              id={id}
            />
            <div className="col-span-2 h-full min-h-[366px]">
              <ProjectContentViewer
                content={
                  (project?.webProject?.pages as unknown as Content[]) || []
                }
                id={id}
              />
            </div>
            <div className="justify-self-center row-span-2">
              <ProjectDesignViewer {...design} id={id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
