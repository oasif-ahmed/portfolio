"use client";

import React, { useState } from "react";
import type { CustomProject } from "@/actions/projects";
import { deleteProject, reorderProjects } from "@/actions/projects";
import { SortableList } from "@/components/dashboard/sortable-list";
import { Plus, Trash2, Edit3, ExternalLink, Code, Image, Check, X } from "lucide-react";

export function ProjectsAdmin({ initialProjects }: { initialProjects: CustomProject[] }) {
  const [projects, setProjects] = useState<CustomProject[]>(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState<Omit<CustomProject, "id" | "_id">>({
    title: "",
    description: "",
    status: "2025",
    tags: [],
    images: [],
    liveLink: "",
    repoLink: "",
    order: 0,
  });
  const [tagsInput, setTagsInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "2025",
      tags: [],
      images: [],
      liveLink: "",
      repoLink: "",
      order: projects.length,
    });
    setTagsInput("");
    setHighlightsInput("");
    setImagesInput("");
    setUploadedImages([]);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (p: CustomProject) => {
    setEditingId(p.id || "");
    setIsAdding(false);
    setForm({
      title: p.title,
      description: p.description,
      status: p.status,
      tags: p.tags,
      images: p.images,
      liveLink: p.liveLink || "",
      repoLink: p.repoLink || "",
      order: p.order ?? 0,
    });
    setTagsInput((p.tags || []).join(", "));
    setHighlightsInput((p.highlights || []).join("\n"));
    setImagesInput((p.images || []).filter((img) => !img.startsWith("data:")).join("\n"));
    setUploadedImages((p.images || []).filter((img) => img.startsWith("data:")));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedHighlights = highlightsInput
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);

    const parsedImages = imagesInput
      .split("\n")
      .map((img) => img.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      tags: parsedTags,
      highlights: parsedHighlights,
      images: [...parsedImages, ...uploadedImages],
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId || null, project: payload }),
    });
    const result = await res.json();

    if (!result.success) {
      alert(result.error || "Failed to save project");
      setLoading(false);
      return;
    }

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? { ...payload, id: editingId } : p))
      );
    } else {
      setProjects((prev) => [...prev, { ...payload, id: result.id }]);
    }

    setLoading(false);
    resetForm();
  };

  const handleReorder = async (ordered: CustomProject[]) => {
    const previous = projects;
    setProjects(ordered);
    const res = await reorderProjects(ordered.map((p) => p.id).filter((id): id is string => !!id));
    if (!res.success) {
      setProjects(previous);
      alert(res.error || "Failed to reorder projects");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--spt-ink)]">Projects ({projects.length})</h2>
          <p className="text-xs text-[var(--spt-muted)]">
            Manage your highlighted showcase projects, live demos, and image galleries.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--spt-ink)] text-[var(--spt-paper)] text-xs font-medium hover:opacity-90"
          >
            <Plus size={14} /> Add Project
          </button>
        )}
      </div>

      {/* Editor Modal / Inline form */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[var(--spt-line)] pb-3">
            <h3 className="font-semibold text-sm text-[var(--spt-ink)]">
              {editingId ? "Edit Project" : "New Project"}
            </h3>
            <button type="button" onClick={resetForm} className="text-[var(--spt-muted)] hover:text-[var(--spt-ink)]">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Project Title</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Distributed Rate Limiter"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Status / Year</label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="e.g. 2025 or Live"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Description / Summary</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What this project does and key engineering architectural highlights..."
              className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Live Demo URL</label>
              <input
                type="url"
                value={form.liveLink}
                onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Source Code / Repo URL</label>
              <input
                type="url"
                value={form.repoLink}
                onChange={(e) => setForm({ ...form, repoLink: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
              Tags / Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="TypeScript, Next.js, Redis, PostgreSQL"
              className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
              Impact Bullets (one per line, shown on project cards)
            </label>
            <textarea
              rows={3}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder="3 role-based dashboards&#10;2 payment gateways&#10;10-test Vitest suite"
              className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
              Image URLs or Local Paths (one per line, e.g. /projects/chef-1.png or https://...)
            </label>
            <textarea
              rows={3}
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              placeholder="/projects/rate-limiter.png&#10;https://..."
              className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
              Upload Screenshots from Computer
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full text-xs text-[var(--spt-muted)] file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-[var(--spt-line)] file:bg-[var(--spt-paper)] file:text-[var(--spt-ink)]"
            />
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedImages.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-16 rounded-md overflow-hidden border border-[var(--spt-line)]">
                    <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 p-0.5 rounded-bl bg-[var(--spt-ink)] text-[var(--spt-paper)]"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-1.5 rounded-md border border-[var(--spt-line)] text-xs font-medium text-[var(--spt-muted)] hover:bg-[var(--spt-soft2)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-md bg-[var(--spt-accent)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <SortableList
        items={projects}
        onReorder={handleReorder}
        className="space-y-3"
        renderItem={(p) => (
          <div className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] hover:border-[var(--spt-muted)] transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-12 rounded-md overflow-hidden bg-[var(--spt-soft2)] border border-[var(--spt-line)] flex-none">
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--spt-faint)]">
                    <Image size={16} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[var(--spt-ink)] truncate">{p.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--spt-paper)] border border-[var(--spt-line)] text-[var(--spt-muted)]">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--spt-muted)] truncate max-w-md">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--spt-paper)] text-[var(--spt-faint)]">
                      {t}
                    </span>
                  ))}
                  {p.tags.length > 4 && (
                    <span className="text-[10px] text-[var(--spt-faint)]">+{p.tags.length - 4}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-none ml-4">
              {p.liveLink && (
                <a
                  href={p.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                  title="View Live"
                >
                  <ExternalLink size={14} />
                </a>
              )}
              {p.repoLink && (
                <a
                  href={p.repoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                  title="View Code"
                >
                  <Code size={14} />
                </a>
              )}
              <button
                onClick={() => handleEdit(p)}
                className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-1.5 rounded-md text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
