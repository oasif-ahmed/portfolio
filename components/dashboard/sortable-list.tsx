"use client";

import React, { useState } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

export function SortableList<T extends { id?: string }>({
  items,
  onReorder,
  renderItem,
  className = "space-y-2",
  itemClassName = "flex items-stretch gap-2",
}: {
  items: T[];
  onReorder: (ordered: T[]) => Promise<void>;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const move = async (from: number, to: number) => {
    if (busy || from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setBusy(true);
    try {
      await onReorder(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={item.id ?? index}
          draggable={!busy}
          onDragStart={(e) => {
            setDragIndex(index);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(index));
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex((prev) => (prev === index ? prev : index));
          }}
          onDrop={(e) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData("text/plain");
            const from = dragIndex ?? (raw ? Number(raw) : NaN);
            if (Number.isInteger(from) && from >= 0 && from < items.length) void move(from, index);
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          className={`${itemClassName} ${dragIndex === index ? "opacity-40" : ""} ${
            overIndex === index && dragIndex !== index ? "ring-1 ring-[var(--spt-accent)] rounded-xl" : ""
          }`}
        >
          <div className="flex flex-none flex-col items-center justify-center gap-0.5 text-[var(--spt-faint)]">
            <GripVertical size={15} className="cursor-grab active:cursor-grabbing" aria-label="Drag to reorder" />
            <button
              type="button"
              onClick={() => move(index, index - 1)}
              disabled={busy || index === 0}
              title="Move up"
              aria-label="Move up"
              className="p-0.5 rounded hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp size={12} />
            </button>
            <button
              type="button"
              onClick={() => move(index, index + 1)}
              disabled={busy || index === items.length - 1}
              title="Move down"
              aria-label="Move down"
              className="p-0.5 rounded hover:text-[var(--spt-ink)] hover:bg-[var(--spt-paper)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown size={12} />
            </button>
          </div>
          <div className="min-w-0 flex-1">{renderItem(item)}</div>
        </div>
      ))}
    </div>
  );
}
