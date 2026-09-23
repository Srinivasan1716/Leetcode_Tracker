// String utility helpers

// Capitalize first letter of each word
export const toTitleCase = (str: string): string => {
  return str.replace(/\b\w/g, c => c.toUpperCase());
};

// Convert camelCase to snake_case
export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
};

// Slugify a problem title
export const slugify = (str: string): string => {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};
