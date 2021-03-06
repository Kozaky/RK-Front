import { gql } from 'apollo-boost';

export const LOG_IN = gql`
  mutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id,
      email,
      full_name,
      avatar,
      role {
        type
      },
      token
    }
  }
`;

export const SIGN_UP = gql`
  mutation($userDetails: UserDetails!) {
    createUser(userDetails: $userDetails ) {
      id
    }
  }
`;

export const LOG_OUT = gql`
  mutation {
    signOut
  }
`;

