import { gql } from 'apollo-boost';

export const CREATE_REKLAMA = gql`
  mutation($reklamaDetails: ReklamaDetails!) {
    createReklama(reklamaDetails: $reklamaDetails) {
      id
    }
  }
`;

export const UPDATE_REKLAMA = gql`
  mutation($updateReklamaDetails: UpdateReklamaDetails!) {
    updateReklama(updateReklamaDetails: $updateReklamaDetails) {
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
        user {
          email
        },
        location {
          name
        }
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
      },
      location {
        id,
        name
      }
    }
  }
`;

export const DELETE_REKLAMA = gql`
  mutation($id: Int!) {
    deleteReklama(id: $id) {
      id
    }
  }
`;

export const LOCATIONS = gql`
  query {
    locations {
      id,
      name
    }
  }
`;
