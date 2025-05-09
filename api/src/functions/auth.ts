import crypto from 'crypto';

import type { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { validate } from '@redwoodjs/api';
import type {
  DbAuthHandlerOptions,
  UserType,
} from '@redwoodjs/auth-dbauth-api';
import {
  DbAuthHandler,
  PasswordValidationError,
} from '@redwoodjs/auth-dbauth-api';
import { UserInputError } from '@redwoodjs/graphql-server'; // Import UserInputError

import { cookieName } from 'src/lib/auth';
import { db } from 'src/lib/db';
import { sendConfirmationEmail } from 'src/lib/emailTemplates/confirmEmail';
import { sendForgotPasswordEmail } from 'src/lib/emailTemplates/forgotPasswordEmail';
import { logger } from 'src/lib/logger';

// Get valid timezones once at module load
const validTimezones = new Set(Intl.supportedValuesOf('timeZone'));

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const forgotPasswordOptions: DbAuthHandlerOptions['forgotPassword'] = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`.
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    //
    // Note that this return value is sent to the client in *plain text*
    // so don't include anything you wouldn't want prying eyes to see. The
    // `user` here has been sanitized to only include the fields listed in
    // `allowedUserFields` so it should be safe to return as-is.
    handler: async (user, resetToken) => {
      // including the `resetToken`. The URL should look something like:
      // `http://localhost:8910/reset-password?resetToken=${resetToken}`

      const resetUrl = `${process.env.APP_URL}/reset-password?resetToken=${resetToken}`;
      await sendForgotPasswordEmail(user.email, user.name, resetUrl);
      logger.info(
        `Password reset email sent to ${user.email} with token ${resetToken}`
      );

      return 'Password reset email sent. Please check your inbox.';
    },

    // How long the resetToken is valid for, in seconds (default is 24 hours)
    expires: 60 * 60 * 24,

    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound: 'Account not found',
      // if the user somehow gets around client validation
      usernameRequired: 'Email address is required',
    },
  };

  const loginOptions: DbAuthHandlerOptions['login'] = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: user => {
      if (!user.emailVerified) {
        throw new Error('Please verify your email address before logging in.');
      }

      return user;
    },

    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Invalid username or password',
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      incorrectPassword: 'Invalid username or password',
    },

    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365 * 10,
  };

  const resetPasswordOptions: DbAuthHandlerOptions['resetPassword'] = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically log the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: _user => {
      return false;
    },

    // If `false` then the new password MUST be different from the current one
    allowReusedPassword: false,

    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired: 'Password reset URL is expired',
      // no user was found with the given resetToken
      resetTokenInvalid: 'Password reset URL is invalid',
      // the resetToken was not present in the URL
      resetTokenRequired: 'Password reset token is required',
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword: 'Must choose a new password',
    },
  };

  interface UserAttributes {
    name: string;
    timezone: string; // Add timezone attribute
  }

  const signupOptions: DbAuthHandlerOptions<
    UserType,
    UserAttributes
  >['signup'] = {
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: async ({
      username,
      hashedPassword,
      salt,
      userAttributes: { name, timezone }, // Destructure name and timezone
    }) => {
      // validate inputs
      validate(username, {
        presence: {
          message: 'Email is required',
        },
        email: {
          message: 'Invalid email address',
        },
      });
      validate(name, {
        // Use the destructured 'name' variable
        presence: {
          message: 'Name is required',
        },
        length: {
          min: 2,
          max: 100,
          message: 'Name must be between 2 and 100 characters',
        },
      });
      validate(timezone, {
        // Validate timezone presence
        presence: { message: 'Timezone is required' },
      });

      // Validate timezone value against known IANA identifiers
      if (!validTimezones.has(timezone)) {
        throw new UserInputError('Invalid timezone selected');
      }

      // Generate a confirmation token and expiry date
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user in the database
      const user = await db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt,
          name: name, // Use destructured name
          timezone: timezone, // Add timezone
          emailVerificationToken: confirmationToken,
          emailVerificationTokenExpiresAt: tokenExpiry,
        },
        select: {
          email: true,
          name: true,
          timezone: true, // Select timezone
        },
      });

      // TODO: add rate limiting to prevent abuse
      // Send confirmation email
      const confirmationUrl = `${process.env.APP_URL}/confirm-email?token=${confirmationToken}`;
      await sendConfirmationEmail(user.email, confirmationUrl, user.name);
      logger.info(
        `Confirmation email sent to ${username} with token ${confirmationToken}`
      );

      return 'Confirmation email sent. Please check your inbox.';
    },

    // Include any format checks for password here. Return `true` if the
    // password is valid, otherwise throw a `PasswordValidationError`.
    // Import the error along with `DbAuthHandler` from `@redwoodjs/api` above.
    passwordValidation: password => {
      if (password.length < 8) {
        throw new PasswordValidationError(
          'Password must be at least 8 characters'
        );
      }

      if (!password.match(/[A-Z]/)) {
        throw new PasswordValidationError(
          'Password must contain at least one uppercase letter'
        );
      }

      if (!password.match(/[a-z]/)) {
        throw new PasswordValidationError(
          'Password must contain at least one lowercase letter'
        );
      }
      if (!password.match(/[0-9]/)) {
        throw new PasswordValidationError(
          'Password must contain at least one number'
        );
      }

      return true;
    },

    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Email is already taken',
    },
  };

  const authHandler = new DbAuthHandler(event, context, {
    // Provide prisma db client
    db: db,

    // The name of the property you'd call on `db` to access your user table.
    // i.e. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',

    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },

    // A list of fields on your user object that are safe to return to the
    // client when invoking a handler that returns a user (like forgotPassword
    // and signup). This list should be as small as possible to be sure not to
    // leak any sensitive information to the client.
    allowedUserFields: ['id', 'email', 'name', 'timezone'], // Add timezone here too

    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Lax',
        Secure: process.env.NODE_ENV !== 'development',

        // If you need to allow other domains (besides the api side) access to
        // the dbAuth session cookie:
        // Domain: 'example.com',
      },
      name: cookieName,
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  });

  return await authHandler.invoke();
};
