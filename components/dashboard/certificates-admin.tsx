"use client";

import React, { useState } from "react";
import { CertificateItem, addCertificate, updateCertificate, deleteCertificate, reorderCertificates } from "@/actions/certificates";
import { SortableList } from "@/components/dashboard/sortable-list";
import { Plus, Trash2, Edit3, ExternalLink, Award, X } from "lucide-react";

export function CertificatesAdmin({ initialCertificates }: { initialCertificates: CertificateItem[] }) {
  const [certs, setCerts] = useState<CertificateItem[]>(initialCertificates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Omit<CertificateItem, "id" | "_id">>({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
    order: 0,
  });

  const resetForm = () => {
    setForm({
      title: "",
      issuer: "",
      date: "",
      credentialUrl: "",
      order: certs.length,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (c: CertificateItem) => {
    setEditingId(c.id || "");
    setIsAdding(false);
    setForm({
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      credentialUrl: c.credentialUrl || "",
      order: c.order ?? 0,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      await updateCertificate(editingId, form);
      setCerts((prev) => prev.map((c) => (c.id === editingId ? { ...form, id: editingId } : c)));
    } else {
      const res = await addCertificate(form);
      if (res.success && res.id) {
        setCerts((prev) => [...prev, { ...form, id: res.id }]);
      }
    }

    setLoading(false);
    resetForm();
  };

  const handleReorder = async (ordered: CertificateItem[]) => {
    const previous = certs;
    setCerts(ordered);
    const res = await reorderCertificates(ordered.map((c) => c.id).filter((id): id is string => !!id));
    if (!res.success) {
      setCerts(previous);
      alert(res.error || "Failed to reorder certificates");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this certificate?")) return;
    setLoading(true);
    await deleteCertificate(id);
    setCerts((prev) => prev.filter((c) => c.id !== id));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--spt-ink)]">Certifications ({certs.length})</h2>
          <p className="text-xs text-[var(--spt-muted)]">
            Manage your verified credentials displayed in the left sidebar.
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
            <Plus size={14} /> Add Certificate
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
              {editingId ? "Edit Certificate" : "New Certificate"}
            </h3>
            <button type="button" onClick={resetForm} className="text-[var(--spt-muted)] hover:text-[var(--spt-ink)]">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Certificate Title</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Claude Code 101"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Issuer / Organization</label>
              <input
                required
                type="text"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="e.g. Anthropic, Pearson, Programming Hero"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Issue Date</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. May 2026 or 2023-2025"
                className="w-full px-3 py-2 rounded-md bg-[var(--spt-paper)] border border-[var(--spt-line)] text-xs text-[var(--spt-ink)] outline-none focus:border-[var(--spt-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--spt-muted)] mb-1">Credential URL (Google Drive / Verification link)</label>
              <input
                type="url"
                value={form.credentialUrl}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
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
              {loading ? "Saving..." : "Save Certificate"}
            </button>
          </div>
        </form>
      )}

      <SortableList
        items={certs}
        onReorder={handleReorder}
        className="space-y-3"
        renderItem={(c) => (
          <div className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--spt-line)] bg-[var(--spt-soft)] hover:border-[var(--spt-muted)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--spt-paper)] border border-[var(--spt-line)] flex items-center justify-center text-[var(--spt-accent)] flex-none">
                <Award size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[var(--spt-ink)]">{c.title}</h4>
                <div className="flex items-center gap-2 text-xs text-[var(--spt-muted)]">
                  <span>{c.issuer}</span>
                  {c.date && <span>• {c.date}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {c.credentialUrl && (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                  title="View Credential"
                >
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                onClick={() => handleEdit(c)}
                className="p-1.5 rounded-md text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)]"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
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
