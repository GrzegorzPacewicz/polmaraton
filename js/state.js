import { plans, DEFAULT_PLAN } from './plans/index.js';

let plan = null;

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function today() {
  const t = new Date(); t.setHours(0,0,0,0);
  return t;
}

export async function loadPlan() {
  const requested = new URLSearchParams(location.search).get('plan');
  const entry = plans.find(p => p.id === requested) || plans.find(p => p.id === DEFAULT_PLAN);
  const mod = await entry.load();
  plan = { meta: mod.meta, phases: mod.phases };
  return plan;
}

export function getPlan() {
  return plan;
}

export function getOtherPlans() {
  return plans.filter(p => p.id !== plan.meta.id);
}

export function getQuality(phase, week) {
  return week.quality ?? phase.quality ?? plan.meta.quality ?? null;
}

export function getCurrentWeekIdx() {
  const diff = Math.floor((today() - parseDate(plan.meta.planStart)) / 86400000);
  return diff < 0 ? -1 : Math.floor(diff / 7);
}

export function getDaysTo() {
  return Math.max(0, Math.ceil((parseDate(plan.meta.raceDate) - today()) / 86400000));
}

function storageKey() {
  return plan.meta.storageKey || `done_${plan.meta.id}`;
}

export function getDone() {
  try { return JSON.parse(localStorage.getItem(storageKey()) || '[]'); } catch { return []; }
}

export function saveDone(arr) {
  try { localStorage.setItem(storageKey(), JSON.stringify(arr)); } catch {}
}
