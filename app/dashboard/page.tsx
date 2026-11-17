import React from "react";
import Link from "next/link";
import { getProjects } from "@/actions/projects";
import { getCertificates } from "@/actions/certificates";
import { getSkills } from "@/actions/skills";
import { getExploringBooks } from "@/actions/exploring";
import { getEducation, getLanguages, getResumeUrl } from "@/actions/education";

import { ProjectsAdmin } from "@/components/dashboard/projects-admin";
import { CertificatesAdmin } from "@/components/dashboard/certificates-admin";
import { SkillsAdmin } from "@/components/dashboard/skills-admin";
import { ExploringAdmin } from "@/components/dashboard/exploring-admin";
import { EducationAdmin } from "@/components/dashboard/education-admin";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { ArrowLeft } from "lucide-react";

export const instant = false;

export default async function DashboardPage() {
  const [
    projects,
    certificates,
    skills,
    books,
    education,
    languages,
    resumeUrl,
  ] = await Promise.all([
    getProjects(),
    getCertificates(),
    getSkills(),
    getExploringBooks(),
    getEducation(),
    getLanguages(),
    getResumeUrl(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--spt-paper)] text-[var(--spt-ink)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--spt-line)] pb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg border border-[var(--spt-line)] bg-[var(--spt-soft)] text-[var(--spt-muted)] hover:text-[var(--spt-ink)] hover:bg-[var(--spt-soft2)] transition-colors"
              title="Return to Portfolio"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--spt-serif)" }}>
                Portfolio CMS Dashboard
              </h1>
              <p className="text-xs text-[var(--spt-muted)]">
                Add, edit, and organize all projects, skills, certificates, books, and education dynamically.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-md bg-[var(--spt-accent)] text-white text-xs font-medium hover:opacity-90"
          >
            View Live Portfolio →
          </Link>
        </div>

        {/* Dashboard Tabs & Sub-managers */}
        <DashboardTabs
          projectsComponent={<ProjectsAdmin initialProjects={projects || []} />}
          certificatesComponent={<CertificatesAdmin initialCertificates={certificates || []} />}
          skillsComponent={<SkillsAdmin initialSkills={skills || []} />}
          exploringComponent={<ExploringAdmin initialBooks={books || []} />}
          educationComponent={
            <EducationAdmin
              initialEducation={education || []}
              initialLanguages={languages || []}
              initialResumeUrl={resumeUrl || ""}
            />
          }
        />
      </div>
    </div>
  );
}
