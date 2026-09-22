// Submission timestamp and runtime formatters
export function formatSubmissionDate(isoDate) {
  if (!isoDate) return "Just now";
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
