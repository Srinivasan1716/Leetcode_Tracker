// Submission payload sanitization module
export function sanitizeSubmission(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid submission payload format');
  }

  const cleanCode = (payload.code || '').replace(/\r\n/g, '\n').trim();
  const cleanTitle = (payload.title || 'Untitled Problem').trim().slice(0, 200);
  const cleanSlug = (payload.slug || 'unknown').toLowerCase().replace(/[^a-z0-9-]/g, '');

  return {
    ...payload,
    code: cleanCode,
    title: cleanTitle,
    slug: cleanSlug,
    sanitized: true
  };
}
