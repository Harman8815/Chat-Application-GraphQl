import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $email: String, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }
`;
export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!) {
    createGroup(name: $name) {
      id
      name
      isGroup
      members {
        id
        username
      }
      createdBy {
        id
        username
      }
    }
  }
`;
export const JOIN_GROUP = gql`
  mutation JoinGroup($name: String!) {
    joinGroup(name: $name) {
      id
      name
      isGroup
      members {
        id
        username
      }
      createdBy {
        id
        username
      }
    }
  }
`;
export const GET_OR_CREATE_CHAT = gql`
  mutation GetOrCreateChat($username: String!) {
    getOrCreateChat(username: $username) {
      id
      name
      isGroup
      members {
        id
        username
      }
      createdBy {
        id
        username
      }
    }
  }
`;
export const LEAVE_GROUP = gql`
  mutation LeaveGroup($roomId: ID!) {
    leaveGroup(roomId: $roomId) {
      id
      name
      members {
        id
        username
      }
      createdBy {
        id
        username
      }
    }
  }
`;

export const DELETE_GROUP = gql`
  mutation DeleteGroup($roomId: ID!) {
    deleteGroup(roomId: $roomId)
  }
`;