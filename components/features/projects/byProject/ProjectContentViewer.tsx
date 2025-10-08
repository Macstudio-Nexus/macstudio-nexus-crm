"use client";

import { FileText, Trash } from "lucide-react";
import { useState } from "react";
import { Content } from "@/types";

export default function ProjectContentViewer({
  content,
  id,
}: {
  content: Content[];
  id: string;
}) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [page, setPage] = useState("");
  const [section, setSection] = useState("");
  const [contentText, setContentText] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleAddContent(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    if (!page || !section || !contentText) return;

    setIsPending(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Add new content to existing array - ensure content is an array
      const existingContent = Array.isArray(content) ? content : [];
      const updatedContent = [
        ...existingContent,
        { page, section, content: contentText },
      ];

      // Add as JSON string
      formData.append("content", JSON.stringify(updatedContent));

      // Dynamic import of server action
      const { updateContent } = await import("@/actions/webProjects");

      // Call the server action
      await updateContent(id, formData);

      // Success - reset form
      setPage("");
      setSection("");
      setContentText("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add content:", error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteContent(index: number) {
    const item = content[index];
    if (!confirm(`Delete ${item.page} - ${item.section}?`)) return;

    setIsPending(true);

    try {
      // Dynamic import of server action
      const { deleteContent } = await import("@/actions/webProjects");

      // Call the server action with the index as a string
      await deleteContent(id, String(index));
    } catch (error) {
      console.error("Failed to delete content:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-component-bg rounded-xl border border-border p-4 w-full min-h-full 2xl:-mt-15">
      <div className="flex items-center justify-start gap-3 min-w-full">
        <FileText className="size-12 text-blue-400 bg-blue-400/20 rounded-xl p-2" />
        <h1 className="text-2xl">Content</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
          }}
          className="project-page-button ml-auto"
        >
          {showForm ? "Cancel" : "Add Content"}
        </button>
      </div>
      {showForm ? (
        // Show the FORM when showForm is true
        <form
          onSubmit={handleAddContent}
          className=" p-4 bg-component-bg rounded-xl border border-border w-full"
        >
          <div className="flex justify-center items-center gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Page Name"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="p-2 rounded border"
                  required
                />

                <input
                  type="text"
                  placeholder="Section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="p-2 rounded border"
                  required
                />
              </div>
              <div className="">
                <textarea
                  placeholder="Content"
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="p-2 rounded border w-full resize-y max-h-60"
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="self-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-400 text-black rounded cursor-pointer hover:bg-blue-400/20 hover:text-text-light"
              >
                {isPending ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Show the CONTENT LIST when showForm is false
        <>
          <div className="min-w-full overflow-y-auto overflow-x-auto scrollbar-hide bg-main-bg max-h-60 border border-border">
            <div className="sticky top-0 grid grid-cols-[1fr_1fr_3fr_0.5fr] items-center gap-5 border-b py-1 border-border px-4 text-accent bg-main-bg">
              <span className="text-lg font-semibold">Page</span>
              <span className="text-lg font-semibold">Section</span>
              <span className="text-lg font-semibold">Content</span>
              <span className="text-base font-semibold justify-self-center">
                Delete
              </span>
            </div>
            {content && content.length > 0 ? (
              content.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_3fr_0.5fr] gap-5 border-b items-center border-border px-4 py-2"
                >
                  <span className="font-semibold">{item.page}</span>
                  <span className="font-medium">{item.section}</span>
                  <span className="text-sm break-words">{item.content}</span>
                  <button
                    onClick={() => handleDeleteContent(index)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-900 cursor-pointer justify-self-center"
                    type="button"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No content added yet
              </p>
            )}
          </div>
          <span className="text-blue-400 text-lg">
            Total Sections: {content?.length || 0}
          </span>
        </>
      )}
    </div>
  );
}
