import { Mutation, Query, Subscription } from "../graphql/types";

export type QueryType<K extends keyof Query> = {
  [P in K]: Query[K];
};

export type MutationType<K extends keyof Mutation> = {
  [P in K]: Mutation[K];
};

export type SubscriptionType<K extends keyof Subscription> = {
  [P in K]: Subscription[K];
};
