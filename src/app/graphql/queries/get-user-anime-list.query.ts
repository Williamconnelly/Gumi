import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const GET_USER_ANIME_LIST: DocumentNode = gql`
query GetUserAnimeList($userId: Int, $chunk: Int, $perChunk: Int, $perPage: Int) {
  MediaListCollection(
    userId: $userId
    type: ANIME
    perChunk: $perChunk
    chunk: $chunk
  ) {
    hasNextChunk
    lists {
      entries {
        mediaId
        score
        status
      }
    }
    user {
      id
      name
      avatar {
        medium
        large
      }
      favourites {
        staff( page: $chunk, perPage: $perPage) {
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
}
`;
