"use client";

import { useBrandingProjects } from "@/hooks/useProjects";
import { BookOpen, Loader, Trash } from "lucide-react";

export default function BrandingProjectTable() {
  const { BrandingProjects, isLoading, isError, mutate } = useBrandingProjects();

  const project = BrandingProjects;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;
  };

  const handleDelete = async (id: any) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Rest selection after delete

        mutate();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      console.log("deleted");
    }
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
    <div className="relative grid grid-cols-3 xl:grid-cols-6 text-lg place-items-center border bg-component-bg -mt-0.5 border-border p-4">
      {tableHeaders.map((title: string, index) => {
        // Hide Package (1), Pages (3), Created (4) on md-lg
        const hideOnMdLg = [1, 3, 4].includes(index);
        return (
          <div
            key={index}
            className={`project-table-item font-bold ${
              hideOnMdLg ? "hidden xl:block" : ""
            }`}
          >
            {title}
          </div>
        );
      })}
      {isLoading ? (
        <div className="absolute top-50 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl">PROJECTS LOADING</span>
            <Loader className="animate-[spin_2s_linear_infinite] size-15" />
          </div>
        </div>
      ) : (
        project?.map((project: any, index: number) => (
          <div key={project.id || index} className="col-span-3 xl:col-span-6 grid grid-cols-3 xl:grid-cols-6 w-full place-items-center">
            <div className="project-table-item">{project.title}</div>
            <div className="project-table-item hidden xl:block">{project.domain}</div>
            <div className="project-table-item hidden xl:block">{project.Contacts.name}</div>
            <div className="project-table-item">{project.title}</div>
            <div className="project-table-item hidden xl:block">{formatDate(project.createdAt)}</div>
            <div className="project-table-item">
              <div className="flex justify-center items-center gap-5">
                <button
                  onClick={() => {
                    handleDelete(project.id);
                  }}
                  className="bg-red-400 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                >
                  <Trash className="text-border"/>
                </button>
                <button className="bg-emerald-400 hover:bg-emerald-600 rounded-full p-2 cursor-pointer">
                  <BookOpen className="text-border"/>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
