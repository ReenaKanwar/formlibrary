export function normalizeGrid(grid) {
  if (!grid) {
    return { xs: 12, md: 12 };
  }
  
  const normalized = { ...grid };
  
  if (normalized.xs === undefined) {
    normalized.xs = 12;
  }
  
  return normalized;
}
