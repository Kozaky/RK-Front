import React from 'react';
import { useAuth } from '../providers/authProvider/AuthProvider';
import { Route, Redirect, RouteProps } from 'react-router-dom';

type AuthorizedProps = {
  authorization: string,
  children: React.ReactNode
} & RouteProps
const AuthorizedRoute = ({ authorization, children, ...rest }: AuthorizedProps) => {

  const { currentUser } = useAuth()!;

  return (
    <Route {...rest}>
      {currentUser?.role.type === authorization
        ? children
        : <Redirect to="/" />
      }
    </Route>
  );
}

export default AuthorizedRoute;