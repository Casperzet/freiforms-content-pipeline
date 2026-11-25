import { THREE, proStage, proPhone, glassCard, lightBeam, dust, rrect, F } from './pro.js';

/* Style frames for the "Quiet Premium" direction.  t < 1: CHAOS (hook).  t >= 1: ORDER (turn). */

const C = { bg: '#0d0e12', panel: '#17181e', panel2: '#1f2129', text: '#f2efe9', mute: '#8d8f99', coral: '#ff8a6e', blue: '#7aa2ff', green: '#4fd1a1', violet: '#a98bff', line: 'rgba(255,255,255,.07)' };

function statusBar(c, W, time) {
  c.fillStyle = C.text; c.font = F(600, 30); c.textAlign = 'left'; c.fillText(time, 54, 66);
  c.textAlign = 'right'; c.fillText('100%', W - 54, 66); c.textAlign = 'left';
}

function chatScreen(c, st, W, H) {
  c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
  statusBar(c, W, '21:47');
  // header
  c.fillStyle = C.panel; c.fillRect(0, 96, W, 140);
  [[C.coral, 0], [C.blue, 1], [C.green, 2]].forEach(([col, i]) => { c.fillStyle = col; c.beginPath(); c.arc(70 + i * 34, 166, 28, 0, 7); c.fill(); c.strokeStyle = C.panel; c.lineWidth = 5; c.stroke(); });
  c.fillStyle = C.text; c.font = F(700, 36); c.fillText('Team Filiale', 190, 158);
  c.fillStyle = C.mute; c.font = F(500, 24); c.fillText('18 Mitglieder · 6 schreiben …', 190, 196);
  // unread pill
  c.fillStyle = C.coral; rrect(c, W / 2 - 170, 262, 340, 58, 29); c.fill();
  c.fillStyle = '#1a0f0c'; c.font = F(700, 26); c.textAlign = 'center'; c.fillText('47 ungelesene Nachrichten', W / 2, 300); c.textAlign = 'left';
  // messages
  let y = 352;
  const bubble = (name, col, text, w = 520) => {
    const h = 112; c.fillStyle = C.panel2; rrect(c, 40, y, w, h, 30); c.fill();
    c.fillStyle = col; c.font = F(600, 22); c.fillText(name, 70, y + 40);
    c.fillStyle = C.text; c.font = F(500, 29); c.fillText(text, 70, y + 84); y += h + 18;
  };
  bubble('Mara', C.coral, 'Wer übernimmt Samstag früh?');
  bubble('Jonas', C.blue, 'Hab den Plan nicht gesehen', 470);
  // photo bubble
  c.fillStyle = C.panel2; rrect(c, 40, y, 430, 250, 30); c.fill();
  const gr = c.createLinearGradient(60, y + 20, 450, y + 190); gr.addColorStop(0, '#d9d2c3'); gr.addColorStop(1, '#8f877a');
  c.save(); rrect(c, 58, y + 18, 394, 170, 20); c.clip(); c.fillStyle = gr; c.fillRect(58, y + 18, 394, 170);
  c.strokeStyle = 'rgba(40,36,30,.35)'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(80, y + 46 + i * 20); c.lineTo(80 + 200 + (i % 3) * 50, y + 42 + i * 21); c.stroke(); }
  c.restore();
  c.fillStyle = C.mute; c.font = F(500, 22); c.fillText('Dienstplan_final_v3.jpg', 70, y + 225); y += 268;
  // voice message
  c.fillStyle = C.panel2; rrect(c, 40, y, 470, 100, 30); c.fill();
  c.fillStyle = C.coral; c.beginPath(); c.arc(100, y + 50, 28, 0, 7); c.fill();
  c.fillStyle = '#1a0f0c'; c.beginPath(); c.moveTo(92, y + 36); c.lineTo(116, y + 50); c.lineTo(92, y + 64); c.fill();
  for (let i = 0; i < 26; i++) { const hh = 10 + Math.abs(Math.sin(i * 1.7)) * 40; c.fillStyle = i < 9 ? C.coral : '#5b5e69'; c.fillRect(150 + i * 11, y + 50 - hh / 2, 6, hh); }
  c.fillStyle = C.mute; c.font = F(500, 22); c.fillText('0:47', 452, y + 58); y += 118;
  bubble('Lea', C.green, 'Wer macht Kasse 2??', 400);
  // input bar
  c.fillStyle = C.panel; c.fillRect(0, H - 120, W, 120);
  c.fillStyle = C.panel2; rrect(c, 40, H - 98, W - 80, 70, 35); c.fill();
  c.fillStyle = C.mute; c.font = F(500, 26); c.fillText('Nachricht', 78, H - 52);
}

