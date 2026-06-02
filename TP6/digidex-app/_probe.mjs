// Reproduit le comportement d'Apollo Client v4 (couche lib, pas Angular)
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/', fetch }),
  cache: new InMemoryCache(),
});

const LISTE = gql`
  query Digimons($page: Int!, $pageSize: Int!, $name: String) {
    digimons(page: $page, pageSize: $pageSize, name: $name) {
      totalElements
      totalPages
      currentPage
      items { id name image }
    }
  }
`;

try {
  const res = await client.query({
    query: LISTE,
    variables: { page: 0, pageSize: 5, name: null },
  });
  console.log('OK data:', JSON.stringify(res.data.digimons.items?.slice(0, 2)));
} catch (e) {
  console.log('APOLLO CLIENT ERROR ->', e.constructor.name, ':', e.message);
  if (e.networkError) console.log('  networkError:', e.networkError.message, e.networkError.statusCode);
  if (e.graphQLErrors?.length) console.log('  graphQLErrors:', JSON.stringify(e.graphQLErrors));
  if (e.cause) console.log('  cause:', e.cause.message);
}
