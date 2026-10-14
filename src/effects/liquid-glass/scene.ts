/** Placeholder photo: a bright office with columns and a figure, drawn so there are edges to bend. */
export function drawScene(): string {
  const c = document.createElement('canvas');
  c.width = 770; c.height = 990;
  const g = c.getContext('2d')!;
  const bg = g.createLinearGradient(0, 0, 0, 990);
  bg.addColorStop(0, '#eef1ee'); bg.addColorStop(0.6, '#d9dfda'); bg.addColorStop(1, '#8f9a94');
  g.fillStyle = bg; g.fillRect(0, 0, 770, 990);
  g.fillStyle = '#b9cfd6';
  for (let i = 0; i < 5; i++) g.fillRect(40 + i * 62, 300, 44, 420);
  g.fillStyle = '#9db6a6'; g.fillRect(520, 380, 250, 300);
  for (const [x, w] of [[-30, 150], [470, 130], [650, 150]]) {
    const cg = g.createLinearGradient(x, 0, x + w, 0);
    cg.addColorStop(0, '#cfd5d0'); cg.addColorStop(0.35, '#fbfcfb'); cg.addColorStop(1, '#c3cac5');
    g.fillStyle = cg; g.fillRect(x, 120, w, 870);
  }
  g.fillStyle = '#1d2321'; g.fillRect(0, 880, 770, 110);
  g.fillStyle = '#39413e';
  for (let i = 0; i < 6; i++) g.fillRect(20 + i * 130, 840, 70, 60);
  g.fillStyle = '#34432f';
  g.beginPath(); g.moveTo(170, 990);
  g.bezierCurveTo(170, 560, 250, 500, 385, 490); g.bezierCurveTo(520, 500, 610, 560, 610, 990); g.fill();
  g.strokeStyle = '#e9ece8'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(390, 520); g.lineTo(400, 990); g.stroke();
  g.fillStyle = '#7a5a48'; g.beginPath(); g.ellipse(390, 350, 92, 118, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1b1614'; g.beginPath(); g.ellipse(385, 268, 96, 62, 0, Math.PI, 0); g.fill();
  g.strokeStyle = '#8a6a55'; g.lineWidth = 46; g.lineCap = 'round';
  g.beginPath(); g.moveTo(240, 800); g.lineTo(520, 760); g.moveTo(540, 810); g.lineTo(270, 760); g.stroke();
  return c.toDataURL('image/jpeg', 0.9);
}
