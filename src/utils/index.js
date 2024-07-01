export const clamp = (min, value, max) => {
  return Math.min(max, Math.max(min, value));
};

export default { clamp };