function planScreen(c, st, W, H) {
  c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
  statusBar(c, W, '06:02');
  c.fillStyle = C.mute; c.font = F(600, 24); c.fillText('SCHICHTPLAN', 54, 160);
  c.fillStyle = C.text; c.font = F(700, 64); c.fillText('Samstag', 54, 236);
  c.fillStyle = C.mute; c.font = F(500, 28); c.fillText('30. November · Filiale Mitte', 54, 280);
  c.fillStyle = 'rgba(79,209,161,.14)'; rrect(c, 54, 312, 372, 56, 28); c.fill();
  c.fillStyle = C.green; c.beginPath(); c.arc(84, 340, 9, 0, 7); c.fill();
  c.font = F(600, 24); c.fillText('Alle Schichten besetzt', 104, 349);
  // time axis
  const x0 = 200, x1 = W - 54, hour = h => x0 + (x1 - x0) * (h - 6) / 16;
  c.fillStyle = C.mute; c.font = F(500, 20);
  [6, 10, 14, 18, 22].forEach(h => { c.fillText(String(h).padStart(2, '0'), hour(h) - 12, 428); c.fillStyle = C.line; c.fillRect(hour(h), 440, 2, 560); c.fillStyle = C.mute; });
  const rows = [['Anna', 6, 14, C.coral, 'Früh'], ['Lena', 6, 14, C.green, 'Kasse 2'], ['Jonas', 10, 18, C.violet, 'Lager'], ['Mehmet', 14, 22, C.blue, 'Spät'], ['Mara', 14, 22, C.coral, 'Kasse 1']];
  rows.forEach(([n, a, b, col, tag], i) => {
    const y = 466 + i * 104;
    c.fillStyle = C.text; c.font = F(600, 28); c.fillText(n, 54, y + 46);
    c.fillStyle = col; rrect(c, hour(a), y + 10, hour(b) - hour(a), 62, 18); c.fill();
    c.fillStyle = '#121318'; c.font = F(700, 22); c.fillText(tag, hour(a) + 18, y + 49);
  });
  // confirmation card
  const cy = 1030;
  c.fillStyle = C.panel2; rrect(c, 40, cy, W - 80, 150, 32); c.fill();
  c.fillStyle = C.green; c.beginPath(); c.arc(104, cy + 75, 34, 0, 7); c.fill();
  c.strokeStyle = '#0d0e12'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(88, cy + 76); c.lineTo(100, cy + 88); c.lineTo(121, cy + 63); c.stroke();
  c.fillStyle = C.text; c.font = F(700, 30); c.fillText('Tausch bestätigt', 162, cy + 66);
  c.fillStyle = C.mute; c.font = F(500, 24); c.fillText('Jonas ↔ Mara · gerade eben', 162, cy + 106);
  c.fillStyle = C.coral; rrect(c, 40, H - 150, W - 80, 92, 46); c.fill();
  c.fillStyle = '#1a0f0c'; c.font = F(700, 30); c.textAlign = 'center'; c.fillText('Schicht tauschen', W / 2, H - 92); c.textAlign = 'left';
}

