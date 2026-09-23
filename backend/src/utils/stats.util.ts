// Statistics utility helpers

// Compute arithmetic mean of a number array
export const computeMean = (values: number[]): number => {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
};
