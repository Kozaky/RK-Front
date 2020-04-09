import { gql } from 'apollo-boost';

export const UPLOAD_AVATAR = gql`
  mutation($userUpdateDetails: UserUpdateDetails!) {
    updateUser(userUpdateDetails: $userUpdateDetails) {
      avatar
    }
  }
`;