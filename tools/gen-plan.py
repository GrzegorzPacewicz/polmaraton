#!/usr/bin/env python3
"""Generuje js/plans/warszawa-2027.js z plan-polmaraton.md.

Użycie (z katalogu głównego repo lub skądkolwiek):
    python3 tools/gen-plan.py

Z pliku .md brane są: sekcja „Założenia” (bez tabeli okresów), „Zasady i korekty”,
sekcja „Tempa treningowe …” (tekst + tabela stref) oraz tabele tygodni z sekcji
„Okres bazowy”, „Faza II”, „Faza III”, „Faza IV”.
Wszystko, czego nie ma w .md, ustawiasz w bloku USTAWIENIA poniżej.

UWAGA: skrypt nadpisuje plik wynikowy — ręczne zmiany w nim przepadną.
"""
import datetime as dt
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'plan-polmaraton.md'
OUT = ROOT / 'js' / 'plans' / 'warszawa-2027.js'

# ── USTAWIENIA ────────────────────────────────────────────────────────────

PLAN_START = dt.date(2026, 10, 5)   # poniedziałek tygodnia B1

META = dict(
    id='warszawa-2027',
    name='Półmaraton Warszawski 2027',
    title='Półmaraton<br><em>Warszawski</em> 2027',
    eyebrow='Plan treningowy · Daniels, VDOT 40',
    planStart=PLAN_START.isoformat(),
    raceDate='2027-04-04',
    quality={'Wt': 'J2', 'Czw': 'J3', 'Nd': 'J1'},
    stats=[
        dict(label='Start', value='04.04.2027'),
        dict(label='Cel', value='sub 1:47', accent=True),
        dict(label='Tygodnie', value='8 + 18'),
        dict(label='Baza', value='35–40 km'),
    ],
)
PACES_NOTE = '(półmaraton 1:50:00)'

# Fazy: (nagłówek sekcji w .md, id fazy, ikona, tytuł, daty, czy tygodnie bazowe)
PHASES = [
    ('## Okres bazowy', 'p1', '🧱', 'Baza — biegi spokojne i podbiegi', '5.10 – 29.11.2026', True),
    ('## Faza II', 'p2', '⚡', 'Faza II — Rytmy i próg', '30.11.2026 – 10.01.2027', False),
    ('## Faza III', 'p3', '🔥', 'Faza III — Interwały i próg', '11.01 – 21.02.2027', False),
    ('## Faza IV', 'p4', '🏁', 'Faza IV — Specyfika półmaratonu i start', '22.02 – 4.04.2027', False),
]

# Krótkie etykiety tygodni 1–18 (nagłówek karty tygodnia); suma km dokleja się sama
LABELS = {
    '1': 'P 3×1,6 km · R 8×200 m', '2': 'P 20 min · R 6×400 m', '3': 'P 4×1,2 km · R · 8 km M',
    '4': 'Lżejszy tydzień (święta)', '5': 'P 5×1 km · R 10×200 m · BD 17 km',
    '6': 'P 20 min · R 6×400 m · 10 km M',
    '7': 'Pierwsze I 3×1,2 km', '8': 'I 4×1 km · 12 km M', '9': 'P + R · I 4×1 km · BD 18 km',
    '10': 'Lżejszy · start kontrolny 10 km', '11': 'P 3,2 + 1,6 km · BD 19 km',
    '12': 'I 4×1 km · 12 km M + P',
    '13': 'P 2×10 min · P + I', '14': 'I 5×800 m · 2×30 min M', '15': 'P 20 + 5 min · BD 18 km',
    '16': 'Taper · 60 min M', '17': 'Taper · 90 min BS', '18': 'Tydzień startowy',
}
# Typ tygodnia (badge); domyślnie 'jak', w bazie 'bud' / 'regen' dla lżejszych
TYP = {'4': 'regen', '9': 'szczyt', '10': 'test', '11': 'szczyt', '12': 'szczyt', '18': 'start'}
# Tygodnie, w których nie wszystkie dni J są jakościowe (np. czwartek = zwykłe BS)
WEEK_QUALITY = {'10': {'Wt': 'J2', 'Nd': 'J1'}, '18': {'Wt': 'J2', 'Nd': 'J1'}}

