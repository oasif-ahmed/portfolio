"use client";

import React, { useState } from "react";
import {
  EducationItem,
  LanguageItem,
  addEducation,
  updateEducation,
  deleteEducation,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  reorderEducation,
  reorderLanguages,
  updateResumeUrl,
} from "@/actions/education";
import { SortableList } from "@/components/dashboard/sortable-list";
import { Plus, Trash2, Edit3, X, GraduationCap, Globe, FileText, Check } from "lucide-react";

export function EducationAdmin({
  initialEducation,
  initialLanguages,
  initialResumeUrl,
}: {
  initialEducation: EducationItem[];
  initialLanguages: LanguageItem[];
  initialResumeUrl: string;
}) {
  // Education state
  const [edus, setEdus] = useState<EducationItem[]>(initialEducation);
  const [eduEditingId, setEduEditingId] = useState<string | null>(null);
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduForm, setEduForm] = useState<Omit<EducationItem, "id" | "_id">>({
    degree: "",
    school: "",
    start: "2024",
    end: "2026",
    circled: false,
    order: 0,
  });

  // Languages state
  const [langs, setLangs] = useState<LanguageItem[]>(initialLanguages);
  const [langEditingId, setLangEditingId] = useState<string | null>(null);
  const [isAddingLang, setIsAddingLang] = useState(false);
  const [langForm, setLangForm] = useState<Omit<LanguageItem, "id" | "_id">>({
    name: "",
    level: "native",
    value: 0.9,
    order: 0,
  });

  // Resume state
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
  const [resumeSaved, setResumeSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resume handlers
  const handleSaveResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateResumeUrl(resumeUrl);
    setLoading(false);
    setResumeSaved(true);
    setTimeout(() => setResumeSaved(false), 2500);
  };

  // Education handlers
  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (eduEditingId) {
      await updateEducation(eduEditingId, eduForm);
      setEdus((prev) => prev.map((e) => (e.id === eduEditingId ? { ...eduForm, id: eduEditingId } : e)));
    } else {
      const res = await addEducation(eduForm);
      if (res.success && res.id) {
        setEdus((prev) => [...prev, { ...eduForm, id: res.id }]);
      }
    }
    setLoading(false);
    setEduEditingId(null);
    setIsAddingEdu(false);
    setEduForm({ degree: "", school: "", start: "", end: "", circled: false, order: edus.length });
  };

  const handleDeleteEdu = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this education entry?")) return;
    setLoading(true);
    await deleteEducation(id);
    setEdus((prev) => prev.filter((e) => e.id !== id));
    setLoading(false);
  };

  const handleReorderEdu = async (ordered: EducationItem[]) => {
    const previous = edus;
    setEdus(ordered);
    const res = await reorderEducation(ordered.map((e) => e.id).filter((id): id is string => !!id));
    if (!res.success) {
      setEdus(previous);
      alert(res.error || "Failed to reorder education");
    }
  };

  // Language handlers
  const handleSaveLang = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (langEditingId) {
      await updateLanguage(langEditingId, langForm);
      setLangs((prev) => prev.map((l) => (l.id === langEditingId ? { ...langForm, id: langEditingId } : l)));
    } else {
      const res = await addLanguage(langForm);
      if (res.success && res.id) {
        setLangs((prev) => [...prev, { ...langForm, id: res.id }]);
      }
    }
    setLoading(false);
    setLangEditingId(null);
    setIsAddingLang(false);
    setLangForm({ name: "", level: "native", value: 0.9, order: langs.length });
  };

  const handleDeleteLang = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this language?")) return;
    setLoading(true);
    await deleteLanguage(id);
    setLangs((prev) => prev.filter((l) => l.id !== id));
    setLoading(false);
  };

  const handleReorderLang = async (ordered: LanguageItem[]) => {
    const previous = langs;
    setLangs(ordered);
    const res = await reorderLanguages(ordered.map((l) => l.id).filter((id): id is string => !!id));
    if (!res.success) {
      setLangs(previous);
      alert(res.error || "Failed to reorder languages");
    }
  };

  return (
    <div className="space-y-10">
      {/* Resume Section */}
      <div className="p-5 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--spt-ink)]">
          <FileText size={16} className="text-[var(--spt-accent)]" />
          <span>Resume & QR Code Link</span>
        </div>
        <p className="text-xs text-[var(--spt-muted)]">
          Updating this Google Drive URL dynamically updates the Download CV button and re-generates the scannable QR code.
        </p>
        <form onSubmit={handleSaveResume} className="flex gap-2">
          <input
            required
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="flex-1 px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)] font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-[var(--spt-ink)] text-[var(--spt-paper)] text-xs font-medium hover:opacity-90 flex items-center gap-1.5"
          >
            {resumeSaved ? <Check size={14} className="text-emerald-400" /> : null}
            {resumeSaved ? "Saved!" : "Update Resume"}
          </button>
        </form>
      </div>

      {/* Education Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--spt-ink)]">Education ({edus.length})</h3>
            <p className="text-xs text-[var(--spt-muted)]">Degrees, bootcamps, and circled highlight marks.</p>
          </div>
          {!isAddingEdu && !eduEditingId && (
            <button
              onClick={() => {
                setEduForm({ degree: "", school: "", start: "2024", end: "2026", circled: false, order: edus.length });
                setIsAddingEdu(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--spt-ink)] text-[var(--spt-paper)] text-xs font-medium hover:opacity-90"
            >
              <Plus size={14} /> Add Degree
            </button>
          )}
        </div>

        {(isAddingEdu || eduEditingId) && (
          <form onSubmit={handleSaveEdu} className="p-4 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Degree / Course</label>
                <input
                  required
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full px-3 py-1.5 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">University / School</label>
                <input
                  required
                  type="text"
                  value={eduForm.school}
                  onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                  placeholder="e.g. Ironhack, Coursera, University"
                  className="w-full px-3 py-1.5 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Start Year</label>
                <input
                  type="text"
                  value={eduForm.start}
                  onChange={(e) => setEduForm({ ...eduForm, start: e.target.value })}
                  placeholder="2023"
                  className="w-full px-3 py-1.5 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">End Year (or blank)</label>
                <input
                  type="text"
                  value={eduForm.end}
                  onChange={(e) => setEduForm({ ...eduForm, end: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3 py-1.5 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)]"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="circled"
                  checked={eduForm.circled}
                  onChange={(e) => setEduForm({ ...eduForm, circled: e.target.checked })}
                  className="accent-[var(--spt-accent)] rounded"
                />
                <label htmlFor="circled" className="text-xs font-medium text-[var(--spt-ink)] cursor-pointer">
                  Hand-drawn pen circle highlight
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAddingEdu(false);
                  setEduEditingId(null);
                }}
                className="px-3 py-1 text-xs text-[var(--spt-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-[var(--spt-accent)] text-white text-xs font-medium"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <SortableList
          items={edus}
          onReorder={handleReorderEdu}
          renderItem={(e) => (
            <div className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[var(--spt-ink)]">{e.degree}</span>
                  {e.circled && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full border border-[var(--spt-accent)] text-[var(--spt-accent)]">
                      Circled
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--spt-muted)]">
                  {e.school} • {[e.start, e.end].filter(Boolean).join(" - ")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEduEditingId(e.id || "");
                    setIsAddingEdu(false);
                    setEduForm({
                      degree: e.degree,
                      school: e.school,
                      start: e.start,
                      end: e.end,
                      circled: !!e.circled,
                      order: e.order ?? 0,
                    });
                  }}
                  className="p-1.5 text-[var(--spt-muted)] hover:text-[var(--spt-ink)]"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteEdu(e.id)}
                  className="p-1.5 text-red-500/70 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Languages Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--spt-ink)]">Languages ({langs.length})</h3>
            <p className="text-xs text-[var(--spt-muted)]">Languages and hand-drawn progress rulers.</p>
          </div>
          {!isAddingLang && !langEditingId && (
            <button
              onClick={() => {
                setLangForm({ name: "", level: "native", value: 0.9, order: langs.length });
                setIsAddingLang(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--spt-ink)] text-[var(--spt-paper)] text-xs font-medium hover:opacity-90"
            >
              <Plus size={14} /> Add Language
            </button>
          )}
        </div>

        {(isAddingLang || langEditingId) && (
          <form onSubmit={handleSaveLang} className="p-4 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Language Name</label>
                <input
                  required
                  type="text"
                  value={langForm.name}
                  onChange={(e) => setLangForm({ ...langForm, name: e.target.value })}
                  placeholder="e.g. English, French, Bengali"
                  className="w-full px-3 py-1.5 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Proficiency Level</label>
                <input
                  required
                  type="text"
                  value={langForm.level}
                  onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
                  placeholder="e.g. native, C1, B2"
                  className="w-full px-3 py-1.5 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">
                  Ruler Width ({Math.round(langForm.value * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={langForm.value}
                  onChange={(e) => setLangForm({ ...langForm, value: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--spt-accent)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAddingLang(false);
                  setLangEditingId(null);
                }}
                className="px-3 py-1 text-xs text-[var(--spt-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-[var(--spt-accent)] text-white text-xs font-medium"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <SortableList
          items={langs}
          onReorder={handleReorderLang}
          renderItem={(l) => (
            <div className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)]">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-xs text-[var(--spt-ink)]">{l.name}</span>
                <span className="text-xs text-[var(--spt-muted)]">{l.level}</span>
                <span className="text-[10px] text-[var(--spt-accent)] font-medium">
                  {Math.round(l.value * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setLangEditingId(l.id || "");
                    setIsAddingLang(false);
                    setLangForm({
                      name: l.name,
                      level: l.level,
                      value: l.value,
                      order: l.order ?? 0,
                    });
                  }}
                  className="p-1.5 text-[var(--spt-muted)] hover:text-[var(--spt-ink)]"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteLang(l.id)}
                  className="p-1.5 text-red-500/70 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
