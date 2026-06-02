import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + process.env.TEMP + '\\cdp-profile-digidex2',
  '--no-first-run',
  '--disable-gpu',
  'http://localhost:4200/',
]);

await sleep(2500);

let targets;
for (let i = 0; i < 10; i++) {
  try {
    targets = await (await fetch(`http://localhost:${PORT}/json`)).json();
    if (targets.find((t) => t.type === 'page')) break;
  } catch {}
  await sleep(500);
}
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);

let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => { pending.set(++id, res); ws.send(JSON.stringify({ id, method, params })); });

const reqUrl = new Map(); // requestId -> url
const logs = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); return; }
  const m = msg.method, p = msg.params;
  if (m === 'Runtime.consoleAPICalled') {
    const text = p.args.map((a) => a.value ?? a.description ?? '').join(' ');
    if (!/vite|running in development/.test(text)) logs.push(`[console.${p.type}] ${text}`);
  }
  if (m === 'Runtime.exceptionThrown') logs.push(`[EXCEPTION] ${p.exceptionDetails.exception?.description || p.exceptionDetails.text}`);
  if (m === 'Network.requestWillBeSent') { reqUrl.set(p.requestId, p.request.url); if (/4000/.test(p.request.url)) logs.push(`[NET req] ${p.request.method} ${p.request.url}`); }
  if (m === 'Network.responseReceived' && /4000/.test(p.response.url)) logs.push(`[NET resp] ${p.response.status} ${p.response.url}`);
  if (m === 'Network.loadingFailed') logs.push(`[NET FAIL] ${p.errorText} url=${reqUrl.get(p.requestId) || '?'} (corsErr=${JSON.stringify(p.corsErrorStatus) || '-'})`);
});

await new Promise((res) => ws.addEventListener('open', res));
await send('Runtime.enable');
await send('Network.enable');
await send('Page.enable');
await send('Page.reload', { ignoreCache: true });
await sleep(5000);

// Reproduit l'appel exact DANS la page (origine localhost:4200)
const evalRes = await send('Runtime.evaluate', {
  awaitPromise: true,
  returnByValue: true,
  expression: `
    (async () => {
      try {
        const r = await fetch('http://localhost:4000/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: '{ digimons(page:0,pageSize:1){ totalElements } }' }),
        });
        return 'FETCH OK status=' + r.status + ' body=' + (await r.text());
      } catch (e) { return 'FETCH ERROR: ' + e.name + ' / ' + e.message; }
    })()
  `,
});
logs.push('[IN-PAGE FETCH] ' + (evalRes.result?.value ?? JSON.stringify(evalRes)));

console.log('==== LOGS NAVIGATEUR ====');
console.log(logs.length ? logs.join('\n') : '(aucun log)');

ws.close();
chrome.kill();
process.exit(0);
