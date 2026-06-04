import { gql } from 'apollo-angular';

/** Requête GraphQL : personnages avec lieu et épisodes en un seul appel. */
export const CHARACTERS_QUERY = gql`
  query CharactersPage($page: Int, $name: String, $status: String) {
    characters(page: $page, filter: { name: $name, status: $status }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        origin {
          name
        }
        location {
          id
          name
        }
        episode {
          id
          name
        }
      }
    }
  }
`;
