import { getProjects } from "@/actions/projects";
import { getCertificates } from "@/actions/certificates";
import { getSkills } from "@/actions/skills";
import { getExploringBooks } from "@/actions/exploring";
import { getEducation, getLanguages, getResumeUrl } from "@/actions/education";
import { getGithubActivity } from "@/lib/github";
import SidebarPortfolioTemplate, { SptSkillGroup } from "@/components/ui/sidebar-portfolio-template";

export const instant = false;

const SKILL_CATEGORY_ORDER = ["Languages", "Frontend", "Backend", "Tools & DevOps"];

const DEFAULT_PROJECTS = [
  {
    title: "Rate Limiter",
    summary: "Systems project utilizing Token Bucket algorithm with Redis and PostgreSQL.",
    start: "2025",
    end: "2026",
    skills: ["TypeScript", "Express", "Node.js", "PostgreSQL"],
    images: ["https://images.unsplash.com/photo-1555066931-4365d14ba8c6?w=600"],
  },
  {
    title: "Local Chef Bazaar",
    summary: "Full-stack marketplace application for local culinary services.",
    start: "2024",
    end: "2025",
    skills: ["React", "Node.js", "MongoDB"],
    images: ["https://images.unsplash.com/photo-1555393642-667d9bd48088?w=600"],
  },
  {
    title: "Dealership Management System",
    summary: "Comprehensive management system for automotive sales and inventory.",
    start: "2024",
    end: "2024",
    skills: ["JavaScript", "Express", "Firebase"],
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600"],
  },
];

export default async function Home() {
  // Fetch all managed collections from MongoDB in parallel (with safe fallbacks)
  const [
    dbProjects,
    dbCerts,
    dbSkills,
    dbBooks,
    dbEducation,
    dbLanguages,
    dbResumeUrl,
    dbGithub,
  ] = await Promise.all([
    getProjects(),
    getCertificates(),
    getSkills(),
    getExploringBooks(),
    getEducation(),
    getLanguages(),
    getResumeUrl(),
    getGithubActivity("oasif-ahmed"),
  ]);

  // Transform projects
  const projects = dbProjects && dbProjects.length > 0
    ? dbProjects.map((p) => ({
        title: p.title,
        summary: p.description,
        start: p.status,
        end: "",
        skills: p.tags,
        images: p.images,
        liveLink: p.liveLink,
        repoLink: p.repoLink,
      }))
    : DEFAULT_PROJECTS.map((p) => ({
        ...p,
        liveLink: "",
        repoLink: "",
      }));

  const experienceData = projects.map((p) => ({
    company: p.title,
    roles: [p],
  }));

  const projectImagesMap = projects.reduce(
    (acc, p) => ({ ...acc, [p.title]: p.images }),
    {} as Record<string, string[]>
  );

  // Group skills into category tabs for SidebarPortfolioTemplate
  const skillCategories = Array.from(new Set(dbSkills.map((s) => s.category || "General"))).sort((a, b) => {
    const aIndex = SKILL_CATEGORY_ORDER.indexOf(a);
    const bIndex = SKILL_CATEGORY_ORDER.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  const groupedSkills: SptSkillGroup[] = skillCategories.map((cat) => ({
    name: cat,
    items: dbSkills
      .filter((s) => (s.category || "General") === cat)
      .map((s) => ({
        name: s.name,
        level: s.level,
        years: s.years,
      })),
  }));

  return (
    <div className="flex flex-1">
      <SidebarPortfolioTemplate
        className="flex-1"
        name="Oasif Ahmed Rikto"
        role="Full-Stack Software Engineer"
        headline="Full-Stack Software Engineer"
        tagline="I love building scalable distributed backends, robust web platforms, and refined developer tooling with clean engineering craft."
        email="oasifrikto@gmail.com"
        avatarSrc="/profile.png"
        signatureSrc="/signature.png"
        details={[
          { icon: "pin", label: "Dhaka, BD" },
          { icon: "briefcase", label: "Available for Impact Roles" },
        ]}
        socials={[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/oasif-ahmed-rikto-30610b354/", icon: "linkedin" },
          { label: "GitHub", href: "https://github.com/oasif-ahmed", icon: "github" },
        ]}
        skills={groupedSkills}
        books={dbBooks.map((b) => ({ title: b.title, color: b.color }))}
        booksNote="what I am currently exploring"
        keySkills={["Express", "Node", "Postgres", "Prisma ORM", "Next.js", "MongoDB", "Redis"]}
        about={[
          "A passionate Full Stack Developer focused on building modern, scalable, and user-friendly web applications.",
          "Experienced in backend engineering with Node.js, Express.js, PostgreSQL, and Prisma ORM, alongside responsive frontend interfaces using React.js, Next.js, and TypeScript.",
        ]}
        certificates={dbCerts}
        githubActivity={dbGithub}
        cvUrl={dbResumeUrl}
        cvNote="my curriculum vitae"
        educationIntro="Final year of my bachelor's. My classes are done, so I can work full-time between my last two exams."
        education={dbEducation}
        languages={dbLanguages}
        labels={{ experience: "Projects", viewExperience: "View Projects" }}
        experience={experienceData}
        projectImages={projectImagesMap}
        accent="#e5553b"
      />
    </div>
  );
}
