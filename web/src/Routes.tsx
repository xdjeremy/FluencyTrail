// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Route, Router, Set } from '@redwoodjs/router';

import ScaffoldLayout from 'src/layouts/ScaffoldLayout';

import { useAuth } from './auth';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import BaseLayout from './layouts/BaseLayout/BaseLayout';
import ProvidersLayout from './layouts/ProvidersLayout/ProvidersLayout';

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set
        wrap={ScaffoldLayout}
        title="Activities"
        titleTo="activities"
        buttonLabel="New Activity"
        buttonTo="newActivity"
      >
        <Route
          path="/activities/{id}/edit"
          page={ActivityEditActivityPage}
          name="editActivity"
        />
        <Route
          path="/activities/{id}"
          page={ActivityActivityPage}
          name="activity"
        />
        <Route
          path="/activities"
          page={ActivityActivitiesPage}
          name="activities"
        />
      </Set>
      <Set wrap={ProvidersLayout}>
        <Set wrap={BaseLayout}>
          <Route path="/" page={HomePage} name="home" />
          <Route path="/media/{slug}" page={MediaPage} name="media" />
        </Set>
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
