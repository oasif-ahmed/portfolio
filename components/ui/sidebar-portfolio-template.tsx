"use client"

// Sidebar Portfolio Template — a whole one-page portfolio in one file. A quiet
// paper page with a sticky profile sidebar (portrait, bio, a signature that
// writes itself, details, socials, a CV download) and a reading column: a
// line-drawn hero with little things orbiting the developer, About with key
// skills, an Experience timeline, Education, Skills and Contact.
//
// It is meant to be used, not just looked at. The nav follows the scroll and
// glides between sections. Click a key skill and the timeline lights up the
// roles that used it. Click the hero and it tells you what just shipped. The
// mail button copies your address, Download CV writes a CV from the same data
// when you have no PDF, Contact Me opens a small compose sheet, and the moon
// flips the page dark. Everything is drawn here: no fonts, images or packages.
import * as React from "react"
import {
  siC,
  siCplusplus,
  siCss,
  siDocker,
  siExpress,
  siFirebase,
  siGit,
  siGithub,
  siGnubash,
  siGraphql,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siLinux,
  siMongodb,
  siMongoose,
  siNextdotjs,
  siNodedotjs,
  siNetlify,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siRender,
  siStripe,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons"
import type { GithubActivity } from "@/lib/github"
import { GithubHeatmap } from "@/components/ui/github-heatmap"

/* ---------- types ---------- */

export type SptDetailIcon = "pin" | "briefcase" | "globe" | "clock" | "mail" | "spark" | "cap"
export type SptSocialIcon = "linkedin" | "x" | "github" | "dribbble" | "instagram" | "globe" | "mail"
export type SptGlyph = "orbit" | "flower" | "hash" | "cap" | "book" | "spark" | "bolt" | "leaf" | "cube"
export type SptTheme = "auto" | "light" | "white" | "dark"

export type SptDetail = { icon: SptDetailIcon; label: string }
export type SptSocial = { label: string; href: string; icon: SptSocialIcon }
export type SptProject = {
  name: string
  description?: string
  year?: string
  tags?: string[]
  href?: string
  /** 0–360. Tints the generated cover; derived from the name when omitted. */
  hue?: number
}
/** A company or school mark: a coloured tile with a drawn glyph, or its initial. */
export type SptLogo = { color: string; glyph?: SptGlyph; text?: string }
export type SptRole = {
  title: string
  /** "Full-Time", "Contract"… shown after the company name. */
  type?: string
  /** "Jan 2025", "2021" or "Present". */
  start: string
  end: string
  summary?: string
  highlights?: string[]
  /** Match `keySkills` labels so the About chips can light this role up. */
  skills?: string[]
  liveLink?: string
  repoLink?: string
  images?: string[]
}
export type SptCompany = { company: string; logo?: SptLogo; roles: SptRole[] }
export type SptSchool = {
  school: string
  degree: string
  start: string
  end: string
  summary?: string
  notes?: string[]
  logo?: SptLogo
  circled?: boolean
}
export type SptLanguage = { name: string; level: string; value: number }
export type SptBook = { title: string; color: string }
export type SptCertificate = {
  id?: string
  title: string
  issuer?: string
  date?: string
  image?: string
  credentialUrl?: string
}
export type SptStat = { value: string; label: string }
export type SptSkill = { name: string; level: number; years?: number }
export type SptSkillGroup = { name: string; items: SptSkill[] }
export type SptLabels = {
  about: string
  experience: string
  projects: string
  education: string
  certificates: string
  skills: string
  contact: string
  contactMe: string
  keySkills: string
  viewExperience: string
  downloadCv: string
  all: string
}

export interface SidebarPortfolioTemplateProps {
  name?: string
  role?: string
  bio?: string
  /** A photo URL. Without one, an illustrated portrait is drawn (see `avatar`). */
  avatarSrc?: string
  /** Colours of the drawn portrait. */
  avatar?: { skin?: string; hair?: string; shirt?: string; backdrop?: string }
  /** Show the signature under the bio. It is generated from `name` unless `signatureSrc` is provided. */
  signature?: boolean
  /** Custom signature image URL (e.g. transparent PNG / SVG of user signature) */
  signatureSrc?: string
  details?: SptDetail[]
  socials?: SptSocial[]
  email?: string
  /** A real CV to download. Without one, Download CV writes a .txt from the page's data. */
  cvUrl?: string
  headline?: string
  tagline?: string
  /** What floats up when the hero drawing is clicked. */
  heroQuips?: string[]
  about?: string | string[]
  keySkills?: string[]
  experience?: SptCompany[]
  projects?: SptProject[]
  education?: SptSchool[]
  educationIntro?: string
  cvNote?: string
  languages?: SptLanguage[]
  books?: SptBook[]
  booksNote?: string
  certificates?: SptCertificate[]
  githubActivity?: GithubActivity | null
  stats?: SptStat[]
  skills?: SptSkillGroup[]
  contactTitle?: string
  contactText?: string
  /** Shows the green "available" pulse in Contact. */
  available?: boolean
  /** IANA zone for the local-time line in Contact, e.g. "Europe/Berlin". */
  timeZone?: string
  city?: string
  labels?: Partial<SptLabels>
  accent?: string
  paper?: string
  ink?: string
  darkPaper?: string
  darkInk?: string
  /** "auto" follows a `.dark` ancestor, the shadcn convention. */
  theme?: SptTheme
  themeToggle?: boolean
  /** Root height. The page scrolls inside it. Always a definite length. */
  height?: string
  className?: string
  projectImages?: Record<string, string[]>
}

/* ---------- defaults ---------- */

const DEFAULT_LABELS: SptLabels = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  certificates: "Certifications",
  skills: "Skills",
  contact: "Contact",
  contactMe: "Contact Me",
  keySkills: "Key skills:",
  viewExperience: "View Experience",
  downloadCv: "Get CV",
  all: "All",
}

const DEFAULT_DETAILS: SptDetail[] = [
  { icon: "pin", label: "Houston, Texas" },
  { icon: "briefcase", label: "5+ years experience" },
  { icon: "globe", label: "Open to remote work" },
]

const DEFAULT_SOCIALS: SptSocial[] = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "Dribbble", href: "https://dribbble.com", icon: "dribbble" },
]

const DEFAULT_ABOUT = [
  "I'm a full stack developer with experience building web applications focused on performance, scalability, and usability. I specialize in creating responsive frontend interfaces, developing reliable backend systems, and working across the full product development process using modern technologies and clean development practices.",
]

const DEFAULT_KEY_SKILLS = [
  "React & Next.js",
  "Node.js & APIs",
  "Responsive interfaces",
  "Backend architecture",
  "TypeScript",
  "Database management",
  "Performance optimization",
]

const DEFAULT_EXPERIENCE: SptCompany[] = [
  {
    company: "Northstack",
    logo: { color: "#3450f0", glyph: "orbit" },
    roles: [
      {
        title: "Senior Full Stack Developer",
        type: "Full-Time",
        start: "Jan 2025",
        end: "Present",
        summary: "Leading full-stack development for scalable web applications and reliable digital products across teams.",
        highlights: [
          "Improved platform performance and stability",
          "Built frontend and backend product features",
          "Collaborated with product and engineering teams",
        ],
        skills: ["React & Next.js", "Node.js & APIs", "Backend architecture", "TypeScript", "Performance optimization"],
      },
      {
        title: "Full Stack Developer",
        type: "Full-Time",
        start: "Jan 2023",
        end: "Dec 2024",
        summary: "Worked on responsive web applications, API integrations, and backend systems using modern frameworks.",
        skills: ["React & Next.js", "Node.js & APIs", "Database management", "TypeScript"],
      },
    ],
  },
  {
    company: "Pixelbase",
    logo: { color: "#ef4a26", glyph: "flower" },
    roles: [
      {
        title: "Frontend Developer",
        type: "Full-Time",
        start: "Apr 2021",
        end: "Dec 2022",
        summary:
          "Developed responsive user interfaces and interactive web experiences for client and internal digital products, focusing on usability, accessibility, and performance.",
        skills: ["React & Next.js", "Responsive interfaces", "Performance optimization"],
      },
    ],
  },
  {
    company: "CloudCore",
    logo: { color: "#7b2fe0", glyph: "hash" },
    roles: [
      {
        title: "Junior Web Developer",
        type: "Part-Time",
        start: "Aug 2020",
        end: "May 2021",
        summary:
          "Supported frontend and backend development tasks while contributing to modern web projects, maintaining internal systems, and improving workflow efficiency.",
        highlights: ["Assisted in developing responsive website interfaces", "Worked with REST APIs and backend integrations"],
        skills: ["Responsive interfaces", "Node.js & APIs", "Database management"],
      },
    ],
  },
]

const DEFAULT_EDUCATION: SptSchool[] = [
  {
    school: "Lakeshore State University",
    degree: "B.S. in Computer Science",
    start: "Aug 2016",
    end: "May 2020",
    summary: "Focused on distributed systems, databases, and human-computer interaction.",
    notes: ["Graduated with honors", "Teaching assistant for Intro to Web Development"],
    logo: { color: "#1f7a5a", glyph: "cap" },
  },
  {
    school: "Open Cloud Academy",
    degree: "Cloud Architecture Certificate",
    start: "Mar 2022",
    end: "Aug 2022",
    summary: "Designing, deploying and observing resilient services on managed cloud infrastructure.",
    logo: { color: "#d99a1e", glyph: "cube" },
  },
]

const DEFAULT_SKILLS: SptSkillGroup[] = [
  {
    name: "Frontend",
    items: [
      { name: "React & Next.js", level: 95, years: 5 },
      { name: "TypeScript", level: 90, years: 5 },
      { name: "Tailwind CSS", level: 88, years: 4 },
      { name: "Accessibility", level: 78, years: 3 },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js & APIs", level: 92, years: 5 },
      { name: "PostgreSQL", level: 84, years: 4 },
      { name: "GraphQL", level: 76, years: 3 },
      { name: "Redis", level: 68, years: 2 },
    ],
  },
  {
    name: "Tooling",
    items: [
      { name: "Docker", level: 82, years: 4 },
      { name: "AWS", level: 74, years: 3 },
      { name: "CI/CD", level: 80, years: 4 },
      { name: "Testing", level: 86, years: 5 },
    ],
  },
]

const DEFAULT_QUIPS = ["deployed ✓", "tests passing", "shipped!", "0 bugs (so far)", "p95 → 120ms", "merged to main"]

// #region dates
// "Jan 2025" / "January 2025" / "2021" / "Present" → months since year 0, and
// the span between two of them as "1 yr 9 mos". Both ends count, like a CV.
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

function monthIndex(s: string, now: Date): number | null {
  const t = s.trim().toLowerCase()
  if (/^(present|now|current|today)$/.test(t)) return now.getFullYear() * 12 + now.getMonth()
  const m = t.match(/^([a-z]{3})[a-z]*\.?\s+(\d{4})$/)
  if (m) {
    const i = MONTHS.indexOf(m[1])
    return i > -1 ? Number(m[2]) * 12 + i : null
  }
  const y = t.match(/^(\d{4})$/)
  return y ? Number(y[1]) * 12 : null
}

function spanLabel(start: string, end: string, now: Date): string {
  const a = monthIndex(start, now)
  const b = monthIndex(end, now)
  if (a === null || b === null || b < a) return ""
  const n = b - a + 1
  const yrs = Math.floor(n / 12)
  const mos = n % 12
  const parts: string[] = []
  if (yrs) parts.push(yrs + (yrs === 1 ? " yr" : " yrs"))
  if (mos) parts.push(mos + (mos === 1 ? " mo" : " mos"))
  return parts.join(" ")
}
// #endregion dates

// #region signature
// An illegible, confident signature generated from a name: a looped capital,
// one hump per letter (tall ones reach up, deep ones dip), and a flourish that
// sweeps back under it all. Seeded by the name, so it is the same every time.
type Pt = [number, number]

function seedOf(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0 || 1
}

function rng(seed: number): () => number {
  let a = seed
  return () => {
    a ^= a << 13
    a ^= a >>> 17
    a ^= a << 5
    return ((a >>> 0) % 10007) / 10007
  }
}

function signaturePoints(name: string): Pt[] {
  const first = (name.trim().split(/\s+/)[0] || "").replace(/[^A-Za-z]/g, "")
  const r = rng(seedOf(name.trim().toLowerCase() || "a"))
  const pts: Pt[] = [[6, 44], [13, 22 + r() * 3], [17, 6], [32, 7], [33, 17], [15, 24], [24, 31]]
  let x = 27
  for (const ch of first.slice(1, 8).toLowerCase()) {
    const w = 6 + r() * 4
    const top = "bdfhklt".includes(ch) ? 11 + r() * 4 : 22 + r() * 5
    pts.push([x + w * 0.45, top])
    if ("gjpqyz".includes(ch)) pts.push([x + w * 0.75, 47 + r() * 2], [x + w * 0.35, 44])
    pts.push([x + w, 33 + r() * 3])
    x += w
  }
  pts.push([x + 9, 22 + r() * 4], [x + 13, 34], [x - 6, 41], [x * 0.4, 43 + r() * 2], [7, 41])
  return pts
}

function smoothPath(p: Pt[]): string {
  const f = (n: number) => String(Math.round(n * 10) / 10)
  let d = "M" + f(p[0][0]) + " " + f(p[0][1])
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    d +=
      " C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) +
      " " + f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) +
      " " + f(p2[0]) + " " + f(p2[1])
  }
  return d
}

function signatureOf(name: string): { d: string; width: number } {
  const pts = signaturePoints(name)
  const width = Math.ceil(Math.max(...pts.map((p) => p[0])) + 6)
  return { d: smoothPath(pts), width }
}
// #endregion signature

// #region QR & Pen drawings for Marginalia Education
const QR_EXP: number[] = []
const QR_LOG: number[] = []
;(function initGF() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    QR_EXP[i] = x
    QR_LOG[x] = i
    x <<= 1
    if (x & 256) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) QR_EXP[i] = QR_EXP[i - 255]
})()

function gfMul(a: number, b: number): number {
  return a && b ? QR_EXP[QR_LOG[a] + QR_LOG[b]] : 0
}

function rsRemainder(data: number[], n: number): number[] {
  let gen = [1]
  for (let i = 0; i < n; i++) {
    const next = new Array(gen.length + 1).fill(0)
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j]
      next[j + 1] ^= gfMul(gen[j], QR_EXP[i])
    }
    gen = next
  }
  const res = new Array(n).fill(0)
  for (const d of data) {
    const f = d ^ res[0]
    res.shift()
    res.push(0)
    for (let j = 0; j < n; j++) res[j] ^= gfMul(gen[j + 1], f)
  }
  return res
}

function utf8(s: string): number[] {
  const out: number[] = []
  for (const ch of s) {
    const c = ch.codePointAt(0) || 0
    if (c < 0x80) out.push(c)
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63))
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63))
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63))
  }
  return out
}

const QR_M = [[0, 0, 0], [16, 10, 1], [28, 16, 1], [44, 26, 1], [32, 18, 2], [43, 24, 2], [27, 16, 4]]

function qrMask(m: number, x: number, y: number): boolean {
  switch (m) {
    case 0: return (x + y) % 2 === 0
    case 1: return y % 2 === 0
    case 2: return x % 3 === 0
    case 3: return (x + y) % 3 === 0
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0
    default: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
  }
}

