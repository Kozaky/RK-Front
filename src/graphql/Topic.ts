import { gql } from 'apollo-boost';

export const TOPIC = gql`
  query($id: Int!) {
    topic(id: $id) {
      title,
      description
    }
  }
`;

export const TOPIC_IMAGE = gql`
  query($id: Int!) {
    topic(id: $id) {
      image,
      imageName
    }
  }
`;

export const TOPICS = gql`
query($filter: TopicFilter, $order: SortOrder, $page: Int!, $perPage: Int!) {
  topics(filter: $filter, order: $order, page: $page, perPage: $perPage) {
    metadata {
      page,
      totalPages,
      totalResults
    },
    topics {
      id,
      title,
      description
      image
    }
  }
}
`;

export const DELETE_TOPIC = gql`
  mutation($id: Int!) {
    deleteTopic(id: $id) {
      id
    }
  }
`;

export const CREATE_TOPIC = gql`
  mutation($topicDetails: TopicDetails!) {
    createTopic(topicDetails: $topicDetails) {
      id
    }
  }
`;

export const UPDATE_TOPIC = gql`
  mutation($updateTopicDetails: UpdateTopicDetails!) {
    updateTopic(updateTopicDetails: $updateTopicDetails) {
      id
    }
  }
`;
