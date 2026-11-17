"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";

export interface CertificateItem {
  id?: string;
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  image?: string;
  credentialUrl?: string;
  order?: number;
}

const DB_NAME = "portfolio";
const COLLECTION_NAME = "certificates";
const TIMEOUT_MS = 5000;

const FALLBACK_CERTIFICATES: CertificateItem[] = [
  {
    id: "1",
    title: "Claude Code 101",
    issuer: "Anthropic",
    date: "May 2026",
    credentialUrl: "https://drive.google.com/file/d/19_eKq5sjQQnLKkyThQRKTCdxnigtTc_y/view?usp=sharing",
    order: 0,
  },
  {
    id: "2",
    title: "Complete Web Development",
    issuer: "Programming Hero",
    date: "Jan 2026",
    credentialUrl: "https://drive.google.com/file/d/19litr0cTaxbQqkZSN-Jpe6vWaqf42Rw9/view?usp=sharing",
    order: 1,
  },
  {
    id: "3",
    title: "Pearson Test of English (PTE)",
    issuer: "Pearson",
    date: "2023-2025",
    credentialUrl: "https://drive.google.com/file/d/1tK8-8PR14QyvKkC9IODEW-m0MCaqoJDN/view?usp=sharing",
    order: 2,
  },
  {
    id: "4",
    title: "Communication Secrets",
    issuer: "10 Minute School",
    date: "May 2026",
    credentialUrl: "https://drive.google.com/file/d/14qjdMTUPw47Ga2BKwE7zKPmDWHH5yVx1/view?usp=sharing",
    order: 3,
  },
];

export async function getCertificates(): Promise<CertificateItem[]> {
  try {
    await connection();

    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
      ),
    ]);

    if (!client) return FALLBACK_CERTIFICATES;

    const db = client.db(DB_NAME);
    const certs = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();

    return certs.map((c, index) => ({
      id: c._id.toString(),
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      image: c.image || "",
      credentialUrl: c.credentialUrl || "",
      order: typeof c.order === "number" ? c.order : index,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("MongoDB certificates fetch failed or timed out:", error);
    }
    return FALLBACK_CERTIFICATES;
  }
}

export async function reorderCertificates(orderedIds: string[]) {
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
    console.error("Error reordering certificates in MongoDB:", e);
    return { success: false, error: "Failed to reorder certificates" };
  }
}

export async function addCertificate(cert: Omit<CertificateItem, "id" | "_id">) {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB timeout")), TIMEOUT_MS)
      ),
    ]);
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...cert,
      order: cert.order ?? 99,
    });
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, id: result.insertedId.toString() };
  } catch (e) {
    console.error("Error inserting certificate to MongoDB:", e);
    return { success: false, error: "Failed to insert" };
  }
}

export async function updateCertificate(id: string, cert: Omit<CertificateItem, "id" | "_id">) {
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
      { $set: cert }
    );
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("Error updating certificate in MongoDB:", e);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteCertificate(id: string) {
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
    console.error("Error deleting certificate from MongoDB:", e);
    return { success: false, error: "Failed to delete" };
  }
}
