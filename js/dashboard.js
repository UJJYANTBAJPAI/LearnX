'use strict';
/* Dashboard greeting and study-plan checklist */
const DEFAULT_TASKS = [
  { id: 1, time: '09:00 AM', title: 'Review Arrays', mins: 30, done: true },
  { id: 2, time: '11:00 AM', title: 'Practice DSA Questions', mins: 45, done: true },
  { id: 3, time: '04:00 PM', title: 'Take Adaptive Quiz', mins: 20, done: false },
  { id: 4, time: '07:00 PM', title: 'Revision', mins: 30, done: false }
];
document.addEventListener('DOMContentLoaded', () => {
  const topbarTitle = document.querySelector('#topbar h1');
  const list = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');

  if (!topbarTitle || !list || !taskCount) return;

  const user = LX.get('user', { name: 'Student' });
  const hour = new Date().getHours();
  topbarTitle.textContent = `${hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'}, ${user.name.split(' ')[0]} 👋`;

  const tasks = LX.get('dashTasks', DEFAULT_TASKS);
  function draw() {
    list.innerHTML = tasks.map(t => `<label class="task ${t.done ? 'done' : ''}"><input type="checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''}><span><span class="t">${t.title}</span><small>${t.time} · ${t.mins} min</small></span></label>`).join('');
    taskCount.textContent = `Today's Progress: ${tasks.filter(t => t.done).length}/${tasks.length} Completed`;
    LX.set('dashTasks', tasks);
  }
  list.addEventListener('change', e => { tasks.find(t => t.id == e.target.dataset.id).done = e.target.checked; draw(); });
  draw();
});
