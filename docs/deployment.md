# TravelDesk deployment

## Recommended MVP hosting

Use Railway first. It is the fastest path for this monorepo:

- Railway PostgreSQL database
- Railway service for `@traveldesk/api`
- Railway or Vercel service for `@traveldesk/web`

Vercel is strong for the web frontend, but the Nest API and Postgres still need a backend host. For fewer moving parts, put both web and API on Railway until the product is stable.

## Firebase keys

Create or open a Firebase project:

1. Go to `https://console.firebase.google.com`
2. Project settings → General → Your apps
3. Add a Web app if one does not exist
4. Copy these values from the Firebase config:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `appId`

Set them like this:

```env
FIREBASE_WEB_API_KEY="same value as apiKey"
NEXT_PUBLIC_FIREBASE_API_KEY="apiKey"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="authDomain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="projectId"
NEXT_PUBLIC_FIREBASE_APP_ID="appId"
```

Then enable providers:

1. Firebase Console → Authentication → Sign-in method
2. Enable Google
3. Enable Facebook
4. Enable Phone
5. Authentication → Settings → Authorized domains
6. Add:
   - `localhost`
   - your production web domain, for example `traveldesk.ph`
   - your hosted preview domain if using one

Facebook also needs a Facebook Developer app ID/secret added inside Firebase.

## Production environment variables

API service:

```env
DATABASE_URL="postgresql://..."
PORT=4000
WEB_ORIGIN="https://your-web-domain.com"
JWT_ACCESS_SECRET="generate-a-long-random-secret-at-least-32-chars"
COOKIE_DOMAIN=".your-web-domain.com"
FLIGHT_PROVIDER="mock"
FLIGHT_PROVIDER_API_KEY=""
FIREBASE_WEB_API_KEY="firebase-api-key"
```

Web service:

```env
NEXT_PUBLIC_API_URL="https://your-api-domain.com/api"
NEXT_PUBLIC_ROOT_DOMAIN="your-web-domain.com"
NEXT_PUBLIC_FIREBASE_API_KEY="firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="firebase-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="firebase-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="firebase-app-id"
```

If the API and web are on different root domains, leave `COOKIE_DOMAIN` empty and keep CORS `WEB_ORIGIN` exact.

## Build and start commands

API:

```bash
npm install
npm run build --workspace @traveldesk/api
npm run start:migrate --workspace @traveldesk/api
```

Web:

```bash
npm install
npm run build --workspace @traveldesk/web
npm run start --workspace @traveldesk/web
```

## Required before launch

- Run production database migrations.
- Add production domain to Firebase authorized domains.
- Add the production web URL to `WEB_ORIGIN`.
- Set a real `JWT_ACCESS_SECRET`.
- Replace mock payment and mock flight providers before taking real money.
