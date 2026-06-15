export const phases = [
  {
    id: 'p1', icon: '⚡', title: 'Faza 1 — Blok szybkościowy 10K',
    dates: '16.06 – 19.07.2026',
    weeks: [
      { id:'T1', label:'Tydzień regeneracji', dates:'8–14.06', typ:'regen',
        days: {
          'Pn': '40 min BS\n+ 6x200m przebieżki',
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': '6km BS\n+ 6x100m P',
          'Czw': '6km BS\n+ 6x100m P',
          'Pt': '30 min BS\n+ 6x100m przebieżki',
          'Sob': '30 min BS\n+ 6x100m przebieżki',
          'Nd': '10km BS\n(tydzień po starcie)'
        }},
      { id:'T2', label:'Pierwsze ZB 8x200m', dates:'15–21.06', typ:'jak',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '3km BS + 8x200m ZB (4:30–4:35) + 1km BS\n(przerwa 1min trucht)',
          'Pt': null,
          'Sob': '30 min BS\n+ 6x100m przebieżki',
          'Nd': '11km BS (6:20-6:30)'
        }},
      { id:'T3', label:'ZB 8x300m', dates:'22–28.06', typ:'jak',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '3km BS + 8x300m ZB (4:35–4:40) + 1km BS\n(przerwa 1:30 trucht)',
          'Pt': null,
          'Sob': '30 min BS\n+ 6x100m przebieżki',
          'Nd': '12km BS (6:20-6:30)'
        }},
      { id:'T4', label:'Regeneracja przed testem', dates:'29.06–5.07', typ:'regen',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '3km BS + 2x3km ZB (5:10–5:15) + 1km BS\n(przerwa 3min trucht)',
          'Pt': null,
          'Sob': '30 min BS + 6x100m przebieżki\n(nogi świeże – test w niedzielę)',
          'Nd': '12km BNP:\n3km@6:10 + 2km@5:50\n+ 2km@5:35 + 2km@5:25 + 3km@5:10'
        }},
      { id:'T5', label:'🏁 TEST 10 KM', dates:'6–12.07', typ:'test',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '20 min BS + 3x1km ZB (5:00–5:10) + 1km BS\n(aktywacja przed testem)',
          'Pt': null,
          'Sob': '30 min BS + 4x100m przebieżki\n(nogi świeże przed testem)',
          'Nd': '🏁 TEST 10 KM NA CZAS\nCEL: sub-52\n2km BS + 10km + 1km BS schłodzenie'
        }},
      { id:'T6', label:'Baza po teście — 6x800m ZB', dates:'13–19.07', typ:'jak',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 6x800m ZB (5:05) + 10 min BS\n(przerwa 3min trucht)',
          'Pt': null,
          'Sob': '40 min BS\n+ 6x100m przebieżki',
          'Nd': '14km BS (6:20-6:30)'
        }},
    ]
  },
  {
    id: 'p2', icon: '🔄', title: 'Faza 2 — Pivot po teście',
    dates: '20–26.07.2026',
    weeks: [
      { id:'T7', label:'Ciągły bieg progowy', dates:'20–26.07', typ:'jak',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 4km ZB (5:20) + 10 min BS\n(ciągły bieg progowy)',
          'Pt': null,
          'Sob': '40 min BS\n+ 6x100m przebieżki',
          'Nd': '15km BS (6:20-6:30)'
        }},
    ]
  },
  {
    id: 'p3', icon: '📈', title: 'Faza 3 — Budowanie półmaratońskie',
    dates: '27.07 – 30.08.2026',
    weeks: [
      { id:'T8', label:'5x1km ZB — 16km long', dates:'27.07–2.08', typ:'bud',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 5x1km ZB (5:05) + 10 min BS\n(przerwa 3min trucht)',
          'Pt': null,
          'Sob': '40 min BS\n+ 6x100m przebieżki',
          'Nd': '16km BS (6:20-6:30)'
        }},
      { id:'T9', label:'Progowy ciągły 5km — 17km long', dates:'3–9.08', typ:'bud',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 5km ZB (5:20) + 10 min BS\n(ciągły bieg progowy)',
          'Pt': null,
          'Sob': '40 min BS\n+ 6x100m przebieżki',
          'Nd': '17km BS (6:20-6:30)'
        }},
      { id:'T10', label:'6x1km ZB — 18km long', dates:'10–16.08', typ:'bud',
        days: {
          'Pn': null,
          'Wt': '45 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 6x1km ZB (5:05) + 10 min BS\n(przerwa 3min trucht)',
          'Pt': null,
          'Sob': '45 min BS\n+ 6x100m przebieżki',
          'Nd': '18km BS (6:20-6:30)'
        }},
      { id:'T11', label:'Progowy 6km — tydzień lżejszy', dates:'17–23.08', typ:'bud',
        days: {
          'Pn': null,
          'Wt': '45 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 6km ZB (5:20) + 10 min BS\n(ciągły bieg progowy)',
          'Pt': null,
          'Sob': '45 min BS\n+ 6x100m przebieżki',
          'Nd': '16km BS (6:20-6:30)\n(tydzień lżejszy)'
        }},
      { id:'T12', label:'4x1,5km ZB — 18km BNP', dates:'24–30.08', typ:'bud',
        days: {
          'Pn': null,
          'Wt': '45 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 4x1,5km ZB (5:05) + 10 min BS\n(przerwa 3min trucht)',
          'Pt': null,
          'Sob': '45 min BS\n+ 6x100m przebieżki',
          'Nd': '18km BNP:\n12km BS + 6km narastająco 5:30→5:10'
        }},
    ]
  },
  {
    id: 'p4', icon: '🔥', title: 'Faza 4 — Szczyt',
    dates: '31.08 – 13.09.2026',
    weeks: [
      { id:'T13', label:'7km ZB — 20km long (SZCZYT!)', dates:'31.08–6.09', typ:'szczyt',
        days: {
          'Pn': null,
          'Wt': '45 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 7km ZB (5:20) + 10 min BS\n(ciągły bieg progowy)',
          'Pt': null,
          'Sob': '45 min BS\n+ 6x100m przebieżki',
          'Nd': '20km BS (6:20-6:30)\n(najdłuższy bieg planu!)'
        }},
      { id:'T14', label:'3x2km ZB — lżejszy tydzień', dates:'7–13.09', typ:'bud',
        days: {
          'Pn': null,
          'Wt': '40 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 3x2km ZB (5:10) + 10 min BS\n(przerwa 3min trucht)',
          'Pt': null,
          'Sob': '40 min BS\n+ 6x100m przebieżki',
          'Nd': '15km BS (6:20-6:30)\n(tydzień lżejszy)'
        }},
    ]
  },
  {
    id: 'p5', icon: '🌙', title: 'Faza 5 — Tapering + Start',
    dates: '14–27.09.2026',
    weeks: [
      { id:'T15', label:'8km ZB — ostatni szczyt', dates:'14–20.09', typ:'szczyt',
        days: {
          'Pn': null,
          'Wt': '45 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 8km ZB (5:20) + 10 min BS\n(ciągły bieg progowy)',
          'Pt': null,
          'Sob': '40 min BS\n+ 6x100m przebieżki',
          'Nd': '18km:\n13km BS + ostatnie 5km@5:15'
        }},
      { id:'T16', label:'🏁 TAPERING — START 27.09', dates:'21–27.09', typ:'start',
        days: {
          'Pn': null,
          'Wt': '35 min BS\n+ 6x200m przebieżki',
          'Śr': null,
          'Czw': '15 min BS + 3km ZB (5:15) + 10 min BS\n(krótko i w kontroli)',
          'Pt': null,
          'Sob': '25 min BS\n+ 4x100m przebieżki',
          'Nd': '10km BS (luz)\n\n🏁 START GDAŃSK 27.09!\nCEL: sub 1:50'
        }},
    ]
  }
];
