// Simple SPA router and app logic
const routes = {
  '/home': renderHome,
  '/form': renderForm,
  '': renderHome,
};

const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const appEl = document.getElementById('app');

function setActiveLink(path){
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const id = path === '/form' ? 'link-form' : 'link-home';
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
}

function router(){
  const hash = location.hash.replace('#','') || '/home';
  const route = routes[hash] ? hash : '/home';
  setActiveLink(route);
  routes[route]();
}

// Home / Dashboard
function renderHome(){
  appEl.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h4 mb-0">Employee Dashboard</h1>
      <button class="btn btn-sm btn-outline-secondary" id="refresh-btn">Refresh</button>
    </div>
    <div id="alert-area"></div>
    <div id="content-area">
      <div class="text-center py-5" id="loading">Loading...</div>
    </div>
  `;

  document.getElementById('refresh-btn').addEventListener('click', fetchAndRenderUsers);
  fetchAndRenderUsers();
}

async function fetchAndRenderUsers(){
  const content = document.getElementById('content-area');
  const alertArea = document.getElementById('alert-area');
  alertArea.innerHTML = '';
  content.innerHTML = '<div class="text-center py-5" id="loading">Loading...</div>';
  try{
    const res = await fetch(apiUrl);
    if(!res.ok) throw new Error(`API error: ${res.status}`);
    const users = await res.json();
    // Render table
    const tableHtml = `
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.email)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    content.innerHTML = tableHtml;
  }catch(err){
    content.innerHTML = '';
    alertArea.innerHTML = `<div class="alert alert-danger">Failed to load users: ${escapeHtml(err.message)}</div>`;
  }
}

// Form
function renderForm(){
  appEl.innerHTML = `
    <h1 class="h4 mb-3">Employee Form</h1>
    <div id="form-alert"></div>
    <form id="employee-form" novalidate>
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" id="name" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Designation</label>
        <input type="text" class="form-control" id="designation" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Location</label>
        <input type="text" class="form-control" id="location" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Salary</label>
        <input type="number" class="form-control" id="salary" required min="0">
      </div>
      <button class="btn btn-primary" type="submit">Save</button>
    </form>
  `;

  const form = document.getElementById('employee-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit();
  });
}

function handleFormSubmit(){
  const alertEl = document.getElementById('form-alert');
  alertEl.innerHTML = '';
  const name = document.getElementById('name').value.trim();
  const designation = document.getElementById('designation').value.trim();
  const location = document.getElementById('location').value.trim();
  const salary = document.getElementById('salary').value.trim();

  const errors = [];
  if(!name) errors.push('Name is required');
  if(!designation) errors.push('Designation is required');
  if(!location) errors.push('Location is required');
  if(!salary) errors.push('Salary is required');
  if(salary && isNaN(Number(salary))) errors.push('Salary must be a number');

  if(errors.length){
    alertEl.innerHTML = `<div class="alert alert-danger">${errors.map(e => `<div>${escapeHtml(e)}</div>`).join('')}</div>`;
    return;
  }

  // Simulate save
  alertEl.innerHTML = `<div class="alert alert-success">Employee <strong>${escapeHtml(name)}</strong> saved successfully (client-only).</div>`;
  document.getElementById('employee-form').reset();
}

// Utilities
function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#39;");
}

// Init
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  // Ensure default route
  if(!location.hash) location.hash = '#/home';
  router();
});
