"use client";
import { useState, useEffect } from "react";
import withRoleProtection from "../auth/withRoleProtection";
import { Check, Loader, X } from "lucide-react";
import { Project } from "@/types";

interface ProjectProps {
  onClose: () => void;
}

const typeOptions = [
  { value: "web-dev", label: "Web Development" },
  { value: "branding", label: "Branding" },
  { value: "full-package", label: "Full Package" },
];

function AddProject({ onClose }: ProjectProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Project>({
    title: "",
    type: "",
    contactId: "",
    stage: "Not Started",
  });

  useEffect(() => {
    async function loadClients() {
      try {
        const { getClients } = await import("@/app/actions/contacts");
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    }

    loadClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError(false);

    try {
      const { createProject } = await import("@/app/actions/projects");

      // Create FormData object
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("type", formData.type);
      formDataToSubmit.append("contactId", String(formData.contactId));
      formDataToSubmit.append("stage", formData.stage || "Not Started");

      const result = await createProject(formDataToSubmit);

      // Clear form and show success
      setFormData({
        title: "",
        type: "",
        contactId: "",
        stage: "Not Started",
      });
      setIsFormLoading(false);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent('projectCreated'));

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      setError(true);
      setIsFormLoading(false);
    }
  };

  return (
    <div className="inset-0 fixed z-50 bg-black/60">
      <div className="h-fit rounded-xl form-sizing fixed text-text-light top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 bg-component-bg border-1 border-border py-2">
        {success ? (
          <div className="text-3xl font-space flex flex-col justify-center items-center p-2">
            <Check className="size-15 text-neon-green" />
            <span className="text-center">
              Project successfully added to database
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center p-6 gap-2">
            <X className="size-15 text-red-500" />
            <h2 className="font-space text-2xl text-red-500 text-center">
              Error Creating Project, please try again
            </h2>
            <button onClick={onClose} className="form-button mt-4">
              Exit
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-space text-2xl md:text-3xl lg:text-4xl text-center pt-4">
              Add New Project
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-2 lg:space-y-4 p-6"
            >
              <div>
                <input
                  id="title"
                  type="text"
                  placeholder="Project Title *"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="form-inputs"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Type *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                >
                  <option>Select a project type...</option>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contactId"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Connected Contact *
                </label>
                <select
                  id="contactId"
                  value={formData.contactId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactId: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                  disabled={isLoadingClients}
                >
                  <option value="">
                    {isLoadingClients
                      ? "Loading clients..."
                      : "Select a contact..."}
                  </option>
                  {clients?.map((contact: any) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center items-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="form-button"
                  disabled={isFormLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="form-button"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader className="animate-[spin_2s_linear_infinite] size-6" />
                    </div>
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default withRoleProtection(AddProject, { allowedRoles: [1] });
