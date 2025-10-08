"use client";

import { useState } from "react";
import { ProjectsProvider } from "@/context/ProjectsContext";
import Logout from "@/components/auth/Logout";
import WebDevProjectTable from "@/components/ui/projects/WebDevProjectTable";
import BrandingProjectTable from "@/components/ui/projects/BrandingProjectTable";
import { FilePlus } from "lucide-react";

import NewProject from "@/components/forms/NewProject";

export default function Projects() {
  const [isShowing, setIsShowing] = useState<string | null>("WD");
  const [isAddShowing, setIsAddShowing] = useState<string | null>(null);

  const onClick = (table: string) => {
    setIsShowing(table);
  };

  const handleFormClose = () => {
    setIsAddShowing(null);
  };

  return (
    <ProjectsProvider>
      <div className="flex flex-col gap-5 md:gap-15 text-text-light font-plex w-full px-5 lg:px-8 py-5 lg:py-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center md:items-start gap-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
              Projects
            </h1>
          </div>
          <Logout />
        </div>
        <div>
          <div className="w-fit bg-component-bg p-4 rounded-xl border border-border">
            <button
              className="Qa-button"
              onClick={() => setIsAddShowing("project")}
            >
              <FilePlus className="form-icons p-1" />
              <span className="px-3 text-lg lg:text-2xl">Add Project</span>
            </button>
          </div>
        </div>
        <div className="flex md:hidden">
          <h1 className="uppercase text-center text-3xl mt-10">
            Full projects page only available on tablet screens and larger
          </h1>
        </div>
        <div className="hidden md:flex flex-col justify-center items-start">
          <div className="flex justify-center items-center gap-5">
            <button
              onClick={() => {
                onClick("WD");
              }}
              className={`project-table-button ${
                isShowing === "WD" ? "bg-component-bg z-50" : ""
              }`}
            >
              Web Development
            </button>
            <button
              onClick={() => {
                onClick("B");
              }}
              className={`project-table-button ${
                isShowing === "B" ? "bg-component-bg z-50" : ""
              }`}
            >
              Branding
            </button>
            <button
              onClick={() => {
                onClick("FP");
              }}
              className={`project-table-button ${
                isShowing === "FP" ? "bg-component-bg z-50" : ""
              }`}
            >
              Full Package
            </button>
          </div>

          {isShowing === "WD" && (
            <div className="w-full">
              <WebDevProjectTable />
            </div>
          )}
          {isShowing === "B" && (
            <div className="w-full">
              <BrandingProjectTable />
            </div>
          )}
          {isShowing === "FP" && <div className="w-full">Full package </div>}
        </div>
      </div>
      {isAddShowing === "project" && <NewProject onClose={handleFormClose} />}
    </ProjectsProvider>
  );
}
