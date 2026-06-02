import { fetchDigimons, fetchDigimon } from "./datasource.js";

// Transforme la réponse REST "riche" en notre type Digimon "propre"
function mapDigimon(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    releaseDate: raw.releaseDate,
    xAntibody: raw.xAntibody,
    images: raw.images ?? [],
    levels: (raw.levels ?? []).map((l) => l.level),
    types: (raw.types ?? []).map((t) => t.type),
    attributes: (raw.attributes ?? []).map((a) => a.attribute),
    // On ne garde que les descriptions en anglais
    descriptions: (raw.descriptions ?? [])
      .filter((d) => d.language === "en_us")
      .map((d) => d.description),
    priorEvolutions: raw.priorEvolutions ?? [],
    nextEvolutions: raw.nextEvolutions ?? [],
  };
}

export const resolvers = {
  Query: {
    // Chaque resolver reçoit (parent, arguments, contexte, info)
    digimons: async (_parent, args) => {
      return fetchDigimons(args); // args = { page, pageSize, name }
    },

    digimon: async (_parent, { id }) => {
      const raw = await fetchDigimon(id);
      return mapDigimon(raw);
    },

    digimonByName: async (_parent, { name }) => {
      const raw = await fetchDigimon(name);
      return mapDigimon(raw);
    },
  },
};
