import { getDaysTo } from './state.js';

export function updateCountdown() {
  const days = getDaysTo();
  document.getElementById('cd-days').textContent  = days;
  document.getElementById('cd-weeks').textContent = Math.ceil(days / 7);
}

setInterval(updateCountdown, 60000);
