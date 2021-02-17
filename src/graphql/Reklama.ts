import { gql } from 'apollo-boost';

export const CREATE_REKLAMA = gql`
  mutation($reklamaDetails: ReklamaDetails!) {
    createReklama(reklamaDetails: $reklamaDetails) {
      id
    }
  }
`;

// images {
// name,
// image
// },
export const REKLAMAS = gql`
  query($filter: ReklamaFilter, $order: SortOrder, $page: Int!, $perPage: Int!) {
    reklamas(filter: $filter, order: $order, page: $page, perPage: $perPage) {
      metadata {
        page,
        totalPages,
        totalResults
      },
      reklamas {
        id,
        title,
        content,
        insertedAt
      }
    }
  }
`;

export const REKLAMAS_IMAGES = gql`
  query($filter: ReklamaFilter, $order: SortOrder, $page: Int!, $perPage: Int!) {
    reklamas(filter: $filter, order: $order, page: $page, perPage: $perPage) {
      reklamas {
        id,
        images {
          name,
          image
        }
      }
    }
  }
`;

export const REKLAMA = gql`
  query($id: Int!) {
    reklama(id: $id) {
      id,
      title,
      content,
      insertedAt,
      user {
        avatar,
        fullName
      },
      images {
        id,
        image,
        name
      }
    }
  }
`;