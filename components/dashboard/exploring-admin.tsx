"use client";

import React, { useState } from "react";
import { BookItem, addExploringBook, updateExploringBook, deleteExploringBook, reorderExploringBooks } from "@/actions/exploring";
import { SortableList } from "@/components/dashboard/sortable-list";
import { Plus, Trash2, Edit3, X, BookOpen } from "lucide-react";

export function ExploringAdmin({ initialBooks }: { initialBooks: BookItem[] }) {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Omit<BookItem, "id" | "_id">>({
    title: "",
    color: "#2f3b52",
    order: 0,
  });

  const presetColors = [
    "#c9473b", // Rust Red
    "#2f3b52", // Navy Charcoal
    "#d9a441", // Mustard Ochre
    "#f2efe8", // Cream Paper
    "#1f1f21", // Obsidian
    "#3450f0", // Royal Blue
    "#1f7a5a", // Forest Green
    "#7b2fe0", // Purple
  ];

  const resetForm = () => {
    setForm({
      title: "",
      color: "#2f3b52",
      order: books.length,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (b: BookItem) => {
    setEditingId(b.id || "");
    setIsAdding(false);
    setForm({
      title: b.title,
      color: b.color,
      order: b.order ?? 0,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      await updateExploringBook(editingId, form);
      setBooks((prev) => prev.map((b) => (b.id === editingId ? { ...form, id: editingId } : b)));
    } else {
      const res = await addExploringBook(form);
      if (res.success && res.id) {
        setBooks((prev) => [...prev, { ...form, id: res.id }]);
      }
    }

    setLoading(false);
    resetForm();
  };

  const handleReorder = async (ordered: BookItem[]) => {
    const previous = books;
    setBooks(ordered);
    const res = await reorderExploringBooks(ordered.map((b) => b.id).filter((id): id is string => !!id));
    if (!res.success) {
      setBooks(previous);
      alert(res.error || "Failed to reorder books");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to remove this book from your exploring stack?")) return;
    setLoading(true);
    await deleteExploringBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--spt-ink)]">Currently Exploring Books ({books.length})</h2>
          <p className="text-xs text-[var(--spt-muted)]">
            Manage the hand-drawn colored book spines displayed in your left sidebar.
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
            <Plus size={14} /> Add Book Bar
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[var(--spt-line)] pb-3">
            <h3 className="font-semibold text-sm text-[var(--spt-ink)]">
              {editingId ? "Edit Book Spine" : "New Book Spine"}
            </h3>
            <button type="button" onClick={resetForm} className="text-[var(--spt-muted)] hover:text-[var(--spt-ink)]">
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
              Topic / Book Title (e.g. Distributed Caching (Redis))
            </label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Distributed Caching (Redis)"
              className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Spine Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-8 h-8 rounded border border-[var(--spt-line)] cursor-pointer"
              />
              <div className="flex flex-wrap gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                      form.color === c ? "scale-125 ring-2 ring-[var(--spt-accent)]" : "hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Spine Preview */}
          <div className="pt-2">
            <span className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Preview</span>
            <div
              style={{ backgroundColor: form.color }}
              className="h-8 rounded px-4 flex items-center justify-center border border-black/20 text-white font-semibold text-xs tracking-wider uppercase shadow-sm"
            >
              {form.title || "BOOK TITLE PREVIEW"}
            </div>
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
              {loading ? "Saving..." : "Save Book"}
            </button>
          </div>
        </form>
      )}

      {/* Book list */}
      <SortableList
        items={books}
        onReorder={handleReorder}
        renderItem={(b) => (
          <div className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] hover:border-[var(--spt-muted)] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div
                style={{ backgroundColor: b.color }}
                className="w-6 h-6 rounded border border-black/20 flex-none"
              />
              <span className="font-semibold text-xs text-[var(--spt-ink)] truncate">{b.title}</span>
            </div>

            <div className="flex items-center gap-1 flex-none">
              <button
                onClick={() => handleEdit(b)}
                className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
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
