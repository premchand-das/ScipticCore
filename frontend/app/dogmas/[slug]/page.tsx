import { notFound } from "next/navigation";
import { getContentBySlug } from "@/services/content-detail.service";
import { ContentDetailPage } from "@/components/content/content-detail-page";

export default async function DogmaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await getContentBySlug("dogmas", slug).catch(() => null);
  if (!item) notFound();

  return <ContentDetailPage item={item} type="dogmas" />;
}