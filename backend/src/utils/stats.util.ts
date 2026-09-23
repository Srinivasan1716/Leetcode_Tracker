// Statistics utility helpers

// Compute arithmetic mean of a number array
export const computeMean = (values: number[]): number => {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

// Compute min and max of a number array
export const computeMinMax = (values: number[]): { min: number; max: number } => {
  if (!values.length) return { min: 0, max: 0 };
  return { min: Math.min(...values), max: Math.max(...values) };
};

// Compute percentage with safe division
export const computePercentage = (part: number, total: number, decimals: number = 1): number => {
  if (!total) return 0;
  return parseFloat(((part / total) * 100).toFixed(decimals));
};

// Get rank label based on percentile
export const getPercentileRank = (percentile: number): string => {
  if (percentile >= 90) return "Top 10%";
  if (percentile >= 75) return "Top 25%";
  if (percentile >= 50) return "Top 50%";
  return "Bottom 50%";
};
