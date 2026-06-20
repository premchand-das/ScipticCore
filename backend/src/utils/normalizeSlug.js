import { generateSlug } from "./generateSlug.js";

export const normalizeSlug = ({ title, slug }) => {
  if (slug) return generateSlug(slug);
  return generateSlug(title);
};