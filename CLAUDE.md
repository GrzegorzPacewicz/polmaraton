# Projekt — Plan treningowy Półmaraton Gdański 2026

Strona z planem treningowym na półmaraton (Gdańsk, 27.09.2026), cel: sub 1:50.
Vanilla JS (ES modules), bez frameworków.

## Struktura plików

```
index.html              — szkielet HTML, importy CSS i JS (type="module")
css/
  base.css              — reset, :root variables, body, fonty, reduced-motion
  header.css            — header, countdown, legend, progress bar
  plan.css              — phase-header, week-card, day-cell, badges, responsive
js/
  data.js               — export const phases (wszystkie dane, zero logiki)
  state.js              — getCurrentWeekIdx, getDaysTo, getDone, saveDone
  render.js             — renderDayCell, renderWeek, renderPhase, renderAll
  countdown.js          — updateCountdown + setInterval(60000)
  main.js               — init, event delegation na #plan
plan_gdanski_2026.html  — oryginał (backup, nie ruszać)
```

## Struktura danych

Plan: 5 faz, 16 tygodni (T1–T16). Dane w `js/data.js` jako `export const phases`.

```js
// tydzień
{ id:'T1', label:'...', dates:'...', typ:'regen|jak|bud|szczyt|test|start',
  days: { 'Pn'|'Wt'|'Śr'|'Czw'|'Pt'|'Sob'|'Nd': string | null } }
// null = dzień odpoczynku
```

Fazy: p1 (T1–T6), p2 (T7), p3 (T8–T12), p4 (T13–T14), p5 (T15–T16).

## Stan aplikacji

- `done: string[]` — localStorage key: `'gdansk_done'`
- `open` — zarządzane przez klasę CSS `.open` na `.week-card`
- `currentWeekIdx` — obliczany z `PLAN_START = new Date('2026-06-16')`
- `RACE_DATE = new Date('2026-09-27')`

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
2. `data.js` — tylko dane, zero logiki.
3. `state.js` — cała logika; render.js nie zawiera logiki biznesowej.
4. Event handling: jeden listener na `#plan`, delegacja przez `data-action`.
5. CSS przepisany 1:1 z oryginału, bez frameworków.
6. `aria-expanded` na `.week-header`, `role="article"` na `.day-cell`.
7. Treść dni treningowych — nie skracać, nie parafrazować.
8. Responsywność: `@media (max-width: 520px)`.
