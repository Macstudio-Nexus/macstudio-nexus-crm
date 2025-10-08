"use client";

import { WebProjectDesign } from "@/types";
import { Wallpaper, Link, Upload, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectDesignViewer({
  sitemap,
  wireframes,
  colorScheme,
  typography,
  responsive,
  id,
}: WebProjectDesign & { id: string }) {
  const [sitemapLink, setSitemapLink] = useState(sitemap ?? "");
  const [wireframesLink, setWireframesLink] = useState(wireframes ?? "");
  const [isResponsive, setIsResponsive] = useState(responsive ?? false);
  const [title, setTitle] = useState("Design");
  const [isUpdating, setIsUpdating] = useState(false);

  // Color scheme states
  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("");

  // Typography states
  const [fontName, setFontName] = useState("");
  const [fontValue, setFontValue] = useState("");

  const [isPending, setIsPending] = useState(false);

  async function handleUpdateDesign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("sitemap", sitemapLink);
    formData.append("wireframes", wireframesLink);
    formData.append("responsive", isResponsive.toString());
    // Add colorScheme and typography when you're ready to implement them
    // formData.append("colorScheme", JSON.stringify(colorScheme));
    // formData.append("typography", JSON.stringify(typography));

    try {
      const { updateWebProjectDesign } = await import("@/actions/webProjects");
      await updateWebProjectDesign(id, formData);
      setTitle("DESIGN UPDATED");
    } catch {
      setTitle("ERROR UPDATING DESIGN");
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
        setTitle("Design");
      }, 2000);
    }
  }

  async function handleAddColor(e: React.FormEvent) {
    e.preventDefault();

    if (!colorName || !colorValue) return;

    setIsPending(true);

    try {
      const formData = new FormData();
      const updatedColors = {
        ...(colorScheme as Record<string, string>),
        [colorName]: colorValue,
      };
      formData.append("colorScheme", JSON.stringify(updatedColors));

      const { updateColorScheme } = await import("@/actions/webProjects");
      await updateColorScheme(id, formData);

      setColorName("");
      setColorValue("");
    } catch (error) {
      console.error("Failed to add color:", error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteColor(colorKey: string) {
    if (!confirm(`Delete ${colorKey}?`)) return;

    setIsPending(true);

    try {
      const { deleteColor } = await import("@/actions/webProjects");
      await deleteColor(id, colorKey);
    } catch (error) {
      console.error("Failed to delete color:", error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleAddFont(e: React.FormEvent) {
    e.preventDefault();

    if (!fontName || !fontValue) return;

    setIsPending(true);

    try {
      const formData = new FormData();
      const updatedFonts = {
        ...(typography as Record<string, string>),
        [fontName]: fontValue,
      };
      formData.append("typography", JSON.stringify(updatedFonts));

      const { updateTypography } = await import("@/actions/webProjects");
      await updateTypography(id, formData);

      setFontName("");
      setFontValue("");
    } catch (error) {
      console.error("Failed to add font:", error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteFont(fontKey: string) {
    if (!confirm(`Delete ${fontKey}?`)) return;

    setIsPending(true);

    try {
      const { deleteFont } = await import("@/actions/webProjects");
      await deleteFont(id, fontKey);
    } catch (error) {
      console.error("Failed to delete font:", error);
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    setSitemapLink(sitemap ?? "");
    setWireframesLink(wireframes ?? "");
    setIsResponsive(responsive ?? false);
  }, [sitemap, wireframes, responsive]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 bg-component-bg rounded-xl    
   border border-border w-fit max-w-full 2xl:min-w-sm p-4"
    >
      <div className="flex items-center justify-left gap-3 w-full">
        <Wallpaper className="text-neon-green size-12 bg-neon-green-trans rounded-xl p-2" />
        <h1
          className={`text-2xl ${
            title === "Design"
              ? ""
              : title.includes("ERROR")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {title}
        </h1>
      </div>

      <form onSubmit={handleUpdateDesign} className="w-full space-y-4">
        {/* Sitemap Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sitemap" className="text-sm font-semibold">
            Sitemap
          </label>
          <div className="flex items-center gap-2">
            <input
              id="sitemap"
              type="text"
              value={sitemapLink}
              placeholder="Add Sitemap Link"
              onChange={(e) => setSitemapLink(e.target.value)}
              className="flex-1 p-2 rounded border border-border bg-transparent"
            />
            {sitemapLink && (
              <a
                href={sitemapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="design-table-button !p-2"
                title="Open sitemap"
              >
                <Link size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Wireframes Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="wireframes" className="text-sm font-semibold">
            Wireframes
          </label>
          <div className="flex items-center gap-2">
            <input
              id="wireframes"
              type="text"
              value={wireframesLink}
              placeholder="Add Wireframes Link"
              onChange={(e) => setWireframesLink(e.target.value)}
              className="flex-1 p-2 rounded border border-border bg-transparent"
            />
            {wireframesLink && (
              <a
                href={wireframesLink}
                target="_blank"
                rel="noopener noreferrer"
                className="design-table-button !p-2"
                title="Open wireframes"
              >
                <Link size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Responsive Checkbox */}
        <div className="flex items-center gap-2">
          <input
            id="responsive"
            type="checkbox"
            checked={isResponsive}
            onChange={(e) => setIsResponsive(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="responsive" className="text-sm cursor-pointer">
            Responsive Design
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full project-page-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Updating..." : "Update Design"}
        </button>
      </form>

      {/* Color Scheme Section */}
      <div className="w-full space-y-3 flex flex-col items-start justify-start">
        <h2 className="text-xl font-semibold text-text-light">Color Scheme</h2>

        {/* Add Color Form */}
        <form onSubmit={handleAddColor} className="flex flex-col gap-2">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Color Name (e.g., Primary)"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
            />
            <input
              type="text"
              placeholder="Hex Value (e.g., #3B82F6)"
              value={colorValue}
              onChange={(e) => setColorValue(e.target.value)}
              className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="project-page-button"
          >
            Add Color
          </button>
        </form>

        {/* Color List */}
        <div className="w-full overflow-y-auto scrollbar-hide max-h-40 bg-main-bg border border-border">
          <div className="sticky top-0 grid grid-cols-[52px_minmax(90px,1fr)_minmax(85px,1fr)_48px] items-center gap-3 border-b py-1 border-border px-4 text-accent bg-main-bg">
            <span className="text-sm font-semibold">Preview</span>
            <span className="text-sm font-semibold">Name</span>
            <span className="text-sm font-semibold">Hex Value</span>
            <span className="text-sm font-semibold">Delete</span>
          </div>
          {colorScheme && Object.keys(colorScheme).length > 0 ? (
            Object.entries(colorScheme as Record<string, string>).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[52px_minmax(90px,1fr)_minmax(85px,1fr)_48px] items-center gap-3 border-b border-border px-4 py-2"
                >
                  <div
                    className="w-8 h-8 rounded border border-border flex-shrink-0 justify-self-center"
                    style={{ backgroundColor: value }}
                  />
                  <span className="font-medium text-sm">{key}</span>
                  <span className="text-sm text-gray-400">{value}</span>
                  <button
                    onClick={() => handleDeleteColor(key)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-700 p-1"
                    type="button"
                  >
                    <Trash className="size-4 justify-self-center cursor-pointer" />
                  </button>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              No colors added
            </p>
          )}
        </div>
      </div>

      {/* Typography Section */}
      <div className="w-full space-y-3">
        <h2 className="text-xl font-semibold text-text-light">Typography</h2>

        {/* Add Font Form */}
        <form onSubmit={handleAddFont} className="flex flex-col gap-2">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Font Name (e.g., Heading)"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
            />
            <input
              type="text"
              placeholder="Font Family (e.g., Inter)"
              value={fontValue}
              onChange={(e) => setFontValue(e.target.value)}
              className="flex-1 p-2 rounded border border-border bg-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="project-page-button"
          >
            Add Font
          </button>
        </form>

        {/* Font List */}
        <div className="w-full overflow-y-auto scrollbar-hide max-h-40 bg-main-bg border border-border">
          <div className="sticky top-0 grid grid-cols-[minmax(100px,1fr)_minmax(100px,1fr)_48px] items-center gap-3 border-b py-1 border-border px-4 text-accent bg-main-bg">
            <span className="text-sm font-semibold">Font Name</span>
            <span className="text-sm font-semibold">Font Family</span>
            <span className="text-sm font-semibold">Delete</span>
          </div>
          {typography && Object.keys(typography).length > 0 ? (
            Object.entries(typography as Record<string, string>).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[minmax(100px,1fr)_minmax(100px,1fr)_48px] items-center gap-3 border-b border-border px-4 py-2"
                >
                  <span className="font-medium text-sm">{key}</span>
                  <span
                    className="text-sm text-gray-400"
                    style={{ fontFamily: value }}
                  >
                    {value}
                  </span>
                  <button
                    onClick={() => handleDeleteFont(key)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    type="button"
                  >
                    <Trash className="size-4 justify-self-center" />
                  </button>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              No fonts added
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
