import api from "@/lib/api";

export async function fetchSitemap() {
  const res = await api.get("/seo/sitemap", {
    responseType: "text",
  });

  return res.data as string;
}