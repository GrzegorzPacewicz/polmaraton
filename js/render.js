import { phases } from './data.js';
import { getDone, getCurrentWeekIdx } from './state.js';

const DAY_ORDER = ['Pn','Wt','Śr','Czw','Pt','Sob','Nd'];
const DAY_NAMES = {
  'Pn':'Poniedziałek','Wt':'Wtorek','Śr':'Środa',
  'Czw':'Czwartek','Pt':'Piątek','Sob':'Sobota','Nd':'Niedziela'
};
const BADGE_MAP = {
  regen: ['badge-regen','⚡ Regeneracja'],
  jak:   ['badge-jak','Jakościowy'],
  bud:   ['badge-bud','Budowanie'],
  szczyt:['badge-szczyt','Szczyt'],
  test:  ['badge-test','🏁 Test 10K'],
  start: ['badge-start','🏁 Start'],
};

export function renderDayCell(dayKey, content, weekTyp) {
  const cell = document.createElement('div');
  cell.setAttribute('role', 'article');

  if (!content) {
    cell.className = 'day-cell rest';
    cell.innerHTML = `<div class="day-name">${DAY_NAMES[dayKey]}</div><div class="day-content" style="color:var(--muted);font-size:11px">odpoczynek</div>`;
    return cell;
  }

  const isKey  = dayKey === 'Czw' || (dayKey === 'Nd' && (weekTyp === 'test' || weekTyp === 'start'));
  const isRace = weekTyp === 'start' && dayKey === 'Nd';
  cell.className = `day-cell${isKey ? ' key' : ''}${isRace ? ' race' : ''}`;
  cell.innerHTML = `<div class="day-name">${DAY_NAMES[dayKey]}</div><div class="day-content">${content}</div>`;
  return cell;
}

export function renderWeek(week, phaseId, globalIdx, currentIdx, done, totalWeeks) {
  const isCurrent = globalIdx === currentIdx;
  const isDone    = done.includes(week.id);
  const weekNum   = totalWeeks - globalIdx;

  const card = document.createElement('div');
  card.className = `week-card ${phaseId}${isCurrent ? ' current' : ''}${isDone ? ' done' : ''}`;
  if (isCurrent) card.classList.add('open');

  const [badgeClass, badgeLabel] = BADGE_MAP[week.typ] || ['badge-jak',''];
  let badges = `<span class="badge ${badgeClass}">${badgeLabel}</span>`;
  if (isCurrent) badges += `<span class="badge badge-now">Ten tydzień</span>`;
  if (isDone)    badges += `<span class="badge badge-done">✓</span>`;

  const header = document.createElement('div');
  header.className = 'week-header';
  header.setAttribute('data-action', 'toggle-week');
  header.setAttribute('aria-expanded', String(isCurrent));
  header.innerHTML = `
    <div>
      <div class="week-num">${weekNum}</div>
      <div class="week-num-sub">tyg.</div>
    </div>
    <div class="week-meta">
      <div class="week-dates">${week.id} · ${week.dates}</div>
      <div class="week-label">${week.label}</div>
      <div class="week-badges">${badges}</div>
    </div>
    <span class="chevron">▾</span>`;

  const grid = document.createElement('div');
  grid.className = 'days-grid';
  DAY_ORDER.forEach(d => grid.appendChild(renderDayCell(d, week.days[d], week.typ)));

  const doneBtn = document.createElement('button');
  doneBtn.className = 'done-btn';
  doneBtn.setAttribute('data-action', 'toggle-done');
  doneBtn.setAttribute('data-week-id', week.id);
  doneBtn.textContent = isDone ? '✓ Zrobiony' : 'Oznacz jako zrobiony';

  const body = document.createElement('div');
  body.className = 'week-body';
  body.appendChild(grid);
  body.appendChild(doneBtn);

  card.appendChild(header);
  card.appendChild(body);
  return card;
}

export function renderPhase(phase, startIdx, currentIdx, done, totalWeeks) {
  const fragment = document.createDocumentFragment();

  const phDiv = document.createElement('div');
  phDiv.className = `phase-header ${phase.id}`;
  phDiv.innerHTML = `<span class="phase-icon">${phase.icon}</span><span class="phase-title">${phase.title}</span><span style="font-size:11px;color:var(--muted);margin-left:auto">${phase.dates}</span>`;
  fragment.appendChild(phDiv);

  phase.weeks.forEach((week, i) => {
    fragment.appendChild(renderWeek(week, phase.id, startIdx + i, currentIdx, done, totalWeeks));
  });

  return fragment;
}

export function renderAll() {
  const plan       = document.getElementById('plan');
  const allWeeks   = phases.flatMap(p => p.weeks);
  const totalWeeks = allWeeks.length;
  const currentIdx = getCurrentWeekIdx();
  const done       = getDone();

  plan.innerHTML = '';

  let globalIdx = 0;
  phases.forEach(phase => {
    plan.appendChild(renderPhase(phase, globalIdx, currentIdx, done, totalWeeks));
    globalIdx += phase.weeks.length;
  });

  document.getElementById('prog-text').textContent = `${done.length} / ${totalWeeks} tygodni`;
  document.getElementById('prog-fill').style.width  = `${(done.length / totalWeeks) * 100}%`;
}
