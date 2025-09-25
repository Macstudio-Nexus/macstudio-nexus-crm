"use client";

import { useUsers } from "@/hooks/useUsers";
import { Loader } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  roleId: number;
}

const roleOptions = [
  { value: 0, label: "No Role Selected" },
  { value: 1, label: "Admin" },
  { value: 2, label: "User" },
  { value: 3, label: "Guest" },
];

export default function UserDisplay() {
  const { users, isLoading, isError, mutate } = useUsers();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  //   const selectedUser = users?.find((user: User) => user.id === selectedUserId);
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    roleId: 0,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setIsUpdating(true);
    console.log("Sending data:", JSON.stringify(formData));
    try {
      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSelectedUserId("");
        setFormData({
          id: "",
          name: "",
          email: "",
          phoneNumber: "",
          roleId: 0,
        });
        mutate();
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    if (
      !confirm(
        "Are you sure you want to delete this user? This will delete all related projects, action items, blog posts, comments, and notifications"
      )
    )
      return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Reset selection after delete
        setSelectedUserId("");
        setFormData({
          id: "",
          name: "",
          email: "",
          phoneNumber: "",
          roleId: 0,
        });
        mutate();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const user = users?.find((u: User) => u.id === userId);
    if (user) {
      setFormData({
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        roleId: user.roleId || 0,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        roleId: 0,
      });
    }
  };

  return (
    <div className="bg-gray-900 border-1 border-gray-800 w-fit rounded-xl">
      <div className="flex flex-col justify-center items-center">
        <form className="p-6">
          <div className="space-y-2">
            <label className="block text-sm lg:text-lg font-medium ml-1">
              Select a User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="form-inputs mb-10"
              required
            >
              {isLoading ? (
                <option className="text-lg">Loading Users...</option>
              ) : (
                <>
                  <option value="" className="text-lg">
                    Select User
                  </option>
                  {users?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <h2 className="text-center font-bold text-base md:text-lg xl:text-2xl 2xl:text-3xl">
              User Information
            </h2>
            <div>
              <input
                id="name"
                placeholder="Name"
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="form-inputs"
              />
            </div>

            <div>
              <input
                id="email"
                placeholder="Email"
                type="email"
                value={formData.email || ""}
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
                placeholder="Phone"
                type="tel"
                value={formData.phoneNumber || ""}
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
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex flex-col lg:flex-row justify-center items-center gap-2 mt-2">
              {isDeleting ? (
                <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer">
                  <Loader />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                >
                  Delete Selected User
                </button>
              )}
              {isDeleting ? (
                <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer">
                  <Loader />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                >
                  Update Selected User
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
