"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";

export interface SkillItem {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  level: number; // 0 - 100
  years?: number;
  order?: number;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "skills_v2";
const TIMEOUT_MS = 5000;

const FALLBACK_SKILLS: SkillItem[] = [
  // Languages
  { name: "TypeScript", category: "Languages", level: 92, years: 4, order: 1 },
  { name: "JavaScript", category: "Languages", level: 95, years: 5, order: 2 },
  { name: "SQL", category: "Languages", level: 85, years: 3, order: 3 },
  { name: "C", category: "Languages", level: 75, years: 2, order: 4 },
  // Frontend
  { name: "React.js", category: "Frontend", level: 95, years: 5, order: 5 },
  { name: "Next.js", category: "Frontend", level: 92, years: 4, order: 6 },
  { name: "Tailwind CSS", category: "Frontend", level: 90, years: 4, order: 7 },
  { name: "TanStack Query", category: "Frontend", level: 85, years: 3, order: 8 },
  { name: "HTML5", category: "Frontend", level: 98, years: 5, order: 9 },
  { name: "CSS3", category: "Frontend", level: 95, years: 5, order: 10 },
  // Backend
  { name: "Node.js", category: "Backend", level: 92, years: 4, order: 11 },
  { name: "Express.js", category: "Backend", level: 90, years: 4, order: 12 },
  { name: "PostgreSQL", category: "Backend", level: 88, years: 3, order: 13 },
  { name: "MongoDB", category: "Backend", level: 88, years: 4, order: 14 },
  { name: "Prisma ORM", category: "Backend", level: 86, years: 3, order: 15 },
  { name: "Redis", category: "Backend", level: 80, years: 2, order: 16 },
  { name: "JWT", category: "Backend", level: 88, years: 3, order: 17 },
  { name: "Stripe", category: "Backend", level: 82, years: 2, order: 18 },
  // Tools & DevOps
  { name: "Git", category: "Tools & DevOps", level: 90, years: 4, order: 19 },
  { name: "GitHub", category: "Tools & DevOps", level: 92, years: 4, order: 20 },
  { name: "Postman", category: "Tools & DevOps", level: 90, years: 4, order: 21 },
  { name: "Firebase", category: "Tools & DevOps", level: 82, years: 3, order: 22 },
  { name: "NextAuth", category: "Tools & DevOps", level: 85, years: 3, order: 23 },
  { name: "Vercel", category: "Tools & DevOps", level: 88, years: 4, order: 24 },
  { name: "Netlify", category: "Tools & DevOps", level: 82, years: 3, order: 25 },
  { name: "Render", category: "Tools & DevOps", level: 80, years: 2, order: 26 },
];

export async function getSkills(): Promise<SkillItem[]> {
  try {
    await connection();

    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timeout")), TIMEOUT_MS)
      ),
    ]);

    if (!client) return FALLBACK_SKILLS;

    const db = client.db(DB_NAME);
    const skills = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();

    if (!skills || skills.length === 0) {
      return FALLBACK_SKILLS;
    }

    return skills.map((s, index) => ({
      id: s._id.toString(),
      name: s.name,
      category: s.category || "General",
      level: Number(s.level) || 80,
      years: s.years ? Number(s.years) : undefined,
      order: typeof s.order === "number" ? s.order : index,
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("MongoDB skills fetch failed, using fallback:", e);
    }
    return FALLBACK_SKILLS;
  }
}

export async function reorderSkills(orderedIds: string[]) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index } },
      },
    }));
    if (operations.length > 0) {
      await db.collection(COLLECTION_NAME).bulkWrite(operations);
    }
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error reordering skills in MongoDB:", e);
    return { success: false, error: "Failed to reorder skills" };
  }
}

export async function addSkill(skill: Omit<SkillItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...skill,
      level: Number(skill.level) || 80,
      years: skill.years ? Number(skill.years) : undefined,
      order: skill.order ?? 99,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting skill to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateSkill(id: string, skill: Omit<SkillItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...skill,
          level: Number(skill.level) || 80,
          years: skill.years ? Number(skill.years) : undefined,
        },
      }
    );
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error updating skill in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteSkill(id: string) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error deleting skill from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
