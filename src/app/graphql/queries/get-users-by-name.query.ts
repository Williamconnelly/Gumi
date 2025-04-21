import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const GET_USERS_BY_NAME: DocumentNode = gql`
query GetUsersByName($userName: String, $perPage: Int) {
  users: Page(perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    results: users(search: $userName, sort: [SEARCH_MATCH]) {
      id
      name
      avatar {
        medium
        large
      }
      favourites {
        staff(perPage: $perPage) {
          edges {
            favouriteOrder
            node {
              id
            }
          }
        }
      }
      statistics {
        anime {
          count
        }
        manga {
          count
        }
      }
    }
  }
}
`;