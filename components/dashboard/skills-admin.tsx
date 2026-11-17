"use client";

import React, { useState } from "react";
import { SkillItem, addSkill, updateSkill, deleteSkill, reorderSkills } from "@/actions/skills";
import { SortableList } from "@/components/dashboard/sortable-list";
import { Plus, Trash2, Edit3, X, Sliders } from "lucide-react";

export function SkillsAdmin({ initialSkills }: { initialSkills: SkillItem[] }) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["Languages", "Frontend", "Backend", "Tools & DevOps"];

  const [form, setForm] = useState<Omit<SkillItem, "id" | "_id">>({
    name: "",
    category: "Languages",
    level: 85,
    years: 3,
    order: 0,
  });

  const resetForm = () => {
    setForm({
      name: "",
      category: filterCategory === "All" ? "Languages" : filterCategory,
      level: 85,
      years: 3,
      order: skills.length,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (s: SkillItem) => {
    setEditingId(s.id || "");
    setIsAdding(false);
    setForm({
      name: s.name,
      category: s.category,
      level: s.level,
      years: s.years ?? 3,
      order: s.order ?? 0,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      await updateSkill(editingId, form);
      setSkills((prev) => prev.map((s) => (s.id === editingId ? { ...form, id: editingId } : s)));
    } else {
      const res = await addSkill(form);
      if (res.success && res.id) {
        setSkills((prev) => [...prev, { ...form, id: res.id }]);
      }
    }

    setLoading(false);
    resetForm();
  };

  const handleReorder = async (ordered: SkillItem[]) => {
    let next = ordered;
    if (filterCategory !== "All") {
      const visibleIds = new Set(ordered.map((s) => s.id));
      let cursor = 0;
      next = skills.map((s) => (visibleIds.has(s.id) ? ordered[cursor++] : s));
    }
    const previous = skills;
    setSkills(next);
    const res = await reorderSkills(next.map((s) => s.id).filter((id): id is string => !!id));
    if (!res.success) {
      setSkills(previous);
      alert(res.error || "Failed to reorder skills");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this skill?")) return;
    setLoading(true);
    await deleteSkill(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setLoading(false);
  };

  const filteredSkills = filterCategory === "All"
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--spt-ink)]">Skills & Technologies ({skills.length})</h2>
          <p className="text-xs text-[var(--spt-muted)]">
            Manage your proficiency levels and categorized skill tabs on your portfolio.
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
            <Plus size={14} /> Add Skill
          </button>
        )}
      </div>

      {/* Category selector */}
      <div className="flex gap-2 p-1 rounded-xl bg-[var(--spt-soft)] border border-[var(--spt-line)] w-fit">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterCategory === cat
                ? "bg-[var(--spt-paper)] text-[var(--spt-ink)] shadow-sm font-semibold"
                : "text-[var(--spt-muted)] hover:text-[var(--spt-ink)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[var(--spt-line)] pb-3">
            <h3 className="font-semibold text-sm text-[var(--spt-ink)]">
              {editingId ? "Edit Skill" : "New Skill"}
            </h3>
            <button type="button" onClick={resetForm} className="text-[var(--spt-muted)] hover:text-[var(--spt-ink)]">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Skill Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Docker, Prisma, GraphQL"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
                Proficiency Level ({form.level}%)
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                className="w-full accent-[var(--spt-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Years of Experience</label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.years || ""}
                onChange={(e) => setForm({ ...form, years: Number(e.target.value) })}
                placeholder="e.g. 3"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
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
              {loading ? "Saving..." : "Save Skill"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of skills */}
      <SortableList
        items={filteredSkills}
        onReorder={handleReorder}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
        itemClassName="flex items-stretch gap-1"
        renderItem={(s) => (
          <div className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] hover:border-[var(--spt-muted)] transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[var(--spt-ink)]">{s.name}</span>
                {s.years && (
                  <span className="text-[10px] text-[var(--spt-faint)]">({s.years} yrs)</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[var(--spt-muted)]">{s.category}</span>
                <span className="text-[10px] text-[var(--spt-accent)] font-medium">{s.level}%</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEdit(s)}
                className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                title="Edit"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1.5 rounded-md text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
