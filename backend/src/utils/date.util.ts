// Date and time utility helpers

// Format ISO date to readable string
export const formatDate = (iso: string, locale: string = "en-IN"): string => {
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
};
