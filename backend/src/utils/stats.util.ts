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
