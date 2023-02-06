import { gql } from "@apollo/client";

export const UPDATE_PROJECT = gql`
  mutation updateProject(
    $projectId: ID!
    $name: String
    $meta: [MetaInput!]
    $tool: ID
    $content: String
  ) {
    updateProject(
      data: {
        projectId: $projectId
        name: $name
        meta: $meta
        tool: $tool
        content: $content
      }
    ) {
      id
      name
      categories
      content
      tool
      meta {
        value
        key
      }
    }
  }
`;
