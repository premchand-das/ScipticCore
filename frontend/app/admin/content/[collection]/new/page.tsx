"use client";

import { useParams } from "next/navigation";

import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";
import { ContentEditor } from "@/components/admin/content/content-editor";
import type { AdminContentCollection } from "@/types/content";

const allowedCollections: AdminContentCollection[] = [
  "series",
  "episodes",
  "articles",
  "papers",
  "archive",
  "dogmas",
];

export default function NewContentPage() {
  const params = useParams();
  const collection = params.collection as AdminContentCollection;

  if (!allowedCollections.includes(collection)) {
    return <div className="p-8">Unknown collection.</div>;
  }

  return (
    <AdminProtectedRoute>
      <ContentEditor mode="create" collection={collection} />
    </AdminProtectedRoute>
  );
}