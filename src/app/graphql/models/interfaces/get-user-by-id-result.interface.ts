
export interface IGetUserByIdResult {
  User: {
    name: string,
    favourites: {
      staff: {
        edges: [
          {
            favouriteOrder: number
            node: {
              id: number
            }
          }
        ]
      }
    }
  }
}