# Strefa z tabeli temp → klasa karty w legendzie
CARD_CLS = {'BS / BD': 'card-bs', 'M': 'card-m', 'P': 'card-tp', 'I': 'card-i', 'R': 'card-r', 'PB': 'card-p'}
# Strefa → chip z tempem (strefy spoza tej listy nie mają chipa)
CHIP = {'BS / BD': ('pace-bs', 'BS/BD'), 'M': ('pace-m', 'M'), 'P': ('pace-tp', 'P'),
        'I': ('pace-i', 'I'), 'R': ('pace-r', 'R')}

# ── PARSOWANIE ────────────────────────────────────────────────────────────

md = SRC.read_text(encoding='utf-8')


def section(head):
    """Tekst sekcji od nagłówka zaczynającego się od `head` do następnego '## '."""
    start = md.index(head)
    end = md.find('\n## ', start + 1)
    return md[start:end if end != -1 else len(md)]


def heading(sec):
    return sec.split('\n', 1)[0].lstrip('# ').strip()


def rows(sec):
    """Wiersze tabeli z sekcji, bez nagłówka i separatora."""
    lines = [l for l in sec.splitlines() if l.startswith('|')]
    return [[c.strip() for c in l.strip().strip('|').split(' | ')] for l in lines[2:]]


def inline(t):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)


def block(text):
    """Akapity i listy '- ' → HTML."""
    html, ul = [], []
    for line in text.strip().split('\n'):
        if line.startswith('- '):
            ul.append(f'<li>{inline(line[2:])}</li>')
            continue
        if ul:
            html.append('<ul>' + ''.join(ul) + '</ul>')
            ul = []
        if line.strip():
            html.append(f'<p>{inline(line)}</p>')
    if ul:
        html.append('<ul>' + ''.join(ul) + '</ul>')
    return ''.join(html)


def body(sec):
    return sec.split('\n', 1)[1]


def jtags(t):
    """J1/J2/J3 w tekście → kolorowe etykiety jak na kafelkach dni."""
    return re.sub(r'\bJ([123])\b', r'<span class="q-tag q-tag-j\1">J\1</span>', t)


def assumptions(text):
    """Akapit wstępny → lead, lista '- **Etykieta:** tekst' → kafelki, akapit po liście → ramka."""
    lead, facts, callout = [], [], None
    for line in (l for l in text.strip().split('\n') if l.strip()):
        m = re.match(r'- \*\*(.+?):\*\* (.+)', line)
        if m:
            facts.append(dict(label=m.group(1), text=jtags(inline(m.group(2)))))
        elif facts:
            title, _, rest = line.partition(': ')
            callout = dict(title=title, text=inline(rest))
        else:
            lead.append(f'<p>{inline(line)}</p>')
    return dict(html=''.join(lead), facts=facts, callout=callout)


def day(t):
    t = inline(t)
    return t.replace(' + 10 min BS (', ' + 10 min BS\n(').replace(' + 10 min truchtu', '\n+ 10 min truchtu')


def week_dates(i):
    a = PLAN_START + dt.timedelta(weeks=i)
    b = a + dt.timedelta(days=6)
    if a.month == b.month:
        return f'{a.day}–{b.day}.{b.month:02d}'
    return f'{a.day}.{a.month:02d}–{b.day}.{b.month:02d}'


def km(s):
    return s if 'km' in s else f'{s} km'


def rules(sec):
    """'1. **Tytuł:** tekst' (lub '**Tytuł** (…): tekst') → kafelki z numerem."""
    out = []
    for line in body(sec).split('\n'):
        m = re.match(r'(\d+)\. \*\*(.+?):?\*\*:? ?(.*)', line)
        if m:
            out.append(dict(num=m.group(1), label=m.group(2), text=jtags(inline(m.group(3)))))
    return out


