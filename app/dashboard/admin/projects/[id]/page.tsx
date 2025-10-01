import Logout from "@/components/auth/Logout";
import prisma from "@/lib/db";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: id },
    include: { Contacts: true },
  });
  return (
    <>
      <div className="flex flex-col gap-15 text-text-light font-plex w-fit px-5 lg:px-8 py-5 lg:py-8">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-7xl text-accent">
            {project?.title}
          </h1>
          <h2 className="text-3xl">{project?.Contacts.companyName}</h2>
        </div>
        <div className="grid grid-cols-3 grid-rows-5 text-xl bg-component-bg">
          <div className="project-table-item col-span-3 !text-left !justify-items-start !py-4 text-3xl">
            Documents
          </div>
          {/* titles */}
          <div className="project-table-item font-bold">Name</div>
          <div className="project-table-item font-bold">Uploaded</div>
          <div className="project-table-item font-bold">Link</div>
          {/* Questionnaire */}
          <div className="project-table-item">Questionnaire</div>
          <div className="project-table-item">
            {project?.createdAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="project-table-item">Link</div>
          {/* Quote */}
          <div className="project-table-item">Quote</div>
          <div className="project-table-item">Uploaded</div>
          <div className="project-table-item">Link</div>
          {/* Contract */}
          <div className="project-table-item">Contract</div>
          <div className="project-table-item">Uploaded</div>
          <div className="project-table-item">Link</div>
          {/* Invoice */}
          <div className="project-table-item">Invoice</div>
          <div className="project-table-item">Uploaded</div>
          <div className="project-table-item">Link</div>
        </div>
      </div>
    </>
  );
}
