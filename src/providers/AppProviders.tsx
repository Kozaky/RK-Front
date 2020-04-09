import React, { ReactNode } from 'react';
import { AuthProvider } from './authProvider/AuthProvider';
// @ts-ignore
import { createLink } from 'apollo-absinthe-upload-link';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';

type Props = {
  children: ReactNode
};

const AppProviders = ({ children }: Props) => {

  const authLink = setContext((_, { headers }) => {
    const currentUserStr = localStorage.getItem('currentUser');
    const currentUser = currentUserStr !== null ? JSON.parse(currentUserStr) : null

    return {
      headers: {
        ...headers,
        authorization: currentUser !== null ? `Bearer ${currentUser.token}` : "",
      }
    }
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      authLink,
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ));
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),
      createLink({
        uri: 'http://localhost:4000/graphiql'
      })
    ]),
    cache: new InMemoryCache()
  });

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
