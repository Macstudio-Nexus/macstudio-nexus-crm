"use client";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";

import withRoleProtection from "../withRoleProtection";
import { Check, Loader, X } from "lucide-react";

interface newSite {
  name: string;
  domain: string;
  userId: string | number;
  description: string;
}

interface NewSiteProps {
  onClose: () => void;
}

function AddSite({ onClose }: NewSiteProps) {
  const { users, isLoading, isError } = useUsers();
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<newSite>({
    name: "",
    domain: "",
    userId: 1,
    description: "",
  });

  // console.log('Users data:', users);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create site");
      }

      const result = await response.json();
      console.log("Site created:", result);

      // Clear form and show success
      setFormData({
        name: "",
        domain: "",
        userId: 1,
        description: "",
      });
      setIsFormLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      //   console.error("Error creating site:", error);
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
              Site successfully added to database
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center p-6 gap-2">
            <X className="size-15 text-red-500" />
            <h2 className="font-space text-2xl text-red-500 text-center">
              Error Creating Site, please try again
            </h2>
            <button onClick={onClose} className="form-button mt-4">
              Exit
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-space text-2xl md:text-3xl lg:text-4xl text-center pt-4">
              Add New Site
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-2 lg:space-y-4 p-6"
            >
              <div>
                <input
                  id="name"
                  type="text"
                  placeholder="Site Name *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="form-inputs"
                  required
                />
              </div>

              <div>
                <input
                  id="domain"
                  placeholder="Domain *"
                  type="text"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, domain: e.target.value }))
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
                <label
                  htmlFor="userId"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  User *
                </label>
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userId: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                >
                  {isLoading ? (
                    <option className="text-lg">Loading Users...</option>
                  ) : (
                    users?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  )}
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
                    "Create Site"
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

export default withRoleProtection(AddSite, { allowedRoles: [1] });
