import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphiql'
});

type Props = {
  children: ReactNode
};

function AppProviders({ children }: Props) {
  return (
    <BrowserRouter>
      <ApolloProvider client={ client }>
        <AuthProvider>
          { children }
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
