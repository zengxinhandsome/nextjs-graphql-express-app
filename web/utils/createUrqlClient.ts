import { message } from 'antd';
import { cacheExchange, dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';


export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ data, error }) => {
      if (error && error.message) {
        message.error(error.message);
        return;
      }

      const dataKey = Object.entries(data)[0][0];
      const code = dataKey && data[dataKey].code;
      const msg = dataKey && data[dataKey].message;
      if (code !== 0 && msg) {
        message.error(msg);
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => ({
  fetchOptions: {
    credentials: 'include' as const
  },
  url: 'http://localhost:4000/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange,
    errorExchange,
    fetchExchange,
  ],
  // exchanges: [errorExchange]
})