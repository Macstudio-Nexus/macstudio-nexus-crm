"use client";

import { BookOpen, Loader, Trash } from "lucide-react";
import Link from "next/link";
import { useProjectsContext } from "@/context/ProjectsContext";
import { useState } from "react";

export default function WebDevProjectTable() {
  const {
    webProjects: { webProjects, isLoading, error, refetch },
  } = useProjectsContext();
  const [isPending, setIsPending] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;
  };

  const tableHeaders = ["Title", "Stage", "Contact", "Created", "Actions"];

  const handleDelete = async (id: any) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { deleteProject } = await import("@/actions/projects/projects");
      await deleteProject(id);
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      console.log("deleted");
    }
  };

  const handleUpdate = async (id: any, stage: string) => {
    if (!id) return;
    setIsPending(true);

    try {
      const { updateProjectStage } = await import("@/actions/projects/projects");
      await updateProjectStage(id, stage);
      refetch();
    } catch (error) {
      console.error("update error", error);
    } finally {
      console.log("updated");
      setIsPending(false);
    }
  };

  return (
    <div className="relative grid grid-cols-3 xl:grid-cols-5 text-lg place-items-center h-full border bg-component-bg -mt-0.5 border-border p-4">
      {tableHeaders.map((title: string, index) => {
        const hideOnMdLg = [2, 3].includes(index);
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
        webProjects?.map((project: any, index: number) => (
          <div
            key={project.id || index}
            className="col-span-3 xl:col-span-5 grid grid-cols-3 xl:grid-cols-5 w-full place-items-center"
          >
            <div className="project-table-item">{project.title}</div>

            <div
              className={`project-table-item ${
                project.stage === "Not Started"
                  ? "bg-red-400/5 text-red-400"
                  : ""
              }
                ${
                  project.stage === "In Progress"
                    ? "bg-sky-400/5 text-sky-400"
                    : ""
                }
                ${
                  project.stage === "Completed"
                    ? "bg-green-400/5 text-green-400"
                    : ""
                }`}
            >
              <select
                value={project.stage}
                onChange={(e) => handleUpdate(project.id, e.target.value)}
                className={`
                  text-xl rounded px-2 py-1 cursor-pointer
              `}
              >
                <option value="Not Started" className="text-red-400">
                  Not Started
                </option>
                <option value="In Progress" className="text-sky-400">
                  In Progress
                </option>
                <option value="Completed" className="text-green-400">
                  Completed
                </option>
              </select>
            </div>

            <div className="project-table-item hidden xl:flex xl:justify-center">
              {project.Contacts.name}
            </div>
            <div className="project-table-item hidden xl:flex xl:justify-center">
              {formatDate(project.createdAt)}
            </div>
            <div className="project-table-item">
              <div className="flex justify-center items-center gap-5">
                <button
                  onClick={() => {
                    handleDelete(project.id);
                  }}
                  className="bg-red-400 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                  title="Delete Project"
                >
                  <Trash className="text-border size-5 xl:size-6" />
                </button>
                <Link
                  href={`/dashboard/admin/projects/${project.id}`}
                  className="bg-emerald-400 hover:bg-emerald-600 rounded-full p-2 cursor-pointer"
                  title="Open detailed view"
                >
                  <BookOpen className="text-border size-5 xl:size-6" />
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
