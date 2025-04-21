import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const GET_USER_BY_ID: DocumentNode = gql`
query GetUserById($userId: Int) {
  User(id: $userId) {
    name,
    favourites {
      staff(perPage: 50) {
        pageInfo {
          hasNextPage
        }
        edges {
          favouriteOrder
          node {
            id
          }
        }
      }
    }
  }
}
`;