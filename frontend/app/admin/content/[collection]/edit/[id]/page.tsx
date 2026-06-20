"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";
import { ContentEditor } from "@/components/admin/content/content-editor";
import { getAdminContentById } from "@/services/admin-content.service";
import type {
  AdminContentCollection,
  AdminContentItem,
} from "@/types/content";

const allowedCollections: AdminContentCollection[] = [
  "series",
  "episodes",
  "articles",
  "papers",
  "archive",
  "dogmas",
];

export default function EditContentPage() {
  return (
    <AdminProtectedRoute>
      <EditContentLoader />
    </AdminProtectedRoute>
  );
}

function EditContentLoader() {
  const params = useParams();
  const collection = params.collection as AdminContentCollection;
  const id = params.id as string;

  const [item, setItem] = useState<AdminContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);

        if (!allowedCollections.includes(collection)) {
          setError("Unknown collection.");
          return;
        }

        const data = await getAdminContentById(collection, id);
        setItem(data);
      } catch {
        setError("Unable to load content item.");
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [collection, id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] p-8">
        <div className="rounded-[32px] border border-[#E7E0D5] bg-white p-8 text-sm text-neutral-500">
          Loading editor...
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] p-8">
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          {error || "Content not found."}
        </div>
      </main>
    );
  }

  return (
    <ContentEditor mode="edit" collection={collection} initialData={item} />
  );
}