SOFT INNOVATIONS BACKEND ROUTES PACKAGE

Files:
- soft_innovations_routes.js       Express routes to paste into server.js
- soft_innovations_mysql.sql       MySQL CREATE TABLE statements
- server_js_corrections.md         Exact server.js changes and reasons
- frontend_route_changes.txt       Small frontend endpoint changes required

Important:
The existing QejaConnect server already has POST /contact. Soft Innovations therefore uses /soft/contact instead of replacing QejaConnect's endpoint.

The Soft project API uses:
  POST /soft/contact
  POST /soft/orders
  GET  /soft/orders/:orderCode
  GET  /admin/soft/orders
  PATCH /admin/soft/orders/:id/status
  GET  /admin/soft/contact-messages
  POST /admin/soft/contact-messages/:id/reply

Run the SQL before testing the routes.
