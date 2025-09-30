"use client";

import { useBrandingProjects } from "@/hooks/useProjects";

export default function BrandingProjectTable() {
  const { BrandingProjects, isLoading, isError } = useBrandingProjects();

  const project = BrandingProjects;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
  };

  const tableHeaders = [
    "Title",
    "Package",
    "Stage",
    "Pages",
    "Created",
    "Actions",
  ];

  return (
    <div className="grid grid-cols-6 text-lg place-items-center border bg-component-bg -mt-0.5 border-border p-4">
      {tableHeaders.map((title: string, index) => (
        <div
          key={index}
          className="project-table-item font-bold"
        >
          {title}
        </div>
      ))}
      {project?.map((project: any, index: number) => (
        <div key={project.id || index} className="col-span-6 grid grid-cols-6 w-full place-items-center">
          <div className="project-table-item">{project.title}</div>
          <div className="project-table-item">{project.domain}</div>
          <div className="project-table-item">{project.Contacts.name}</div>
          <div className="project-table-item">{project.title}</div>
          <div className="project-table-item">{formatDate(project.createdAt)}</div>
          <div className="project-table-item">{project.title}</div>
        </div>
      ))}
    </div>
  );
}
