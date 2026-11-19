"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";

export interface CustomProject {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  images: string[];
  highlights?: string[];
  liveLink?: string;
  repoLink?: string;
  order?: number;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "projects";
const MONGO_TIMEOUT = 5000;

export async function getProjects() {
  try {
    await connection();

    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("MongoDB connection timeout")), MONGO_TIMEOUT)
      )
    ]);
    
    const db = client.db(DB_NAME);
    const projects = await db.collection(COLLECTION_NAME).find({}).sort({ order: 1, _id: 1 }).toArray();

    return projects.map((p, index) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      tags: p.tags,
      status: p.status,
      images: p.images,
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      liveLink: p.liveLink,
      repoLink: p.repoLink,
      order: typeof p.order === "number" ? p.order : index,
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.debug("MongoDB not available, using fallback projects:", e);
    }
    return null;
  }
}

export async function reorderProjects(orderedIds: string[]) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("MongoDB connection timeout")), MONGO_TIMEOUT)
      )
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
    console.error("Error reordering projects in MongoDB:", e);
    return { success: false, error: "Failed to reorder projects" };
  }
}

export async function addProject(project: Omit<CustomProject, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("MongoDB connection timeout")), MONGO_TIMEOUT)
      )
    ]);
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...project,
      order: project.order ?? 99,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting project to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateProject(id: string, project: Omit<CustomProject, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("MongoDB connection timeout")), MONGO_TIMEOUT)
      )
    ]);
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: project }
    );
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error updating project in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteProject(id: string) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("MongoDB connection timeout")), MONGO_TIMEOUT)
      )
    ]);
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error deleting project from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
