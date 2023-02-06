import { gql } from "@apollo/client";

export const CREATE_WORKSPACE = gql`
  mutation createWorkspace($name: String!) {
    createWorkspace(data: { name: $name }) {
      id
      createdAt
      updatedAt
      members {
        id
        firstname
        lastname
        status
        email
      }
      ownerId
      name
      subscription
    }
  }
`;
