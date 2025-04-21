import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const GET_MEDIA_BY_STAFF_IDS: DocumentNode = gql`
query GetMediaByStaffIds(
  $staffIds: [Int]
  $mediaPage: Int
  $staffPage: Int
  $perPage: Int
) {
  Page(page: $staffPage, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    staff(id_in: $staffIds) {
      id
      name {
        full
        native
        alternative
      }
      image {
        medium
        large
      }
      primaryOccupations
      staffMedia(page: $mediaPage, perPage: $perPage, sort: [START_DATE_DESC]) {
        pageInfo {
          hasNextPage
        }
        edges {
          staffRole
          node {
            id
            idMal
            title {
              english
              native
              romaji
            }
            format
            coverImage {
              extraLarge
              large
              medium
            }
            status
            season
            seasonYear
            startDate {
              day
              month
              year
            }
            endDate {
              day
              month
              year
            }
            episodes
            duration
            averageScore
            studios(isMain: true, sort: []) {
              nodes {
                id
                name
              }
            }
            genres
          }
        }
      }
    }
  }
}
`;