"use client";
import { useState } from "react";

import withRoleProtection from "../auth/withRoleProtection";
import { Check, Loader, X } from "lucide-react";
import { Contact } from "@/types";

interface ContactProps {
  onClose: () => void;
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
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social-media", label: "Social Media" },
  { value: "email-campaign", label: "Email Campaign" },
  { value: "cold-outreach", label: "Cold Outreach" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

function AddContact({ onClose }: ContactProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Contact>({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    domain: "",
    meetingNotes: "",
    source: "",
    stage: "",
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
      formDataObj.append("companyName", formData.companyName);
      formDataObj.append("domain", formData.domain || "");
      formDataObj.append("meetingNotes", formData.meetingNotes || "");
      formDataObj.append("source", formData.source || "");
      formDataObj.append("stage", formData.stage);

      // Dynamic import server action
      const { createContact } = await import("@/app/actions/contacts");
      const result = await createContact(formDataObj);

      console.log("Contact created:", result);

      // Clear form and show success
      setFormData({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        domain: "",
        meetingNotes: "",
        source: "",
        stage: "",
      });
      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating contact:", error);
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
              Contact successfully added to database
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center p-6 gap-2">
            <X className="size-15 text-red-500" />
            <h2 className="font-space text-2xl text-red-500 text-center">
              Error Creating Contact, please try again
            </h2>
            <button onClick={onClose} className="form-button mt-4">
              Exit
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-space text-2xl md:text-3xl lg:text-4xl text-center pt-4">
              Add New Contact
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
                <input
                  id="companyName"
                  placeholder="Company Name *"
                  type="text"
                  value={formData.companyName}
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
                <label
                  htmlFor="source"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
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
                  <option value="">Select a source...</option>
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="stage"
                  className="block text-sm lg:text-lg font-medium ml-1"
                >
                  Stage *
                </label>
                <select
                  id="stage"
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stage: e.target.value,
                    }))
                  }
                  className="form-inputs"
                  required
                >
                  <option value="">Select a stage...</option>
                  {stageOptions.map((option) => (
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
                    "Create Contact"
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

export default withRoleProtection(AddContact, { allowedRoles: [1] });
