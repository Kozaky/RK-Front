import { gql } from 'apollo-boost';

export const CREATE_REKLAMA = gql`
  mutation($reklamaDetails: ReklamaDetails!) {
    createReklama(reklamaDetails: $reklamaDetails) {
      id
    }
  }
`;

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
        insertedAt,
        images {
          name,
          image
        },
        user {
          avatar
        },
        topic {
          image,
          imageName
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