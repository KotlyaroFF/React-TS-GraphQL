import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation createProject(
    $folderId: String
    $category: ID
    $workspaceId: ID!
    $toolsId: ID
  ) {
    createProject(
      data: {
        category: $category
        workspaceId: $workspaceId
        folderId: $folderId
        toolsId: $toolsId
      }
    ) {
      id
      createdAt
      updatedAt
      name
      tool
      categories
      meta {
        key
        value
      }
    }
  }
`;
