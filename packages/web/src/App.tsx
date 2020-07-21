import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import Routes from './Routes';

const App = () => {
  const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache({}),
    link: new HttpLink({
      uri: 'http://localhost:8001/graphql',
    }),
  });

  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
};

export default App;
