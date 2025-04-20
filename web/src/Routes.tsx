// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { PrivateSet, Route, Router, Set } from '@redwoodjs/router';

import { useAuth } from './auth';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import BaseLayout from './layouts/BaseLayout/BaseLayout';
import ProvidersLayout from './layouts/ProvidersLayout/ProvidersLayout';
import SettingLayout from './layouts/SettingsLayout/SettingsLayout';

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={ProvidersLayout}>
        <Set wrap={BaseLayout}>
          <Route path="/" page={HomePage} name="home" />
          <Route path="/media/{slug}" page={MediaPage} name="media" />
          <Route path="/activity" page={ActivityPage} name="activity" />
          <Route
            path="/custom-media"
            page={CustomMediaPage}
            name="customMedia"
          />
          <PrivateSet wrap={SettingLayout} unauthenticated="login">
            <Route
              path="/settings"
              page={AccountSettingsPage}
              name="accountSettings"
            />
            <Route
              path="/settings/language"
              page={LanguageSettingsPage}
              name="languageSettings"
            />
          </PrivateSet>
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
          <Route
            path="/confirm-email"
            page={ConfirmEmailPage}
            name="confirmEmail"
          />
        </Set>
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  );
};

export default Routes;
