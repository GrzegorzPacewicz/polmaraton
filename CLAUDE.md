# Projekt — Plany treningowe (biegi)

Strona z planami treningowymi. Obsługuje wiele planów; wybór przez `?plan=<id>`,
bez parametru — `DEFAULT_PLAN` z `js/plans/index.js`.
Archiwum: Półmaraton Gdański 2026 (`gdansk-2026`, tag git `gdansk-2026`).
Vanilla JS (ES modules), bez frameworków.

## Struktura plików

```
index.html              — szkielet HTML, importy CSS i JS (type="module")
css/
  base.css              — reset, :root variables, body, fonty, reduced-motion
  header.css            — header, countdown, legend, progress bar
  plan.css              — phase-header, week-card, day-cell, badges, responsive
js/
  plans/
    index.js            — rejestr planów (id, name, load) + DEFAULT_PLAN
    warszawa-2027.js    — aktualny plan: Półmaraton Warszawski (Daniels VDOT 40, start 4.04.2027)
                          GENEROWANY: `python3 tools/gen-plan.py` z plan-polmaraton.md — nie edytować ręcznie
    gdansk-2026.js      — archiwum (wynik 1:50:21, cel spełniony)
  state.js              — loadPlan, getPlan, getOtherPlans, getCurrentWeekIdx, getDaysTo, getDone, saveDone
  render.js             — renderHeader, renderDayCell, renderWeek, renderPhase, renderAll
  countdown.js          — updateCountdown
  main.js               — init (loadPlan → render), setInterval, event delegation na #plan
plan_gdanski_2026.html  — oryginał (backup, nie ruszać)
plan-polmaraton.md      — źródło planu warszawskiego
tools/gen-plan.py       — generator warszawa-2027.js (etykiety tygodni, typy, meta w bloku USTAWIENIA)
```

## Struktura danych

Każdy plan to plik `js/plans/<id>.js` z `meta` i `phases`. Nowy plan = nowy plik + wpis w `plans/index.js`.

```js
// meta
{ id, name, title /* HTML h1 */, eyebrow, planStart:'RRRR-MM-DD', raceDate:'RRRR-MM-DD',
  storageKey? /* domyślnie `done_<id>` */, stats:[{label,value,accent?}],
  legend:[{title, html?, facts?:[{label,text}], rules?:[{num,label,text}],
           callout?:{title,text}, cards?:[{cls,abbr,name,desc}], after?}],  // sekcje legendy (w tej kolejności)
  paces:{label,note,chips:[{cls,text}]},
  quality?: {Wt:'J2', Czw:'J3', Nd:'J1'} }  // sesje jakościowe → .key (pomarańczowa góra) + tło .q-j1/.q-j2/.q-j3
// faza (quality nadpisuje meta.quality, {} = brak sesji J)
{ id:'p1'..'p6', icon, title, dates, recovery?: true /* numeracja po starcie */, quality?, weeks:[...] }
// tydzień
{ id:'T1', label:'...', dates:'...', typ:'regen|jak|bud|szczyt|test|start', quality? /* nadpisuje fazę */,
  days: { 'Pn'|'Wt'|'Śr'|'Czw'|'Pt'|'Sob'|'Nd': string | null } }
// null = dzień odpoczynku
```

Bez `quality` (Gdańsk) działa stara logika `.key` (Czw + Nd w test/start).

Półmaraton Warszawski 2027: p1 baza (B1–B8), p2 Faza II (T1–T6), p3 Faza III (T7–T12), p4 Faza IV (T13–T18).
Gdańsk 2026: p1 (T1–T6), p2 (T7), p3 (T8–T12), p4 (T13–T14), p5 (T15–T16), p6 regeneracja (T17–T18).

## Stan aplikacji

- `done: string[]` — localStorage key: `meta.storageKey` lub `done_<id>` (Gdańsk: `'gdansk_done'`)
- `open` — zarządzane przez klasę CSS `.open` na `.week-card`
- `currentWeekIdx` — obliczany z `meta.planStart`
- odliczanie — z `meta.raceDate`

## Paleta kolorów (CSS variables)

```css
--bg:#08101E  --surface:#0F1B2D  --card:#142035  --border:#1C2E45
--cyan:#00D4FF  --cyan-dim:rgba(0,212,255,0.12)
--orange:#FF6B35  --orange-dim:rgba(255,107,53,0.12)
--green:#3DD68C  --green-dim:rgba(61,214,140,0.1)
--yellow:#FFD166  --yellow-dim:rgba(255,209,102,0.12)
--red:#FF4D6D  --red-dim:rgba(255,77,109,0.1)
--text:#E2EAF4  --muted:#4E6A8A  --subtle:#243447
```

Fonty: **Barlow Condensed** (display, 700/900) + **Inter** (body, 400/600) — Google Fonts.

## Typy tygodni → kolory

| typ    | badge        | kolor       |
|--------|-------------|-------------|
| regen  | badge-regen | --yellow    |
| jak    | badge-jak   | --cyan      |
| bud    | badge-bud   | --green     |
| szczyt | badge-szczyt| --orange    |
| test   | badge-test  | --red       |
| start  | badge-start | --green     |

## Fazy → kolor akcentu (border-left + phase-title)

| faza | kolor     |
|------|-----------|
| p1   | --orange  |
| p2   | --yellow  |
| p3   | --green   |
| p4   | --red     |
| p5   | --cyan    |

## Zasady (nie zmieniać)

1. ES modules — `import/export` wszędzie, `type="module"` w index.html.
2. `plans/<id>.js` — tylko dane, zero logiki.
3. `state.js` — cała logika; render.js nie zawiera logiki biznesowej.
4. Event handling: jeden listener na `#plan`, delegacja przez `data-action`.
5. CSS przepisany 1:1 z oryginału, bez frameworków.
6. `aria-expanded` na `.week-header`, `role="article"` na `.day-cell`.
7. Treść dni treningowych — nie skracać, nie parafrazować.
8. Responsywność: `@media (max-width: 520px)`.
