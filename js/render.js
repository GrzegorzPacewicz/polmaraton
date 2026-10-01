import { getPlan, getOtherPlans, getDone, getCurrentWeekIdx, getQuality } from './state.js';

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

export function renderDayCell(dayKey, content, weekTyp, quality) {
  const cell = document.createElement('div');
  cell.setAttribute('role', 'article');

  if (!content) {
    cell.className = 'day-cell rest';
    cell.innerHTML = `<div class="day-name">${DAY_NAMES[dayKey]}</div><div class="day-content" style="color:var(--muted);font-size:11px">odpoczynek</div>`;
    return cell;
  }

  const q      = quality && quality[dayKey];
  const isKey  = quality
    ? Boolean(q)
    : dayKey === 'Czw' || (dayKey === 'Nd' && (weekTyp === 'test' || weekTyp === 'start'));
  const isRace = weekTyp === 'start' && dayKey === 'Nd';
  cell.className = `day-cell${isKey ? ' key' : ''}${q ? ` q-${q.toLowerCase()}` : ''}${isRace ? ' race' : ''}`;
  const qTag = q ? ` <span class="q-tag">${q}</span>` : '';
  cell.innerHTML = `<div class="day-name">${DAY_NAMES[dayKey]}${qTag}</div><div class="day-content">${content}</div>`;
  return cell;
}

export function renderWeek(week, phase, globalIdx, currentIdx, done, totalWeeks) {
  const phaseId   = phase.id;
  const isCurrent = globalIdx === currentIdx;
  const isDone    = done.includes(week.id);
  const weekNum   = phase.recovery
    ? globalIdx - totalWeeks + 1
    : totalWeeks - globalIdx;

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
  const quality = getQuality(phase, week);
  DAY_ORDER.forEach(d => grid.appendChild(renderDayCell(d, week.days[d], week.typ, quality)));

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
    fragment.appendChild(renderWeek(week, phase, startIdx + i, currentIdx, done, totalWeeks));
  });

  return fragment;
}

export function renderHeader() {
  const { meta } = getPlan();
  document.title = `${meta.name} — Plan Treningowy`;

  document.getElementById('eyebrow').textContent = meta.eyebrow;
  document.getElementById('plan-title').innerHTML = meta.title;
  document.getElementById('header-meta').innerHTML = meta.stats.map(s => `
    <div class="meta-item">
      <span class="meta-label">${s.label}</span>
      <span class="meta-value${s.accent ? ' accent' : ''}">${s.value}</span>
    </div>`).join('');

  const others = getOtherPlans();
  const nav = document.getElementById('plan-nav');
  nav.hidden = others.length === 0;
  nav.innerHTML = `<span class="plan-nav-label">Inne plany</span>` +
    others.map(p => `<a class="plan-nav-link" href="?plan=${p.id}">${p.name}</a>`).join('');

  const sections = meta.legend.map(sec => `
    <div class="legend-title">${sec.title}</div>
    ${sec.html ? `<div class="legend-text">${sec.html}</div>` : ''}
    ${sec.cards ? `<div class="legend-cards">${sec.cards.map(c => `
      <div class="legend-card ${c.cls}">
        <div class="legend-abbr">${c.abbr}</div>
        <div class="legend-name">${c.name}</div>
        <div class="legend-desc">${c.desc}</div>
      </div>`).join('')}</div>` : ''}
    ${sec.after ? `<div class="legend-text legend-after">${sec.after}</div>` : ''}`).join('');

  document.getElementById('legend').innerHTML = sections + `
    <div class="legend-paces">
      <span class="legend-paces-label">${meta.paces.label}</span>
      <span class="legend-paces-note">${meta.paces.note}</span>
      ${meta.paces.chips.map(c => `<span class="pace-chip ${c.cls}">${c.text}</span>`).join('')}
    </div>`;
}

export function renderAll() {
  const { phases } = getPlan();
  const plan       = document.getElementById('plan');
  const allWeeks      = phases.flatMap(p => p.weeks);
  const totalWeeks    = allWeeks.length;
  const racePlanWeeks = phases.filter(p => !p.recovery).flatMap(p => p.weeks).length;
  const currentIdx    = getCurrentWeekIdx();
  const done          = getDone();

  plan.innerHTML = '';

  let globalIdx = 0;
  phases.forEach(phase => {
    plan.appendChild(renderPhase(phase, globalIdx, currentIdx, done, racePlanWeeks));
    globalIdx += phase.weeks.length;
  });

  document.getElementById('prog-text').textContent = `${done.length} / ${totalWeeks} tygodni`;
  document.getElementById('prog-fill').style.width  = `${(done.length / totalWeeks) * 100}%`;
}
