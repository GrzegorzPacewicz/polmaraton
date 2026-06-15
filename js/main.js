import { getDone, saveDone } from './state.js';
import { renderAll } from './render.js';
import { updateCountdown } from './countdown.js';

updateCountdown();
renderAll();

const current = document.querySelector('.week-card.current');
if (current) current.scrollIntoView({ behavior: 'smooth', block: 'start' });

document.getElementById('plan').addEventListener('click', e => {
  const header = e.target.closest('[data-action="toggle-week"]');
  if (header) {
    const card   = header.closest('.week-card');
    const isOpen = card.classList.toggle('open');
    header.setAttribute('aria-expanded', String(isOpen));
    return;
  }

  const btn = e.target.closest('[data-action="toggle-done"]');
  if (btn) {
    e.stopPropagation();
    const id  = btn.dataset.weekId;
    let done  = getDone();
    done = done.includes(id) ? done.filter(i => i !== id) : [...done, id];
    saveDone(done);
    renderAll();
  }
});
