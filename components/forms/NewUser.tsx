"use client";
import { useState } from "react";
import withRoleProtection from "../auth/withRoleProtection";
import { Check, Loader, X } from "lucide-react";

interface newUser {
  name: string;
  email: string;
  phoneNumber: string;
  roleId: number;
}

interface NewUserProps {
  onClose: () => void;
}

const roleOptions = [
  { value: 1, label: "Admin" },
  { value: 3, label: "Guest" },
];

function AddUser({ onClose }: NewUserProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<newUser>({
    name: "",
    email: "",
    phoneNumber: "",
    roleId: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      // Create FormData
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phoneNumber", formData.phoneNumber);
      formDataObj.append("roleId", formData.roleId.toString());

      // Dynamic import server action
      const { createUser } = await import("@/app/actions/users");
      const result = await createUser(formDataObj);

      console.log("User created:", result);

      // Clear form and show success
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        roleId: 0,
      });
      setIsLoading(false);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent('userCreated'));

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      setError(true);
      setIsLoading(false);
    }
  };
  return (
    <div className="inset-0 fixed z-50 bg-black/60">
      <div className="h-fit rounded-xl form-sizing fixed text-text-light top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 bg-component-bg border-1 border-border py-2">
        {success ? (
          <div className="text-3xl font-space flex flex-col justify-center items-center p-2">
            <Check className="size-15 text-neon-green" />
            <span className="text-center">
              User successfully added to database
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center p-6 gap-2">
            <X className="size-15 text-red-500" />
            <h2 className="font-space text-2xl text-red-500 text-center">
              Error Creating User, please try again
            </h2>
            <button onClick={onClose} className="form-button mt-4">
              Exit
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-space text-2xl md:text-3xl lg:text-4xl text-center pt-4">
              Add New User
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-2 lg:space-y-4 p-6"
            >
              <div>
                <input
                  id="name"
                  type="text"
                  placeholder="Name *"
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
                  id="email"
                  placeholder="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="form-inputs"
                  required
                />
              </div>

              <div>
                <input
                  id="phoneNumber"
                  placeholder="Phone *"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="roleId"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Role *
                </label>
                <select
                  id="roleId"
                  value={formData.roleId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleId: Number(e.target.value),
                    }))
                  }
                  className="form-inputs"
                  required
                >
                  <option value="">Select a role...</option>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center items-center gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="form-button"
                  disabled={isLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="form-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader className="animate-[spin_2s_linear_infinite] size-6" />
                    </div>
                  ) : (
                    "Create User"
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

export default withRoleProtection(AddUser, { allowedRoles: [1] });
