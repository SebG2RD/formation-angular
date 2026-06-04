/** Extrait l'identifiant numérique à la fin d'une URL API (ex. .../character/42 → 42). */
export function extractIdFromUrl(url: string): number {
  const segment = url.split('/').filter(Boolean).pop();
  return segment ? Number(segment) : 0;
}
