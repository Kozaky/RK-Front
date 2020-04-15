import { gql } from 'apollo-boost';

export const USERS = gql`
  query($filter: UserFilter, $order: SortOrder, $page: Int!, $perPage: Int!) {
    users(filter: $filter, order: $order, page: $page, perPage: $perPage) {
      metadata {
        page,
        totalPages,
        totalResults
      },
      users {
        id,
        fullName,
        email,
        role {
          type
        }
      }
    }
  }
`;

export const ROLES = gql`
  query {
    roles {
      id,
      type
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation($userUpdateDetails: UserUpdateDetails!) {
    updateUser(userUpdateDetails: $userUpdateDetails) {
      avatar
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation($userUpdateRoleDetails: UserUpdateRoleDetails!) {
    updateUsersRole(userUpdateRoleDetails: $userUpdateRoleDetails) {
      id
    }
  }
`;

