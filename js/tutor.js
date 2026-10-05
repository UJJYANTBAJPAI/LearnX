'use strict';
/* AI Tutor chat. Only sendAIMessage() in main.js needs replacing to go live. */
document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('messages'), input = document.getElementById('chatInput');
  let history = LX.get('chat', []);

  function addBubble(role, text) {
    const div = document.createElement('div');
    div.className = 'bubble ' + role;
    div.textContent = text; // textContent keeps text safe from HTML injection
    box.appendChild(div); box.scrollTop = box.scrollHeight;
    return div;
  }
  function reset(messages) {
    history = messages; LX.set('chat', history); box.innerHTML = '';
    if (!history.length) addBubble('ai', 'Hi! I am your LearnX AI Tutor. What would you like to learn today?');
    history.forEach(m => addBubble(m.role, m.text));
  }
  async function send(text) {
    text = text.trim(); if (!text) return;
    input.value = '';
    addBubble('user', text); history.push({ role: 'user', text });
    const typing = addBubble('ai', 'Thinking…');
    const { reply } = await sendAIMessage(text, history);
    typing.remove(); addBubble('ai', reply); history.push({ role: 'ai', text: reply });
    LX.set('chat', history);
  }
  document.getElementById('sendBtn').onclick = () => send(input.value);
  input.onkeydown = e => { if (e.key === 'Enter') send(input.value); };
  document.getElementById('clearBtn').onclick = () => reset([]);
  document.getElementById('newBtn').onclick = () => { reset([]); input.focus(); };
  document.querySelectorAll('.chip').forEach(c => c.onclick = () => send(c.textContent));

  reset(history);
  const q = new URLSearchParams(location.search).get('q'); // from the topbar search
  if (q) send(q);
});
