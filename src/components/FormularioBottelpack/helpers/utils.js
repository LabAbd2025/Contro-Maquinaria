export function parseJSONField(val) {
  if (!val) return {};
  if (typeof val === "object") return val;
  try {
    const parsed = JSON.parse(val);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}
