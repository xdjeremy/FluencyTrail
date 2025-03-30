// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Route, Router, Set } from '@redwoodjs/router';
import { useAuth } from './auth';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import ProvidersLayout from './layouts/ProvidersLayout/ProvidersLayout';

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={ProvidersLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Set wrap={AuthLayout}>
          <Route path="/login" page={LoginPage} name="login" />
          <Route path="/signup" page={SignupPage} name="signup" />
          <Route
            path="/forgot-password"
            page={ForgotPasswordPage}
            name="forgotPassword"
          />
          <Route
            path="/reset-password"
            page={ResetPasswordPage}
            name="resetPassword"
          />
        </Set>
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  );
};

export default Routes;
