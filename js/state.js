const PLAN_START = new Date(2026, 5, 8);
const RACE_DATE  = new Date(2026, 8, 27);

export function getCurrentWeekIdx() {
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.floor((today - PLAN_START) / 86400000);
  return diff < 0 ? -1 : Math.floor(diff / 7);
}

export function getDaysTo() {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((RACE_DATE - today) / 86400000));
}

export function getDone() {
  try { return JSON.parse(localStorage.getItem('gdansk_done') || '[]'); } catch { return []; }
}

export function saveDone(arr) {
  try { localStorage.setItem('gdansk_done', JSON.stringify(arr)); } catch {}
}
