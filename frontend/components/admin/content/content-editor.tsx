"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";

import {
  createAdminContent,
  updateAdminContent,
} from "@/services/admin-content.service";
import { uploadImage } from "@/services/upload.service";
import type {
  AdminContentCollection,
  AdminContentItem,
  AdminContentPayload,
  ContentDifficulty,
  ContentFormat,
  ContentStatus,
  ContentVisibility,
} from "@/types/content";

interface ContentEditorProps {
  mode: "create" | "edit";
  collection: AdminContentCollection;
  initialData?: AdminContentItem;
}

const emptyPayload = (
  collection: AdminContentCollection,
  item?: AdminContentItem
): AdminContentPayload => ({
  title: item?.title || "",
  slug: item?.slug || "",
  type: item?.type || collection,
  category: item?.category || "",
  hook: item?.hook || "",
  summary: item?.summary || "",
  body: item?.body || "",
  thumbnail: item?.thumbnail || "",
  tags: item?.tags || [],
  readingTime: item?.readingTime || 3,
  status: (item?.status as ContentStatus) || "draft",
  isFeatured: item?.isFeatured || false,
  order: item?.order || 0,
  visibility: item?.visibility || "public",
  contentFormat: item?.contentFormat || "essay",
  difficulty: item?.difficulty || "beginner",
  estimatedMinutes: item?.estimatedMinutes || 3,
  seo: {
    metaTitle: item?.seo?.metaTitle || "",
    metaDescription: item?.seo?.metaDescription || "",
    canonicalUrl: item?.seo?.canonicalUrl || "",
    ogImage: item?.seo?.ogImage || "",
  },
  sources: item?.sources || [],
});

