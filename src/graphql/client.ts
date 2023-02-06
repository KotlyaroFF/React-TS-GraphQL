import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { REFRESH_TOKEN } from "./mutations";

// eslint-disable-next-line import/no-mutable-exports
export let client: ApolloClient<NormalizedCacheObject>;
const backendUrl = `${process.env.REACT_APP_BACKEND_URL}/graphql`;
const HTTPProtocol = process.env.REACT_APP_HTTP_PROTOKOL;
const WSProtocol = process.env.REACT_APP_WS_PROTOKOL;

const getNewToken = async () => {
  const res = await client.mutate({
    mutation: REFRESH_TOKEN,
    variables: { token: localStorage.getItem("refreshToken") || null },
  });

  localStorage.setItem("auth", res.data.refreshToken.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken.refreshToken);
  return res.data.refreshToken.accessToken;
};

export const wsClient = new SubscriptionClient(
  `${WSProtocol}://${backendUrl}`,
  {
    lazy: true,
    connectionParams: async () => {
      const getToken = () => localStorage.getItem("auth") || null;
      const token = getToken();
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  }
);

const wsLink = new WebSocketLink(wsClient);
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err?.message === "Unauthorized") {
        if (!localStorage.getItem("refreshToken")) {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("auth");
          // window.location.reload();
          return;
        }
        if (
          err?.message === "Unauthorized" &&
          localStorage.getItem("refreshToken")
        ) {
          return fromPromise(
            getNewToken().catch(() => {
              localStorage.removeItem("auth");
              localStorage.removeItem("refreshToken");
              window.location.reload();
            })
          )
            .filter(Boolean)
            .flatMap((accessToken) => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken}`,
                },
              });

              return forward(operation);
            });
        }
      }
    }
  }
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem("auth") || null}`,
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: `${HTTPProtocol}://${backendUrl}`,
  credentials: "same-origin",
});

client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as unknown as never;
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    ),
  ]),
  cache: new InMemoryCache(),
  // queryDeduplication: true,
});
