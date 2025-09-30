"use client";

import { useUsers } from "@/hooks/useUsers";
import { Loader, Check, X } from "lucide-react";
import { useState } from "react";
import { User } from "@/types";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<User>();

const roleOptions = [
  { value: 0, label: "No Role Selected" },
  { value: 1, label: "Admin" },
  { value: 2, label: "User" },
  { value: 3, label: "Guest" },
];

const getRoleLabel = (roleId: number) => {
  return (
    roleOptions.find((option) => option.value === roleId)?.label || "Unknown"
  );
};

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone",
  }),
  columnHelper.accessor("roleId", {
    header: "Role",
    cell: (info) => getRoleLabel(info.getValue()),
  }),
];

export default function UserDisplay() {
  const { users, isLoading, mutate } = useUsers();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    roleId: 0,
  });

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setIsUpdating(true);
    setSuccess(false);
    setError(false);
    // console.log("Sending data:", JSON.stringify(formData));
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

        setIsUpdating(false);
        setSuccess(true);
        mutate();

        setTimeout(() => {
          setShowEditModal(false);
        }, 2000);
      }
    } catch (error) {
      // console.error("Update error:", error);
      setError(true);
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
    setSuccess(false);
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
    <>
      <div className="lg:hidden bg-component-bg border-1 border-border w-fit rounded-xl">
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

      <div className="hidden lg:block bg-component-bg border-1 border-border rounded-xl p-6">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-4 font-medium">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border hover:bg-border"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      handleUserSelect(row.original.id);
                      setShowEditModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2 mb-2 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      handleUserSelect(row.original.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-component-bg border-1 border-border rounded-xl p-6 max-w-fit w-full mx-4">
            {success ? (
              <div className="text-3xl font-space flex flex-col justify-center items-center p-2">
                <Check className="size-15 text-neon-green" />
                <span className="text-center">User successfully updated</span>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center p-6 gap-2">
                <X className="size-15 text-red-500" />
                <h2 className="font-space text-2xl text-red-500 text-center">
                  Error updating User, please try again
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                  }}
                  className="form-button mt-4"
                >
                  Exit
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <form className="p-6" onSubmit={handleUpdate}>
                  <div className="space-y-2">
                    <h2 className="text-center font-bold text-base md:text-lg xl:text-2xl 2xl:text-4xl mb-10">
                      Edit User:{" "}
                      <span className="text-accent">{formData.name}</span>
                    </h2>
                    <div>
                      <input
                        id="name"
                        placeholder="Name"
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
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
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
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
                      {isUpdating ? (
                        <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleUpdate}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                          >
                            Update Selected User
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEditModal(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                          >
                            Close
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
