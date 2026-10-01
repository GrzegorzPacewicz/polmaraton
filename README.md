# Plany treningowe — półmaraton

Strona z planami treningowymi na półmaraton.

- **Półmaraton Warszawski 2027** (4.04.2027) — aktualny plan, Daniels VDOT 40, cel sub 1:47
- **Półmaraton Gdańsk 2026** (27.09.2026) — archiwum, cel sub 1:50, wynik 1:50:21 — cel spełniony (`?plan=gdansk-2026`)

## Live

https://polmaraton.grzegorzpacewicz.pl

## Stack

- Vanilla JS (ES modules)
- CSS (custom properties, zero frameworków)
- PWA (manifest, ikona)

## Zmiany w planie warszawskim

Źródłem jest `plan-polmaraton.md`. Po edycji uruchom:

```bash
python3 tools/gen-plan.py
```

Skrypt nadpisuje `js/plans/warszawa-2027.js` — nie edytuj go ręcznie.
Krótkie etykiety tygodni, typy tygodni i dane nagłówka są w bloku `USTAWIENIA` w skrypcie.

## Nowy plan

1. Dodaj `js/plans/<id>.js` z `meta` i `phases`.
2. Dopisz plan w `js/plans/index.js` i ustaw `DEFAULT_PLAN`.

## Uruchomienie lokalne

```bash
npx serve .
```

lub dowolny serwer statyczny.
