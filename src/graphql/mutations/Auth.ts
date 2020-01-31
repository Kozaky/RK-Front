import { gql } from 'apollo-boost';

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

export const SIGNUP = gql`
  mutation( $userDetails: UserDetails!) {
    createUser( userDetails: $userDetails ) {
      id
    }
  }
`;

