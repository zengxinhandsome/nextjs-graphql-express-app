import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { createClient, Provider } from 'urql';
import 'antd/dist/antd.css';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  }
});

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
