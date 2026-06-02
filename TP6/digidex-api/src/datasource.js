const BASE = "https://digi-api.com/api/v1";

// Liste paginée. L'API renvoie { content: [...], pageable: {...} }
export async function fetchDigimons({ page, pageSize, name }) {
  let url = `${BASE}/digimon?page=${page}&pageSize=${pageSize}`;
  if (name) url += `&name=${encodeURIComponent(name)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  const data = await res.json();

  return {
    items: data.content.map((d) => ({
      id: d.id,
      name: d.name,
      image: d.image,
    })),
    totalElements: data.pageable?.totalElements,
    totalPages: data.pageable?.totalPages,
    currentPage: data.pageable?.currentPage,
  };
}

// Détail (par id OU par nom : l'API accepte les deux dans la même route)
export async function fetchDigimon(idOrName) {
  const res = await fetch(`${BASE}/digimon/${idOrName}`);
  if (res.status === 404) return null; // introuvable
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json();
}
