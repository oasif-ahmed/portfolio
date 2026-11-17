"use client";

import React, { useState } from "react";
import { FolderKanban, Award, Code2, BookOpen, GraduationCap } from "lucide-react";

export function DashboardTabs({
  projectsComponent,
  certificatesComponent,
  skillsComponent,
  exploringComponent,
  educationComponent,
}: {
  projectsComponent: React.ReactNode;
  certificatesComponent: React.ReactNode;
  skillsComponent: React.ReactNode;
  exploringComponent: React.ReactNode;
  educationComponent: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"projects" | "certificates" | "skills" | "exploring" | "education">("projects");

  const tabs = [
    { key: "projects" as const, label: "Projects", icon: FolderKanban },
    { key: "certificates" as const, label: "Certificates", icon: Award },
    { key: "skills" as const, label: "Skills", icon: Code2 },
    { key: "exploring" as const, label: "Exploring Stack", icon: BookOpen },
    { key: "education" as const, label: "Education & CV", icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[var(--spt-soft)] border border-[var(--spt-line)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[var(--spt-paper)] text-[var(--spt-ink)] shadow-sm font-semibold border border-[var(--spt-line)]"
                  : "text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-soft2)]"
              }`}
            >
              <Icon size={15} className={isActive ? "text-[var(--spt-accent)]" : ""} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab view */}
      <div className="min-h-[400px]">
        {activeTab === "projects" && projectsComponent}
        {activeTab === "certificates" && certificatesComponent}
        {activeTab === "skills" && skillsComponent}
        {activeTab === "exploring" && exploringComponent}
        {activeTab === "education" && educationComponent}
      </div>
    </div>
  );
}
