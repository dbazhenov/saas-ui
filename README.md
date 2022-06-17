# saas-ui

[![CI GitHub Action status](https://github.com/percona-platform/saas-ui/workflows/CI/badge.svg?branch=main)](https://github.com/percona-platform/saas-ui/actions?query=workflow%3ACI+branch%3Amain)

SaaS UI.

### Developing locally

Install dependencies:

`make init`

Run a local dev environment with one command:

`make dev`

### Running E2E tests locally

To execute E2E tests locally you need to set related environment variables first. By default `.env.local` file is used as a source,
so you have to create it from `.env`:

```sh
cp .env .env.local
```

Then you should update `.env.local` with your own secrets.

To execute E2E tests just use `npm run cy:run`

### Store rules

1. By extension of the definition of the global store, reducers are also global and we want to keep
   them in one place (contrary to some practices, where reducers are kept close to the components).
2. All reducers should be typed.
3. The store is merely a combination of distinct store slices, every slice has its own key.
4. Action names should describe events that occured rather than look like setters.
5. Every action must obey the interface { type: string; payload?: PayloadType }. The payload should be strongly typed.
6. Action helpers are using either [createAction](https://redux-toolkit.js.org/api/createAction) if synchronous, or [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) otherwise

### Integration with Okta

We are using several dependencies to integrate with by Okta, namely:

- [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js)
- [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget)
- [Okta React SDK](https://github.com/okta/okta-react)

From the authorization standpoint, we leverage `OAuth 2.0 Authorization Code Flow` with [PKCE](https://tools.ietf.org/html/rfc7636).
The `UseOktaAuth` react hook provides access to the auth API, while components like `SecureRoute` and `LoginCallback` help automate the authz flow.

In order to authorize the web client, we set up a dedicated authorization server with Okta, which handles the process of issuing, verifying, reissuing and revoking the access tokens. A separate Okta application called 'Portal FE' is configured to handle sign-in and sign-out redirect URIs.
