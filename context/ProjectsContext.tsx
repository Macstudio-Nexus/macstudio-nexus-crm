import { createContext, useContext } from "react";
import {
  useProjects,
  useWebProjects,
  useBrandingProjects,
} from "@/hooks/useInfo";
import { PropsWithChildren } from "react";

type ProjectsContextType = {
  allProjects: ReturnType<typeof useProjects>;
  webProjects: ReturnType<typeof useWebProjects>;
  brandingProjects: ReturnType<typeof useBrandingProjects>;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: PropsWithChildren) {
  const allProjects = useProjects();
  const webProjects = useWebProjects();
  const brandingProjects = useBrandingProjects();

  return (
    <ProjectsContext.Provider
      value={{
        allProjects,
        webProjects,
        brandingProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("Must be used within ProjectsProvider");
  return context;
};