function qrPenalty(g: boolean[][]): number {
  const n = g.length
  let p = 0
  let dark = 0
  for (let a = 0; a < n; a++) {
    for (const horiz of [true, false]) {
      let run = 1
      for (let b = 1; b <= n; b++) {
        const same = b < n && (horiz ? g[a][b] === g[a][b - 1] : g[b][a] === g[b - 1][a])
        if (same) run++
        else {
          if (run >= 5) p += run - 2
          run = 1
        }
      }
      for (let b = 0; b + 10 < n; b++) {
        let s = ""
        for (let k = 0; k < 11; k++) s += (horiz ? g[a][b + k] : g[b + k][a]) ? "1" : "0"
        if (s === "10111010000" || s === "00001011101") p += 40
      }
    }
  }
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (g[y][x]) dark++
      if (x < n - 1 && y < n - 1 && g[y][x] === g[y][x + 1] && g[y][x] === g[y + 1][x] && g[y][x] === g[y + 1][x + 1]) p += 3
    }
  p += Math.floor(Math.abs((dark * 20) / (n * n) - 10)) * 10
  return p
}

function qrMatrix(text: string): boolean[][] | null {
  const bytes = utf8(text)
  let ver = 1
  while (ver <= 6 && 12 + bytes.length * 8 > QR_M[ver][0] * QR_M[ver][2] * 8) ver++
  if (ver > 6) return null
  const [per, ecn, blocks] = QR_M[ver]
  const cap = per * blocks
  const bits: number[] = []
  const put = (v: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((v >>> i) & 1)
  }
  put(4, 4)
  put(bytes.length, 8)
  for (const b of bytes) put(b, 8)
  put(0, Math.min(4, cap * 8 - bits.length))
  while (bits.length % 8) bits.push(0)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2))
  for (let pad = 0xec; data.length < cap; pad ^= 0xec ^ 0x11) data.push(pad)
  const dataBlocks: number[][] = []
  const ecBlocks: number[][] = []
  for (let b = 0; b < blocks; b++) {
    const chunk = data.slice(b * per, (b + 1) * per)
    dataBlocks.push(chunk)
    ecBlocks.push(rsRemainder(chunk, ecn))
  }
  const stream: number[] = []
  for (let i = 0; i < per; i++) for (const blk of dataBlocks) stream.push(blk[i])
  for (let i = 0; i < ecn; i++) for (const blk of ecBlocks) stream.push(blk[i])

  const size = 17 + ver * 4
  const mods: boolean[][] = []
  const fn: boolean[][] = []
  for (let y = 0; y < size; y++) {
    mods.push(new Array(size).fill(false))
    fn.push(new Array(size).fill(false))
  }
  const set = (x: number, y: number, v: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    mods[y][x] = v
    fn[y][x] = true
  }
  for (const [fx, fy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy))
        set(fx + dx, fy + dy, d !== 2 && d !== 4)
      }
  }
  for (let i = 8; i < size - 8; i++) {
    set(6, i, i % 2 === 0)
    set(i, 6, i % 2 === 0)
  }
  if (ver > 1) {
    const c = size - 7
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) set(c + dx, c + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
  }
  const drawFormat = (mask: number) => {
    const d = mask
    let rem = d
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const f = ((d << 10) | rem) ^ 0x5412
    const bit = (i: number) => ((f >>> i) & 1) === 1
    for (let i = 0; i <= 5; i++) set(8, i, bit(i))
    set(8, 7, bit(6))
    set(8, 8, bit(7))
    set(7, 8, bit(8))
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i))
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i))
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i))
    set(8, size - 8, true)
  }
  drawFormat(0)
  let i = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert
        if (!fn[y][x] && i < stream.length * 8) {
          mods[y][x] = ((stream[i >>> 3] >>> (7 - (i & 7))) & 1) === 1
          i++
        }
      }
  }
  let best: boolean[][] = mods
  let bestScore = Infinity
  for (let m = 0; m < 8; m++) {
    drawFormat(m)
    const g = mods.map((row, y) => row.map((v, x) => (fn[y][x] ? v : v !== qrMask(m, x, y))))
    const score = qrPenalty(g)
    if (score < bestScore) {
      bestScore = score
      best = g
    }
  }
  return best
}

function QRCode({ text }: { text: string }) {
  const g = React.useMemo(() => qrMatrix(text), [text])
  if (!g) return null
  const n = g.length
  let d = ""
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (g[y][x]) d += "M" + x + " " + y + "h1v1h-1z"
  return (
    <svg viewBox={"-2 -2 " + (n + 4) + " " + (n + 4)} shapeRendering="crispEdges" role="img" aria-label={"QR code: " + text}>
      <path d={d} fill="currentColor" />
    </svg>
  )
}

function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v))
}

function rand(seed: number): () => number {
  let s = (Math.floor(seed * 9973) ^ 0x9e3779b9) >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function r1(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

function ovalPath(w: number, h: number, seed: number): string {
  const R = rand(seed)
  const cx = w / 2
  const cy = h / 2
  const rx = Math.max(4, w / 2 - 3)
  const ry = Math.max(4, h / 2 - 3)
  const start = -2.5 + R() * 0.6
  const sweep = Math.PI * 2 * (1.1 + R() * 0.08)
  const n = 30
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const a = start + sweep * t
    const k = 1.04 - 0.09 * t + (R() - 0.5) * 0.03
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k + (t - 0.5) * 2])
  }
  return smoothPath(pts)
}

function handLine(x1: number, x2: number, y: number, seed: number): string {
  const R = rand(seed)
  const n = Math.max(2, Math.round((x2 - x1) / 22))
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) pts.push([x1 + ((x2 - x1) * i) / n, y + (R() - 0.5) * 3])
  return smoothPath(pts)
}

function arrowPaths(a: Pt, b: Pt, bend: number, head = 9): { shaft: string; head: string } {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const c: Pt = [(a[0] + b[0]) / 2 - (dy / len) * len * bend, (a[1] + b[1]) / 2 + (dx / len) * len * bend]
  const shaft = "M" + r1(a[0]) + " " + r1(a[1]) + "Q" + r1(c[0]) + " " + r1(c[1]) + " " + r1(b[0]) + " " + r1(b[1])
  const ang = Math.atan2(b[1] - c[1], b[0] - c[0])
  const s = 0.5
  const h1: Pt = [b[0] - Math.cos(ang - s) * head, b[1] - Math.sin(ang - s) * head]
  const h2: Pt = [b[0] - Math.cos(ang + s) * head, b[1] - Math.sin(ang + s) * head]
  return {
    shaft,
    head: "M" + r1(h1[0]) + " " + r1(h1[1]) + "L" + r1(b[0]) + " " + r1(b[1]) + "L" + r1(h2[0]) + " " + r1(h2[1]),
  }
}

