"use client";

import { useContacts } from "@/hooks/useContacts";
import { Loader } from "lucide-react";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  industry: string;
  domain?: string;
  meetingNotes?: string;
  source?: string;
  stage: string;
}

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

export default function ContactDisplay() {
  const { contacts, isLoading, isError, mutate } = useContacts();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [formData, setFormData] = useState<Contact>({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    industry: "",
    domain: "",
    meetingNotes: "",
    source: "",
    stage: "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContactId) return;
    setIsUpdating(true);
    console.log("Sending data:", JSON.stringify(formData));
    try {
      const response = await fetch(`/api/contacts/${selectedContactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSelectedContactId("");
        setFormData({
          id: "",
          name: "",
          email: "",
          phoneNumber: "",
          industry: "",
          domain: "",
          meetingNotes: "",
          source: "",
          stage: "",
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
    if (!selectedContactId) return;
    if (!confirm("Are you sure you want to delete this contact?")) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/contacts/${selectedContactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Reset selection after delete
        setSelectedContactId("");
        setFormData({
          id: "",
          name: "",
          email: "",
          phoneNumber: "",
          industry: "",
          domain: "",
          meetingNotes: "",
          source: "",
          stage: "",
        });
        mutate();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    const contact = contacts?.find((c: Contact) => c.id === contactId);
    if (contact) {
      setFormData({
        id: contact.id || "",
        name: contact.name || "",
        email: contact.email || "",
        phoneNumber: contact.phoneNumber || "",
        industry: contact.industry || "",
        domain: contact.domain || "",
        meetingNotes: contact.meetingNotes || "",
        source: contact.source || "",
        stage: contact.stage || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        industry: "",
        domain: "",
        meetingNotes: "",
        source: "",
        stage: "",
      });
    }
  };

  return (
    <div className="bg-gray-900 border-1 border-gray-800 w-fit rounded-xl">
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
              {isLoading ? (
                <option className="text-lg">Loading Contacts...</option>
              ) : (
                <>
                  <option value="" className="text-lg">
                    Select Contact
                  </option>
                  {contacts?.map((contact: any) => (
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
                id="industry"
                placeholder="Industry"
                type="text"
                value={formData.industry || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industry: e.target.value,
                  }))
                }
                className="form-inputs"
                required
              />
            </div>

            <div>
              <input
                id="domain"
                placeholder="Domain"
                type="text"
                value={formData.domain || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    domain: e.target.value,
                  }))
                }
                className="form-inputs"
              />
            </div>

            <div>
              <textarea
                id="meetingNotes"
                placeholder="Meeting Notes"
                value={formData.meetingNotes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    meetingNotes: e.target.value,
                  }))
                }
                className="form-inputs"
                rows={3}
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
                  onClick={handleDelete}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg active:scale-95 transition-all duration-100 cursor-pointer"
                >
                  Delete Selected Contact
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
                  Update Selected Contact
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
