import { gql } from 'apollo-boost';

export const MESSAGES = gql`
  query($id: Int!) {
    reklama(id: $id) {
      id,
      messages {
        id, 
        content,
        user {
          id,
          avatar,
          fullName
        },
        insertedAt
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation($messageDetails: MessageDetails!) {
    createMessage(messageDetails: $messageDetails) {
      id
    }
  }
`;