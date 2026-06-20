"use client";

import { useState } from "react";
import { ImagePlus, Copy } from "lucide-react";
import { uploadAdminImage } from "@/services/media.service";
import { AdminProtectedRoute } from "@/components/admin/admin-protected-route";

export default function AdminMediaPage() {
  return (
    <AdminProtectedRoute>
      <MediaContent />
    </AdminProtectedRoute>
  );
}

function MediaContent() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file?: File) {
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadAdminImage(file);
      const url = data?.url || data?.secure_url || data?.imageUrl;

      if (url) setImages((prev) => [url, ...prev]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] p-8 text-[#191713]">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-black/40">
          Assets
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Media Library</h1>
      </div>

      <label className="mb-8 flex cursor-pointer flex-col items-center justify-center rounded-[36px] border border-dashed border-black/20 bg-white p-12 text-center">
        <ImagePlus size={34} />
        <h2 className="mt-4 text-xl font-semibold">
          {uploading ? "Uploading..." : "Upload editorial image"}
        </h2>
        <p className="mt-2 text-sm text-black/45">
          Supports the confirmed backend upload route.
        </p>
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </label>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((url) => (
          <div
            key={url}
            className="overflow-hidden rounded-[28px] border border-black/10 bg-white"
          >
            <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <p className="truncate text-xs text-black/45">{url}</p>
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="rounded-full bg-black p-2 text-white"
              >
                <Copy size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}