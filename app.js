function slugifyKeyword(text) {
  return text.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}
function slugifyLocation(text) {
  return text.trim().replace(/[^A-Za-z0-9\s-]/g, '').replace(/\s+/g, '-');
}
function jobUrl(keyword, location) {
  return `https://www.jobstreet.co.id/id/job-search/${slugifyKeyword(keyword)}-jobs/in-${slugifyLocation(location)}`;
}
function openJobStreetSearch() {
  const keyword = document.getElementById('jobKeyword').value;
  const city = document.getElementById('jobCity').value;
  window.open(jobUrl(keyword, city), '_blank', 'noopener');
}
function generateQr() {
  const qrcodeEl = document.getElementById('qrcode');
  if (!qrcodeEl || typeof QRCode === 'undefined') return;
  const text = (document.getElementById('qrText')?.value || '').trim() || location.href;
  const dark = document.getElementById('qrDark')?.value || '#0f172a';
  const light = document.getElementById('qrLight')?.value || '#ffffff';
  qrcodeEl.innerHTML = '';
  new QRCode(qrcodeEl, {
    text,
    width: 240,
    height: 240,
    colorDark: dark,
    colorLight: light,
    correctLevel: QRCode.CorrectLevel.H
  });
}
function downloadQr(type) {
  const canvas = document.querySelector('#qrcode canvas');
  if (!canvas) {
    generateQr();
    setTimeout(() => downloadQr(type), 120);
    return;
  }
  const mime = type === 'jpeg' ? 'image/jpeg' : 'image/png';
  const fileName = type === 'jpeg' ? 'qrcode.jpg' : 'qrcode.png';
  const link = document.createElement('a');
  link.href = canvas.toDataURL(mime, 0.95);
  link.download = fileName;
  link.click();
}
const pasangan = {
  h: 'p', p: 'h', n: 'dh', dh: 'n', c: 'j', j: 'c', r: 'y', y: 'r',
  k: 'ny', ny: 'k', d: 'm', m: 'd', t: 'g', g: 't', s: 'b', b: 's',
  w: 'th', th: 'w', l: 'ng', ng: 'l'
};
const vowels = ['a', 'i', 'u', 'e', 'o'];
function isVowel(char) { return vowels.includes(char); }
function convertWord(word) {
  let w = word.toLowerCase().replace(/ng/g, '{NG}').replace(/ny/g, '{NY}').replace(/th/g, '{TH}').replace(/dh/g, '{DH}');
  const tokens = [];
  for (let i = 0; i < w.length;) {
    if (w.startsWith('{NG}', i)) { tokens.push('ng'); i += 4; }
    else if (w.startsWith('{NY}', i)) { tokens.push('ny'); i += 4; }
    else if (w.startsWith('{TH}', i)) { tokens.push('th'); i += 4; }
    else if (w.startsWith('{DH}', i)) { tokens.push('dh'); i += 4; }
    else { tokens.push(w[i]); i++; }
  }
  let result = '';
  let i = 0;
  while (i < tokens.length) {
    const cur = tokens[i];
    const next = tokens[i + 1];
    if (isVowel(cur)) { result += 'p' + cur; i++; continue; }
    if (pasangan[cur] && next && isVowel(next)) { result += pasangan[cur] + next; i += 2; continue; }
    if (pasangan[cur]) { result += pasangan[cur]; i++; continue; }
    result += cur; i++;
  }
  return result;
}
function convertWalikan() {
  const input = document.getElementById('walikanInput').value;
  const output = input.replace(/[A-Za-z]+/g, word => convertWord(word));
  document.getElementById('walikanOutput').textContent = output || 'Hasil konversi akan muncul di sini.';
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('qrcode')) {
    const qrText = document.getElementById('qrText');
    if (qrText && !qrText.value) qrText.value = 'https://www.jobstreet.co.id/';
    generateQr();
  }
});