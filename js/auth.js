'use strict';
/* Login + register validation (uses loginUser / registerUser from main.js) */
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
function setError(input, message) {
  const field = input.closest('.field');
  field.classList.toggle('error', Boolean(message));
  field.querySelector('.msg').textContent = message || '';
  return !message;
}
const passwordScore = pw => [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('authForm');
  if (!form) return;
  const isRegister = form.dataset.mode === 'register';
  const f = form.elements;

  document.querySelectorAll('.pw button').forEach(btn => btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
  }));
  if (isRegister) f.password.addEventListener('input', () => {
    const score = passwordScore(f.password.value), bar = document.querySelector('.strength i');
    bar.style.width = score * 25 + '%';
    bar.style.background = ['#e5484d', '#e5484d', '#e08a1e', '#4f9bd5', '#16a37a'][score];
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = setError(f.email, isEmail(f.email.value) ? '' : 'Enter a valid email address.');
    if (isRegister) {
      ok = setError(f.name, f.name.value.trim().length >= 2 ? '' : 'Enter your full name.') && ok;
      ok = setError(f.password, passwordScore(f.password.value) >= 3 ? '' : 'Use 8+ characters with a capital letter, number and symbol.') && ok;
      ok = setError(f.confirm, f.confirm.value === f.password.value ? '' : 'Passwords do not match.') && ok;
      ok = setError(f.goal, f.goal.value.trim() ? '' : 'Tell us what you want to learn.') && ok;
      ok = setError(f.terms, f.terms.checked ? '' : 'Accept the terms to continue.') && ok;
    } else {
      ok = setError(f.password, f.password.value.length >= 6 ? '' : 'Password must be at least 6 characters.') && ok;
    }
    if (!ok) return;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Please wait…';
    if (isRegister) await registerUser({ name: f.name.value.trim(), email: f.email.value, level: f.level.value, goal: f.goal.value.trim() });
    else await loginUser({ email: f.email.value, password: f.password.value });
    location.href = 'dashboard.html';
  });
});
