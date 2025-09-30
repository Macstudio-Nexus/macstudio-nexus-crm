"use client";

import { useWebProjects } from "@/hooks/useProjects";
import { BookOpen, Trash } from "lucide-react";

export default function WebDevProjectTable() {
  const { webProjects, isLoading, isError } = useWebProjects();

  const project = webProjects;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;
  };

  const tableHeaders = [
    "Title",
    "Domain",
    "Stage",
    "Contact",
    "Created",
    "Actions",
  ];

  return (
    <div className="grid grid-cols-6 text-lg place-items-center h-full border bg-component-bg -mt-0.5 border-border p-4">
      {tableHeaders.map((title: string, index) => (
        <div key={index} className="project-table-item font-bold">
          {title}
        </div>
      ))}
      {project?.map((project: any, index: number) => (
        <div
          key={project.id || index}
          className="col-span-6 grid grid-cols-6 w-full place-items-center"
        >
          <div className="project-table-item">{project.title}</div>
          <div className="project-table-item">{project.domain}</div>
          <div className="project-table-item">{project.title}</div>
          <div className="project-table-item">{project.Contacts.name}</div>
          <div className="project-table-item">
            {formatDate(project.createdAt)}
          </div>
          <div className="project-table-item">
            <div className="flex justify-center items-center gap-5">
              <button className="bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer">
                <Trash />
              </button>
              <button className="bg-green-500 hover:bg-green-600 rounded-full p-2 cursor-pointer">
                <BookOpen />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
