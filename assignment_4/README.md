# CRUD SPA — Posts (JSONPlaceholder)

This is a single-page CRUD app (Create, Read, Update, Delete) built with HTML, Bootstrap 5, jQuery, and AJAX against the free JSONPlaceholder REST API.

Files
- `index.html` — main page
- `assets/js/app.js` — logic for AJAX calls and DOM updates
- `assets/css/style.css` — minimal styles

How to run
1. Open `index.html` in your browser (double-click or open from your editor). No server needed.
2. The app fetches posts from JSONPlaceholder and displays the first 20 posts.
3. Click "New Post" to create a post (uses POST). The created post is prepended to the table.
4. Click "Edit" to modify a post (uses PUT). The row updates dynamically.
5. Click "Delete" to remove a post (uses DELETE). The row is removed from the table.

Notes
- JSONPlaceholder is a fake API; POST/PUT/DELETE requests will succeed but won't change the backend persistent data. The app updates the UI based on API responses so it behaves like a real CRUD app.
- No page reloads are used — all updates are dynamic via AJAX.
