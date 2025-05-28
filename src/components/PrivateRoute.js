import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // match your file name
import { useAuthState } from 'react-firebase-hooks/auth';

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
// This code defines a PrivateRoute component that checks if a user is authenticated using Firebase Authentication. If the user is authenticated, it renders the children components (protected routes). If not, it redirects the user to the login page ("/"). The component uses the useAuthState hook from the react-firebase-hooks library to manage the authentication state and loading status. While the authentication state is being determined, it displays a loading message.
// This component is typically used to wrap around routes that should only be accessible to authenticated users, ensuring that unauthorized users are redirected to the login page.