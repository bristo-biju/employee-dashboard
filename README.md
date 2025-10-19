# Employee Dashboard (SPA)

Simple single-page application that shows an Employee Dashboard (data from https://jsonplaceholder.typicode.com/users) and an Employee Form.

Files:
- `index.html` - main page
- `app.js` - SPA routing and logic
- `styles.css` - small custom styles

How to run:
- Option A: Open `index.html` in your browser.
- Option B: Run a simple static server (recommended to avoid CORS in some setups). Example using Python 3 in PowerShell:

```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Features:
- Navbar with Home and Employee Form links
- Dashboard loads users from the provided API and displays id, name, email in a table
- Employee form with Name, Designation, Location, Salary and client-side validation

Notes:
- This is a client-only demo. Form submissions are not sent to a backend.
