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

// Check if a date is today
export const isToday = (iso: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return iso.startsWith(today);
};

// Get start of week date (Monday)
export const getStartOfWeek = (): string => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
};

// Get last N days as ISO date string array
export const getLastNDays = (n: number): string[] => {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();
};
