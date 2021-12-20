# graphql-codegen-typescript-document-nodes-typed

This plugin creates a typed document node export for an external GraphQL document.

## Example

Schema:
```graphql
type Query {
    user(id: ID!): User!
}

type User {
    id: ID!
    username: String!
    email: String!
}
```

Operation document:
```graphql
query User {
    user(id: 1) {
        id
        username
        email
    }
}
```

The `@graphql-codegen/typescript-operations` plugin would create types for the query variables and result:
```ts
export type UserQueryVariables = Types.Exact<{ [key: string]: never; }>;

export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'username' | 'email'>
  ) }
);
```

This plugin adds a type export for the query itself:
```ts
import { DocumentNode } from 'graphql-typed';

export const User: DocumentNode<UserQuery, UserQueryVariables>;
```

When used with the `graphql-tag/loader` GraphQL loader in webpack, this `DocumentNode` export matches the runtime export of the query itself.

## Differences to other plugins

### `@graphql-codegen/typescript-document-nodes`

https://www.graphql-code-generator.com/plugins/typescript-document-nodes
https://github.com/dotansimha/graphql-code-generator/tree/@graphql-codegen/typescript-document-nodes@2.2.1/packages/plugins/typescript/document-nodes

This plugin generates a `DocumentNode` export which doesn't have the generic query/variables types (the main `DocumentNode` type from `graphql` doesn't use them).

It doesn't add this export with `external` mode (i.e. the source of the operation becomes inlined by codegen).

### `@graphql-codegen/typed-document-node`

https://www.graphql-code-generator.com/plugins/typed-document-node
https://github.com/dotansimha/graphql-code-generator/tree/@graphql-codegen/typed-document-node@2.2.1/packages/plugins/typescript/typed-document-node

This plugin generates a `DocumentNode` with the generic query/variables types.

It currently doesn't support this without creating a pre-compiled query export too (https://github.com/dotansimha/graphql-code-generator/issues/7242).
