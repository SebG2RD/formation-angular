export const typeDefs = `#graphql
  # ----- TYPES (la forme des données) -----

  type Image {
    href: String
    transparent: Boolean
  }

  type Evolution {
    id: Int
    digimon: String
    condition: String
    image: String
  }

  # Le type principal. Le "!" signifie "non null" (obligatoire).
  type Digimon {
    id: Int!
    name: String!
    releaseDate: String
    xAntibody: Boolean
    images: [Image!]          # une LISTE d'images
    levels: [String!]         # ex: ["Child"]
    types: [String!]          # ex: ["Reptile"]
    attributes: [String!]     # ex: ["Vaccine"]
    descriptions: [String!]   # descriptions en anglais
    priorEvolutions: [Evolution!]
    nextEvolutions: [Evolution!]
  }

  # Un type "page" pour la pagination de la liste
  type DigimonPage {
    items: [DigimonSummary!]!
    totalElements: Int
    totalPages: Int
    currentPage: Int
  }

  # Version "légère" pour la liste (pas tous les détails)
  type DigimonSummary {
    id: Int!
    name: String!
    image: String
  }

  # ----- QUERIES (les points d'entrée en LECTURE) -----
  type Query {
    # Liste paginée. Arguments avec valeurs par défaut.
    digimons(page: Int = 0, pageSize: Int = 20, name: String): DigimonPage!

    # Détail d'un Digimon par son id
    digimon(id: Int!): Digimon

    # Détail par son nom
    digimonByName(name: String!): Digimon
  }
`;
