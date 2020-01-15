import { gql } from 'apollo-boost';

export const LOGIN = gql`
  mutation($email: String, $password: String) {
    signIn(email: $email, password: $password)
  }
`;
