// Date and time utility helpers

// Format ISO date to readable string
export const formatDate = (iso: string, locale: string = "en-IN"): string => {
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
};

// Get number of days between two dates
export const daysBetween = (dateA: string, dateB: string): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.floor((new Date(dateA).getTime() - new Date(dateB).getTime()) / msPerDay));
};
