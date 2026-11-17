"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";

export interface BookItem {
  id?: string;
  _id?: string;
  title: string;
  color: string;
  order?: number;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "exploring_books";
const TIMEOUT_MS = 5000;

const FALLBACK_BOOKS: BookItem[] = [
  { id: "1", title: "Distributed Caching (Redis)", color: "#c9473b", order: 0 },
  { id: "2", title: "Backend Architecture", color: "#2f3b52", order: 1 },
  { id: "3", title: "System Design Patterns", color: "#d9a441", order: 2 },
  { id: "4", title: "Database Sharding & Scale", color: "#f2efe8", order: 3 },
  { id: "5", title: "Clean Distributed Systems", color: "#1f1f21", order: 4 },
];

export async function getExploringBooks(): Promise<BookItem[]> {
  try {
    await connection();

    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
      ),
    ]);

    if (!client) return FALLBACK_BOOKS;

    const db = client.db(DB_NAME);
    const books = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();

    if (!books || books.length === 0) {
      return FALLBACK_BOOKS;
    }

    return books.map((b, index) => ({
      id: b._id.toString(),
      title: b.title,
      color: b.color || "#2f3b52",
      order: typeof b.order === "number" ? b.order : index,
    }));
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("MongoDB exploring_books fetch failed, using fallback:", e);
    }
    return FALLBACK_BOOKS;
  }
}

export async function reorderExploringBooks(orderedIds: string[]) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
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
    console.error("Error reordering books in MongoDB:", e);
    return { success: false, error: "Failed to reorder books" };
  }
}

export async function addExploringBook(book: Omit<BookItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...book,
      order: book.order ?? 99,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting book to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateExploringBook(id: string, book: Omit<BookItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: book }
    );
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error updating book in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteExploringBook(id: string) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error deleting book from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
