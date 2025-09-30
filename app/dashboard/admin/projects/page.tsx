"use client";

import { useState } from "react";

import Logout from "@/components/auth/Logout";
import WebDevProjectTable from "@/components/ui/WebDevProjectTable";
import BrandingProjectTable from "@/components/ui/BrandingProjectTable";

export default function Projects() {
  const [isShowing, setIsShowing] = useState<string | null>("WD");

  const onClick = (table: string) => {
    setIsShowing(table);
  };

  return (
    <>
      <div className="text-text-light font-plex w-full">
        <div className="flex items-center justify-between px-5 lg:px-8 py-5 lg:py-8">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
              Projects
            </h1>
          </div>
          <Logout />
        </div>
        <div className="flex flex-col justify-center items-start px-10 mt-10">
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
    </>
  );
}
