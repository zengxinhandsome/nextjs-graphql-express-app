export const createUrqlClient = (ssrExchange: any) => ({
  fetchOptions: {
    credentials: 'include' as const
  },
  url: 'http://localhost:4000/graphql'
})