export function ContentEditor({
  mode,
  collection,
  initialData,
}: ContentEditorProps) {
  const router = useRouter();

  const [form, setForm] = useState<AdminContentPayload>(
    emptyPayload(collection, initialData)
  );

  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof AdminContentPayload>(
    key: K,
    value: AdminContentPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(
    file: File,
    target: "thumbnail" | "ogImage"
  ) {
    try {
      if (target === "thumbnail") setUploadingThumbnail(true);
      if (target === "ogImage") setUploadingOg(true);

      const uploaded = await uploadImage(file);

      if (target === "thumbnail") {
        updateField("thumbnail", uploaded.secureUrl);
      } else {
        updateField("seo", {
          ...form.seo,
          ogImage: uploaded.secureUrl,
        });
      }
    } finally {
      setUploadingThumbnail(false);
      setUploadingOg(false);
    }
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    setSaving(true);
    setError("");

    const cleanSources = (form.sources || [])
      .map((source: any) => {
        const cleaned: any = {};

        if (source.title?.trim()) cleaned.title = source.title.trim();
        if (source.url?.trim()) cleaned.url = source.url.trim();
        if (source.author?.trim()) cleaned.author = source.author.trim();
        if (source.publisher?.trim()) cleaned.publisher = source.publisher.trim();

        return cleaned;
      })
      .filter((source: any) => source.title || source.url);

    const cleanSeo: any = {};

    if (form.seo?.metaTitle?.trim()) {
      cleanSeo.metaTitle = form.seo.metaTitle.trim();
    }

    if (form.seo?.metaDescription?.trim()) {
      cleanSeo.metaDescription = form.seo.metaDescription.trim();
    }

    if (form.seo?.canonicalUrl?.trim()) {
      cleanSeo.canonicalUrl = form.seo.canonicalUrl.trim();
    }

    if (form.seo?.ogImage?.trim()) {
      cleanSeo.ogImage = form.seo.ogImage.trim();
    }

    const payload: any = {
      ...form,
      sources: cleanSources,
      seo: cleanSeo,
    };

    if (!payload.slug?.trim()) delete payload.slug;
    if (!payload.archivedFrom) delete payload.archivedFrom;

    if (mode === "create") {
      await createAdminContent(collection, payload);
    } else if (initialData?._id) {
      await updateAdminContent(collection, initialData._id, payload);
    }

    router.push(`/admin/content/${collection}`);
  } catch (error: any) {
    console.error("CONTENT SAVE ERROR:", error?.response?.data || error);
    setError(error?.response?.data?.message || "Content could not be saved.");
  } finally {
    setSaving(false);
  }
}

function addSource() {
  updateField("sources", [
    ...(form.sources || []),
    {
      title: "",
      url: "",
      author: "",
      publisher: "",
    },
  ]);
}

  function updateSource(index: number, key: string, value: string) {
    const sources = [...(form.sources || [])];
    sources[index] = {
      ...sources[index],
      [key]: value,
    };

    updateField("sources", sources);
  }

  function removeSource(index: number) {
    updateField(
      "sources",
      (form.sources || []).filter((_, i) => i !== index)
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] p-5 text-[#14110F] md:p-8 xl:p-10">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
        <header className="rounded-[36px] border border-[#E7E0D5] bg-white/80 p-7 shadow-sm md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
            Content Studio
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            {mode === "create" ? "Create" : "Edit"} {collection}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
            Manage editorial content, publishing state, SEO, sources, metadata,
            and visual assets.
          </p>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Panel title="Core Identity">
              <Input
                label="Title"
                value={form.title}
                onChange={(v) => updateField("title", v)}
                required
              />

              <Input
                label="Slug"
                value={form.slug || ""}
                onChange={(v) => updateField("slug", v)}
                placeholder="auto-generated-if-empty"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Type"
                  value={form.type}
                  onChange={(v) => updateField("type", v)}
                  required
                />

                <Input
                  label="Category"
                  value={form.category}
                  onChange={(v) => updateField("category", v)}
                  required
                />
              </div>
            </Panel>

            <Panel title="Editorial Content">
              <Input
                label="Hook"
                value={form.hook || ""}
                onChange={(v) => updateField("hook", v)}
              />

              <Textarea
                label="Summary"
                value={form.summary || ""}
                onChange={(v) => updateField("summary", v)}
                rows={4}
              />

              <Textarea
                label="Body"
                value={form.body || ""}
                onChange={(v) => updateField("body", v)}
                rows={16}
              />
            </Panel>

            <Panel title="Sources">
              <div className="space-y-4">
                {(form.sources || []).map((source, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-[#E7E0D5] bg-[#FBF8F2] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        Source {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeSource(index)}
                        className="rounded-full bg-white p-2 text-neutral-500"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        label="Title"
                        value={source.title || ""}
                        onChange={(v) => updateSource(index, "title", v)}
                      />

                      <Input
                        label="URL"
                        value={source.url || ""}
                        onChange={(v) => updateSource(index, "url", v)}
                      />

                      <Input
                        label="Author"
                        value={source.author || ""}
                        onChange={(v) => updateSource(index, "author", v)}
                      />

                      <Input
                        label="Publisher"
                        value={source.publisher || ""}
                        onChange={(v) => updateSource(index, "publisher", v)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSource}
                  className="rounded-2xl border border-[#14110F] px-4 py-3 text-sm font-semibold"
                >
                  Add Source
                </button>
              </div>
            </Panel>

            <Panel title="SEO">
              <Input
                label="Meta Title"
                value={form.seo?.metaTitle || ""}
                onChange={(v) =>
                  updateField("seo", { ...form.seo, metaTitle: v })
                }
              />

              <Textarea
                label="Meta Description"
                value={form.seo?.metaDescription || ""}
                onChange={(v) =>
                  updateField("seo", { ...form.seo, metaDescription: v })
                }
                rows={3}
              />

              <Input
                label="Canonical URL"
                value={form.seo?.canonicalUrl || ""}
                onChange={(v) =>
                  updateField("seo", { ...form.seo, canonicalUrl: v })
                }
              />

              <UploadInput
                label="OG Image"
                value={form.seo?.ogImage || ""}
                uploading={uploadingOg}
                onUrlChange={(v) =>
                  updateField("seo", { ...form.seo, ogImage: v })
                }
                onFile={(file) => handleImageUpload(file, "ogImage")}
              />
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel title="Publishing">
              <Select
                label="Status"
                value={form.status || "draft"}
                options={["draft", "published", "archived"]}
                onChange={(v) => updateField("status", v as ContentStatus)}
              />

              <Select
                label="Visibility"
                value={form.visibility || "public"}
                options={["public", "private", "unlisted"]}
                onChange={(v) =>
                  updateField("visibility", v as ContentVisibility)
                }
              />

              <Select
                label="Format"
                value={form.contentFormat || "essay"}
                options={[
                  "essay",
                  "reel",
                  "carousel",
                  "paper",
                  "note",
                  "video",
                  "archive",
                ]}
                onChange={(v) =>
                  updateField("contentFormat", v as ContentFormat)
                }
              />

              <Select
                label="Difficulty"
                value={form.difficulty || "beginner"}
                options={["beginner", "intermediate", "advanced"]}
                onChange={(v) =>
                  updateField("difficulty", v as ContentDifficulty)
                }
              />

              <label className="flex items-center gap-3 rounded-2xl bg-[#F7F3EC] p-4 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(form.isFeatured)}
                  onChange={(e) =>
                    updateField("isFeatured", e.target.checked)
                  }
                />
                Featured
              </label>
            </Panel>

            <Panel title="Visual Asset">
              <UploadInput
                label="Thumbnail"
                value={form.thumbnail || ""}
                uploading={uploadingThumbnail}
                onUrlChange={(v) => updateField("thumbnail", v)}
                onFile={(file) => handleImageUpload(file, "thumbnail")}
              />
            </Panel>

            <Panel title="Metadata">
              <Input
                label="Tags"
                value={(form.tags || []).join(", ")}
                onChange={(v) =>
                  updateField(
                    "tags",
                    v
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="science, philosophy, skepticism"
              />

              <Input
                label="Reading Time"
                type="number"
                value={String(form.readingTime || 1)}
                onChange={(v) => updateField("readingTime", Number(v))}
              />

              <Input
                label="Estimated Minutes"
                type="number"
                value={String(form.estimatedMinutes || 1)}
                onChange={(v) => updateField("estimatedMinutes", Number(v))}
              />

              <Input
                label="Order"
                type="number"
                value={String(form.order || 0)}
                onChange={(v) => updateField("order", Number(v))}
              />
            </Panel>

            <button
              disabled={saving}
              className="w-full rounded-2xl bg-[#14110F] px-6 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : mode === "create"
                  ? "Create Content"
                  : "Save Changes"}
            </button>
          </aside>
        </section>
      </form>
    </main>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-[#E7E0D5] bg-white/80 p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[#E7E0D5] bg-[#FBF8F2] px-4 text-sm outline-none"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FBF8F2] px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[#E7E0D5] bg-[#FBF8F2] px-4 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function UploadInput({
  label,
  value,
  uploading,
  onUrlChange,
  onFile,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onUrlChange: (value: string) => void;
  onFile: (file: File) => void;
}) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>

      {value && (
        <img
          src={value}
          alt=""
          className="mt-3 h-36 w-full rounded-2xl object-cover"
        />
      )}

      <input
        value={value}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Image URL"
        className="mt-3 h-12 w-full rounded-2xl border border-[#E7E0D5] bg-[#FBF8F2] px-4 text-sm outline-none"
      />

      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#14110F] px-4 py-3 text-sm font-semibold">
        <Upload size={16} />
        {uploading ? "Uploading..." : "Upload Image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </label>
    </div>
  );
}