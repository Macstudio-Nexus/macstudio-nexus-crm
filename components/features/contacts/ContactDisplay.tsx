"use client";

import { Loader, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Contact } from "@/types";
import { useContacts } from "@/hooks/useInfo";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<Contact>();

const stageOptions = [
  { value: "lead", label: "Lead" },
  { value: "prospect", label: "Prospect" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed-won", label: "Closed Won" },
  { value: "closed-lost", label: "Closed Lost" },
  { value: "client", label: "Client" },
];

const sourceOptions = [
  { value: "", label: "No Source" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social-media", label: "Social Media" },
  { value: "email-campaign", label: "Email Campaign" },
  { value: "cold-outreach", label: "Cold Outreach" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

const getSourceLabel = (source: string) => {
  return (
    sourceOptions.find((option) => option.value === source)?.label || "Unknown"
  );
};

const getStageLabel = (stage: string) => {
  return (
    stageOptions.find((option) => option.value === stage)?.label || "Unknown"
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
  columnHelper.accessor("companyName", {
    header: "Company Name",
  }),
  columnHelper.accessor("source", {
    header: "Source",
    cell: (info) => {
      const value = info.getValue();
      return value ? getSourceLabel(value) : "No Source";
    },
  }),
  columnHelper.accessor("stage", {
    header: "Stage",
    cell: (info) => {
      const value = info.getValue();
      return value ? getStageLabel(value) : "No Stage";
    },
  }),
];

export default function ContactDisplay() {
  const { contacts, isLoading: isFetchingContacts, refetch } = useContacts();
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Contact>({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    source: "",
    stage: "",
  });

  const table = useReactTable({
    data: contacts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContactId) return;
    setIsUpdating(true);
    setSuccess(false);
    setError(false);

    try {
      // Create FormData
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phoneNumber", formData.phoneNumber || "");
      formDataObj.append("companyName", formData.companyName || "");
      formDataObj.append("source", formData.source || "");
      formDataObj.append("stage", formData.stage || "");

      // Dynamic import server action
      const { updateContact } = await import("@/actions/contacts");
      await updateContact(selectedContactId, formDataObj);

      // Reset form
      setSelectedContactId("");
      setFormData({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        source: "",
        stage: "",
      });

      setIsUpdating(false);
      setSuccess(true);

      // Refresh contacts list
      refetch();

      setTimeout(() => {
        setShowEditModal(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      setError(true);
      setIsUpdating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, contactId: string) => {
    console.log("delete");
    e.preventDefault();
    e.stopPropagation();
    if (!contactId) return;
    if (!confirm("Are you sure you want to delete this contact?")) return;
    setIsDeleting(true);

    try {
      // Dynamic import server action
      const { deleteContact } = await import("@/actions/contacts");
      await deleteContact(contactId);

      // Reset selection after delete
      setSelectedContactId("");
      setFormData({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        source: "",
        stage: "",
      });

      // Refresh contacts list
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContactSelect = (contactId: string) => {
    setSuccess(false);
    setSelectedContactId(contactId);
    const contact = contacts?.find((c: Contact) => c.id === contactId);
    if (contact) {
      setFormData({
        id: contact.id || "",
        name: contact.name || "",
        email: contact.email || "",
        phoneNumber: contact.phoneNumber || "",
        companyName: contact.companyName || "",
        source: contact.source || "",
        stage: contact.stage || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        source: "",
        stage: "",
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
                Select a Contact
              </label>
              <select
                value={selectedContactId}
                onChange={(e) => handleContactSelect(e.target.value)}
                className="form-inputs mb-10"
                required
              >
                {isFetchingContacts ? (
                  <option className="text-lg">Loading Contacts...</option>
                ) : (
                  <>
                    <option value="" className="text-lg">
                      Select Contact
                    </option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <h2 className="text-center font-bold text-base md:text-lg xl:text-2xl 2xl:text-3xl">
                Contact Information
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

              <div>
                <input
                  id="companyName"
                  placeholder="Company Name"
                  type="text"
                  value={formData.companyName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                />
              </div>

              <div>
                <label className="block text-sm lg:text-lg font-medium ml-1">
                  Source
                </label>
                <select
                  id="source"
                  value={formData.source || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      source: e.target.value,
                    }))
                  }
                  className="form-inputs"
                >
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm lg:text-lg font-medium ml-1">
                  Stage *
                </label>
                <select
                  id="stage"
                  value={formData.stage || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stage: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                >
                  {stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col lg:flex-row justify-center items-center gap-2 mt-2">
                {isDeleting ? (
                  <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer">
                    <Loader />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      handleDelete(e, selectedContactId);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                  >
                    Delete Selected Contact
                  </button>
                )}
                {isUpdating ? (
                  <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer">
                    <Loader />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                  >
                    Update Selected Contact
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block bg-component-bg border-1 border-border rounded-xl p-4">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-1 font-medium"
                  >
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
              <tr key={row.id} className="border-b border-border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="p-4">
                  <button
                    onClick={() => {
                      handleContactSelect(row.original.id);
                      setShowEditModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-800 px-3 py-1 rounded mr-2 mb-2 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      handleContactSelect(row.original.id);
                      handleDelete(e, row.original.id);
                    }}
                    className="bg-red-600 hover:bg-red-800 px-3 py-1 rounded cursor-pointer"
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
                <span className="text-center">
                  Contact successfully updated
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center p-6 gap-2">
                <X className="size-15 text-red-500" />
                <h2 className="font-space text-2xl text-red-500 text-center">
                  Error updating Contact, please try again
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setError(false);
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
                      Edit Contact:{" "}
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

                    <div>
                      <input
                        id="companyName"
                        placeholder="Company Name"
                        type="text"
                        value={formData.companyName || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            companyName: e.target.value,
                          }))
                        }
                        className="form-inputs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm lg:text-lg font-medium ml-1">
                        Source
                      </label>
                      <select
                        id="source"
                        value={formData.source || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            source: e.target.value,
                          }))
                        }
                        className="form-inputs"
                      >
                        {sourceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm lg:text-lg font-medium ml-1">
                        Stage *
                      </label>
                      <select
                        id="stage"
                        value={formData.stage || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stage: e.target.value,
                          }))
                        }
                        className="form-inputs"
                        required
                      >
                        {stageOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center items-center gap-2 mt-2">
                      {isUpdating ? (
                        <div className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                          >
                            Update Selected Contact
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
