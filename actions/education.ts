"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";

export interface EducationItem {
  id?: string;
  _id?: string;
  degree: string;
  school: string;
  start: string;
  end: string;
  circled?: boolean;
  order?: number;
}

export interface LanguageItem {
  id?: string;
  _id?: string;
  name: string;
  level: string;
  value: number; // 0 to 1
  order?: number;
}

const DB_NAME = "portfolio";
const EDU_COLLECTION = "education";
const LANG_COLLECTION = "languages";
const RESUME_COLLECTION = "resume";
const TIMEOUT_MS = 5000;

const FALLBACK_EDUCATION: EducationItem[] = [
  { id: "1", degree: "UX/UI Design Bootcamp", school: "Ironhack, Paris", start: "2025", end: "", circled: false, order: 0 },
  { id: "2", degree: "Google UX Design Certificate", school: "Coursera", start: "2024", end: "", circled: false, order: 1 },
  { id: "3", degree: "Erasmus — Études visuelles", school: "Université Paris 8", start: "2023", end: "", circled: true, order: 2 },
  { id: "4", degree: "B.A. Multimedia Sciences & Technologies", school: "University of Udine", start: "2021", end: "26", circled: true, order: 3 },
];

const FALLBACK_LANGUAGES: LanguageItem[] = [
  { id: "1", name: "Italian", level: "native", value: 1, order: 0 },
  { id: "2", name: "French", level: "B2", value: 0.72, order: 1 },
  { id: "3", name: "English", level: "C1", value: 0.88, order: 2 },
];

const FALLBACK_RESUME_URL = "https://drive.google.com/file/d/1SanC7OU4l_TyOVYt4dPlw4Xwr_GPYCVe/view?usp=drive_link";

export async function getEducation(): Promise<EducationItem[]> {
  try {
    await connection();
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    if (!client) return FALLBACK_EDUCATION;

    const db = client.db(DB_NAME);
    const edus = await db.collection(EDU_COLLECTION).find({}).sort({ order: 1, _id: 1 }).toArray();
    if (!edus || edus.length === 0) return FALLBACK_EDUCATION;

    return edus.map((e, index) => ({
      id: e._id.toString(),
      degree: e.degree,
      school: e.school,
      start: e.start || "",
      end: e.end || "",
      circled: !!e.circled,
      order: typeof e.order === "number" ? e.order : index,
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.warn("MongoDB education fetch failed:", e);
    return FALLBACK_EDUCATION;
  }
}

export async function reorderEducation(orderedIds: string[]) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index } },
      },
    }));
    if (operations.length > 0) {
      await db.collection(EDU_COLLECTION).bulkWrite(operations);
    }
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error reordering education in MongoDB:", e);
    return { success: false, error: "Failed to reorder education" };
  }
}

export async function addEducation(item: Omit<EducationItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    const res = await db.collection(EDU_COLLECTION).insertOne({
      ...item,
      order: item.order ?? 99,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, id: res.insertedId.toString() };
  } catch (e) {
    return { success: false, error: "Failed to add education" };
  }
}

export async function updateEducation(id: string, item: Omit<EducationItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(EDU_COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: item });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update education" };
  }
}

export async function deleteEducation(id: string) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(EDU_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete education" };
  }
}

export async function getLanguages(): Promise<LanguageItem[]> {
  try {
    await connection();
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    if (!client) return FALLBACK_LANGUAGES;

    const db = client.db(DB_NAME);
    const langs = await db.collection(LANG_COLLECTION).find({}).sort({ order: 1, _id: 1 }).toArray();
    if (!langs || langs.length === 0) return FALLBACK_LANGUAGES;

    return langs.map((l, index) => ({
      id: l._id.toString(),
      name: l.name,
      level: l.level,
      value: typeof l.value === "number" ? l.value : 0.8,
      order: typeof l.order === "number" ? l.order : index,
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.warn("MongoDB languages fetch failed:", e);
    return FALLBACK_LANGUAGES;
  }
}

export async function reorderLanguages(orderedIds: string[]) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index } },
      },
    }));
    if (operations.length > 0) {
      await db.collection(LANG_COLLECTION).bulkWrite(operations);
    }
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error reordering languages in MongoDB:", e);
    return { success: false, error: "Failed to reorder languages" };
  }
}

export async function addLanguage(item: Omit<LanguageItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    const res = await db.collection(LANG_COLLECTION).insertOne({
      ...item,
      value: Number(item.value) || 0.8,
      order: item.order ?? 99,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, id: res.insertedId.toString() };
  } catch (e) {
    return { success: false, error: "Failed to add language" };
  }
}

export async function updateLanguage(id: string, item: Omit<LanguageItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(LANG_COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...item, value: Number(item.value) || 0.8 } }
    );
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update language" };
  }
}

export async function deleteLanguage(id: string) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(LANG_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete language" };
  }
}

export async function getResumeUrl(): Promise<string> {
  try {
    await connection();
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    if (!client) return FALLBACK_RESUME_URL;

    const db = client.db(DB_NAME);
    const doc = await db.collection(RESUME_COLLECTION).findOne({});
    return doc?.url || FALLBACK_RESUME_URL;
  } catch (e) {
    return FALLBACK_RESUME_URL;
  }
}

export async function updateResumeUrl(url: string) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(RESUME_COLLECTION).deleteMany({});
    await db.collection(RESUME_COLLECTION).insertOne({ url, updatedAt: new Date() });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update resume URL" };
  }
}
