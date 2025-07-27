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