function MgnArrow({ a, b, bend = -0.3, head = 9 }: { a: Pt; b: Pt; bend?: number; head?: number }) {
  const p = arrowPaths(a, b, bend, head)
  return (
    <g>
      <path d={p.shaft} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <path d={p.head} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

function isLight(hex: string): boolean {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return false
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  const v = parseInt(h, 16)
  const lum = (0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255
  return lum > 0.62
}

function BookStack({ books }: { books: { title: string; color: string }[] }) {
  const list = books.slice(0, 7)
  const R = rand(5)
  const bh = 30
  const base = list.length * bh + 64
  return (
    <svg viewBox={"0 0 260 " + (base + 6)} aria-hidden="true" style={{ width: "100%", height: "auto", overflow: "visible", display: "block" }}>
      <g style={{ stroke: "var(--spt-accent)" }}>
        <path className="mgn-draw" pathLength={1} d={handLine(6, 254, base + 2, 3)} style={{ fill: "none", strokeWidth: 1.8, strokeLinecap: "round" }} />
      </g>
      {list.map((b, i) => {
        const w = 175 + R() * 45
        const x = (260 - w) / 2 + (R() - 0.5) * 16
        const y = base - (i + 1) * bh
        const rot = (R() - 0.5) * 5
        const dark = !isLight(b.color)
        const title = b.title.toUpperCase()
        return (
          <g
            key={i}
            className="mgn-book-item"
            transform={"rotate(" + rot.toFixed(2) + " " + (x + w / 2).toFixed(1) + " " + (y + bh / 2).toFixed(1) + ")"}
          >
            <rect x={x} y={y} width={w} height={bh - 3} rx={3} fill={b.color} stroke="rgba(0,0,0,.25)" strokeWidth={0.7} />
            <rect x={x + 9} y={y} width={4} height={bh - 3} fill={dark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.12)"} />
            <rect x={x + w - 13} y={y} width={4} height={bh - 3} fill={dark ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.12)"} />
            <text
              x={x + w / 2}
              y={y + bh / 2 + 3}
              textAnchor="middle"
              fontSize={8.5}
              fill={dark ? "#f4f2ec" : "#232325"}
              textLength={Math.min(w - 38, title.length * 6.2)}
              lengthAdjust="spacingAndGlyphs"
              style={{ fontWeight: 600, letterSpacing: ".06em" }}
            >
              {title}
            </text>
          </g>
        )
      })}
      <g style={{ stroke: "var(--spt-accent)", fill: "none", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }} transform={"translate(104 " + (base - list.length * bh - 52) + ")"}>
        <path className="mgn-draw" pathLength={1} d="M10 22h30v10c0 8-6 13-15 13S10 40 10 32z" />
        <path className="mgn-draw" pathLength={1} d="M40 25c6 0 7 3 7 5s-2 6-7 6" />
        <path className="mgn-draw" pathLength={1} d="M19 16c-3-3 3-6 0-10M29 16c-3-3 3-6 0-10" />
      </g>
    </svg>
  )
}

function PenOvalMark({ seed = 1, padX = 12, padY = 7 }: { seed?: number; padX?: number; padY?: number }) {
  const ref = React.useRef(null as SVGSVGElement | null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  useIsoLayoutEffect(() => {
    const host = ref.current?.parentElement
    if (!host) return
    const measure = () => {
      const w = host.offsetWidth
      const h = host.offsetHeight
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])
  const W = Math.max(1, box.w + padX * 2)
  const H = Math.max(1, box.h + padY * 2)
  const d = ovalPath(W, H, seed)
  return (
    <svg ref={ref} className="mgn-mark" aria-hidden="true" viewBox={"0 0 " + W + " " + H} style={{ left: -padX, top: -padY, width: W, height: H }}>
      <path className="mgn-draw" pathLength={1} d={d} />
    </svg>
  )
}
// #endregion QR & Pen drawings

// #region cv
// The CV Download CV writes when there is no `cvUrl`: plain text, from the
// same data the page shows, so it can never disagree with it.
type CvInput = {
  name: string
  role: string
  bio: string
  email: string
  details: string[]
  about: string[]
  experience: SptCompany[]
  education: SptSchool[]
  skills: SptSkillGroup[]
}

function buildCv(c: CvInput): string {
  const out: string[] = []
  const head = (t: string) => out.push("", t.toUpperCase(), "-".repeat(t.length))
  out.push(c.name, c.role)
  const contact = [c.email, ...c.details].filter(Boolean).join("  ·  ")
  if (contact) out.push(contact)
  if (c.bio) out.push("", c.bio)
  if (c.about.length) {
    head("About")
    out.push(...c.about)
  }
  if (c.experience.length) {
    head("Experience")
    for (const co of c.experience) {
      for (const r of co.roles) {
        out.push("", r.title + " — " + co.company + (r.type ? " (" + r.type + ")" : ""), r.start + " – " + r.end)
        if (r.summary) out.push(r.summary)
        for (const h of r.highlights ?? []) out.push("  • " + h)
      }
    }
  }
  if (c.education.length) {
    head("Education")
    for (const s of c.education) {
      out.push("", s.degree + " — " + s.school, s.start + " – " + s.end)
      if (s.summary) out.push(s.summary)
      for (const n of s.notes ?? []) out.push("  • " + n)
    }
  }
  if (c.skills.length) {
    head("Skills")
    for (const g of c.skills) out.push(g.name + ": " + g.items.map((i) => i.name).join(", "))
  }
  return out.join("\n") + "\n"
}
// #endregion cv

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect
const levelName = (n: number) => (n >= 90 ? "Expert" : n >= 80 ? "Advanced" : n >= 65 ? "Proficient" : "Familiar")
const norm = (s: string) => s.trim().toLowerCase()

/* ---------- drawings ---------- */

function DetailIcon({ icon }: { icon: SptDetailIcon }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const
  return (
    <svg className="spt-ico" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      {icon === "pin" && (
        <g {...p}>
          <path d="M7 12.6s4.4-3.8 4.4-7a4.4 4.4 0 0 0-8.8 0c0 3.2 4.4 7 4.4 7Z" />
          <circle cx="7" cy="5.6" r="1.5" />
        </g>
      )}
      {icon === "briefcase" && (
        <g {...p}>
          <rect x="1.8" y="4.3" width="10.4" height="7.6" rx="1.5" />
          <path d="M5 4.3V3a.8.8 0 0 1 .8-.8h2.4A.8.8 0 0 1 9 3v1.3M1.8 7.8h10.4" />
        </g>
      )}
      {icon === "globe" && (
        <g {...p}>
          <circle cx="7" cy="7" r="5.2" />
          <ellipse cx="7" cy="7" rx="2.2" ry="5.2" />
          <path d="M1.8 7h10.4" />
        </g>
      )}
      {icon === "clock" && (
        <g {...p}>
          <circle cx="7" cy="7" r="5.2" />
          <path d="M7 4.2V7l1.9 1.2" />
        </g>
      )}
      {icon === "mail" && (
        <g {...p}>
          <rect x="1.5" y="3" width="11" height="8" rx="1.5" />
          <path d="m2 4 5 3.8L12 4" />
        </g>
      )}
      {icon === "spark" && <path d="M7 1.5c.5 3 2 4.5 5.5 5.5C9 8 7.5 9.5 7 12.5 6.5 9.5 5 8 1.5 7 5 6 6.5 4.5 7 1.5Z" {...p} />}
      {icon === "cap" && (
        <g {...p}>
          <path d="M1.2 5.6 7 2.8l5.8 2.8L7 8.4Z" />
          <path d="M3.8 6.9v2.8c1.8 1.4 4.6 1.4 6.4 0V6.9M12.8 5.6v3.2" />
        </g>
      )}
    </svg>
  )
}

function SocialIcon({ icon }: { icon: SptSocialIcon }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const
  switch (icon) {
    case "linkedin":
      return (
        <g {...p}>
          <rect x="2" y="2" width="12" height="12" rx="2.4" />
          <path d="M5.2 7.2v3.8M7.8 11V7.2m0 1.6c0-1.4 3-2.2 3 .2V11" />
          <circle cx="5.2" cy="5.1" r=".5" fill="currentColor" />
        </g>
      )
    case "x":
      return (
        <g {...p}>
          <path d="M3 2.8h2.8l7.2 10.4h-2.8Z" />
          <path d="M12.8 2.8 8.9 7.2M7.1 8.9 3.2 13.2" />
        </g>
      )
    case "github":
      return (
        <g {...p}>
          <path d="M6 13.6c-3.2-.9-4-3.2-4-5.4C2 4.8 4.7 2.4 8 2.4s6 2.4 6 5.8c0 2.2-.8 4.5-4 5.4" />
          <path d="M6 13.6v-2c0-.8.3-1.3.8-1.6-2-.2-3-1-3-3 0-.6.2-1.1.6-1.6l-.1-1.5 1.4.6a5.6 5.6 0 0 1 2.6 0l1.4-.6-.1 1.5c.4.5.6 1 .6 1.6 0 2-1 2.8-3 3 .5.3.8.8.8 1.6v2" />
        </g>
      )
    case "dribbble":
      return (
        <g {...p}>
          <circle cx="8" cy="8" r="5.8" />
          <path d="M3.6 4.4c3.4 2.4 7 2.3 9-.3M2.3 9c3.6-1.2 7.6.1 9.6 3.8M5.9 2.6c2.3 2.7 3.8 6.6 4.2 11" />
        </g>
      )
    case "instagram":
      return (
        <g {...p}>
          <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="3.4" />
          <circle cx="8" cy="8" r="2.7" />
          <circle cx="11.4" cy="4.6" r=".5" fill="currentColor" />
        </g>
      )
    case "mail":
      return (
        <g {...p}>
          <rect x="1.8" y="3.4" width="12.4" height="9.2" rx="1.6" />
          <path d="m2.4 4.4 5.6 4.2 5.6-4.2" />
        </g>
      )
    default:
      return (
        <g {...p}>
          <circle cx="8" cy="8" r="5.8" />
          <ellipse cx="8" cy="8" rx="2.5" ry="5.8" />
          <path d="M2.2 8h11.6" />
        </g>
      )
  }
}

function BrandSocialIcon({ icon }: { icon: SptSocialIcon }) {
  if (icon === "github") {
    return (
      <svg className="spt-brand-ico spt-brand-github" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"
        />
      </svg>
    )
  }
  if (icon === "linkedin") {
    return (
      <svg className="spt-brand-ico" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="#0A66C2"
          d="M20.4 20.5h-3.5V15c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.6H9.3V9h3.4v1.6h.1a3.7 3.7 0 0 1 3.3-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1Zm1.8 13.1H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z"
        />
      </svg>
    )
  }
  return (
    <svg className="spt-brand-ico" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
      <SocialIcon icon={icon} />
    </svg>
  )
}

type SkillBrandIcon = Pick<SimpleIcon, "path" | "hex">

const SQL_ICON: SkillBrandIcon = {
  hex: "4479A1",
  path:
    "M12 2C7.6 2 4 3.1 4 4.5S7.6 7 12 7s8-1.1 8-2.5S16.4 2 12 2ZM4 8.2c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6v2.3c0 1.4-3.6 2.6-8 2.6s-8-1.2-8-2.6V8.2Zm0 5.2c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6V16c0 1.4-3.6 2.5-8 2.5S4 17.4 4 16v-2.6Zm0 5.2c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6V21c0 1.4-3.6 2.5-8 2.5S4 22.4 4 21v-2.4Z",
}

const AUTH_ICON: SkillBrandIcon = {
  hex: "000000",
  path: "M14.5 2a6 6 0 0 0-5.7 8L2 16.8V22h5.2l6.8-6.8a6 6 0 1 0 .5-13.2Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
}

const SKILL_ICONS: { match: RegExp; icon: SkillBrandIcon }[] = [
  { match: /\bnextauth\b/i, icon: AUTH_ICON },
  { match: /\bnext(?:\.js|js)?\b/i, icon: siNextdotjs },
  { match: /\breact(?:\.js|js)?\b/i, icon: siReact },
  { match: /\btanstack(?:\s+query)?\b|\breact query\b/i, icon: siTanstack },
  { match: /\btypescript\b|\bts\b/i, icon: siTypescript },
  { match: /\bjavascript\b|\bjs\b/i, icon: siJavascript },
  { match: /\bnode(?:\.js|js)?\b/i, icon: siNodedotjs },
  { match: /\bpostgre(?:sql)?\b|\bpostgres\b/i, icon: siPostgresql },
  { match: /\bsql\b/i, icon: SQL_ICON },
  { match: /\bprisma\b/i, icon: siPrisma },
  { match: /\bmongodb?\b|\bmongo\b/i, icon: siMongodb },
  { match: /\bmongoose\b/i, icon: siMongoose },
  { match: /\bredis\b/i, icon: siRedis },
  { match: /\bexpress(?:\.js|js)?\b/i, icon: siExpress },
  { match: /\btailwind(?:\s*css)?\b/i, icon: siTailwindcss },
  { match: /\bgithub\b/i, icon: siGithub },
  { match: /\bgit\b/i, icon: siGit },
  { match: /\bjson\s*web\s*tokens?\b|\bjwt\b/i, icon: siJsonwebtokens },
  { match: /\bstripe\b/i, icon: siStripe },
  { match: /\bpostman\b/i, icon: siPostman },
  { match: /\bfirebase\b/i, icon: siFirebase },
  { match: /\bvercel\b/i, icon: siVercel },
  { match: /\bnetlify\b/i, icon: siNetlify },
  { match: /\brender\b/i, icon: siRender },
  { match: /\bdocker\b/i, icon: siDocker },
  { match: /\bhtml5?\b/i, icon: siHtml5 },
  { match: /\bcss3?\b/i, icon: siCss },
  { match: /\bpython\b/i, icon: siPython },
  { match: /\bc\+\+\b/i, icon: siCplusplus },
  { match: /\bc\b/i, icon: siC },
  { match: /\bjava\b|\bopenjdk\b/i, icon: siOpenjdk },
  { match: /\bgraphql\b/i, icon: siGraphql },
  { match: /\blinux\b/i, icon: siLinux },
  { match: /\bbash\b|shell/i, icon: siGnubash },
]

function isDarkHex(hex: string) {
  const value = hex.replace("#", "")
  const r = parseInt(value.slice(0, 2), 16) / 255
  const g = parseInt(value.slice(2, 4), 16) / 255
  const b = parseInt(value.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.32
}

function SkillIcon({ name }: { name: string }) {
  const match = SKILL_ICONS.find((item) => item.match.test(name))
  if (!match) return <span className="spt-skill-icon spt-skill-dot" aria-hidden="true" />
  return (
    <svg
      className="spt-skill-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      data-dark={isDarkHex(match.icon.hex) ? "" : undefined}
      style={{ "--skill-color": `#${match.icon.hex}` } as React.CSSProperties}
    >
      <path d={match.icon.path} fill="currentColor" />
    </svg>
  )
}

function Glyph({ glyph }: { glyph: SptGlyph }) {
  const s = { fill: "none", stroke: "#fff", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const
  switch (glyph) {
    case "orbit":
      return (
        <g {...s}>
          <circle cx="10" cy="10" r="1.8" fill="#fff" />
          <ellipse cx="10" cy="10" rx="7" ry="2.8" transform="rotate(-35 10 10)" />
          <ellipse cx="10" cy="10" rx="7" ry="2.8" transform="rotate(35 10 10)" />
        </g>
      )
    case "flower":
      return (
        <g fill="#fff">
          <circle cx="10" cy="5.8" r="3.2" />
          <circle cx="14.2" cy="10" r="3.2" />
          <circle cx="10" cy="14.2" r="3.2" />
          <circle cx="5.8" cy="10" r="3.2" />
          <circle cx="10" cy="10" r="1.6" fill="currentColor" />
        </g>
      )
    case "hash":
      return <path d="M8 3.5 6.8 16.5M13.2 3.5 12 16.5M4 7.6h12.2M3.6 12.4h12.2" {...s} />
    case "cap":
      return (
        <g {...s}>
          <path d="M1.8 8 10 4l8.2 4L10 12Z" fill="#fff" />
          <path d="M5.4 9.9v3.6c2.6 2 6.6 2 9.2 0V9.9M18.2 8v4.4" />
        </g>
      )
    case "book":
      return <path d="M3 5c3-1 5-.6 7 1 2-1.6 4-2 7-1v10c-3-1-5-.6-7 1-2-1.6-4-2-7-1ZM10 6v10" {...s} />
    case "spark":
      return <path d="M10 2.4c.8 4.8 2.8 6.8 7.6 7.6-4.8.8-6.8 2.8-7.6 7.6-.8-4.8-2.8-6.8-7.6-7.6 4.8-.8 6.8-2.8 7.6-7.6Z" fill="#fff" />
    case "bolt":
      return <path d="M11.2 2.4 4.4 11h5.2l-1 6.6L15.6 9h-5.2Z" fill="#fff" />
    case "leaf":
      return <path d="M4 16c0-7.4 4.6-12 12-12 0 7.4-4.6 12-12 12Zm0 0 7.6-7.6" {...s} />
    default:
      return <path d="M10 3 16.5 6.6v6.8L10 17l-6.5-3.6V6.6ZM3.5 6.6 10 10.2l6.5-3.6M10 10.2V17" {...s} />
  }
}

function LogoTile({ logo, name, size = 22, round = false }: { logo?: SptLogo; name: string; size?: number; round?: boolean }) {
  const color = logo?.color ?? "#6b6b6b"
  const text = logo?.text ?? (logo?.glyph ? "" : name.trim().charAt(0).toUpperCase())
  return (
    <span className={"spt-logo" + (round ? " is-round" : "")} style={{ width: size, height: size, background: color, color }} aria-hidden="true">
      {text ? (
        <b>{text}</b>
      ) : (
        <svg viewBox="0 0 20 20" width={size * 0.66} height={size * 0.66}>
          <Glyph glyph={logo?.glyph ?? "cube"} />
        </svg>
      )}
    </span>
  )
}

// The portrait drawn when there is no photo: shoulders, a face that blinks, curls.
function Portrait({ uid, skin, hair, shirt, backdrop }: { uid: string; skin: string; hair: string; shirt: string; backdrop: string }) {
  const g = uid + "-bd"
  return (
    <svg className="spt-portrait" viewBox="0 0 88 88" width="88" height="88" aria-hidden="true">
      <defs>
        <radialGradient id={g} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="88" height="88" fill={backdrop} />
      <rect width="88" height="88" fill={"url(#" + g + ")"} />
      <path d="M6 88c2-17 17-26 38-26s36 9 38 26Z" fill={shirt} />
      <path d="M35 50v12c4 5 14 5 18 0V50Z" fill={skin} />
      <path d="M35 57c4 3 14 3 18 0v5c-4 5-14 5-18 0Z" fill="#000" opacity="0.14" />
      <path d="M33 62.5 44 73l11-10.5" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="1.4" />
      <ellipse cx="29.5" cy="41" rx="3" ry="4.6" fill={skin} />
      <ellipse cx="58.5" cy="41" rx="3" ry="4.6" fill={skin} />
      <ellipse cx="44" cy="39" rx="14.6" ry="17.6" fill={skin} />
      <path d="M31 44c1 9 6 13.6 13 13.6S56 53 57 44c-2 5-6 7.6-13 7.6S33 49 31 44Z" fill="#000" opacity="0.1" />
      <g fill={hair}>
        <path d="M28.4 38c-2.4-14 5.4-21 15.6-21s18 7 15.6 21c-1.2-5.6-3.4-8.6-6.6-9.6-5 2-12.4 2-18 0-3.4 1.2-5.4 4.2-6.6 9.6Z" />
        <circle cx="33" cy="23.6" r="4.6" />
        <circle cx="39.6" cy="19.8" r="5" />
        <circle cx="47" cy="19" r="5" />
        <circle cx="53.8" cy="22.4" r="4.6" />
        <circle cx="57.4" cy="28.2" r="3.6" />
        <circle cx="30" cy="29.4" r="3.4" />
      </g>
      <g fill="none" stroke={hair} strokeWidth="1.5" strokeLinecap="round">
        <path d="M34.6 35.4c1.8-1 3.8-1 5.4-.2M48 35.2c1.6-.8 3.6-.8 5.4.2" />
      </g>
      <g className="spt-blink">
        <ellipse cx="37.6" cy="40.4" rx="1.5" ry="1.7" fill="#1e1510" />
        <ellipse cx="50.4" cy="40.4" rx="1.5" ry="1.7" fill="#1e1510" />
      </g>
      <path d="M44.4 41.4c-.8 3.2-1.8 5-.2 6" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M39.4 51c3 2.2 7 2.2 9.8 0" fill="none" stroke="#7a3a2c" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// The hero drawing: a developer on the floor with a laptop, two orbits and
// the little things that float around a working day. The orbiting dots are
// moved by the component's animation frame; the icons bob in CSS.
const ORBITS = [
  { rx: 96, ry: 30, rot: -16 },
  { rx: 74, ry: 40, rot: 24 },
]
const CX = 120
const CY = 84

function orbitPoint(o: { rx: number; ry: number; rot: number }, t: number): Pt {
  const a = (o.rot * Math.PI) / 180
  const x = o.rx * Math.cos(t)
  const y = o.ry * Math.sin(t)
  return [CX + x * Math.cos(a) - y * Math.sin(a), CY + x * Math.sin(a) + y * Math.cos(a)]
}

function HeroArt({ dotRefs }: { dotRefs: React.MutableRefObject<(SVGCircleElement | null)[]> }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const
  const body = { style: { fill: "var(--spt-paper)" }, stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" } as const
  const icon = (x: number, y: number, depth: number, delay: number, children: React.ReactNode) => (
    <g style={{ transform: "translate(calc(var(--spt-px) * " + depth + "px), calc(var(--spt-py) * " + depth + "px))" }}>
      <g className="spt-bob" style={{ animationDelay: delay + "s" }}>
        <g transform={"translate(" + x + " " + y + ")"}>{children}</g>
      </g>
    </g>
  )
  const start = ORBITS.map((o, i) => orbitPoint(o, i * 2.4 + 0.6))
  return (
    <svg className="spt-art" viewBox="0 0 240 160" width="240" height="160" aria-hidden="true">
      {ORBITS.map((o, i) => (
        <ellipse key={i} cx={CX} cy={CY} rx={o.rx} ry={o.ry} transform={"rotate(" + o.rot + " " + CX + " " + CY + ")"} {...line} strokeWidth={1.1} opacity={0.75} />
      ))}

      {/* the developer */}
      <g className="spt-dev">
        <path d="M86 118c2-11 21-14 34-9 13-5 32-2 34 9-3 9-22 10-34 3-12 7-31 6-34-3Z" {...body} />
        <path d="M101 88c0-14 7-20 19-20s19 6 19 20v16h-38Z" {...body} />
        <path d="M117 60v8h6v-8" {...line} />
        <g className="spt-head">
          <circle cx="120" cy="48" r="13" {...body} />
          <path d="M107.4 46c-1.4-11 6-16 12.6-16 8 0 14 5.6 12.4 16-2-5-5.6-7.6-12.2-7.6-6 0-10.6 2.4-12.8 7.6Z" fill="currentColor" />
          <path d="M115 52.2h.01M125 52.2h.01" {...line} strokeWidth={2.4} />
          <path d="M116.6 56.4c2 1.4 4.8 1.4 6.8 0" {...line} strokeWidth={1.3} />
        </g>
        <path d="M103 76c-7 7-7 17 0 26M137 76c7 7 7 17 0 26" {...line} />
        <rect x="99" y="82" width="42" height="26" rx="2.5" fill="currentColor" />
        <circle cx="120" cy="95" r="3" style={{ fill: "var(--spt-paper)" }} className="spt-led" />
        <path d="M92 108h56l4 4H88Z" fill="currentColor" />
      </g>

      {/* what floats around: mail, chat, code, heart, star */}
      {icon(44, 34, 6, 0, (
        <g>
          <rect x="0" y="0" width="20" height="14" rx="2.4" {...body} />
          <path d="m1.2 1.8 8.8 6.4 8.8-6.4" {...line} strokeWidth={1.3} />
        </g>
      ))}
      {icon(176, 26, 9, 0.8, (
        <g>
          <path d="M3 0h16a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4v-4H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3Z" {...body} />
          <path d="M6.6 7h.01M11 7h.01M15.4 7h.01" {...line} strokeWidth={2.2} />
        </g>
      ))}
      {icon(186, 104, 5, 1.6, (
        <g>
          <rect x="0" y="0" width="24" height="17" rx="3" {...body} />
          <path d="m9 5.4-3.2 3.1L9 11.6M15 5.4l3.2 3.1-3.2 3.1M13 4.6l-2 7.8" {...line} strokeWidth={1.3} />
        </g>
      ))}
      {icon(30, 98, 8, 2.3, <path d="M9 15.4C3.4 11.6 0 8.6 0 5a4.6 4.6 0 0 1 9-1.4A4.6 4.6 0 0 1 18 5c0 3.6-3.4 6.6-9 10.4Z" fill="currentColor" />)}
      {icon(150, 8, 4, 1.2, <path d="M6 0c.5 3.2 2.2 5 6 6-3.8 1-5.5 2.8-6 6-.5-3.2-2.2-5-6-6 3.8-1 5.5-2.8 6-6Z" fill="currentColor" />)}
      {icon(70, 132, 7, 3, <path d="M5 0c.4 2.6 1.8 4 5 5-3.2 1-4.6 2.4-5 5-.4-2.6-1.8-4-5-5 3.2-1 4.6-2.4 5-5Z" fill="currentColor" opacity={0.7} />)}

      {/* orbiting dots, placed by the animation frame */}
      {start.map((p, i) => (
        <circle
          key={i}
          ref={(el) => {
            dotRefs.current[i] = el
          }}
          cx={p[0]}
          cy={p[1]}
          r={i ? 2.6 : 3.4}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

/* ---------- styles ---------- */

const SPT_CSS = `
.spt-root{--spt-paper:var(--spt-paper-l);--spt-paper-w:#fff;--spt-ink:var(--spt-ink-l);--spt-bg:var(--spt-paper-l);--spt-chip:var(--spt-soft);position:relative;overflow:hidden;container:spt/inline-size;color:var(--spt-ink);background:var(--spt-paper);font-family:var(--spt-sans);font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;color-scheme:light}
.spt-root[data-theme="white"]{--spt-paper:var(--spt-paper-w);--spt-ink:var(--spt-ink-l);--spt-bg:var(--spt-paper-w);--spt-chip:var(--spt-soft);color-scheme:light}
.spt-root[data-theme="dark"],:where(.dark) .spt-root[data-theme="auto"]{--spt-paper:var(--spt-paper-d);--spt-ink:var(--spt-ink-d);--spt-bg:var(--spt-paper-d);--spt-chip:var(--spt-soft2);color-scheme:dark}
.spt-root{--spt-muted:color-mix(in oklab,var(--spt-ink) 60%,var(--spt-paper));--spt-faint:color-mix(in oklab,var(--spt-ink) 42%,var(--spt-paper));--spt-line:color-mix(in oklab,var(--spt-ink) 11%,var(--spt-paper));--spt-soft:color-mix(in oklab,var(--spt-ink) 5.5%,var(--spt-paper));--spt-soft2:color-mix(in oklab,var(--spt-ink) 9%,var(--spt-paper))}
:where(.spt-root) *,:where(.spt-root) *::before,:where(.spt-root) *::after{box-sizing:border-box}
.spt-root svg{max-width:none;display:block}
:where(.spt-root) button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
:where(.spt-root) a{color:inherit;text-decoration:none}
.spt-root :focus-visible{outline:2px solid var(--spt-accent);outline-offset:2px;border-radius:4px}
.spt-scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scroll-behavior:auto;overscroll-behavior:contain}
.spt-grid{display:grid;grid-template-columns:minmax(0,1fr)}
.spt-serif{font-family:var(--spt-serif);font-weight:400;letter-spacing:-.01em}
.spt-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* sidebar */
.spt-side{display:flex;flex-direction:column;gap:18px;padding:24px 20px 22px;border-bottom:1px solid var(--spt-line)}
.spt-side-top{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;align-items:center}
.spt-avatar{width:76px;height:76px;border-radius:3px;overflow:hidden;background:var(--spt-soft2);grid-row:span 2}
.spt-avatar img,.spt-avatar .spt-portrait{width:100%;height:100%;max-width:none;object-fit:cover;display:block}
.spt-name{font-size:24px;line-height:1.1;margin:0}
.spt-role{margin:3px 0 0;font-size:12.5px;color:var(--spt-muted)}
.spt-bio{margin:0;font-size:13px;color:var(--spt-muted);max-width:34ch;line-height:1.6}
.spt-sig{display:block;width:max-content;color:var(--spt-ink);margin:-4px 0 -6px -4px;padding:4px;border-radius:6px}
.spt-sig path{stroke-dasharray:1;stroke-dashoffset:0}
.spt-sig:hover{background:var(--spt-soft)}
.spt-sig-img-wrap{display:block;overflow:hidden;position:relative;width:150px;height:55px;margin:-4px 0 -6px -4px;padding:2px;border-radius:6px}
.spt-sig-img-wrap:hover{background:var(--spt-soft)}
.spt-sig-img{width:100%;height:100%;object-fit:contain;object-position:left center;display:block}
.spt-root[data-theme="dark"] .spt-sig-img,:where(.dark) .spt-root[data-theme="auto"] .spt-sig-img{filter:invert(1) brightness(1.2)}
.spt-rule{height:1px;background:var(--spt-line);border:0;margin:0}
.spt-details{list-style:none;margin:0;padding:0;display:grid;gap:7px;font-size:12.5px}
.spt-details li{display:flex;align-items:center;gap:9px}
.spt-ico{color:var(--spt-muted);flex:none}

/* sidebar stats */
.spt-side-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px;background:var(--spt-soft);border:1px solid var(--spt-line);border-radius:6px}
.spt-stat-item{display:flex;flex-direction:column;gap:2px}
.spt-stat-val{font-size:16px;font-weight:700;color:var(--spt-ink);line-height:1.1;letter-spacing:-0.02em}
.spt-stat-lbl{font-size:11px;color:var(--spt-muted);line-height:1.3}

/* sidebar certifications */
.spt-side-certs{display:flex;flex-direction:column;gap:10px}
.spt-side-subhead{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--spt-muted)}
.spt-cert-count{display:inline-flex;align-items:center;justify-content:center;padding:1px 6px;border-radius:999px;background:var(--spt-soft2);font-size:10px;color:var(--spt-ink)}
.spt-cert-list{display:flex;flex-direction:column;gap:7px}
.spt-cert-item{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:6px;background:var(--spt-soft);border:1px solid var(--spt-line);transition:background .2s,border-color .2s}
.spt-cert-item:hover{background:var(--spt-soft2);border-color:color-mix(in oklab,var(--spt-ink) 20%,var(--spt-paper))}
.spt-cert-main{min-width:0;flex:1}
.spt-cert-title-row{display:flex;align-items:center;gap:6px}
.spt-cert-badge-dot{width:5px;height:5px;border-radius:50%;background:var(--spt-accent);flex:none}
.spt-cert-title{margin:0;font-size:12px;font-weight:500;color:var(--spt-ink);line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spt-cert-meta{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--spt-muted);margin-top:2px}
.spt-cert-dot{opacity:0.6}
.spt-cert-link{display:grid;place-items:center;width:24px;height:24px;border-radius:4px;color:var(--spt-muted);flex:none;transition:color .2s,background .2s}
.spt-cert-link:hover{color:var(--spt-ink);background:var(--spt-soft2)}
.spt-cert-preview{position:absolute;bottom:100%;left:0;right:0;margin-bottom:6px;overflow:hidden;border-radius:6px;background:var(--spt-soft);box-shadow:0 8px 24px rgba(0,0,0,.18);opacity:0;transform:scale(0.96) translateY(6px);transition:opacity .25s ease,transform .25s ease;pointer-events:none;z-index:20}
.spt-cert-item:hover .spt-cert-preview{opacity:1;transform:scale(1) translateY(0)}
.spt-cert-img{width:100%;height:auto;display:block}
.spt-main-certs{margin-top:14px}

/* sidebar github activity */
.spt-gh{display:grid;gap:10px;padding:12px;background:var(--spt-soft);border:1px solid var(--spt-line);border-radius:6px}
.spt-gh-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.spt-gh-total{display:flex;flex-direction:column;gap:1px}
.spt-gh-total strong{font-size:26px;line-height:1;letter-spacing:-0.04em;color:var(--spt-ink)}
.spt-gh-total span{font-size:10.5px;color:var(--spt-muted)}
.spt-gh-year{font-size:10px;color:var(--spt-accent);text-decoration:none;white-space:nowrap}
.spt-gh-year:hover{text-decoration:underline}
.spt-gh-grid-wrap{display:grid;grid-template-columns:18px minmax(0,1fr);gap:4px;align-items:stretch}
.spt-gh-days{display:grid;grid-template-rows:repeat(7,minmax(0,1fr));gap:1.5px}
.spt-gh-days span{display:flex;align-items:center;font-size:7px;line-height:1;color:var(--spt-faint)}
.spt-gh-grid{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,minmax(0,1fr));gap:1.5px;width:100%}
.spt-gh-cell{display:block;width:100%;aspect-ratio:1;border-radius:1.5px;background:var(--spt-soft2)}
.spt-gh-blank{background:transparent}
.spt-gh-l0{background:color-mix(in oklab,var(--spt-ink) 7%,var(--spt-paper))}
.spt-gh-l1{background:color-mix(in oklab,var(--spt-accent) 28%,var(--spt-soft))}
.spt-gh-l2{background:color-mix(in oklab,var(--spt-accent) 52%,var(--spt-soft))}
.spt-gh-l3{background:color-mix(in oklab,var(--spt-accent) 76%,var(--spt-soft))}
.spt-gh-l4{background:var(--spt-accent)}
.spt-gh-foot{display:flex;align-items:center;justify-content:flex-end;gap:3px;font-size:9px;color:var(--spt-faint)}
.spt-gh-foot .spt-gh-cell{width:8px;height:8px;aspect-ratio:auto;border-radius:1.5px}

.spt-intro-socials{display:flex;gap:8px;margin:10px 0 -12px}
.spt-intro-socials a{display:grid;place-items:center;width:32px;height:32px;border:1px solid var(--spt-line);border-radius:6px;background:var(--spt-soft);transition:background .2s,border-color .2s,transform .2s}
.spt-intro-socials a:hover{background:var(--spt-soft2);border-color:color-mix(in oklab,var(--spt-ink) 20%,var(--spt-paper));transform:translateY(-2px)}
.spt-brand-ico{width:18px;height:18px;display:block}
.spt-brand-github{color:var(--spt-ink)}

.spt-side-foot{display:grid;gap:14px;margin-top:4px}
.spt-actions{display:grid;grid-template-columns:1fr 44px;gap:6px}
.spt-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;height:42px;padding:0 16px;border-radius:3px;font-size:12.5px;font-weight:500;position:relative;isolation:isolate;overflow:hidden;transition:background .2s,transform .15s,color .2s}
.spt-btn:active{transform:translateY(1px)}
.spt-btn-dark{background:var(--spt-ink);color:var(--spt-paper)}
.spt-btn-dark:hover{background:color-mix(in oklab,var(--spt-ink) 86%,var(--spt-accent))}
.spt-btn-soft{background:var(--spt-soft2);color:var(--spt-ink)}
.spt-btn-soft:hover{background:color-mix(in oklab,var(--spt-ink) 14%,var(--spt-paper))}
.spt-btn .spt-dl{transition:transform .25s}
.spt-btn:hover .spt-dl{transform:translateY(2px)}

/* main */
.spt-main{min-width:0;position:relative}
.spt-nav{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;height:58px;padding:0 20px;background:color-mix(in oklab,var(--spt-paper) 88%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid transparent;transition:border-color .3s}
.spt-nav[data-stuck]{border-bottom-color:var(--spt-line)}
.spt-mark{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;color:var(--spt-accent);flex:none;transition:transform .4s}
.spt-mark:hover{transform:rotate(-12deg) scale(1.06)}
.spt-links{position:relative;display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;min-width:0;flex:1;margin:0;padding:0;list-style:none}
.spt-links::-webkit-scrollbar{display:none}
.spt-links a{position:relative;z-index:1;display:block;padding:5px 8px;font-size:12.5px;color:var(--spt-muted);white-space:nowrap;border-radius:999px;transition:color .2s}
.spt-links a:hover,.spt-links a[aria-current="true"]{color:var(--spt-ink)}
.spt-pill{position:absolute;top:0;left:0;height:100%;border-radius:999px;background:var(--spt-soft2);transition:transform .45s cubic-bezier(.3,1.3,.5,1),width .45s cubic-bezier(.3,1.3,.5,1),opacity .3s;pointer-events:none}
.spt-nav-end{display:flex;align-items:center;gap:6px;flex:none}
.spt-theme{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;color:var(--spt-muted);transition:color .2s,background .2s}
.spt-theme:hover{color:var(--spt-ink);background:var(--spt-soft2)}
.spt-theme .spt-sun,.spt-theme .spt-white{display:none}
.spt-root[data-theme="white"] .spt-theme .spt-moon{display:block}
.spt-root[data-theme="light"] .spt-theme .spt-white{display:block}
.spt-root[data-theme="light"] .spt-theme .spt-moon{display:none}
.spt-root[data-theme="dark"] .spt-theme .spt-sun,:where(.dark) .spt-root[data-theme="auto"] .spt-theme .spt-sun{display:block}
.spt-root[data-theme="dark"] .spt-theme .spt-moon,:where(.dark) .spt-root[data-theme="auto"] .spt-theme .spt-moon{display:none}
.spt-contact-btn{height:34px;padding:0 13px;font-size:12px;gap:7px}
.spt-contact-btn .spt-cm-label{display:none}
.spt-col{max-width:600px;margin:0 auto;padding:0 20px}
.spt-sec{padding:48px 0 44px;border-top:1px solid var(--spt-line)}
.spt-h2{font-size:28px;line-height:1.15;margin:0 0 16px}
.spt-p{margin:0 0 12px;color:var(--spt-muted);font-size:13.5px;line-height:1.7;max-width:60ch}

/* hero */
.spt-hero{padding:34px 0 52px;text-align:center;display:grid;justify-items:center}
.spt-art-wrap{position:relative;width:276px;height:184px;color:var(--spt-accent);cursor:pointer;border-radius:12px;--spt-px:0;--spt-py:0}
.spt-art{width:276px;height:184px}
.spt-art g{transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.spt-art .spt-bob{transition:none}
.spt-head{transform-box:fill-box;transform-origin:50% 90%}
.spt-quip{position:absolute;left:50%;top:44%;padding:3px 9px;border-radius:999px;background:var(--spt-ink);color:var(--spt-paper);font-size:11px;font-weight:500;white-space:nowrap;pointer-events:none;transform:translate(-50%,0);opacity:0}
.spt-h1{font-size:40px;line-height:1.05;margin:18px 0 12px}
.spt-tagline{margin:0 auto 22px;max-width:44ch;color:var(--spt-muted);font-size:14px;line-height:1.6}
.spt-cta{display:inline-flex;align-items:center;gap:12px;height:40px;padding:0 12px 0 8px;min-width:200px;border-radius:3px;background:var(--spt-soft2);font-size:12.5px;font-weight:500;position:relative;isolation:isolate;overflow:hidden;transition:background .2s,color .2s}
.spt-cta:hover{background:color-mix(in oklab,var(--spt-ink) 14%,var(--spt-paper))}
.spt-stack{display:flex}

/* liquid hover fill */
.spt-btn>*,
.spt-cta>*{position:relative;z-index:1}
.spt-btn::before,
.spt-btn::after,
.spt-cta::before,
.spt-cta::after{content:"";position:absolute;left:-18%;bottom:-170%;width:136%;height:170%;z-index:-1;border-radius:43% 57% 44% 56% / 52% 44% 56% 48%;pointer-events:none}
.spt-btn::before,
.spt-cta::before{background:linear-gradient(180deg,color-mix(in oklab,var(--spt-accent) 30%,transparent),color-mix(in oklab,var(--spt-accent) 18%,transparent));backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);transition:bottom .62s cubic-bezier(.22,1,.36,1),transform .62s cubic-bezier(.22,1,.36,1)}
.spt-btn::after,
.spt-cta::after{bottom:-178%;background:color-mix(in oklab,var(--spt-accent) 14%,transparent);opacity:.9;transform:rotate(9deg);transition:bottom .72s .05s cubic-bezier(.22,1,.36,1),transform .72s .05s cubic-bezier(.22,1,.36,1)}
.spt-btn-dark:is(:hover,:focus-visible){color:var(--spt-paper)}
.spt-btn-soft:is(:hover,:focus-visible),
.spt-cta:is(:hover,:focus-visible){color:var(--spt-ink)}
.spt-btn:is(:hover,:focus-visible)::before,
.spt-cta:is(:hover,:focus-visible)::before{bottom:-52%;transform:rotate(-4deg);animation:spt-water-wave 2.1s ease-in-out .62s infinite}
.spt-btn:is(:hover,:focus-visible)::after,
.spt-cta:is(:hover,:focus-visible)::after{bottom:-58%;transform:rotate(6deg);animation:spt-water-wave-alt 2.4s ease-in-out .66s infinite}
@keyframes spt-water-wave{0%,100%{border-radius:43% 57% 44% 56% / 52% 44% 56% 48%}50%{border-radius:55% 45% 52% 48% / 43% 56% 44% 57%}}
@keyframes spt-water-wave-alt{0%,100%{border-radius:48% 52% 55% 45% / 45% 55% 46% 54%}50%{border-radius:40% 60% 47% 53% / 57% 43% 60% 40%}}
.spt-stack .spt-logo{box-shadow:0 0 0 2px var(--spt-soft2);transition:margin .35s cubic-bezier(.3,1.4,.5,1)}
.spt-stack .spt-logo+.spt-logo{margin-left:-7px}
.spt-cta:hover .spt-stack .spt-logo+.spt-logo{margin-left:2px}
.spt-cta-arrow{margin-left:auto;transition:transform .3s}
.spt-cta:hover .spt-cta-arrow{transform:translateX(3px)}

/* chips */
.spt-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.spt-chip{display:inline-flex;align-items:center;gap:6px;height:27px;padding:0 9px;border-radius:3px;background:var(--spt-soft2);font-size:12px;color:var(--spt-ink);transition:background .2s,color .2s,transform .15s}
.spt-chip:hover{background:color-mix(in oklab,var(--spt-ink) 14%,var(--spt-paper))}
.spt-chip[aria-pressed="true"]{background:var(--spt-accent);color:#fff}
.spt-chip:active{transform:scale(.97)}
.spt-chip i{font-style:normal;font-size:10.5px;opacity:.6}
.spt-chip .spt-skill-icon{width:14px;height:14px;flex:none;color:var(--skill-color,var(--spt-accent))}
.spt-chip .spt-skill-dot{width:5px;height:5px;border-radius:50%;background:var(--spt-accent);color:transparent}
.spt-root[data-theme="dark"] .spt-chip .spt-skill-icon[data-dark]{color:var(--spt-ink)}
.spt-chip[aria-pressed="true"] .spt-skill-icon{color:#fff}
.spt-label{margin:20px 0 9px;font-size:12.5px;font-weight:500}

/* timeline */
.spt-filter{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-4px 0 18px;padding:8px 10px;border-radius:4px;background:color-mix(in oklab,var(--spt-accent) 9%,var(--spt-paper));font-size:12.5px}
.spt-filter b{font-weight:600;color:var(--spt-accent)}
.spt-filter button{margin-left:auto;font-size:12px;text-decoration:underline;text-underline-offset:3px;color:var(--spt-muted)}
.spt-filter button:hover{color:var(--spt-ink)}
.spt-tl{list-style:none;margin:0;padding:0;display:grid;gap:26px}
.spt-co{display:grid;grid-template-columns:22px minmax(0,1fr);gap:0 14px;position:relative}
.spt-co[data-multi]::before{content:"";position:absolute;left:10.5px;top:30px;bottom:6px;width:1px;background:var(--spt-line)}
.spt-roles{display:grid;gap:22px}
.spt-role{position:relative;transition:opacity .35s}
.spt-role+.spt-role::before{content:"";position:absolute;left:-28.5px;top:6px;width:7px;height:7px;border-radius:50%;background:var(--spt-paper);box-shadow:inset 0 0 0 1.5px var(--spt-line);transition:box-shadow .25s,background .25s}
.spt-role:hover::before,.spt-role[data-hit]::before{background:var(--spt-accent);box-shadow:inset 0 0 0 1.5px var(--spt-accent)}
.spt-role[data-dim]{opacity:.32}
.spt-role-head{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.spt-role h3,.spt-edu h3{font-size:17px;line-height:1.25;margin:0}
.spt-meta{margin:2px 0 0;font-size:12px;color:var(--spt-muted)}
.spt-meta span{margin:0 5px;opacity:.7}
.spt-date{margin:0;font-size:11.5px;color:var(--spt-muted);text-align:right;white-space:nowrap;flex:none}
.spt-date small{display:block;font-size:10.5px;color:var(--spt-faint);height:15px}
.spt-role .spt-p,.spt-edu .spt-p{margin:10px 0 0;font-size:12.5px;line-height:1.65}
.spt-bul{list-style:disc;margin:8px 0 0;padding:0 0 0 16px;font-size:12.5px;color:var(--spt-muted);line-height:1.8}
.spt-bul li::marker{color:var(--spt-faint)}
.spt-tags{display:flex;flex-wrap:wrap;gap:4px;margin:10px 0 0;padding:0;list-style:none}
.spt-tags button{height:21px;padding:0 7px;border-radius:3px;font-size:11px;color:var(--spt-muted);box-shadow:inset 0 0 0 1px var(--spt-line);transition:color .2s,box-shadow .2s,background .2s}
.spt-tags button:hover{color:var(--spt-ink);box-shadow:inset 0 0 0 1px var(--spt-faint)}
.spt-tags button[aria-pressed="true"]{color:#fff;background:var(--spt-accent);box-shadow:none}
.spt-logo{display:grid;place-items:center;border-radius:4px;flex:none;overflow:hidden}
.spt-logo.is-round{border-radius:50%}
.spt-logo b{color:#fff;font-size:11px;font-weight:600;line-height:1}

/* education */
.mgn-edu{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:32px;max-width:100%;align-items:start;margin-top:14px}
@media (max-width:768px){.mgn-edu{grid-template-columns:1fr;gap:40px}}
.mgn-edu-intro{font-size:13.5px;line-height:1.6;color:var(--spt-muted);margin:0 0 20px;max-width:48ch}
.mgn-edu-list{list-style:none;padding:0;margin:0;display:grid;gap:18px}
.mgn-edu-list li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:baseline}
.mgn-edu-list li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--spt-ink);transform:translateY(-3px)}
.mgn-edu-t{font-weight:600;font-size:14.5px;color:var(--spt-ink);line-height:1.4}
.mgn-edu-s{font-size:12.5px;color:var(--spt-muted);margin-top:3px}
.mgn-mk{position:relative;display:inline-block;white-space:normal}
.mgn-mark{position:absolute;overflow:visible;pointer-events:none;fill:none;stroke:var(--spt-accent);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.spt-root[data-motion="on"] .mgn-mark .mgn-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:spt-write 1.8s cubic-bezier(.5,0,.3,1) .2s both}
.mgn-edu-right{display:flex;flex-direction:column;gap:36px}
.mgn-qr-wrap{position:relative;display:flex;align-items:center;gap:24px}
.mgn-qr{position:relative;display:block;width:120px;padding:9px;background:#fff;color:#141416;border-radius:10px;box-shadow:0 18px 36px -16px rgba(0,0,0,.3);transform:rotate(-2deg);transition:transform .4s cubic-bezier(.2,.8,.2,1);text-decoration:none}
.mgn-qr:hover{transform:rotate(0deg) scale(1.06)}
.mgn-qr svg{display:block;width:100%;height:auto}
.mgn-qr-tag{position:absolute;left:8px;top:-20px;font-family:var(--spt-hand,cursive);font-size:16px;color:var(--spt-accent);font-weight:600}
.mgn-cvnote-box{position:relative;font-family:var(--spt-hand,cursive);font-size:22px;color:var(--spt-accent);display:flex;flex-direction:column;align-items:flex-start}
.mgn-cvnote-box svg{width:70px;height:45px;color:var(--spt-accent);margin-bottom:2px}
.mgn-langs-wrap h3{font-family:var(--spt-serif);font-weight:500;font-size:24px;margin:0 0 14px;color:var(--spt-ink)}
.mgn-lang-row{display:grid;grid-template-columns:5.5em 3.2em minmax(0,1fr);align-items:center;gap:12px;padding:9px 0;border-top:1px solid var(--spt-line);font-size:13px}
.mgn-lang-row b{font-weight:500;color:var(--spt-ink)}
.mgn-lang-row svg{width:100%;height:16px;overflow:visible}
.spt-root[data-motion="on"] .mgn-lang-row .mgn-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:spt-write 2s cubic-bezier(.5,0,.3,1) .3s both}

.spt-edus{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.spt-edu{display:grid;grid-template-columns:22px minmax(0,1fr);gap:0 14px;padding:14px;margin:0 -14px;border-radius:6px;transition:background .25s}
.spt-edu:hover{background:var(--spt-soft)}
.spt-more{margin-top:8px;font-size:12px;color:var(--spt-muted);display:inline-flex;gap:5px;align-items:center}
.spt-more:hover{color:var(--spt-ink)}
.spt-more svg{transition:transform .3s}
.spt-more[aria-expanded="true"] svg{transform:rotate(180deg)}
.spt-fold{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.8,.2,1)}
.spt-fold[data-open]{grid-template-rows:1fr}
.spt-fold>div{overflow:hidden}

/* skills */
.spt-tabs{position:relative;display:inline-flex;gap:2px;padding:3px;border-radius:6px;background:var(--spt-soft);margin:0 0 18px;max-width:100%;overflow-x:auto;scrollbar-width:none}
.spt-tabs button{position:relative;z-index:1;height:28px;padding:0 12px;font-size:12px;color:var(--spt-muted);border-radius:4px;transition:color .25s ease;white-space:nowrap}
.spt-tabs button[aria-selected="true"]{color:var(--spt-ink);font-weight:500}
.spt-tab-pill{position:absolute;top:3px;left:0;height:28px;border-radius:4px;background:var(--spt-paper);box-shadow:0 1px 3px rgba(0,0,0,.1),0 0 0 1px var(--spt-line);transition:transform .35s cubic-bezier(.25,1,.5,1),width .35s cubic-bezier(.25,1,.5,1);will-change:transform,width}
.spt-skills{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.spt-skill{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:9px 0;border-bottom:1px dashed var(--spt-line)}
.spt-skill-name{display:flex;align-items:center;gap:7px;min-width:0;font-size:13px}
.spt-skill-name small{margin-left:8px;font-size:11px;color:var(--spt-faint)}
.spt-skill-name .spt-skill-icon{width:14px;height:14px;flex:none;color:var(--skill-color,var(--spt-accent))}
.spt-skill-name .spt-skill-dot{width:5px;height:5px;border-radius:50%;background:var(--spt-accent);color:transparent}
.spt-root[data-theme="dark"] .spt-skill-name .spt-skill-icon[data-dark]{color:var(--spt-ink)}
.spt-skill-lvl{font-size:11px;color:var(--spt-muted);text-align:right}
.spt-meter{grid-column:1/-1;display:grid;grid-template-columns:repeat(20,1fr);gap:2px;height:6px}
.spt-meter i{border-radius:1px;background:var(--spt-soft2);transition:background .3s;transition-delay:calc(var(--i) * 22ms)}
.spt-meter i[data-on]{background:var(--spt-ink)}
.spt-skill:hover .spt-meter i[data-on]{background:var(--spt-accent)}

/* contact */
.spt-contact{padding-bottom:30px}
.spt-status{display:inline-flex;align-items:center;gap:8px;margin:0 0 14px;padding:4px 10px 4px 8px;border-radius:999px;background:var(--spt-soft);font-size:11.5px;color:var(--spt-muted)}
.spt-dot{position:relative;width:7px;height:7px;border-radius:50%;background:#22a860}
.spt-dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:#22a860;animation:spt-ping 2s cubic-bezier(0,0,.2,1) infinite}
.spt-mailrow{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 26px}
.spt-email{display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 14px;border-radius:3px;box-shadow:inset 0 0 0 1px var(--spt-line);font-size:13px;transition:box-shadow .2s}
.spt-email:hover{box-shadow:inset 0 0 0 1px var(--spt-faint)}
.spt-email .spt-copy{font-size:11px;color:var(--spt-muted)}
.spt-foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:18px;border-top:1px solid var(--spt-line);font-size:11.5px;color:var(--spt-faint)}

/* Marginalia Book Stack (Exploring) */
.mgn-books-wrap{position:relative;display:flex;flex-direction:column;align-items:center;margin:32px auto 8px;max-width:320px;padding:12px}
.mgn-books-note{position:relative;margin-bottom:12px;font-family:var(--spt-serif);font-style:italic;font-size:15px;color:var(--spt-accent);text-align:center;display:inline-flex;align-items:center;gap:6px}
.mgn-books-note svg{width:46px;height:24px;flex:none;color:var(--spt-accent);transform:rotate(-15deg)}
.spt-side-books{display:flex;flex-direction:column;gap:4px;padding:8px 0;background:transparent;border:none;position:relative}
.spt-side-books-head{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:0 2px}
.spt-side-books-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--spt-muted);line-height:1.2}
.spt-side-books-badge{font-size:10px;font-style:italic;color:var(--spt-accent);font-family:var(--spt-serif)}
.spt-side-books-stack{width:100%;max-width:240px;margin:2px auto 0}

/* Book hover interaction */
.mgn-book-item{cursor:pointer;transform-origin:center;transition:transform .35s cubic-bezier(.25,1.4,.5,1),filter .25s ease}
.mgn-book-item:hover{transform:translateX(10px) rotate(1.5deg) scale(1.02);filter:drop-shadow(0 6px 12px rgba(0,0,0,.22))}
.mgn-book-item:active{transform:translateX(6px) scale(.99)}
.spt-root[data-motion="on"] .spt-reveal{transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
.spt-root[data-motion="on"] .spt-reveal:not([data-in]){opacity:0;transform:translateY(16px)}

/* dialog + toast */
.spt-overlay{position:absolute;inset:0;z-index:20;display:grid;place-items:center;padding:16px;background:rgba(12,8,6,.38);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:spt-fade .25s ease both}
.spt-dialog{width:min(420px,100%);max-height:100%;overflow:auto;padding:22px;border-radius:8px;background:var(--spt-paper);box-shadow:0 24px 60px -20px rgba(0,0,0,.4),0 0 0 1px var(--spt-line);animation:spt-pop .35s cubic-bezier(.2,1.2,.4,1) both}
.spt-dialog-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px}
.spt-dialog h2{font-size:24px;margin:0}
.spt-x{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;color:var(--spt-muted)}
.spt-x:hover{background:var(--spt-soft2);color:var(--spt-ink)}
.spt-field{display:grid;gap:5px;margin-top:12px;font-size:12px;color:var(--spt-muted)}
.spt-field input,.spt-field textarea{font:inherit;font-size:13px;color:var(--spt-ink);background:var(--spt-soft);border:1px solid var(--spt-line);border-radius:4px;padding:9px 10px;outline:none;resize:vertical;transition:border-color .2s,background .2s}
.spt-field input:focus-visible,.spt-field textarea:focus-visible{outline:none}
.spt-field input:focus,.spt-field textarea:focus{border-color:var(--spt-accent);background:var(--spt-paper)}
.spt-dialog-actions{display:flex;gap:8px;margin-top:16px}
.spt-dialog-actions .spt-btn{flex:1}
.spt-toast{position:absolute;left:50%;bottom:18px;z-index:30;display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:var(--spt-ink);color:var(--spt-paper);font-size:12.5px;box-shadow:0 10px 30px -10px rgba(0,0,0,.4);transform:translateX(-50%);animation:spt-toast .35s cubic-bezier(.2,1.2,.4,1) both;pointer-events:none}

/* motion */
.spt-root[data-motion="on"] .spt-sig path{animation:spt-write 2.4s cubic-bezier(.5,0,.3,1) .3s both}
.spt-root[data-motion="on"] .spt-sig-img{animation:spt-write-reveal 2.2s cubic-bezier(.4,0,.2,1) .2s both}
@keyframes spt-write-reveal{from{clip-path:inset(0 100% 0 0);opacity:0.3}to{clip-path:inset(0 0 0 0);opacity:1}}
.spt-root[data-motion="on"] .spt-bob{animation:spt-bob 4.6s ease-in-out infinite}
.spt-root[data-motion="on"] .spt-blink{transform-box:fill-box;transform-origin:center;animation:spt-blink 5.2s infinite}
.spt-root[data-motion="on"] .spt-led{animation:spt-led 2.8s ease-in-out infinite}
.spt-root[data-motion="on"] .spt-quip{animation:spt-quip 1.7s cubic-bezier(.2,.8,.2,1) both}
.spt-root[data-motion="off"] .spt-quip{opacity:1;transform:translate(-50%,-70px)}
.spt-root[data-motion="on"] .spt-art-wrap:active .spt-dev{transform:translateY(1px)}
@keyframes spt-write{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes spt-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes spt-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes spt-led{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spt-quip{0%{opacity:0;transform:translate(-50%,6px) scale(.8)}18%{opacity:1;transform:translate(-50%,-30px) scale(1)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-78px) scale(.96)}}
@keyframes spt-ping{0%{transform:scale(1);opacity:.7}80%,100%{transform:scale(2.8);opacity:0}}
@keyframes spt-fade{from{opacity:0}}
@keyframes spt-pop{from{opacity:0;transform:translateY(12px) scale(.97)}}
@keyframes spt-toast{from{opacity:0;transform:translate(-50%,12px)}}

/* Projects grid styles (from quiet-portfolio-template) */
.qpt-work{margin:0;padding:0;list-style:none}
.qpt-row{display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;padding:9px 0;font-size:17px;color:var(--spt-ink)}
.qpt-row-name{display:flex;align-items:baseline;gap:10px;transition:transform .35s cubic-bezier(.3,1.4,.5,1)}
.qpt-row-year{font-size:13px;color:var(--spt-faint);opacity:0;transform:translateX(-4px);transition:opacity .25s,transform .35s;font-variant-numeric:tabular-nums}
.qpt-row-arrow{color:var(--spt-muted);transition:transform .4s cubic-bezier(.3,1.4,.5,1),color .2s}
.qpt-work li:hover .qpt-row-name,.qpt-row:focus-visible .qpt-row-name{transform:translateX(4px)}
.qpt-work li:hover .qpt-row-year,.qpt-row[aria-expanded="true"] .qpt-row-year{opacity:1;transform:none}
.qpt-work li:hover .qpt-row-arrow{color:var(--spt-ink);transform:translateX(3px)}
.qpt-row[aria-expanded="true"] .qpt-row-arrow{transform:rotate(90deg);color:var(--spt-ink)}
.qpt-work[data-hovering="true"] li:not(:hover) .qpt-row:not([aria-expanded="true"]){color:var(--spt-faint)}
.qpt-row{transition:color .25s}
.qpt-detail{display:flex;flex-direction:column;gap:14px;padding:8px 0 18px 4px}
.qpt-detail-media{display:flex;flex-direction:column;gap:8px}
.qpt-detail-art{width:100%;max-width:440px;aspect-ratio:16/10;border-radius:8px;overflow:hidden;flex:none;box-shadow:0 0 0 1px var(--spt-line);background:var(--spt-chip)}
.qpt-thumbs{display:flex;flex-wrap:wrap;gap:6px;max-width:440px}
.qpt-thumb-btn{width:48px;height:32px;border-radius:4px;overflow:hidden;border:1px solid var(--spt-line);padding:0;background:none;cursor:pointer;opacity:0.65;transition:all .2s ease}
.qpt-thumb-btn:hover{opacity:1;border-color:var(--spt-muted)}
.qpt-thumb-btn[data-active="true"]{opacity:1;border-color:var(--spt-accent);box-shadow:0 0 0 1px var(--spt-accent)}
.qpt-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
.qpt-link{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;padding:4px 10px;border-radius:6px;background:var(--spt-chip);color:var(--spt-ink);text-decoration:none;border:1px solid var(--spt-line);transition:all .2s}
.qpt-link:hover{background:var(--spt-paper);border-color:var(--spt-muted);color:var(--spt-accent)}
.qpt-detail p{margin:0 0 10px;font-size:14px;line-height:1.6;color:var(--spt-muted)}
.qpt-tags{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.qpt-tag{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--spt-chip);color:var(--spt-muted)}
.qpt-visit{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:500;color:var(--spt-ink);margin-left:4px}
.qpt-visit:hover{color:var(--spt-accent)}

.qpt-fold{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}
.qpt-fold[data-open="true"]{grid-template-rows:1fr}
.qpt-fold>div{overflow:hidden;min-height:0}

.qpt-preview{position:fixed;left:0;top:0;z-index:40;width:216px;pointer-events:none;border-radius:10px;overflow:hidden;background:var(--spt-bg);box-shadow:0 0 0 1px var(--spt-line),0 18px 40px -16px rgba(0,0,0,.35);opacity:0;transition:opacity .2s ease;will-change:transform}
.qpt-preview[data-show="true"]{opacity:1}
.qpt-preview-art{width:216px;height:135px}
.qpt-preview-cap{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;font-size:12px;color:var(--spt-muted)}
.qpt-preview-cap b{color:var(--spt-ink);font-weight:500}

@media (prefers-reduced-motion:reduce){.spt-root *,.spt-root *::before,.spt-root *::after{animation:none!important;transition:none!important}}

/* wide: the sidebar sticks beside the reading column */
@container spt (min-width:560px){
.spt-side{padding:28px 32px}
.spt-nav{padding:0 32px}
.spt-col{padding:0 32px}
.spt-contact-btn .spt-cm-label{display:inline}
.spt-h1{font-size:44px}
.spt-links{gap:4px}
}
@container spt (min-width:880px){
.spt-grid{grid-template-columns:minmax(260px,300px) minmax(0,1fr)}
.spt-side{position:sticky;top:0;align-self:start;height:var(--spt-h);overflow-y:auto;scrollbar-width:none;border-bottom:0;border-right:1px solid var(--spt-line);padding:26px 26px 26px 28px}
.spt-side::-webkit-scrollbar{display:none}
.spt-side-top{grid-template-columns:1fr;gap:0}
.spt-avatar{grid-row:auto;margin-bottom:18px}
.spt-side-foot{margin-top:auto}
.spt-nav{padding:0 44px;height:62px}
.spt-col{padding:0 44px}
.spt-links{justify-content:center}
.spt-hero{padding-top:44px}
}
`

/* ---------- component ---------- */

type Toast = { id: number; text: string }
type Quip = { id: number; text: string }
type Key = "about" | "experience" | "education" | "certificates" | "skills" | "contact"

export default function SidebarPortfolioTemplate({
  name = "Oliver Rowland",
  role = "Full Stack Developer",
  bio = "Focused on high-performance web development, clean interfaces, and reliable backend systems.",
  avatarSrc,
  avatar,
  signature = true,
  signatureSrc,
  details = DEFAULT_DETAILS,
  socials = DEFAULT_SOCIALS,
  email = "hello@oliverrowland.dev",
  cvUrl,
  headline = "Full Stack Developer",
  tagline = "Building scalable web applications with clean architecture, modern tools, and thoughtful user experience.",
  heroQuips = DEFAULT_QUIPS,
  about = DEFAULT_ABOUT,
  keySkills = DEFAULT_KEY_SKILLS,
  experience = DEFAULT_EXPERIENCE,
  education = DEFAULT_EDUCATION,
  educationIntro = "Final year of my bachelor's. My classes are done, so I can work full-time between my last two exams.",
  cvNote = "my curriculum vitae",
  languages = [
    { name: "Italian", level: "native", value: 1 },
    { name: "French", level: "B2", value: 0.72 },
    { name: "English", level: "C1", value: 0.88 },
  ],
  books = [],
  booksNote = "what I am currently exploring",
  certificates = [],
  githubActivity = null,
  stats = [],
  skills = DEFAULT_SKILLS,
  contactTitle = "Let's build something good",
  contactText = "Have a product in mind, a team that needs another pair of hands, or just want to talk shop? My inbox is open, and I usually reply within a day.",
  available = true,
  timeZone = "America/Chicago",
  city = "Houston",
  labels: labelsIn,
  accent = "#e5553b",
  paper = "#f7f2e7",
  ink = "#1f1512",
  darkPaper = "#15110e",
  darkInk = "#f1ebe3",
  theme = "light",
  themeToggle = true,
  height = "100svh",
  className = "",
  projectImages
}: SidebarPortfolioTemplateProps) {
  const L = { ...DEFAULT_LABELS, ...labelsIn }
  const uid = React.useId().replace(/:/g, "")
  const rootRef = React.useRef(null as HTMLDivElement | null)
  const scrollRef = React.useRef(null as HTMLDivElement | null)
  const linksRef = React.useRef(null as HTMLUListElement | null)
  const tabsRef = React.useRef(null as HTMLDivElement | null)
  const artRef = React.useRef(null as HTMLDivElement | null)
  const dotRefs = React.useRef<(SVGCircleElement | null)[]>([])
  const openerRef = React.useRef(null as HTMLElement | null)
  const firstFieldRef = React.useRef(null as HTMLInputElement | null)
  const boost = React.useRef(0)
  const seq = React.useRef(0)
  const timers = React.useRef([] as number[])

  const [mode, setMode] = React.useState<SptTheme>(theme)
  const [reduced, setReduced] = React.useState(null as boolean | null)
  const [now, setNow] = React.useState(null as Date | null)
  const [active, setActive] = React.useState(null as Key | null)
  const [stuck, setStuck] = React.useState(false)
  const [pill, setPill] = React.useState(null as { x: number; w: number } | null)
  const [focusSkill, setFocusSkill] = React.useState(null as string | null)
  const [tab, setTab] = React.useState(0)
  const [tabPill, setTabPill] = React.useState(null as { x: number; w: number } | null)
  const [openEdu, setOpenEdu] = React.useState(null as number | null)
  const [dialog, setDialog] = React.useState(false)
  const [draft, setDraft] = React.useState({ from: "", message: "" })
  const [toast, setToast] = React.useState(null as Toast | null)
  const [quips, setQuips] = React.useState([] as Quip[])
  const [sigRun, setSigRun] = React.useState(0)
  const [seen, setSeen] = React.useState({} as { [k: string]: boolean })
  const [lit, setLit] = React.useState(false)

  // Projects state
  const [hover, setHover] = React.useState(null as number | null)
  const previewRef = React.useRef(null as HTMLDivElement | null)
  const target = React.useRef({ x: 0, y: 0 })
  const pos = React.useRef({ x: 0, y: 0 })
  const raf = React.useRef(0)
  const [fine, setFine] = React.useState(false)
  const [openProject, setOpenProject] = React.useState(null as number | null)
  const [activeImageIdx, setActiveImageIdx] = React.useState<Record<number, number>>({})

  React.useEffect(() => {
    if (typeof matchMedia !== "function") return
    const mq = matchMedia("(hover: hover) and (pointer: fine)")
    const set = () => setFine(mq.matches)
    set()
    mq.addEventListener?.("change", set)
    return () => mq.removeEventListener?.("change", set)
  }, [])

  const tick = React.useCallback(() => {
    const el = previewRef.current
    const p = pos.current
    const t = target.current
    const dx = t.x - p.x
    p.x += dx * 0.18
    p.y += (t.y - p.y) * 0.18
    if (el) el.style.transform = "translate(" + (p.x + 22).toFixed(1) + "px," + (p.y - 70).toFixed(1) + "px) rotate(" + Math.max(-8, Math.min(8, dx * 0.08)).toFixed(2) + "deg)"
    raf.current = Math.abs(dx) + Math.abs(t.y - p.y) > 0.3 ? requestAnimationFrame(tick) : 0
  }, [])

  const onMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY }
    if (hover === null) pos.current = { ...target.current }
    if (!raf.current) raf.current = requestAnimationFrame(tick)
  }

  React.useEffect(() => () => cancelAnimationFrame(raf.current), [])
  React.useLayoutEffect(() => {
    if (hover !== null && !raf.current) raf.current = requestAnimationFrame(tick)
  }, [hover, tick])

  const shown = hover !== null && hover !== openProject && fine ? experience[hover] : null
  const last = React.useRef(null as SptCompany | null)
  if (shown) last.current = shown
  const card = shown ?? last.current

  React.useEffect(() => setMode(theme), [theme])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const aboutParas = (Array.isArray(about) ? about : [about]).filter(Boolean)
  const sig = React.useMemo(() => signatureOf(name), [name])
  const sections = (
    [
      ["about", L.about, aboutParas.length > 0 || keySkills.length > 0],
      ["skills", L.skills, skills.length > 0],
      ["experience", L.experience, experience.length > 0],
      ["education", L.education, education.length > 0],
      ["certificates", L.certificates, certificates.length > 0],
    ] as [Key, string, boolean][]
  ).filter((s) => s[2])
  const sid = (k: Key) => uid + "-" + k
  const group = skills[Math.min(tab, skills.length)] as SptSkillGroup | undefined
  const shownSkills = tab >= skills.length ? skills.flatMap((g) => g.items) : group?.items ?? []

  /* reduced motion, clock, cleanup */
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    setNow(new Date())
    const tick = window.setInterval(() => setNow(new Date()), 30000)
    return () => {
      mq.removeEventListener("change", sync)
      clearInterval(tick)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  /* scroll spy: the last section whose top has passed under the nav */
  const spy = React.useCallback(() => {
    const sc = scrollRef.current
    if (!sc) return
    setStuck(sc.scrollTop > 8)
    const top = sc.getBoundingClientRect().top
    let cur: Key | null = null
    for (const [k] of sections) {
      const el = document.getElementById(sid(k))
      if (el && el.getBoundingClientRect().top - top <= 140) cur = k
    }
    if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4 && sections.length) cur = sections[sections.length - 1][0]
    setActive(cur)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.map((s) => s[0]).join(), uid])

  React.useEffect(() => {
    const sc = scrollRef.current
    if (!sc) return
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(spy)
    }
    spy()
    sc.addEventListener("scroll", on, { passive: true })
    window.addEventListener("resize", on)
    return () => {
      cancelAnimationFrame(raf)
      sc.removeEventListener("scroll", on)
      window.removeEventListener("resize", on)
    }
  }, [spy])

  /* the pill under the active nav link, and the one under the skills tab */
  useIsoLayoutEffect(() => {
    const measureNav = () => {
      const a = linksRef.current?.querySelector<HTMLElement>('a[aria-current="true"]')
      setPill(a ? { x: a.offsetLeft, w: a.offsetWidth } : null)
    }
    const measureTab = () => {
      const t = tabsRef.current?.querySelector<HTMLElement>('button[aria-selected="true"]')
      setTabPill(t ? { x: t.offsetLeft, w: t.offsetWidth } : null)
    }
    measureNav()
    measureTab()
    const el = rootRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => {
      measureNav()
      measureTab()
    })
    ro.observe(el)
    if (tabsRef.current) ro.observe(tabsRef.current)
    return () => ro.disconnect()
  }, [active, tab, skills])

  /* sections fade up as they scroll in */
  React.useEffect(() => {
    const sc = scrollRef.current
    if (!sc || typeof IntersectionObserver === "undefined") {
      setSeen({ about: true, skills: true, experience: true, education: true, certificates: true, contact: true })
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.reveal as string)
        if (hit.length) setSeen((s) => ({ ...s, ...Object.fromEntries(hit.map((h) => [h, true])) }))
      },
      { root: sc, threshold: 0.05, rootMargin: "0px 0px -4% 0px" },
    )
    sc.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections.length])

  /* the skill meters fill once they are seen, and re-animate smoothly on every tab change */
  React.useEffect(() => {
    setLit(false)
    const t = setTimeout(() => {
      setLit(true)
    }, 40)
    return () => clearTimeout(t)
  }, [tab])

  /* orbiting dots */
  React.useEffect(() => {
    if (reduced !== false) return
    let raf = 0
    let last = performance.now()
    const t = ORBITS.map((_, i) => i * 2.4 + 0.6)
    const loop = (ts: number) => {
      const dt = Math.min(64, ts - last) / 1000
      last = ts
      boost.current *= 0.96
      ORBITS.forEach((o, i) => {
        t[i] += dt * (i ? -0.5 : 0.36) * (1 + boost.current)
        const [x, y] = orbitPoint(o, t[i])
        const dot = dotRefs.current[i]
        if (dot) {
          dot.setAttribute("cx", x.toFixed(2))
          dot.setAttribute("cy", y.toFixed(2))
          // behind the developer on the far side of the orbit
          dot.style.opacity = Math.sin(t[i]) < -0.2 && Math.abs(x - CX) < 30 ? "0" : "1"
        }
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  /* dialog: focus in, Escape out, focus back */
  React.useEffect(() => {
    if (!dialog) return
    firstFieldRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog])

  const say = (text: string) => {
    const id = ++seq.current
    setToast({ id, text })
    later(() => setToast((t) => (t && t.id === id ? null : t)), 2400)
  }

  const go = (k: Key) => {
    const sc = scrollRef.current
    const el = document.getElementById(sid(k))
    if (!sc || !el) return
    const y = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 56
    sc.scrollTo({ top: Math.max(0, y), behavior: reduced ? "auto" : "smooth" })
  }

  const copyEmail = () => {
    const done = () => say("Copied " + email)
    const fail = () => say(email)
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(email).then(done, fail)
      else fail()
    } catch {
      fail()
    }
  }

  const downloadCv = () => {
    if (cvUrl) return
    const text = buildCv({
      name,
      role,
      bio,
      email,
      details: details.map((d) => d.label),
      about: aboutParas,
      experience,
      education,
      skills,
    })
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }))
    const a = document.createElement("a")
    a.href = url
    a.download = (name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cv") + "-cv.txt"
    document.body.appendChild(a)
    a.click()
    a.remove()
    later(() => URL.revokeObjectURL(url), 1000)
    say("CV downloaded")
  }

  const flipTheme = () => {
    const order: Array<"light" | "white" | "dark"> = ["light", "white", "dark"]
    const current =
      mode === "auto"
        ? rootRef.current?.parentElement?.closest(".dark") ? "dark" : "light"
        : mode === "white" ? "white" : mode === "dark" ? "dark" : "light"
    setMode(order[(order.indexOf(current) + 1) % order.length])
  }

  const openDialog = (e: React.MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget
    setDialog(true)
  }
  function closeDialog() {
    setDialog(false)
    openerRef.current?.focus()
  }

  const pickSkill = (s: string, jump: boolean) => {
    const next = focusSkill && norm(focusSkill) === norm(s) ? null : s
    setFocusSkill(next)
    if (next && jump) later(() => go("experience"), 60)
  }
  const roleHas = (r: SptRole, s: string) => (r.skills ?? []).some((x) => norm(x) === norm(s))
  const skillCount = (s: string) => experience.reduce((n, co) => n + co.roles.filter((r) => roleHas(r, s)).length, 0)

  const poke = () => {
    boost.current = 5
    if (!heroQuips.length) return
    const id = ++seq.current
    setQuips((q) => [...q.slice(-2), { id, text: heroQuips[id % heroQuips.length] }])
    later(() => setQuips((q) => q.filter((x) => x.id !== id)), 1800)
  }

  const onArtMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = artRef.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--spt-px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty("--spt-py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  const onArtLeave = () => {
    artRef.current?.style.setProperty("--spt-px", "0")
    artRef.current?.style.setProperty("--spt-py", "0")
  }

  let clock = ""
  if (now) {
    try {
      clock = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone }).format(now)
    } catch {
      clock = ""
    }
  }

  const mailto =
    "mailto:" + email +
    "?subject=" + encodeURIComponent("Hello from " + (draft.from.trim() || "your portfolio")) +
    "&body=" + encodeURIComponent(draft.message)
  const reveal = (key: string) => ({ "data-reveal": key, "data-in": seen[key] ? "" : undefined, className: "spt-reveal" })
  const firstLogos = experience.slice(0, 3)

  return (
    <div
      ref={rootRef}
      className={"spt-root " + className}
      data-theme={mode}
      data-motion={reduced === false ? "on" : "off"}
      style={
        {
          height,
          "--spt-h": height,
          "--spt-accent": accent,
          "--spt-paper-l": paper,
          "--spt-ink-l": ink,
          "--spt-paper-d": darkPaper,
          "--spt-ink-d": darkInk,
          "--spt-serif": '"Iowan Old Style","Palatino Linotype","URW Palladio L",P052,Palatino,"Book Antiqua",Georgia,serif',
          "--spt-sans": 'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
        } as React.CSSProperties
      }
    >
      <style>{SPT_CSS}</style>

      <div className="spt-scroll" ref={scrollRef} aria-hidden={dialog || undefined}>
        <div className="spt-grid">
          {/* ---------- sidebar ---------- */}
          <aside className="spt-side" aria-label="Profile">
            <div className="spt-side-top">
              <div className="spt-avatar">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={name} width={76} height={76} style={{ maxWidth: "none" }} />
                ) : (
                  <Portrait
                    uid={uid}
                    skin={avatar?.skin ?? "#c68e6e"}
                    hair={avatar?.hair ?? "#231812"}
                    shirt={avatar?.shirt ?? "#ebe6dc"}
                    backdrop={avatar?.backdrop ?? "#cfc0a6"}
                  />
                )}
              </div>
              <div>
                <h2 className="spt-name spt-serif">{name}</h2>
                <p className="spt-role">{role}</p>
              </div>
            </div>
            {bio && <p className="spt-bio">{bio}</p>}
            {socials.length > 0 && (
              <div className="spt-intro-socials" aria-label="Social links">
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                    <BrandSocialIcon icon={s.icon} />
                  </a>
                ))}
              </div>
            )}
            {signature && (
              signatureSrc ? (
                <button
                  type="button"
                  className="spt-sig-img-wrap"
                  onClick={() => setSigRun((n) => n + 1)}
                  aria-label={"Signature of " + name + ". Click to animate again."}
                  title="Sign again"
                >
                  <img
                    key={sigRun}
                    src={signatureSrc}
                    alt={"Signature of " + name}
                    className="spt-sig-img"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="spt-sig"
                  onClick={() => setSigRun((n) => n + 1)}
                  aria-label={"Signature of " + name + ". Click to sign again."}
                  title="Sign again"
                >
                  <svg key={sigRun} viewBox={"0 0 " + sig.width + " 52"} width={sig.width * 1.25} height={65} aria-hidden="true">
                    <path d={sig.d} pathLength={1} fill="none" stroke="currentColor" strokeWidth={1.35} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )
            )}
            <hr className="spt-rule" />
            {details.length > 0 && (
              <ul className="spt-details">
                {details.map((d, i) => (
                  <li key={i}>
                    <DetailIcon icon={d.icon} />
                    {d.label}
                  </li>
                ))}
              </ul>
            )}

            {/* Marginalia Book Stack (Exploring) in Sidebar */}
            {books && books.length > 0 ? (
              <div className="spt-side-books">
                <div className="spt-side-books-head">
                  <span className="spt-side-books-title">Currently Exploring</span>
                  <span className="spt-side-books-badge">topics & craft</span>
                </div>
                <div className="spt-side-books-stack">
                  <BookStack books={books} />
                </div>
              </div>
            ) : (
              stats && stats.length > 0 && (
                <div className="spt-side-stats">
                  {stats.map((st, i) => (
                    <div key={i} className="spt-stat-item">
                      <span className="spt-stat-val">{st.value}</span>
                      <span className="spt-stat-lbl">{st.label}</span>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* GitHub contribution calendar */}
            {githubActivity && <GithubHeatmap activity={githubActivity} />}

            <div className="spt-side-foot">
              <div className="spt-actions">
                {cvUrl ? (
                  <a className="spt-btn spt-btn-dark" href={cvUrl} download target="_blank" rel="noreferrer">
                    <DownloadIcon />
                    {L.downloadCv}
                  </a>
                ) : (
                  <button type="button" className="spt-btn spt-btn-dark" onClick={downloadCv}>
                    <DownloadIcon />
                    {L.downloadCv}
                  </button>
                )}
                <button type="button" className="spt-btn spt-btn-soft" onClick={copyEmail} aria-label={"Copy " + email} title={"Copy " + email}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                    <SocialIcon icon="mail" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center pt-2">
                <a
                  href="/dashboard"
                  className="text-[11px] text-[var(--spt-faint)] hover:text-[var(--spt-ink)] transition-colors inline-flex items-center gap-1 opacity-60 hover:opacity-100"
                  title="Open Content Dashboard"
                >
                  <span>Dashboard ↗</span>
                </a>
              </div>
            </div>
          </aside>

          {/* ---------- reading column ---------- */}
          <div className="spt-main">
            <nav className="spt-nav" data-stuck={stuck ? "" : undefined} aria-label="Sections">
              <button
                type="button"
                className="spt-mark"
                aria-label="Back to top"
                onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="9.6" r="3.4" />
                  <path d="M5.6 18.8c1.4-2.8 3.8-4.2 6.4-4.2s5 1.4 6.4 4.2" strokeLinecap="round" />
                </svg>
              </button>
              <ul className="spt-links" ref={linksRef}>
                <li className="spt-pill" aria-hidden="true" style={{ width: pill?.w ?? 0, transform: "translateX(" + (pill?.x ?? 0) + "px)", opacity: pill ? 1 : 0 }} />
                {sections.map(([k, label]) => (
                  <li key={k}>
                    <a
                      href={"#" + sid(k)}
                      aria-current={active === k ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault()
                        go(k)
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="spt-nav-end">
                {themeToggle && (
                  <button type="button" className="spt-theme" onClick={flipTheme} aria-label="Cycle theme" title="Cycle theme: cream, white, dark">
                    <svg className="spt-moon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
                      <path d="M13.4 9.8A5.6 5.6 0 0 1 6.2 2.6a5.6 5.6 0 1 0 7.2 7.2Z" />
                    </svg>
                    <svg className="spt-white" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
                      <rect x="2.2" y="2.2" width="11.6" height="11.6" rx="2.6" />
                      <path d="M2.4 10.6h11.2" opacity=".45" />
                    </svg>
                    <svg className="spt-sun" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
                      <circle cx="8" cy="8" r="3" />
                      <path d="M8 1.4v1.4M8 13.2v1.4M1.4 8h1.4M13.2 8h1.4M3.3 3.3l1 1M11.7 11.7l1 1M3.3 12.7l1-1M11.7 4.3l1-1" />
                    </svg>
                  </button>
                )}
                <button type="button" className="spt-btn spt-btn-dark spt-contact-btn" onClick={openDialog} aria-label={L.contactMe}>
                  <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
                    <path d="M7 1.6c3 0 5.4 2 5.4 4.6S10 10.8 7 10.8c-.6 0-1.2-.1-1.8-.2L2.4 12l.7-2.4C2.1 8.7 1.6 7.5 1.6 6.2 1.6 3.6 4 1.6 7 1.6Z" />
                  </svg>
                  <span className="spt-cm-label">{L.contactMe}</span>
                </button>
              </div>
            </nav>

            <div className="spt-col">
              {/* hero */}
              <header className="spt-hero">
                <div
                  ref={artRef}
                  className="spt-art-wrap"
                  role="button"
                  tabIndex={0}
                  aria-label="Say hi to the illustration"
                  onClick={poke}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      poke()
                    }
                  }}
                  onPointerMove={onArtMove}
                  onPointerLeave={onArtLeave}
                >
                  <HeroArt dotRefs={dotRefs} />
                  {quips.map((q) => (
                    <span key={q.id} className="spt-quip" aria-hidden="true">
                      {q.text}
                    </span>
                  ))}
                </div>
                <h1 className="spt-h1 spt-serif">{headline}</h1>
                {tagline && <p className="spt-tagline">{tagline}</p>}
                {experience.length > 0 && (
                  <button type="button" className="spt-cta" onClick={() => go("experience")}>
                    <span className="spt-stack">
                      {firstLogos.map((co, i) => (
                        <LogoTile key={i} logo={co.logo} name={co.company} size={20} round />
                      ))}
                    </span>
                    {L.viewExperience}
                    <svg className="spt-cta-arrow" viewBox="0 0 14 14" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
                    </svg>
                  </button>
                )}
              </header>

              {/* about */}
              {sections.some((s) => s[0] === "about") && (
                <section id={sid("about")} aria-labelledby={sid("about") + "-h"} className="spt-sec">
                  <div {...reveal("about")}>
                    <h2 id={sid("about") + "-h"} className="spt-h2 spt-serif">
                      {L.about}
                    </h2>
                    {aboutParas.map((p, i) => (
                      <p key={i} className="spt-p">
                        {p}
                      </p>
                    ))}
                    {keySkills.length > 0 && (
                      <>
                        <p className="spt-label">{L.keySkills}</p>
                        <ul className="spt-chips">
                          {keySkills.map((s) => {
                            const n = skillCount(s)
                            const on = !!focusSkill && norm(focusSkill) === norm(s)
                            return (
                              <li key={s}>
                                <button
                                  type="button"
                                  className="spt-chip"
                                  aria-pressed={on}
                                  onClick={() => pickSkill(s, n > 0)}
                                  title={n ? "Show the " + n + (n === 1 ? " role" : " roles") + " that used this" : undefined}
                                >
                                  <SkillIcon name={s} />
                                  <span>{s}</span>
                                  {on && n > 0 && <i>{n}</i>}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* skills */}
              {skills.length > 0 && (
                <section id={sid("skills")} aria-labelledby={sid("skills") + "-h"} className="spt-sec">
                  <div {...reveal("skills")}>
                    <h2 id={sid("skills") + "-h"} className="spt-h2 spt-serif">
                      {L.skills}
                    </h2>
                    {skills.length > 1 && (
                      <div className="spt-tabs" role="tablist" aria-label={L.skills} ref={tabsRef}>
                        <span className="spt-tab-pill" aria-hidden="true" style={{ width: tabPill?.w ?? 0, transform: "translateX(" + (tabPill?.x ?? 0) + "px)", opacity: tabPill ? 1 : 0 }} />
                        {[...skills.map((g) => g.name), L.all].map((label, i) => (
                          <button
                            key={label + i}
                            type="button"
                            role="tab"
                            aria-selected={tab === i}
                            aria-controls={uid + "-skills-panel"}
                            onClick={() => setTab(i)}
                            onKeyDown={(e) => {
                              const n = skills.length + 1
                              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
                              if (!d) return
                              e.preventDefault()
                              const next = (i + d + n) % n
                              setTab(next)
                              ;(e.currentTarget.parentElement?.querySelectorAll("button")[next] as HTMLButtonElement | undefined)?.focus()
                            }}
                            tabIndex={tab === i ? 0 : -1}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                    <ul className="spt-skills" id={uid + "-skills-panel"} role={skills.length > 1 ? "tabpanel" : undefined}>
                      {shownSkills.map((s, i) => {
                        const cells = Math.round((Math.max(0, Math.min(100, s.level)) / 100) * 20)
                        return (
                          <li key={tab + "-" + s.name + i} className="spt-skill">
                            <span className="spt-skill-name">
                              <SkillIcon name={s.name} />
                              <span>{s.name}</span>
                              {s.years ? <small>{s.years + (s.years === 1 ? " yr" : " yrs")}</small> : null}
                            </span>
                            <span className="spt-skill-lvl">{levelName(s.level)}</span>
                            <span className="spt-meter" role="img" aria-label={s.level + " out of 100"}>
                              {Array.from({ length: 20 }, (_, c) => (
                                <SkillCell key={c} i={c} on={c < cells} lit={lit} />
                              ))}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </section>
              )}

              {/* experience */}
              {experience.length > 0 && (
                <section id={sid("experience")} aria-labelledby={sid("experience") + "-h"} className="spt-sec">
                  <div {...reveal("experience")}>
                    <h2 id={sid("experience") + "-h"} className="spt-h2 spt-serif">
                      {L.experience}
                    </h2>

                    {/* Projects Grid */}
                    <ul className="qpt-work" data-hovering={hover !== null} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
                      {experience.map((co, ci) => (
                        <li key={ci} data-qpt-project={ci} onPointerEnter={() => setHover(ci)}>
                          <button
                            type="button"
                            className="qpt-row"
                            aria-expanded={openProject === ci}
                            aria-controls={uid + "-p" + ci}
                            onClick={() => setOpenProject(openProject === ci ? null : ci)}
                          >
                            <span className="qpt-row-name">
                              {co.company}
                              {co.roles[0]?.start ? <span className="qpt-row-year">{co.roles[0].start}</span> : null}
                            </span>
                            <span className="qpt-row-arrow">
                              <ArrowIcon />
                            </span>
                          </button>
                          <div className="qpt-fold" data-open={openProject === ci} id={uid + "-p" + ci}>
                            <div>
                              <div className="qpt-detail" aria-hidden={openProject !== ci}>
                                {(() => {
                                  const allImgs = co.roles[0]?.images || projectImages?.[co.company] || []
                                  const currentIdx = activeImageIdx[ci] || 0
                                  const displayImg = allImgs[currentIdx] || allImgs[0]

                                  return (
                                    <>
                                      <div className="qpt-detail-media">
                                        <div className="qpt-detail-art">
                                          {displayImg ? (
                                            <img
                                              src={displayImg}
                                              alt={co.company}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <ProjectArt name={co.company} hue={ci * 45} id={uid + "d" + ci} />
                                          )}
                                        </div>
                                        {allImgs.length > 1 && (
                                          <div className="qpt-thumbs" aria-label="Project images gallery">
                                            {allImgs.map((imgSrc, imgI) => (
                                              <button
                                                key={imgI}
                                                type="button"
                                                className="qpt-thumb-btn"
                                                data-active={currentIdx === imgI}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setActiveImageIdx((prev) => ({ ...prev, [ci]: imgI }))
                                                }}
                                              >
                                                <img src={imgSrc} alt={`${co.company} ${imgI + 1}`} className="w-full h-full object-cover" />
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        {co.roles[0]?.summary ? <p>{co.roles[0].summary}</p> : null}
                                        <div className="qpt-tags">
                                          {co.roles[0]?.skills?.map((t) => (
                                            <span className="qpt-tag" key={t}>
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                        {(co.roles[0]?.liveLink || co.roles[0]?.repoLink) && (
                                          <div className="qpt-links">
                                            {co.roles[0].liveLink && (
                                              <a
                                                href={co.roles[0].liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="qpt-link"
                                              >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                  <polyline points="15 3 21 3 21 9" />
                                                  <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                                Live Demo
                                              </a>
                                            )}
                                            {co.roles[0].repoLink && (
                                              <a
                                                href={co.roles[0].repoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="qpt-link"
                                              >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                                </svg>
                                                Source Code
                                              </a>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )
                                })()}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {fine && card ? (
                      <div ref={previewRef} className="qpt-preview" data-show={!!shown} aria-hidden="true">
                        <div className="qpt-preview-art">
                          {projectImages?.[card.company]?.[0] ? <img src={projectImages[card.company][0]} alt={card.company} className="w-full h-full object-cover" /> : <ProjectArt name={card.company} hue={hover !== null ? hover * 45 : 0} id={uid + "pv"} />}
                        </div>
                        <div className="qpt-preview-cap">
                          <b>{card.company}</b>
                          <span>{card.roles[0]?.start}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>
              )}

              {/* education */}
              {education.length > 0 && (
                <section id={sid("education")} aria-labelledby={sid("education") + "-h"} className="spt-sec">
                  <div {...reveal("education")}>
                    <h2 id={sid("education") + "-h"} className="spt-h2 spt-serif">
                      {L.education}
                    </h2>
                    <div className="mgn-edu">
                      <div>
                        {educationIntro && <p className="mgn-edu-intro">{educationIntro}</p>}
                        <ul className="mgn-edu-list">
                          {education.map((e, i) => (
                            <li key={i}>
                              <div>
                                <div className="mgn-edu-t">
                                  {e.circled ? (
                                    <span className="mgn-mk">
                                      {e.degree}
                                      <PenOvalMark seed={30 + i} padX={12} padY={7} />
                                    </span>
                                  ) : (
                                    e.degree
                                  )}
                                </div>
                                <div className="mgn-edu-s">{[e.school, e.start && e.end ? `${e.start} — ${e.end}` : e.start || e.end].filter(Boolean).join(" · ")}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mgn-edu-right">
                        {cvUrl && (
                          <div className="mgn-qr-wrap">
                            <a className="mgn-qr" href={cvUrl} target="_blank" rel="noreferrer" aria-label={"Open my CV: " + cvUrl}>
                              <span className="mgn-qr-tag">scan me</span>
                              <QRCode text={cvUrl} />
                            </a>
                            <div className="mgn-cvnote-box">
                              <svg viewBox="0 0 90 60" aria-hidden="true">
                                <MgnArrow a={[84, 50]} b={[10, 16]} bend={-0.3} head={9} />
                              </svg>
                              <span>{cvNote}</span>
                            </div>
                          </div>
                        )}
                        {languages.length > 0 && (
                          <div className="mgn-langs-wrap">
                            <h3>Languages</h3>
                            {languages.map((l, i) => (
                              <div className="mgn-lang-row" key={i}>
                                <b>{l.name}</b>
                                <span className="spt-muted" style={{ color: "var(--spt-muted)" }}>{l.level}</span>
                                <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-label={l.name + ": " + Math.round(clamp(l.value, 0, 1) * 100) + "%"} role="img">
                                  <path d="M2 9H198" style={{ stroke: "var(--spt-line)", strokeWidth: 1.2, fill: "none" }} />
                                  <path className="mgn-draw" pathLength={1} d={handLine(2, 2 + 196 * clamp(l.value, 0.02, 1), 8.5, 40 + i)} style={{ stroke: "var(--spt-accent)", strokeWidth: 2.2, fill: "none", strokeLinecap: "round" }} />
                                </svg>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* certifications */}
              {certificates.length > 0 && (
                <section id={sid("certificates")} aria-labelledby={sid("certificates") + "-h"} className="spt-sec">
                  <div {...reveal("certificates")}>
                    <h2 id={sid("certificates") + "-h"} className="spt-h2 spt-serif">
                      {L.certificates}
                    </h2>
                    <div className="spt-side-certs spt-main-certs">
                      <div className="spt-cert-list">
                        {certificates.map((c, i) => (
                          <div key={c.id || i} className="spt-cert-item">
                            <div className="spt-cert-main">
                              <div className="spt-cert-title-row">
                                <span className="spt-cert-badge-dot" />
                                <h4 className="spt-cert-title">{c.title}</h4>
                              </div>
                              {(c.issuer || c.date) && (
                                <div className="spt-cert-meta">
                                  {[c.issuer, c.date].filter(Boolean).join(" · ")}
                                </div>
                              )}
                            </div>
                            {c.credentialUrl && (
                              <a
                                href={c.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="spt-cert-link"
                                title="View credential"
                                aria-label={`View ${c.title} credential`}
                              >
                                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={1.6}>
                                  <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </a>
                            )}
                            {c.image && (
                              <div className="spt-cert-preview">
                                <img src={c.image} alt={`${c.title} preview`} className="spt-cert-img" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* contact */}
              <section id={sid("contact")} aria-labelledby={sid("contact") + "-h"} className="spt-sec spt-contact">
                <div {...reveal("contact")}>
                  {available && (
                    <p className="spt-status">
                      <span className="spt-dot" aria-hidden="true" />
                      Available for new projects
                    </p>
                  )}
                  <h2 id={sid("contact") + "-h"} className="spt-h2 spt-serif">
                    {contactTitle}
                  </h2>
                  {contactText && <p className="spt-p">{contactText}</p>}
                  <div className="spt-mailrow">
                    <button type="button" className="spt-email" onClick={copyEmail}>
                      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                        <SocialIcon icon="mail" />
                      </svg>
                      {email}
                      <span className="spt-copy">Copy</span>
                    </button>
                    <button type="button" className="spt-btn spt-btn-dark" onClick={openDialog}>
                      {L.contactMe}
                    </button>
                  </div>
                  <footer className="spt-foot">
                    <span>
                      © {now ? now.getFullYear() : ""} {name}
                    </span>
                    {clock && (
                      <span>
                        {city ? city + " · " : ""}
                        {clock} local time
                      </span>
                    )}
                  </footer>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {dialog && (
        <div
          className="spt-overlay"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) closeDialog()
          }}
        >
          <div className="spt-dialog" role="dialog" aria-modal="true" aria-labelledby={uid + "-dlg"}>
            <div className="spt-dialog-head">
              <div>
                <h2 id={uid + "-dlg"} className="spt-serif">
                  Say hello
                </h2>
                <p className="spt-p" style={{ margin: "4px 0 0" }}>
                  This opens a draft to {email} in your mail app.
                </p>
              </div>
              <button type="button" className="spt-x" onClick={closeDialog} aria-label="Close">
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
                  <path d="m2.5 2.5 7 7M9.5 2.5l-7 7" />
                </svg>
              </button>
            </div>
            <label className="spt-field">
              Your name
              <input ref={firstFieldRef} value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} placeholder="Jane from Acme" />
            </label>
            <label className="spt-field">
              Message
              <textarea
                rows={4}
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                placeholder="Hi! We're building…"
              />
            </label>
            <div className="spt-dialog-actions">
              <button type="button" className="spt-btn spt-btn-soft" onClick={copyEmail}>
                Copy email
              </button>
              <a className="spt-btn spt-btn-dark" href={mailto} onClick={() => later(closeDialog, 150)}>
                Open draft
              </a>
            </div>
          </div>
        </div>
      )}

      <div aria-live="polite" className="spt-sr">
        {toast?.text}
      </div>
      {toast && (
        <div key={toast.id} className="spt-toast" aria-hidden="true">
          <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 7.4 2.6 2.6L11 4.4" />
          </svg>
          {toast.text}
        </div>
      )}
    </div>
  )
}

function SkillCell({ i, on, lit }: { i: number; on: boolean; lit: boolean }) {
  return <i style={{ "--i": i } as React.CSSProperties} data-on={on && lit ? "" : undefined} />
}

function DownloadIcon() {
  return (
    <svg className="spt-dl" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2v7M4 6.4 7 9.4l3-3M2.4 11.8h9.2" />
    </svg>
  )
}

const ico = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const

function ArrowIcon({ flip }: { flip?: boolean }) {
  return (
    <svg {...ico} width={18} height={18} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg {...ico}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg {...ico} width={18} height={18}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg {...ico} width={18} height={18}>
      <rect x="5" y="3" width="14" height="14" rx="2" />
      <path d="M9 3v14M15 3v14M3 9h14M3 15h14" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg {...ico} width={18} height={18}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M4 6h20M4 10h20M4 14h20" />
    </svg>
  )
}

function OutIcon() {
  return (
    <svg {...ico} width={14} height={14}>
      <path d="M18 5h-7a7 7 0 0 0-7 7v7M3 12h15M3 12l8-8" />
    </svg>
  )
}

function SunMoon({ theme, size = 20, id }: { theme: "light" | "dark"; size?: number; id: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      <g id={id + "moon"} style={theme === "dark" ? { display: "none" } : undefined}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </g>
      <g id={id + "sun"} style={theme === "light" ? { display: "none" } : undefined} />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function XIconSocial() {
  return (
    <svg {...ico} width={16} height={16}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function DribbbleIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.38-1.72-10.88 1.4-12.99 6.89" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg {...ico} width={16} height={16}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20" />
    </svg>
  )
}

function MailIconSocial() {
  return (
    <svg {...ico} width={16} height={16}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function ProjectArt({ name, hue = 200, id }: { name: string; hue?: number; id: string }) {
  const h = hue % 360
  return (
    <svg width={216} height={135} viewBox="0 0 216 135" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" id={id}>
      <defs>
        <linearGradient id={id + "bg"} x1="0" y1="0" x2="216" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={`hsl(${h}, 60%, 12%)`} />
          <stop offset="100%" stopColor={`hsl(${h}, 50%, 6%)`} />
        </linearGradient>
        <radialGradient id={id + "glow"} cx="50%" cy="50%" r="70%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={`hsl(${h}, 60%, 20%)`} stopOpacity="0.3" />
          <stop offset="100%" stopColor={`hsl(${h}, 50%, 6%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="216" height="135" fill={`url(#${id}bg)`} />
      <ellipse cx="108" cy="67.5" rx="120" ry="80" fill={`url(#${id}glow)`} />
      <g fill="none" stroke={`hsl(${h}, 50%, 40%)`} strokeWidth={1} opacity="0.3">
        <path d="M0 0L216 135M216 0L0 135" />
        <circle cx="108" cy="67.5" r="40" />
      </g>
      <text x="108" y="67.5" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace" fill={`hsl(${h}, 40%, 50%)`} opacity="0.5" letterSpacing="0.1em">
        {name}
      </text>
    </svg>
  )
}
