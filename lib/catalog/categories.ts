import type { Category, CategoryId } from "./types";

export const CATEGORIES: Category[] = [
  { id: "t-shirts", name: "T-Shirts", slug: "t-shirts", sizingKey: "top" },
  { id: "hoodies", name: "Hoodies", slug: "hoodies", sizingKey: "top" },
  { id: "sweatshirts", name: "Sweatshirts", slug: "sweatshirts", sizingKey: "top" },
  { id: "pants", name: "Pants", slug: "pants", sizingKey: "bottom" },
  { id: "outerwear", name: "Outerwear", slug: "outerwear", sizingKey: "top" },
  { id: "accessories", name: "Accessories", slug: "accessories", sizingKey: null },
];

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function categoryName(id: CategoryId): string {
  return getCategory(id)?.name ?? id;
}
