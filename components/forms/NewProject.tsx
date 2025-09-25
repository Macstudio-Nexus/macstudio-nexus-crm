"use client";
import { useState } from "react";
import withRoleProtection from "../withRoleProtection";
import { Check, Loader, X } from "lucide-react";

import { useClients } from "@/hooks/useClients";
import { useSites } from "@/hooks/useSites";

interface newProject {
  title: string;
  description?: string;
  domain?: string;
  type: string;
  contactId: string | number;
  siteId?: string | number;
}

interface NewProjectProps {
  onClose: () => void;
}

const typeOptions = [
  { value: "web-dev", label: "Web Development" },
  { value: "branding", label: "Branding" },
];

function AddProject({ onClose }: NewProjectProps) {
  const { clients } = useClients();
  const { sites } = useSites();
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<newProject>({
    title: "",
    description: "",
    domain: "",
    type: "",
    contactId: "",
    siteId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();
      console.log("Project created:", result);

      // Clear form and show success
      setFormData({
        title: "",
        description: "",
        domain: "",
        type: "",
        contactId: "",
        siteId: "",
      });
      setIsFormLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      //   console.error("Error creating project:", error);
      setError(true);
      setIsFormLoading(false);
      // Handle error state
    }
  };
  return (
    <div className="inset-0 fixed z-50 bg-black/60">
      <div className="h-fit rounded-xl form-sizing fixed text-text top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 bg-gray-900 border-1 border-gray-800 py-2">
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
                <textarea
                  id="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  rows={3}
                />
              </div>

              <div>
                <input
                  id="domain"
                  placeholder="Domain"
                  type="text"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, domain: e.target.value }))
                  }
                  className="form-inputs"
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
                >
                  <option value="">Select a contact...</option>
                  {clients?.map((contact: any) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="siteId"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Site
                </label>
                <select
                  id="siteId"
                  value={formData.siteId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      siteId: e.target.value,
                    }))
                  }
                  className="form-inputs"
                >
                  <option value="">Select a site...</option>
                  {sites?.map((site: any) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
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
                <button type="submit" className="form-button">
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