function notifW(title, text, col) { return notif(title, text, col); }
function notif(title, text, col) {
  return (c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.fillStyle = col; rrect(c, 34, H / 2 - 40, 80, 80, 22); c.fill();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.font = F(700, 34); c.textAlign = 'center'; c.fillText(title[0], 74, H / 2 + 12); c.textAlign = 'left';
    c.fillStyle = 'rgba(255,255,255,.62)'; c.font = F(600, 24); c.fillText(title + ' · jetzt', 140, H / 2 - 12);
    c.fillStyle = '#ffffff'; c.font = F(600, 32); c.fillText(text, 140, H / 2 + 30);
  };
}

export function build(stage, ov) {
  const S = proStage({ bloom: .45, threshold: .82 });
  const { scene, camera } = S;
  const motes = dust(260); motes.material.opacity = .35; scene.add(motes);

  const phone = proPhone((c, st, W, H) => (st.mode === 'plan' ? planScreen : chatScreen)(c, st, W, H));
  scene.add(phone);

  const cards = [
    glassCard(notifW('Mara', 'Wer übernimmt Samstag?', '#ff8a6e')),
    glassCard(notifW('Jonas', 'Hab den Plan nicht gesehen', '#7aa2ff')),
    glassCard(notifW('Lea', 'Wer macht Kasse 2??', '#4fd1a1')),
    glassCard(notifW('Mehmet', 'Kann jemand tauschen?', '#a98bff')),
  ];
  cards.forEach(k => scene.add(k));
  const done = [
    glassCard(notifW('Samstag', 'Alle Schichten besetzt', '#4fd1a1')),
    glassCard(notifW('Tausch', 'Jonas ↔ Mara bestätigt', '#ff8a6e')),
  ];
  done.forEach(k => scene.add(k));

  ov.innerHTML = `<div class="brand">Frei<b>Forms</b></div>
    <div id="chaos"><div class="big">47</div><div class="rule" style="top:248px"></div>
      <div class="label" style="top:266px">ungelesene Nachrichten.<br><em>Und keiner weiß, wer Samstag arbeitet.</em></div></div>
    <div id="order" style="display:none"><div class="label" style="top:92px;font-size:52px;line-height:1.02;letter-spacing:-.035em">Ein Plan.<br><em>Auf jedem Handy.</em></div>
      <div class="rule" style="top:226px"></div><div class="label" style="top:244px;font-size:20px;color:rgba(244,241,236,.62);letter-spacing:0">Tauschen mit einem Tippen. Alle sehen es sofort.</div></div>
`;

  function update(t) {
    const order = t >= 1;
    ov.querySelector('#chaos').style.display = order ? 'none' : '';
    ov.querySelector('#order').style.display = order ? '' : 'none';
    phone.userData.redraw({ mode: order ? 'plan' : 'chat' });
    if (!order) {
      phone.position.set(1.15, -1.55, 0); phone.rotation.set(.08, -.38, .05); phone.scale.setScalar(.92);
      const P = [[-.78, .2, 1.0, .02, .24, .03], [-.92, -.58, .72, .02, .28, -.02], [-.74, -1.36, .44, .02, .24, .02], [-.95, -2.14, .16, .02, .3, -.03]];
      cards.forEach((k, i) => { k.visible = true; k.position.set(...P[i].slice(0, 3)); k.rotation.set(P[i][3], P[i][4], P[i][5]); });
      done.forEach(k => k.visible = false);
      camera.position.set(.4, .6, 15); camera.lookAt(.2, .2, 0);
    } else {
      phone.position.set(.95, -1.35, 0); phone.rotation.set(.04, -.26, 0); phone.scale.setScalar(.98);
      cards.forEach(k => k.visible = false);
      done.forEach((k, i) => { k.visible = true; k.position.set(-.85, -.15 - i * .82, 1.1); k.rotation.set(.02, .24, 0); });
      camera.position.set(.2, .3, 14.5); camera.lookAt(.2, 0, 0);
    }
    motes.userData.update(t * 3);
    S.render(t);
  }
  return { duration: 2, update };
}
