# Soft Innovations — server.js corrections

https://github.com/eliyasande65-lang/soft/soft/public/index.html
https://eliyasande65-lang.github.io/soft/soft/public/index.html
Your current QejaConnect server already has `express`, `mysql2`, `cors`, `zod`, `adminAuth`, `auth`, `generalLimiter`, `dbPromise`, and the router setup. The existing file also already mounts `router` with `app.use(router)`. The Soft Innovations routes therefore do not need another Express app or another MySQL connection.

## 1. Install requirements

No new package is required for these Soft Innovations routes. They use packages you already have.

## 2. Keep the API base

Frontend API base should remain:

```js
const API = 'https://qeja-backend-azkf.onrender.com';
```

## 3. Add the route file

Paste the contents of `soft_innovations_routes.js` into `server.js` after your existing middleware/auth/database setup and before the global error handler. It can be placed before `app.use(router)` or immediately after it; keeping all route declarations before the global error handler is the important part.

## 4. IMPORTANT — do not use `/contact` for Soft Innovations

Your existing QejaConnect server already has:

```js
app.post('/contact', auth, validate(messageSchema), ...)
```

That endpoint requires a JWT and only accepts `message`. The Soft Innovations public form sends `name`, `email`, and `message`, so it would fail against that route.

The new Soft Innovations route is:

```text
POST /soft/contact
```

Change the Soft frontend `main.js` from:

```js
await api('/contact', {
```

to:

```js
await api('/soft/contact', {
```

## 5. Change Soft order route

The Soft frontend currently posts to:

```text
POST /orders
```

Change it to:

```text
POST /soft/orders
```

This prevents collisions with any future QejaConnect `/orders` route.

In `public/js/main.js`:

```js
await api('/soft/orders', {
```

In `public/plans/js/planform.js`, replace the hard-coded fetch URL with:

```js
await fetch('https://qeja-backend-azkf.onrender.com/soft/orders', {
```

Better long-term: import/use the same `API` constant instead of repeating the URL.

## 6. Change Soft tracking route

The frontend currently requests:

```text
GET /orders/:id
```

Change it to:

```text
GET /soft/orders/:id
```

In `track.html`:

```js
const r = await api('/soft/orders/' + encodeURIComponent(id));
```

## 7. CORS

Your existing CORS configuration allows:

```js
const allowedOrigins = [
  'https://eliyasande65-lang.github.io'
];
```

That is correct if the Soft Innovations frontend is served from the same GitHub Pages origin. If you later move Soft Innovations to another domain, add that exact origin to `allowedOrigins`.

Do NOT use `origin: '*'` together with `credentials: true`.

## 8. JSON body size

Your current:

```js
app.use(express.json());
```

is sufficient for the current Soft forms. Do not increase it unnecessarily.

## 9. Existing `/contact` route

Do not delete or replace the QejaConnect `/contact` route. QejaConnect uses it for authenticated support messages. Soft Innovations now has its own public `/soft/contact` endpoint.

## 10. Security correction for project tracking

The public tracking endpoint intentionally exposes only customer-safe information. It does NOT return the customer's email, full description, inclusions, price, or internal/admin information.

## 11. Admin routes

The new routes use your existing `adminAuth` middleware:

```text
GET   /admin/soft/orders
PATCH /admin/soft/orders/:id/status
GET   /admin/soft/contact-messages
POST  /admin/soft/contact-messages/:id/reply
```

They use the same `x-admin-secret` mechanism already used by your QejaConnect admin routes.

## 12. One unrelated correction noticed in your current server.js

Your existing QejaConnect code mixes callback-style `db.query(...)` and promise-style `dbPromise.query(...)`. This works, but for new development prefer `dbPromise.query(...)` consistently. The Soft routes already do this.

## 13. Run SQL first

Run `soft_innovations_mysql.sql` in the same MySQL database configured by:

```env
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=...
```

Then deploy the updated `server.js` to Render.

## 14. Expected API flow

Public contact:

```text
POST https://qeja-backend-azkf.onrender.com/soft/contact
```

Project request:

```text
POST https://qeja-backend-azkf.onrender.com/soft/orders
```

Tracking:

```text
GET https://qeja-backend-azkf.onrender.com/soft/orders/SI-1001
```

Admin order list:

```text
GET https://qeja-backend-azkf.onrender.com/admin/soft/orders
x-admin-secret: YOUR_ADMIN_SECRET
```

Admin status update:

```text
PATCH https://qeja-backend-azkf.onrender.com/admin/soft/orders/1/status
x-admin-secret: YOUR_ADMIN_SECRET
Content-Type: application/json
```

Body:

```json
{
  "status": "development",
  "customer_message": "Development is currently in progress."
}
```
