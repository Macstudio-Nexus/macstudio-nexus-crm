"use client";

import { WebProjectDev } from "@/types";
import { useEffect, useState } from "react";

import { CodeXml, Link, Trash } from "lucide-react";

export default function ProjectDevViewer({
  domain,
  githubLink,
  hostingLink,
  integrations,
  SEOstrat,
  id,
}: WebProjectDev & { id: string }) {
  const [domainLink, setDomainLink] = useState(domain ?? "");
  const [github, setGithub] = useState(githubLink ?? "");
  const [hosting, setHosting] = useState(hostingLink ?? "");
  const [seoStratLink, setseoStratLink] = useState(SEOstrat ?? "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [integrationName, setIntegrationName] = useState("");
  const [integrationDesc, setIntegrationDesc] = useState("");
  const [integrationPrice, setIntegrationPrice] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [title, setTitle] = useState("Development");

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("domain", domainLink);
    formData.append("github", github);
    formData.append("hostingLink", hosting);
    formData.append("SEOstrat", seoStratLink);

    try {
      const { updateWebProjectDev } = await import(
        "@/actions/projects/webProjects"
      );
      await updateWebProjectDev(id, formData);
      setTitle("DESIGN UPDATED");
    } catch {
      setTitle("ERROR UPDATING DEVELOPMENT");
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
        setTitle("Development");
      }, 2000);
    }
  }

  async function handleAddIntegration(e: React.FormEvent) {
    e.preventDefault();

    if (!integrationName || !integrationDesc || !integrationPrice) return;

    setIsPending(true);

    try {
      const formData = new FormData();
      const updatedIntegrations = {
        ...(integrations as Record<string, string>),
        [integrationName]: JSON.stringify({
          description: integrationDesc,
          price: integrationPrice,
        }),
      };
      formData.append("integrations", JSON.stringify(updatedIntegrations));

      const { updateIntegrations } = await import(
        "@/actions/projects/webProjects"
      );
      await updateIntegrations(id, formData);

      setIntegrationName("");
      setIntegrationDesc("");
      setIntegrationPrice("");
    } catch (error) {
      console.error("Failed to add integration:", error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteIntegration(integrationKey: string) {
    if (!confirm(`Delete ${integrationKey}?`)) return;

    setIsPending(true);

    try {
      const { deleteIntegration } = await import(
        "@/actions/projects/webProjects"
      );
      await deleteIntegration(id, integrationKey);
    } catch (error) {
      console.error("Failed to delete integration:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-component-bg border border-border p-4 rounded-xl 2xl:-mt-15">
      <div className="flex items-center justify-start gap-3 min-w-full pb-2">
        <CodeXml className="size-12 text-blue-400 bg-blue-400/20 rounded-xl p-2" />
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="w-full flex flex-col items-start justify-around gap-2">
        <form onSubmit={handleUpdate} className="w-fit space-y-4">
          {/* Domain Field */}
          <div className="flex items-center justify-start gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="domain" className="text-sm font-semibold">
                Domain
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="domain"
                  type="text"
                  value={domainLink}
                  placeholder="Add Domain Link"
                  onChange={(e) => setDomainLink(e.target.value)}
                  className="flex-1 p-2 rounded border border-border bg-transparent"
                />
                {domainLink && (
                  <a
                    href={domainLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-table-button !p-2"
                    title="Open domain"
                  >
                    <Link size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* GitHub Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="github" className="text-sm font-semibold">
                GitHub Repository
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="github"
                  type="text"
                  value={github}
                  placeholder="Add GitHub Link"
                  onChange={(e) => setGithub(e.target.value)}
                  className="flex-1 p-2 rounded border border-border bg-transparent"
                />
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-table-button !p-2"
                    title="Open GitHub"
                  >
                    <Link size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Hosting Field */}
          <div className="flex items-center justify-start gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="hosting" className="text-sm font-semibold">
                Hosting Platform
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="hosting"
                  type="text"
                  value={hosting}
                  placeholder="Add Hosting Link"
                  onChange={(e) => setHosting(e.target.value)}
                  className="flex-1 p-2 rounded border border-border bg-transparent"
                />
                {hosting && (
                  <a
                    href={hosting}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-table-button !p-2"
                    title="Open hosting"
                  >
                    <Link size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* SEO Strategy Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="seostrat" className="text-sm font-semibold">
                SEO Strategy
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="seostrat"
                  type="text"
                  value={seoStratLink}
                  placeholder="Add SEO Strategy Link"
                  onChange={(e) => setseoStratLink(e.target.value)}
                  className="flex-1 p-2 rounded border border-border bg-transparent"
                />
                {seoStratLink && (
                  <a
                    href={seoStratLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="design-table-button !p-2"
                    title="Open SEO strategy"
                  >
                    <Link size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-fit project-page-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update Development"}
          </button>
        </form>
        {/* Integrations Section */}
        <div className="w-full space-y-3 flex flex-col items-start justify-start">
          <h2 className="text-xl font-semibold text-text-light">
            Integrations
          </h2>

          {/* Add Integration Form */}
          <form onSubmit={handleAddIntegration} className="flex flex-col gap-2">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Integration Name"
                value={integrationName}
                onChange={(e) => setIntegrationName(e.target.value)}
                className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={integrationDesc}
                onChange={(e) => setIntegrationDesc(e.target.value)}
                className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
              />
              <input
                type="text"
                placeholder="$ Price"
                value={integrationPrice}
                onChange={(e) => setIntegrationPrice(e.target.value)}
                className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="project-page-button w-fit"
            >
              Add Integration
            </button>
          </form>

          {/* Integrations List */}
          <div
            className="w-full overflow-y-auto scrollbar-hide max-h-40 bg-main-bg borderborder-border"
          >
            <div
              className="sticky top-0 grid grid-cols-[minmax(100px,0.7fr)_minmax(120px,1.4fr)_minmax(60px,0.5fr)_40px] items-center gap-3 border-b py-1 border-border px-4 text-accent bg-main-bg"
            >
              <span className="text-sm font-semibold">Name</span>
              <span className="text-sm font-semibold">Description</span>
              <span className="text-sm font-semibold">Price</span>
              <span className="text-sm font-semibold">Delete</span>
            </div>
            {integrations && Object.keys(integrations).length > 0 ? (
              Object.entries(integrations as Record<string, string>).map(
                ([key, value]) => {
                  // Parse the value as JSON if it's a stringified object
                  const integration =
                    typeof value === "string" ? JSON.parse(value) : value;
                  return (
                    <div
                      key={key}
                      className="grid grid-cols-[minmax(100px,0.7fr)_minmax(120px,1.4fr)_minmax(60px,0.5fr)_40px] items-center gap-3 border-b border-border px-4 py-2"
                    >
                      <span className="font-medium text-sm">{key}</span>
                      <span className="text-sm text-gray-400">
                        {integration.description}
                      </span>
                      <span className="text-sm text-gray-400">
                        ${integration.price}
                      </span>
                      <button
                        onClick={() => handleDeleteIntegration(key)}
                        disabled={isPending}
                        className="text-red-500 hover:text-red-700 p-1"
                        type="button"
                      >
                        <Trash className="size-4 justify-self-center cursor-pointer" />
                      </button>
                    </div>
                  );
                }
              )
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No integrations added
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
