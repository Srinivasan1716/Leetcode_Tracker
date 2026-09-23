// String utility helpers

// Capitalize first letter of each word
export const toTitleCase = (str: string): string => {
  return str.replace(/\b\w/g, c => c.toUpperCase());
};