# Legenda: Założenia (bez tabeli okresów) + Tempa (tekst przed/po tabeli + karty)
zal = section('## Założenia')
zal_text = '\n'.join(l for l in body(zal).split('\n') if not l.startswith('|'))

tempa = section('## Tempa treningowe')
before, _, rest = body(tempa).partition('\n|')
after = '\n'.join(l for l in rest.split('\n') if '|' not in l)

cards, chips = [], []
for r in rows(tempa):
    abbr, name = re.match(r'(.+?) \((.+)\)', r[0]).groups()
    lines = [f'Tempo /km: {r[1]}']
    if r[2] != '–':
        lines.append(f'Na odcinkach: {r[2]}')
    if r[3] != '–':
        lines.append(f'Limit w jednej sesji: {r[3]}')
    cards.append(dict(cls=CARD_CLS[abbr], abbr=abbr, name=name, desc='<br>'.join(lines)))
    if abbr in CHIP:
        cls, short = CHIP[abbr]
        chips.append(dict(cls=cls, text=f"{short} {r[1].replace('ok. ', '~')}"))

tempa_title = heading(tempa)
vdot = re.search(r'VDOT \d+', tempa_title)
META['legend'] = [
    dict(title=heading(zal), **assumptions(zal_text)),
    dict(title=heading(section('## Zasady i korekty')), rules=rules(section('## Zasady i korekty'))),
    dict(title=tempa_title, html=block(before), cards=cards, after=block(after)),
]
META['paces'] = dict(label=f'Tempa {vdot.group(0)}' if vdot else 'Tempa',
                     note=PACES_NOTE, chips=chips)

# Tygodnie
phases, idx = [], 0
for head, pid, icon, title, dates, is_base in PHASES:
    weeks = []
    for r in rows(section(head)):
        n = r[0].split()[0]
        days = dict(Pn=None, Wt=day(r[2]), Śr=None, Czw=day(r[3]), Pt=None, Sob=day(r[4]), Nd=day(r[5]))
        if is_base:
            light = '(lżejszy)' in r[0]
            w = dict(id=n, label=('Baza · lżejszy tydzień' if light else 'Baza') + f' · {km(r[6])}',
                     dates=week_dates(idx), typ='regen' if light else 'bud', days=days)
        else:
            w = dict(id=f'T{n}', label=f'{LABELS[n]} · {km(r[6])}',
                     dates=week_dates(idx), typ=TYP.get(n, 'jak'), days=days)
            if n in WEEK_QUALITY:
                w['quality'] = WEEK_QUALITY[n]
        weeks.append(w)
        idx += 1
    phase = dict(id=pid)
    if is_base:
        phase['quality'] = {}
    phase.update(icon=icon, title=title, dates=dates, weeks=weeks)
    phases.append(phase)

assert [len(p['weeks']) for p in phases] == [8, 6, 6, 6], [len(p['weeks']) for p in phases]

# ── ZAPIS ─────────────────────────────────────────────────────────────────

def js(v, ind=0):
    p = '  ' * ind
    if isinstance(v, dict):
        return '{\n' + ''.join(f'{p}  {k}: {js(x, ind + 1)},\n' for k, x in v.items()) + p + '}'
    if isinstance(v, list):
        if all(isinstance(x, str) for x in v):
            return json.dumps(v, ensure_ascii=False)
        return '[\n' + ''.join(f'{p}  {js(x, ind + 1)},\n' for x in v) + p + ']'
    if v is None:
        return 'null'
    return json.dumps(v, ensure_ascii=False)


OUT.write_text(f'export const meta = {js(META)};\n\nexport const phases = {js(phases)};\n', encoding='utf-8')
print(f'Zapisano {OUT.relative_to(ROOT)}: {idx} tygodni')
