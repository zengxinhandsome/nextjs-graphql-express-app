import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type HelloResponse = {
  __typename?: 'HelloResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type MeResponse = {
  __typename?: 'MeResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<User>;
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: CreatePostResponse;
  deletePost: DeletePostResponse;
  deleteUser: DeleteUserResponse;
  login: LoginResponse;
  logout: LogoutResponse;
  register: RegisterResponse;
  updatePost: UpdatePostResponse;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPost: GetPostResponse;
  hello: HelloResponse;
  me: MeResponse;
  posts: PostResponse;
  users: UsersResponse;
};


export type QueryGetPostArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<User>>;
  message?: Maybe<Scalars['String']>;
};

export type CreatePostResponse = {
  __typename?: 'createPostResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<Post>;
  message?: Maybe<Scalars['String']>;
};

export type DeletePostResponse = {
  __typename?: 'deletePostResponse';
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
};

export type DeleteUserResponse = {
  __typename?: 'deleteUserResponse';
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
};

export type GetPostResponse = {
  __typename?: 'getPostResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<Post>;
  message?: Maybe<Scalars['String']>;
};

export type LoginResponse = {
  __typename?: 'loginResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<User>;
  message?: Maybe<Scalars['String']>;
};

export type LogoutResponse = {
  __typename?: 'logoutResponse';
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
};

export type PostResponse = {
  __typename?: 'postResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Post>>;
  message?: Maybe<Scalars['String']>;
};

export type RegisterResponse = {
  __typename?: 'registerResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<User>;
  message?: Maybe<Scalars['String']>;
};

export type UpdatePostResponse = {
  __typename?: 'updatePostResponse';
  code?: Maybe<Scalars['Int']>;
  data?: Maybe<Post>;
  message?: Maybe<Scalars['String']>;
};

export type RegularUserFragment = { __typename?: 'User', id: number, username: string };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'loginResponse', code?: number | null | undefined, message?: string | null | undefined, data?: { __typename?: 'User', createdAt: string, id: number, username: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'logoutResponse', code?: number | null | undefined, message?: string | null | undefined } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'registerResponse', code?: number | null | undefined, message?: string | null | undefined, data?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'MeResponse', code?: number | null | undefined, message?: string | null | undefined, data?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'postResponse', code?: number | null | undefined, message?: string | null | undefined, data?: Array<{ __typename?: 'Post', id: number, title: string, createdAt: string, updatedAt: string }> | null | undefined } };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    code
    message
    data {
      createdAt
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    code
    message
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    code
    message
    data {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    code
    message
    data {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    code
    message
    data {
      id
      title
      createdAt
      updatedAt
    }
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};