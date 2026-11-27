(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, attrs = {}, html = '') => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (html) n.innerHTML = html;
  return n;
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, reduce ? Math.min(ms, 30) : ms));
const MAIL = 'joaovargas1108@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/jo%C3%A3o-vargas/';
const GITHUB = 'https://github.com/jrasch7';

/* ---------- idioma ---------- */
let LANG = 'pt';
try {
  const saved = localStorage.getItem('lang');
  if (saved === 'pt' || saved === 'en') LANG = saved;
  else if (!/^pt/i.test(navigator.language || 'pt')) LANG = 'en';
} catch (e) { if (!/^pt/i.test(navigator.language || 'pt')) LANG = 'en'; }
const tr = (pt, en) => (LANG === 'en' ? en : pt);
const EN = window.I18N_EN || {};
const renderers = [];
const onLang = fn => { renderers.push(fn); fn(); };

/* imagens reais (capturas) */
const IMG = {
  dash: { f: 'nivela-dashboard.webp', w: 1500, h: 1002 },
  cel:  { f: 'nivela-celular.webp', w: 588, h: 950 },
  sul:  { f: 'sulcore-demo.webp', w: 759, h: 767 }
};
const imgAlt = k => ({
  dash: tr('Painel do Nivela no computador: faturamento do dia, ações recomendadas e agenda.', 'Nivela dashboard on desktop: daily revenue, recommended actions and schedule.'),
  cel: tr('Painel do Nivela no celular, com menu inferior.', 'Nivela dashboard on a phone, with a bottom menu.'),
  sul: tr('Demonstração no site da SulCore: pedido em linguagem natural vira uma proposta para confirmar.', 'Demo on the SulCore site: a natural-language request becomes a proposal to confirm.')
}[k]);

function applyStatic() {
  $$('[data-i18n]').forEach(e => {
    if (e.dataset.pt === undefined) e.dataset.pt = e.innerHTML;
    const v = LANG === 'en' ? EN[e.dataset.i18n] : undefined;
    e.innerHTML = v !== undefined ? v : e.dataset.pt;
  });
  const attr = (sel, name, a) => $$(`[${sel}]`).forEach(e => {
    const k = 'pt' + a; if (e.dataset[k] === undefined) e.dataset[k] = e.getAttribute(name) || '';
    const v = LANG === 'en' ? EN[e.getAttribute(sel)] : undefined;
    e.setAttribute(name, v !== undefined ? v : e.dataset[k]);
  });
  attr('data-i18n-label', 'aria-label', 'Label');
  attr('data-i18n-ph', 'placeholder', 'Ph');
  document.documentElement.lang = LANG === 'en' ? 'en' : 'pt-BR';
  document.title = tr('João Vargas · Engenharia de software', 'João Vargas · Software engineering');
  $('#arq').setAttribute('aria-label', tr('Diagrama de arquitetura do Nivela. Use Tab para percorrer os blocos.', 'Nivela architecture diagram. Use Tab to move through the blocks.'));
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === LANG));
}
function setLang(l) {
  if (l === LANG) return;
  LANG = l;
  try { localStorage.setItem('lang', l); } catch (e) { /* sem armazenamento: segue sem lembrar */ }
  applyStatic();
  renderers.forEach(fn => fn());
}
$$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- terminal do hero ---------- */
(function terminal() {
  const out = $('#term-out');
  let token = 0;
  const lines = () => [
    ['p', tr('Inspeção do sistema Nivela', 'Inspection of the Nivela system')],
    ['v', tr('1. Isolamento entre clientes ..... conforme', '1. Isolation between customers ..... compliant')],
    ['v', tr('2. IA só age após confirmação .... conforme', '2. AI acts only after confirmation .... compliant')],
    ['v', tr('3. Dinheiro e fiscal sob teste ... conforme', '3. Money and fiscal under test ... compliant')],
    ['d', tr('Regra nº 1: toda query de negócio filtra tenant_id. Sem exceção.', 'Rule no. 1: every business query filters by tenant_id. No exceptions.')],
    ['k', tr('Liberado para serviço.', 'Released for service.')]
  ];
  const draw = (done, cur) => {
    out.innerHTML = done.map(l => `<span class="${l[0]}">${esc(l[1])}</span>`).join('\n') +
      (cur ? `\n<span class="${cur[0]}">${esc(cur[1])}</span><span class="caret"></span>` : '');
  };
  let first = true;
  async function run() {
    const id = ++token, L = lines();
    if (reduce || !first) { draw(L, null); return; }
    first = false;
    const done = [];
    for (const l of L) {
      let s = '';
      for (const ch of l[1]) {
        s += ch;
        if (id !== token) return;
        draw(done, [l[0], s]);
        await sleep(l[0] === 'p' ? 38 : 14);
      }
      done.push(l);
      await sleep(l[0] === 'p' ? 180 : 320);
    }
    if (id === token) { draw(done, null); out.insertAdjacentHTML('beforeend', '<span class="caret"></span>'); }
  }
  renderers.push(run);
  run();
})();

/* ---------- contadores ---------- */
(function counters() {
  const els = $$('[data-count]');
  const run = e => {
    const to = +e.dataset.count;
    if (reduce) { e.textContent = to; return; }
    const t0 = performance.now(), dur = 1300;
    const f = t => {
      const p = Math.min(1, (t - t0) / dur);
      e.textContent = Math.floor(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: .6 });
  els.forEach(e => io.observe(e));
})();

/* ---------- abas ---------- */
(function tabs() {
  const tabs = $$('.tabs [role=tab]');
  const show = t => {
    tabs.forEach(b => {
      const on = b === t;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      $('#' + b.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => show(b));
    b.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); show(n);
    });
  });
  window.showTab = id => { const t = $('#' + id); if (t) show(t); };
})();

/* ---------- arquitetura ---------- */
(function arch() {
  const svg = $('#arq');
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a = {}) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const nodes = () => ({
    web:  { x: 24,  y: 40,  w: 200, h: 62, t: tr('Navegador', 'Browser'), s: 'Jinja2 · Bootstrap · JS',
      d: { h: tr('Core ERP no navegador', 'Core ERP in the browser'),
        p: tr('Interface do operador renderizada no servidor. JavaScript vanilla só onde precisa de interação.', 'Operator UI rendered on the server. Vanilla JavaScript only where interaction is needed.'),
        l: tr(['Sem framework SPA: carrega rápido e funciona bem em celular.', 'Padrão de UI documentado: ícones sempre Font Awesome, alvos de toque de 44 px, nenhuma rolagem lateral.', 'Telas passam por gate visual com captura real em desktop e celular.'],
              ['No SPA framework: loads fast and works well on phones.', 'Documented UI standard: icons always Font Awesome, 44 px touch targets, no sideways scrolling.', 'Screens go through a visual gate with real captures on desktop and phone.']) } },
    ext:  { x: 24,  y: 170, w: 200, h: 62, t: tr('Apps parceiros', 'Partner apps'), s: 'API + webhooks',
      d: { h: tr('Ecossistema por API', 'API ecosystem'),
        p: tr('Outros produtos conversam com o ERP por uma API versionada e por webhooks.', 'Other products talk to the ERP through a versioned API and webhooks.'),
        l: tr(['Contrato versionado: o consumidor não quebra quando o ERP evolui.', 'Webhooks para eventos, em vez de polling.'],
              ['Versioned contract: consumers do not break when the ERP evolves.', 'Webhooks for events instead of polling.']) } },
    bp:   { x: 270, y: 40,  w: 190, h: 62, t: 'Blueprints', s: tr('camada HTTP fina', 'thin HTTP layer'),
      d: { h: tr('Blueprints: só HTTP', 'Blueprints: HTTP only'),
        p: tr('Autenticam, leem parâmetros, chamam um service e respondem. Não guardam regra de negócio.', 'They authenticate, read parameters, call a service and respond. They hold no business rules.'),
        l: tr(['70+ blueprints, cada um pequeno e previsível.', 'Ao tocar um blueprint grande, extrai-se só a parte alterada para um service. Nunca reescrever o arquivo inteiro.', 'Permissões por papel (RBAC próprio) checadas na borda.'],
              ['70+ blueprints, each small and predictable.', 'When touching a large blueprint, only the changed part is extracted into a service. Never rewrite the whole file.', 'Role-based permissions (custom RBAC) checked at the edge.']) } },
    svc:  { x: 270, y: 170, w: 190, h: 62, t: 'Services', s: tr('regra de negócio', 'business rules'),
      d: { h: tr('Services: onde mora a regra', 'Services: where the rules live'),
        p: tr('Cálculo, transação, estoque, financeiro, fiscal, comissão, pagamento e integração nascem aqui.', 'Calculation, transactions, stock, finance, fiscal, commission, payment and integrations are born here.'),
        l: tr(['290+ services, testáveis sem subir HTTP.', 'Financeiro com motor de títulos: posição de caixa separa realizado, projeção e vencidos.', 'Mesma regra serve ao ERP, à API de integração e à IA.'],
              ['290+ services, testable without starting HTTP.', 'Finance with a title-based engine: cash position separates realized, projected and overdue.', 'The same rule serves the ERP, the integration API and the AI.']) } },
    wk:   { x: 270, y: 300, w: 190, h: 62, t: 'Worker', s: 'RQ + Redis · retry',
      d: { h: tr('Tarefas em segundo plano', 'Background tasks'),
        p: tr('E-mail, lead da landing e rotinas pesadas saem da requisição.', 'Email, landing-page leads and heavy routines leave the request.'),
        l: tr(['Cada tarefa roda com app context, sessão de banco e tenant próprios.', 'Até 3 novas tentativas com espera crescente (30 s, 2 min, 10 min).', 'Sem Redis, cai para thread: simples em desenvolvimento, e a operação sabe o limite disso.'],
              ['Each task runs with its own app context, database session and tenant.', 'Up to 3 retries with growing waits (30 s, 2 min, 10 min).', 'Without Redis it falls back to a thread: simple in development, and operations know its limit.']) } },
    orm:  { x: 520, y: 105, w: 200, h: 62, t: 'SQLAlchemy 2', s: 'Alembic · 200+ migrations',
      d: { h: tr('Acesso a dados e migrations', 'Data access and migrations'),
        p: tr('Todo schema muda por Alembic. Nunca ALTER TABLE manual em produção.', 'Every schema change goes through Alembic. Never a manual ALTER TABLE in production.'),
        l: tr(['200+ migrations versionadas, com upgrade e downgrade.', 'Migration que mexe em schema é validada em PostgreSQL descartável (upgrade, downgrade, upgrade).', 'Regra: tabela nova nasce com RLS na própria migration.'],
              ['200+ versioned migrations, with upgrade and downgrade.', 'A migration that changes schema is validated on a throwaway PostgreSQL (upgrade, downgrade, upgrade).', 'Rule: a new table is born with RLS in the same migration.']) } },
    db:   { x: 520, y: 235, w: 170, h: 62, t: 'PostgreSQL', s: 'tenant_id + RLS',
      d: { h: tr('Banco multi-tenant', 'Multi-tenant database'),
        p: tr('Isolamento por linha: todas as tabelas de negócio têm tenant_id, e o PostgreSQL reforça com Row Level Security.', 'Row-level isolation: every business table has tenant_id, and PostgreSQL backs it up with Row Level Security.'),
        l: tr(['A request fixa o tenant no contexto e o banco filtra por conta própria.', 'Esquecer um WHERE no código não vira vazamento entre clientes.'],
              ['The request sets the tenant in context and the database filters on its own.', 'Forgetting a WHERE in code does not become a leak between customers.']) } },
    bill: { x: 750, y: 20,  w: 150, h: 54, t: 'Stripe · Asaas', s: tr('cobrança SaaS', 'SaaS billing'),
      d: { h: tr('Cobrança', 'Billing'), p: tr('Stripe no cartão (mensal e anual); Asaas para Pix e contingência.', 'Stripe for cards (monthly and annual); Asaas for Pix and as a fallback.'),
        l: tr(['Webhooks de cobrança.', 'Acesso do cliente muda conforme o status da assinatura.'], ['Billing webhooks.', 'Customer access changes with subscription status.']) } },
    fis:  { x: 750, y: 100, w: 150, h: 54, t: 'NFS-e Nacional', s: tr('emissão direta', 'direct issuance'),
      d: { h: tr('Fiscal', 'Fiscal'), p: tr('Emissão direta na NFS-e Nacional e NF-e na SEFAZ, sem intermediário pago.', 'Direct issuance through the national NFS-e system and NF-e at SEFAZ, with no paid middleman.'),
        l: tr(['Decisão registrada em ADR: menos custo e menos um ponto de falha.', 'Modo simulado para treino.'], ['Decision recorded as an ADR: lower cost and one less point of failure.', 'Simulated mode for training.']) } },
    mail: { x: 750, y: 180, w: 150, h: 54, t: 'Resend', s: tr('e-mail transacional', 'transactional email'),
      d: { h: tr('E-mail transacional', 'Transactional email'), p: tr('Envio por API com domínio próprio. Os envios saem pela fila.', 'Sent through an API with a custom domain. Sending goes through the queue.'),
        l: tr(['Recuperação de senha com tempo de resposta que não revela se o e-mail existe.'], ['Password recovery with a response time that does not reveal whether the email exists.']) } },
    ia:   { x: 750, y: 260, w: 150, h: 54, t: 'Claude API', s: tr('Nivela IA', 'Nivela AI'),
      d: { h: tr('IA dentro do produto', 'AI inside the product'), p: tr('A Nivela IA consulta dados por ferramentas e propõe ações. Quem executa é o service, depois da confirmação.', 'Nivela AI reads data through tools and proposes actions. The service executes, after confirmation.'),
        l: tr(['Respostas com ferramentas, não "de cabeça".', 'Ver a aba Nivela IA para o fluxo de segurança.'], ['Answers use tools, not guesses.', 'See the Nivela AI tab for the safety flow.']) } },
    obs:  { x: 750, y: 340, w: 150, h: 54, t: 'Sentry · Railway', s: tr('erros e deploy', 'errors and deploy'),
      d: { h: tr('Operação', 'Operations'), p: tr('Deploy em Railway com Gunicorn; erros no Sentry; CI no GitHub Actions.', 'Deployed on Railway with Gunicorn; errors in Sentry; CI on GitHub Actions.'),
        l: tr(['Deploy em produção é decisão humana, por PR de staging para main.'], ['Production deploy is a human decision, via a PR from staging to main.']) } }
  });
  const E = [['web','bp'],['ext','bp'],['bp','svc'],['svc','wk'],['svc','orm'],['orm','db'],['wk','db'],['svc','bill'],['svc','fis'],['wk','mail'],['svc','ia'],['svc','obs']];
  let selected = 'svc';
  function render() {
    const N = nodes();
    svg.innerHTML = '';
    [tr('CLIENTES', 'CLIENTS'), tr('APLICAÇÃO', 'APPLICATION'), tr('DADOS', 'DATA'), tr('INTEGRAÇÕES', 'INTEGRATIONS')].forEach((t, i) => {
      const c = mk('text', { x: [24, 270, 520, 750][i], y: 14, class: 'col' }); c.textContent = t; svg.append(c);
    });
    const edgeEls = E.map(([a, b]) => {
      const A = N[a], B = N[b];
      const x1 = A.x + A.w, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y + B.h / 2, mx = (x1 + x2) / 2;
      const p = mk('path', { class: 'edge', d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}` });
      svg.append(p);
      return { a, b, p };
    });
    const nodeEls = {};
    for (const [id, n] of Object.entries(N)) {
      const g = mk('g', { class: 'node', tabindex: 0, role: 'button' });
      g.append(mk('rect', { x: n.x, y: n.y, width: n.w, height: n.h }));
      const t1 = mk('text', { x: n.x + 14, y: n.y + 26 }); t1.textContent = n.t;
      const t2 = mk('text', { x: n.x + 14, y: n.y + 46, class: 'sm' }); t2.textContent = n.s;
      g.append(t1, t2);
      const pick = () => { selected = id; paint(); };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      svg.append(g);
      nodeEls[id] = g;
    }
    function paint() {
      const n = N[selected], linked = new Set([selected]);
      edgeEls.forEach(e => {
        const hot = e.a === selected || e.b === selected;
        e.p.classList.toggle('hot', hot);
        if (hot) { linked.add(e.a); linked.add(e.b); }
      });
      for (const k in nodeEls) {
        nodeEls[k].classList.toggle('sel', k === selected);
        nodeEls[k].classList.toggle('dim', !linked.has(k));
      }
      $('#arq-detail').innerHTML = `<h3>${esc(n.d.h)}</h3><p>${esc(n.d.p)}</p><ul>${n.d.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    }
    paint();
  }
  onLang(render);
})();

/* ---------- isolamento de tenant ---------- */
(function tenant() {
  const T = { 1: 'Barbearia Alfa', 2: 'Studio Beta', 3: 'Pet Gama' };
  const rows = () => [
    [101, 1, tr('Cliente A1', 'Customer A1'), tr('Corte', 'Haircut'), '09:00'], [102, 1, tr('Cliente A2', 'Customer A2'), tr('Barba', 'Beard trim'), '10:30'],
    [201, 2, tr('Cliente B1', 'Customer B1'), 'Manicure', '09:30'], [202, 2, tr('Cliente B2', 'Customer B2'), tr('Escova', 'Blow-dry'), '11:00'],
    [301, 3, tr('Cliente C1', 'Customer C1'), tr('Banho', 'Bath'), '14:00'], [302, 3, tr('Cliente C2', 'Customer C2'), tr('Tosa', 'Grooming'), '15:30']
  ];
  const sel = $('#ten-sel'), rls = $('#ten-rls'), bug = $('#ten-bug'), tb = $('#ten-table tbody');
  const sql = $('#ten-sql'), v = $('#ten-verdict');
  function run() {
    const me = +sel.value, R = rows();
    const q = bug.checked
      ? `<span class="kw">SELECT</span> * <span class="kw">FROM</span> agendamento;   <span class="c">${tr('-- esqueceu o filtro de tenant', '-- forgot the tenant filter')}</span>`
      : `<span class="kw">SELECT</span> * <span class="kw">FROM</span> agendamento <span class="kw">WHERE</span> tenant_id = <span class="st">${me}</span>;`;
    sql.innerHTML = `<span class="c">${tr('-- sessão', '-- session')}: SET app.tenant_id = ${me};   (${esc(T[me])})\n-- RLS: ${rls.checked ? tr('LIGADO', 'ON') : tr('DESLIGADO', 'OFF')}</span>\n${q}`;
    let res = bug.checked ? R : R.filter(r => r[1] === me);
    if (rls.checked) res = res.filter(r => r[1] === me);
    tb.innerHTML = res.length ? res.map(r =>
      `<tr class="${r[1] === me ? 'mine' : 'leak'}"><td>${r[0]}</td><td>${esc(T[r[1]])}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')
      : `<tr><td class="empty" colspan="5">${tr('nenhuma linha', 'no rows')}</td></tr>`;
    const leaked = res.filter(r => r[1] !== me).length;
    v.className = 'verdict ' + (leaked ? 'bad' : 'ok');
    v.textContent = leaked
      ? tr(`Vazamento: a sessão de ${T[me]} enxergou ${leaked} linha(s) de outros negócios. Foi o que aconteceria sem a segunda barreira.`,
           `Leak: the ${T[me]} session saw ${leaked} row(s) from other businesses. That is what would happen without the second barrier.`)
      : (bug.checked
        ? tr(`Protegido: a query estava errada, mas o banco só devolveu as linhas de ${T[me]}. O erro de código virou inofensivo.`,
             `Protected: the query was wrong, but the database only returned ${T[me]} rows. The code mistake became harmless.`)
        : tr(`Correto: ${res.length} linha(s), todas de ${T[me]}.`, `Correct: ${res.length} row(s), all from ${T[me]}.`));
  }
  function render() {
    const cur = sel.value || '1';
    sel.innerHTML = Object.entries(T).map(([k, n]) => `<option value="${k}">${esc(n)} (tenant ${k})</option>`).join('');
    sel.value = cur;
    run();
  }
  [sel, rls, bug].forEach(x => x.addEventListener('change', run));
  $('#ten-run').addEventListener('click', run);
  onLang(render);
})();

/* ---------- Nivela IA ---------- */
(function nivelaIA() {
  const log = $('#ia-log'), box = $('#ia-scn');
  const S = () => ({
    ok:  { label: tr('Agendar um corte', 'Book a haircut'), q: tr('Marca um corte pro Carlos amanhã às 15h com o Rafa.', 'Book a haircut for Carlos tomorrow at 3pm with Rafa.') },
    amb: { label: tr('Pedido incompleto', 'Incomplete request'), q: tr('Marca o Carlos amanhã.', 'Book Carlos for tomorrow.') },
    bad: { label: tr('Pedido perigoso', 'Dangerous request'), q: tr('Apaga todos os clientes inativos.', 'Delete all inactive customers.') }
  });
  let run = 0, current = 'ok';
  const add = (cls, html) => { const m = el('div', { class: 'msg ' + cls }, html); log.append(m); m.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); return m; };
  const sys = (name, txt, k = '') => add('sys ' + k, `<b>${esc(name)}</b> ${esc(txt)}`);
  const tool = () => tr('ferramenta', 'tool');
  const srv = () => tr('servidor', 'server');
  function buildChips() {
    box.innerHTML = '';
    Object.entries(S()).forEach(([k, s]) => {
      const b = el('button', { class: 'chip', type: 'button', 'aria-pressed': String(k === current) }, esc(s.label));
      b.addEventListener('click', () => start(k));
      box.append(b);
    });
  }
  async function start(k) {
    current = k;
    const id = ++run, s = S()[k];
    $$('.chip', box).forEach((c, i) => c.setAttribute('aria-pressed', Object.keys(S())[i] === k));
    log.innerHTML = '';
    add('user', esc(s.q));
    await sleep(500); if (id !== run) return;
    sys(tool(), tr('buscar_cliente("Carlos") → 1 resultado', 'find_customer("Carlos") → 1 result'));
    if (k === 'bad') {
      await sleep(600); if (id !== run) return;
      sys(tr('política', 'policy'), tr('pedido destrutivo em lote: fora do que a IA pode fazer', 'bulk destructive request: outside what the AI may do'), 'bad');
      await sleep(500); if (id !== run) return;
      add('ai', tr('Não consigo fazer isso por aqui. Apagar clientes em lote precisa ser feito pela tela de Clientes, com a sua conferência. Quer que eu mostre o caminho?',
                   'I can’t do that from here. Deleting customers in bulk has to be done from the Customers screen, with your review. Want me to show you the way?'));
      sys(tr('resultado', 'result'), tr('recusa clara. Nada foi gravado.', 'clear refusal. Nothing was written.'), 'ok');
      return;
    }
    await sleep(600); if (id !== run) return;
    sys(tool(), tr('buscar_servico("corte") → Corte masculino · 40 min', 'find_service("haircut") → Men’s haircut · 40 min'));
    if (k === 'amb') {
      await sleep(500); if (id !== run) return;
      sys(tr('validação', 'validation'), tr('faltam profissional e horário', 'professional and time are missing'), 'bad');
      await sleep(500); if (id !== run) return;
      const m = add('ai', tr('Com qual profissional e em que horário? Vejo estes livres amanhã:', 'With which professional and at what time? I see these free tomorrow:') + '<div class="row"></div>');
      ['Rafa · 15:00', 'Rafa · 16:30', 'Duda · 15:00'].forEach(o => {
        const b = el('button', { class: 'btn', type: 'button' }, esc(o));
        b.addEventListener('click', () => { if (id !== run) return; $$('.btn', m).forEach(x => x.disabled = true); proposal(id, o); });
        $('.row', m).append(b);
      });
      sys(tr('resultado', 'result'), tr('pergunta de esclarecimento. Nada foi gravado.', 'clarifying question. Nothing was written.'), 'ok');
      return;
    }
    await sleep(500); if (id !== run) return;
    sys(tool(), tr('disponibilidade(Rafa, amanhã 15:00) → livre', 'availability(Rafa, tomorrow 15:00) → free'));
    await proposal(id, 'Rafa · 15:00');
  }
  async function proposal(id, who) {
    await sleep(500); if (id !== run) return;
    const m = add('ai', `${tr('Encontrei tudo. Confirma este agendamento?', 'I found everything. Do you confirm this booking?')}
      <div class="prop"><span>${tr('cliente', 'customer')}: <b>Carlos</b></span><span>${tr('serviço', 'service')}: <b>${tr('Corte masculino', 'Men’s haircut')}</b></span><span>${tr('profissional · horário', 'professional · time')}: <b>${esc(who)}</b></span></div>
      <div class="row"></div>`);
    sys(tr('estado', 'state'), tr('ação proposta e validada. Aguardando confirmação humana.', 'action proposed and validated. Waiting for human confirmation.'));
    const row = $('.row', m);
    const yes = el('button', { class: 'btn primary', type: 'button' }, tr('Confirmar', 'Confirm')), no = el('button', { class: 'btn', type: 'button' }, tr('Cancelar', 'Cancel'));
    row.append(yes, no);
    let done = false;
    yes.addEventListener('click', async () => {
      if (id !== run) return;
      if (done) { sys(srv(), tr('confirmação repetida ignorada: a ação já foi executada (chave de idempotência)', 'repeated confirmation ignored: the action was already executed (idempotency key)'), 'bad'); return; }
      done = true;
      sys(srv(), tr('revalidando: tenant, usuário, permissão, horário ainda livre…', 're-validating: tenant, user, permission, slot still free…'));
      await sleep(700); if (id !== run) return;
      sys(srv(), tr('agendamento criado uma única vez.', 'booking created exactly once.'), 'ok');
      add('ai', tr('Pronto, agendado. Tente clicar em Confirmar de novo: o servidor não executa duas vezes.', 'Done, booked. Try clicking Confirm again: the server does not execute twice.'));
    });
    no.addEventListener('click', () => { if (id !== run || done) return; done = true; sys(tr('resultado', 'result'), tr('cancelado pela pessoa. Nada foi gravado.', 'cancelled by the person. Nothing was written.'), 'ok'); });
  }
  onLang(() => { buildChips(); start(current); });
})();

/* ---------- projetos ---------- */
(function projects() {
  const P = () => [
    { n: 'Nivela', img: 'dash', st: ['live', tr('em produção', 'in production')],
      d: tr('ERP SaaS multi-tenant para negócios de serviço: agenda, fila, financeiro, fiscal, assinaturas e a Nivela IA.', 'Multi-tenant SaaS ERP for service businesses: scheduling, queue, finance, fiscal, subscriptions and Nivela AI.'),
      tech: ['Python 3.12', 'Flask 3', 'SQLAlchemy 2', 'PostgreSQL + RLS', 'Redis/RQ', 'Stripe', 'Asaas', 'NFS-e'],
      det: tr(['Monólito modular: blueprints finos, regra em services, 290+ services e 560+ rotas.', 'Multi-tenancy por linha com tenant_id e RLS no PostgreSQL.', 'Financeiro com motor de títulos e conciliação OFX/CSV auditável; correções de dinheiro cobertas por testes de regressão.', 'Fiscal por emissão direta (NFS-e Nacional), sem intermediário pago.', 'Qualidade medida: gate visual com capturas reais, auditoria de celular e testes para telas que piscam ao carregar.'],
              ['Modular monolith: thin blueprints, rules in services, 290+ services and 560+ routes.', 'Row-level multi-tenancy with tenant_id and RLS in PostgreSQL.', 'Finance with a title-based engine and auditable OFX/CSV reconciliation; money fixes covered by regression tests.', 'Fiscal through direct issuance (national NFS-e), no paid middleman.', 'Measured quality: visual gate with real captures, phone audit and tests for screens that flicker while loading.']) },
    { n: tr('Nivela IA', 'Nivela AI'), st: ['live', tr('dentro do Nivela', 'inside Nivela')],
      d: tr('Assistente que entende pedidos em linguagem natural e propõe ações. Nunca grava sozinha.', 'Assistant that understands natural-language requests and proposes actions. It never writes on its own.'),
      tech: ['Claude (Anthropic)', 'tool use', tr('idempotência', 'idempotency')],
      det: tr(['Três saídas possíveis: ação proposta validada, pergunta de esclarecimento ou recusa clara.', 'Confirmação explícita, revalidação no servidor, escopo de tenant e usuário, execução única.', 'Responde consultando o menu real, os guias e os dados do negócio por ferramentas, em vez de "de cabeça".', 'Avaliação de mudanças (prompt, modelo, ferramentas) antes de ir para staging.'],
              ['Three possible outcomes: a validated proposed action, a clarifying question or a clear refusal.', 'Explicit confirmation, server-side re-validation, tenant and user scope, single execution.', 'It answers by looking up the real menu, guides and business data through tools, not from memory.', 'Changes (prompt, model, tools) are evaluated before reaching staging.']) },
    { n: 'SulCore', img: 'sul', st: ['live', tr('site aberto', 'open site')],
      d: tr('Site da SulCore, feito para mostrar como se trabalha: exportação estática, CI forte e código aberto.', 'The SulCore website, built to show how the work is done: static export, strong CI and open source.'),
      tech: ['Next.js 16', 'TypeScript strict', 'Tailwind 4', 'Playwright', 'Vitest', 'GitHub Pages'],
      det: tr(['Exportação 100% estática, sem servidor, sem banco, sem rastreio.', 'Rotas /pt/ e /en/ com dicionários tipados.', 'CodeQL, OpenSSF Scorecard, Lighthouse CI e testes de acessibilidade no pipeline.', 'ADRs numerados para cada decisão.'],
              ['100% static export, no server, no database, no tracking.', '/pt/ and /en/ routes with typed dictionaries.', 'CodeQL, OpenSSF Scorecard, Lighthouse CI and accessibility tests in the pipeline.', 'Numbered ADRs for every decision.']),
      link: ['https://github.com/sulcore/sulcore.github.io', tr('Ver o código', 'See the code')] }
  ];
  const wrap = $('#cards');
  onLang(() => {
    const open = $$('details', wrap).map(d => d.open);
    wrap.innerHTML = '';
    P().forEach((p, i) => {
      const c = el('article', { class: 'card' });
      const im = p.img ? IMG[p.img] : null;
      c.innerHTML = `${im ? `<div class="thumb"><img src="assets/img/${im.f}" width="${im.w}" height="${im.h}" alt="${esc(imgAlt(p.img))}" loading="lazy" decoding="async"></div>` : ''}<header><h3>${esc(p.n)}</h3><span class="status ${p.st[0]}">${esc(p.st[1])}</span></header>
        <p>${esc(p.d)}</p>
        <div>${p.tech.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <div class="more"><details${open[i] ? ' open' : ''}><summary>${tr('Por dentro', 'Under the hood')}</summary><ul>${p.det.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
        ${p.link ? `<div class="links"><a href="${p.link[0]}" rel="noopener" target="_blank">${esc(p.link[1])} →</a></div>` : ''}</div>`;
      wrap.append(c);
    });
  });
})();

/* ---------- pipeline de IA no desenvolvimento ---------- */
(function pipeline() {
  const S = () => [
    { t: tr('Contexto versionado', 'Versioned context'), h: false,
      d: tr('O agente começa pelas regras permanentes do repositório (AGENTS.md), pela arquitetura, pela documentação do módulo e por um vault de decisões de produto. Nada de contexto só na minha cabeça.', 'The agent starts from the repository’s permanent rules (AGENTS.md), the architecture, the module docs and a vault of product decisions. No context that lives only in my head.'),
      l: tr(['Regras invioláveis escritas: isolamento de tenant, permissões, migrations, dinheiro.', 'Decisões em ADRs, não em conversa.'], ['Inviolable rules in writing: tenant isolation, permissions, migrations, money.', 'Decisions in ADRs, not in chat.']) },
    { t: tr('Branch isolada', 'Isolated branch'), h: false,
      d: tr('Todo trabalho nasce de staging em branch ou worktree próprios. Agente não mexe na main e não publica produção.', 'All work starts from staging in its own branch or worktree. Agents do not touch main and do not publish to production.'),
      l: tr(['Hotfix também vai por PR.', 'Antes de abrir PR: conferir PRs e branches abertas para não pisar no trabalho de outro.'], ['Hotfixes go through a PR too.', 'Before opening a PR: check open PRs and branches so nobody steps on another’s work.']) },
    { t: tr('Plano e escopo', 'Plan and scope'), h: false,
      d: tr('Resultado esperado e critério de pronto em uma frase. Mudança mínima e aditiva; regra nova em service.', 'Expected result and definition of done in one sentence. Minimal, additive change; new rules go in a service.'),
      l: tr(['Se falta uma decisão que só o dono toma, pergunta uma vez.'], ['If a decision only the owner can make is missing, ask once.']) },
    { t: tr('Implementação', 'Implementation'), h: false,
      d: tr('O agente implementa com substituição exata e direcionada. Regex de escopo aberto para editar código é proibido.', 'The agent implements with exact, targeted replacements. Open-scope regex for editing code is forbidden.'),
      l: tr(['Ferramentas que apagam código alheio por erro são o principal risco real.'], ['Tools that delete unrelated code by mistake are the main real risk.']) },
    { t: tr('Evidência, não resumo', 'Evidence, not summaries'), h: true,
      d: tr('Leio o diff de verdade, confiro adições e remoções e valido a afirmação contra o código. "Está pronto" dito por um agente nunca é o critério de aceite.', 'I read the real diff, check additions and removals, and validate claims against the code. An agent saying "it’s done" is never the acceptance criterion.'),
      l: tr(['Testes focados no que mudou, suíte maior quando cabe, compileall e git diff --check.', 'Tela: abrir no navegador, desktop e celular, com toque real.'], ['Focused tests on what changed, a broader suite when warranted, compileall and git diff --check.', 'UI: open it in the browser, desktop and phone, with real touch.']) },
    { t: tr('Gate de qualidade', 'Quality gate'), h: false,
      d: tr('PR passa por CI no runner próprio, gate visual e documentação atualizada no mesmo PR. Documento velho é entrega incompleta.', 'The PR goes through CI on a self-hosted runner, a visual gate and docs updated in the same PR. Outdated docs mean an unfinished delivery.'),
      l: tr(['A própria IA do produto aprende a cada entrega: manual, habilidade e teste que falha se ficar para trás.'], ['The product’s own AI learns with every delivery: manual, skill and a test that fails if it falls behind.']) },
    { t: tr('Decisão humana', 'Human decision'), h: true,
      d: tr('Merge, release e validação em produção são decisões deliberadas, seguidas de smoke test e monitoramento.', 'Merge, release and production validation are deliberate decisions, followed by smoke tests and monitoring.'),
      l: tr(['Staging para main exige autorização explícita, sempre.'], ['Staging to main always requires explicit authorization.']) }
  ];
  const ol = $('#pipe'), dt = $('#pipe-detail');
  let cur = 4;
  function show(i) {
    cur = i;
    const s = S()[i];
    $$('button', ol).forEach((x, j) => x.setAttribute('aria-pressed', j === i));
    dt.innerHTML = `<h3>${esc(s.t)} <span class="tag ${s.h ? 'human' : ''}">${s.h ? tr('decisão humana', 'human decision') : tr('agente com regras', 'agent with rules')}</span></h3><p>${esc(s.d)}</p><ul>${s.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  }
  onLang(() => {
    ol.innerHTML = '';
    S().forEach((s, i) => {
      const li = el('li'), b = el('button', { type: 'button', class: s.h ? 'human' : '', 'aria-pressed': 'false' }, esc(s.t));
      b.addEventListener('click', () => show(i));
      li.append(b); ol.append(li);
    });
    show(cur);
  });
})();

/* ---------- stack ---------- */
(function stack() {
  const G = () => ({
    [tr('Back-end', 'Backend')]: [['Python 3.12', tr('Núcleo do Nivela', 'Nivela core')], ['Flask 3', tr('Core ERP e API', 'Core ERP and API')], ['SQLAlchemy 2', tr('ORM e consultas', 'ORM and queries')], ['Alembic', tr('200+ migrations versionadas', '200+ versioned migrations')], ['Gunicorn', tr('Servidor de produção', 'Production server')], ['Redis + RQ', tr('Fila, retry e cache', 'Queue, retries and cache')]],
    [tr('Dados', 'Data')]: [['PostgreSQL', tr('Banco único com RLS por tenant', 'Single database with per-tenant RLS')], ['Row Level Security', tr('Segunda barreira de isolamento', 'Second isolation barrier')], ['SQLite', tr('Banco dos testes do Nivela', 'Nivela’s test database')]],
    [tr('Front-end', 'Frontend')]: [['TypeScript', 'SulCore'], ['Next.js 16', tr('Site da SulCore', 'SulCore website')], ['React 19', 'Next.js'], ['Tailwind 4', tr('Site da SulCore', 'SulCore website')], ['Jinja2', tr('Telas do Core ERP', 'Core ERP screens')], ['JavaScript vanilla', tr('Interações do ERP e deste portfólio', 'ERP interactions and this portfolio')]],
    [tr('IA', 'AI')]: [['Claude API', tr('Nivela IA e assistente de ajuda', 'Nivela AI and the help assistant')], ['Tool use', tr('Consulta de dados por ferramentas', 'Data lookups through tools')], [tr('Avaliação de prompts', 'Prompt evaluation'), tr('Comparar modelo e instrução antes de publicar', 'Compare model and instructions before publishing')]],
    [tr('Qualidade e operação', 'Quality and operations')]: [['pytest', tr('390+ arquivos de teste no Nivela', '390+ test files in Nivela')], ['Playwright', tr('Validação visual e E2E', 'Visual validation and E2E')], ['GitHub Actions', 'CI'], ['CodeQL', tr('Análise estática no site da SulCore', 'Static analysis on the SulCore site')], ['Docker', tr('Ambiente', 'Environment')], ['Railway', tr('Deploy do Nivela', 'Nivela deployment')], ['Sentry', tr('Erros em produção', 'Production errors')]],
    [tr('Integrações', 'Integrations')]: [['Stripe', tr('Assinatura no cartão', 'Card subscriptions')], ['Asaas', tr('Pix e contingência', 'Pix and fallback')], ['NFS-e Nacional', tr('Emissão fiscal direta', 'Direct fiscal issuance')], ['Resend', tr('E-mail transacional', 'Transactional email')]]
  });
  const f = $('#stack-filter'), ul = $('#stack-list'), note = $('#stack-note');
  let cur = 0;
  onLang(() => {
    const g = G(), cats = [tr('Tudo', 'All'), ...Object.keys(g)];
    f.innerHTML = ''; ul.innerHTML = '';
    note.textContent = tr('Passe o mouse ou foque em um item para ver onde ele é usado.', 'Hover or focus an item to see where it is used.');
    const apply = i => {
      cur = i;
      $$('.chip', f).forEach((x, j) => x.setAttribute('aria-pressed', j === i));
      $$('li', ul).forEach(li => li.hidden = !(i === 0 || li.dataset.cat === cats[i]));
    };
    cats.forEach((c, i) => {
      const b = el('button', { class: 'chip', type: 'button', 'aria-pressed': 'false' }, esc(c));
      b.addEventListener('click', () => apply(i));
      f.append(b);
    });
    for (const [cat, items] of Object.entries(g)) items.forEach(([n, u]) => {
      const li = el('li'); li.dataset.cat = cat;
      const b = el('button', { type: 'button' }, esc(n));
      const show = () => { note.textContent = `${n}: ${u}`; };
      b.addEventListener('mouseenter', show); b.addEventListener('focus', show); b.addEventListener('click', show);
      li.append(b); ul.append(li);
    });
    apply(cur);
  });
})();

/* ---------- paleta de comandos ---------- */
(function palette() {
  const pal = $('#palette'), inp = $('#pal-input'), list = $('#pal-list');
  const go = id => () => { document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  const tab = (id, sec) => () => { go(sec)(); window.showTab(id); };
  const CMD = () => [
    [tr('Ir para: Nivela por dentro', 'Go to: Inside Nivela'), tr('seção', 'section'), go('nivela')],
    [tr('Ver a arquitetura do Nivela', 'See the Nivela architecture'), 'demo', tab('t-arq', 'nivela')],
    [tr('Testar o isolamento de tenant', 'Test tenant isolation'), 'demo', tab('t-ten', 'nivela')],
    [tr('Conversar com a Nivela IA (simulação)', 'Talk to Nivela AI (simulation)'), 'demo', tab('t-ia', 'nivela')],
    [tr('Ir para: Projetos', 'Go to: Projects'), tr('seção', 'section'), go('projetos')],
    [tr('Ir para: IA no desenvolvimento', 'Go to: AI in development'), tr('seção', 'section'), go('ia-dev')],
    [tr('Ir para: Pipeline', 'Go to: Pipeline'), tr('seção', 'section'), go('pipeline')],
    [tr('Ir para: Stack', 'Go to: Stack'), tr('seção', 'section'), go('stack')],
    [tr('Ir para: Contato', 'Go to: Contact'), tr('seção', 'section'), go('contato')],
    [tr('Copiar e-mail', 'Copy email'), tr('ação', 'action'), copyMail],
    [tr('Abrir LinkedIn', 'Open LinkedIn'), 'link', () => window.open(LINKEDIN, '_blank', 'noopener')],
    [tr('Abrir GitHub', 'Open GitHub'), 'link', () => window.open(GITHUB, '_blank', 'noopener')],
    [tr('Mudar idioma', 'Switch language'), tr('ação', 'action'), () => setLang(LANG === 'pt' ? 'en' : 'pt')],
    [tr('Voltar ao topo', 'Back to top'), tr('seção', 'section'), go('top')]
  ];
  let shown = [], idx = 0;
  function draw() {
    const q = inp.value.trim().toLowerCase();
    shown = CMD().filter(c => c[0].toLowerCase().includes(q) || c[1].includes(q));
    idx = Math.min(idx, Math.max(0, shown.length - 1));
    list.innerHTML = '';
    shown.forEach((c, i) => {
      const li = el('li', { role: 'option', 'aria-selected': i === idx }, `<span>${esc(c[0])}</span><small>${esc(c[1])}</small>`);
      li.addEventListener('click', () => run(c));
      li.addEventListener('mousemove', () => { idx = i; $$('li', list).forEach((x, j) => x.setAttribute('aria-selected', j === i)); });
      list.append(li);
    });
    if (!shown.length) list.append(el('li', {}, `<span>${tr('Nenhum comando encontrado', 'No command found')}</span>`));
  }
  let last;
  function open() { last = document.activeElement; pal.hidden = false; inp.value = ''; idx = 0; draw(); inp.focus(); }
  function close() { pal.hidden = true; if (last && last.focus) last.focus(); }
  function run(c) { close(); c[2](); }
  inp.addEventListener('input', () => { idx = 0; draw(); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, shown.length - 1); draw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); draw(); }
    else if (e.key === 'Enter' && shown[idx]) { e.preventDefault(); run(shown[idx]); }
    else if (e.key === 'Tab') e.preventDefault();
  });
  pal.addEventListener('click', e => { if (e.target === pal) close(); });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? open() : close(); }
    else if (e.key === 'Escape' && !pal.hidden) close();
  });
  $('#open-palette').addEventListener('click', open);
  $$('[data-open-palette]').forEach(b => b.addEventListener('click', open));
  function copyMail() {
    const done = () => toast(tr('E-mail copiado', 'Email copied'));
    if (navigator.clipboard) navigator.clipboard.writeText(MAIL).then(done, () => toast(MAIL)); else toast(MAIL);
  }
  $('#copy-mail').addEventListener('click', copyMail);
})();

/* ---------- seção ativa no menu ---------- */
(function spy() {
  const links = $$('.nav nav a');
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + x.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  ['galeria', 'nivela', 'projetos', 'ia-dev', 'pipeline', 'stack', 'contato'].forEach(id => io.observe(document.getElementById(id)));
})();

/* ---------- galeria com ampliação ---------- */
(function gallery() {
  const wrap = $('#gallery'), dlg = $('#lightbox'), body = $('#lb-body'), cap = $('#lb-cap');
  const items = () => [
    { k: 'dash', kind: 'browser', s: 's8', t: tr('Nivela no computador', 'Nivela on desktop'), d: tr('Demonstração pública, dados fictícios', 'Public demo, fictional data') },
    { k: 'cel', kind: 'phone', s: 's4', t: tr('Nivela no celular', 'Nivela on phone'), d: tr('Mesma regra de negócio, tela pensada para o toque', 'Same business rules, screen designed for touch') },
    { k: 'sul', kind: 'browser', s: 's12', t: tr('Site da SulCore', 'SulCore website'), d: tr('Demonstração com confirmação antes de gravar', 'Demo with confirmation before saving') }
  ];
  function open(it) {
    const im = IMG[it.k];
    body.innerHTML = `<img src="assets/img/${im.f}" width="${im.w}" height="${im.h}" alt="${esc(imgAlt(it.k))}">`;
    cap.textContent = `${it.t}. ${it.d}.`;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  onLang(() => {
    wrap.innerHTML = '';
    items().forEach((it, n) => {
      const im = IMG[it.k];
      const f = el('figure', { class: 'shot ' + it.s });
      f.innerHTML = `<button type="button" class="shot-btn" aria-label="${esc(tr('Ampliar: ', 'Enlarge: ') + it.t)}"><span class="frame ${it.kind}"><img src="assets/img/${im.f}" width="${im.w}" height="${im.h}" alt="${esc(imgAlt(it.k))}" loading="lazy" decoding="async"></span></button>
        <figcaption><span class="fig-no">${tr('Foto', 'Photo')} ${n + 1}</span><b>${esc(it.t)}</b>${esc(it.d)}</figcaption>`;
      const btn = $('.shot-btn', f);
      btn.addEventListener('click', () => open(it));
      wrap.append(f);
    });
  });
  $('#lb-close').addEventListener('click', () => dlg.close ? dlg.close() : dlg.removeAttribute('open'));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  renderers.push(() => { $('#lb-close').setAttribute('aria-label', tr('Fechar', 'Close')); dlg.setAttribute('aria-label', tr('Imagem ampliada', 'Enlarged image')); });
})();

/* ---------- foto (opcional): assets/foto.jpg ---------- */
(function portrait() {
  /* Para mostrar sua foto: coloque assets/foto.jpg (proporção 4:5) e mude para true. */
  const HAS_PHOTO = false;
  if (!HAS_PHOTO) return;
  const fig = $('#portrait');
  const probe = new Image();
  probe.onload = () => {
    probe.alt = '';
    probe.width = 480; probe.height = 600;
    fig.append(probe);
    fig.classList.add('has-photo');
  };
  probe.src = 'assets/foto.jpg';
})();

/* ---------- tela da pipeline (lê pipeline.json, gerado pela própria pipeline) ---------- */
(function pipelineView() {
  const head = $('#pl-head'), graph = $('#pl-graph'), detail = $('#pl-detail'), note = $('#pl-note');
  let data = null, failed = false, sel = null;
  const L = o => (o && typeof o === 'object' ? (o[LANG] ?? o.pt ?? '') : (o ?? ''));
  const ST = () => ({ passed: tr('Passou', 'Passed'), failed: tr('Falhou', 'Failed'), skipped: tr('Pulada', 'Skipped'), pending: tr('Pendente', 'Pending'), partial: tr('Parcial', 'Partial') });
  const ICON = {
    passed: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5"/></svg>',
    failed: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
    skipped: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9"/></svg>',
    pending: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4.5"/><path d="M8 5.5V8l1.8 1.2"/></svg>'
  };
  ICON.partial = ICON.pending;
  const METRIC = {
    arquivos: ['arquivos', 'files'], arquivosDeTexto: ['arquivos de texto', 'text files'], imagensKB: ['imagens (KB)', 'images (KB)'],
    codigoGzipKB: ['código comprimido (KB)', 'gzipped code (KB)'], chavesDeTexto: ['chaves de texto', 'text keys'], ancoras: ['âncoras', 'anchors'],
    arquivosJS: ['arquivos JS', 'JS files'], referencias: ['referências', 'references'], tamanhoKB: ['tamanho (KB)', 'size (KB)'], commit: ['commit', 'commit'],
    testes: ['testes', 'tests'], execucoes: ['execuções', 'runs'], falhas: ['falhas', 'failures'], instaveis: ['instáveis', 'flaky'], projetos: ['projetos', 'projects'],
    vulnerabilidades: ['vulnerabilidades', 'vulnerabilities'], diretivasCSP: ['diretivas CSP', 'CSP directives'], linhasDoDiff: ['linhas do diff', 'diff lines'],
    esperouSegundos: ['espera (s)', 'wait (s)'], performance: ['desempenho', 'performance'], accessibility: ['acessibilidade', 'accessibility'],
    'best-practices': ['boas práticas', 'best practices'], seo: ['SEO', 'SEO'], 'largest-contentful-paint': ['LCP (ms)', 'LCP (ms)'],
    'cumulative-layout-shift': ['CLS', 'CLS'], 'total-blocking-time': ['TBT (ms)', 'TBT (ms)']
  };
  const stampIO = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.remove('pre'); x.target.classList.add('slam'); stampIO.unobserve(x.target); } }), { threshold: .6 });
  const dur = ms => (ms == null ? '' : ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`);
  const when = iso => { try { return new Date(iso).toLocaleString(LANG === 'en' ? 'en-US' : 'pt-BR', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return iso; } };

  function levels() {
    const by = Object.fromEntries(data.stages.map(s => [s.id, s]));
    const lv = {};
    const depth = s => lv[s.id] ?? (lv[s.id] = s.needs.length ? 1 + Math.max(...s.needs.map(n => depth(by[n]))) : 0);
    data.stages.forEach(depth);
    const cols = [];
    data.stages.forEach(s => (cols[lv[s.id]] ??= []).push(s));
    return cols;
  }

  function renderHead() {
    const t = data.totals, r = data.run, S = ST();
    const src = data.source === 'ci' ? tr('GitHub Actions', 'GitHub Actions') : tr('Execução local', 'Local run');
    head.innerHTML = `<span class="pl-pill ${data.status}"><i>${ICON[data.status] || ICON.pending}</i>${esc(S[data.status] || data.status)}</span>
      <dl class="pl-meta">
        <div><dt>${tr('Fonte', 'Source')}</dt><dd>${esc(src)}</dd></div>
        <div><dt>commit</dt><dd><code>${esc(r.shaShort)}</code> · ${esc(r.branch)}</dd></div>
        <div><dt>${tr('Etapas', 'Stages')}</dt><dd>${t.passed} ${tr('ok', 'ok')} · ${t.failed} ${tr('falhas', 'failed')} · ${t.skipped + t.pending} ${tr('puladas ou pendentes', 'skipped or pending')}</dd></div>
        <div><dt>${tr('Tempo', 'Time')}</dt><dd>${dur(t.durationMs) || '–'}</dd></div>
        <div><dt>${tr('Gerado em', 'Generated')}</dt><dd>${esc(when(data.generatedAt))}</dd></div>
      </dl>
      ${r.url ? `<a class="pl-run" href="${esc(r.url)}" target="_blank" rel="noopener">${tr('Ver execução no GitHub', 'View run on GitHub')} →</a>` : ''}`;
    const pill = $('.pl-pill', head);
    if (pill && !reduce) { pill.classList.add('pre'); stampIO.observe(pill); }
  }

  function renderGraph() {
    const S = ST(), cols = levels();
    graph.innerHTML = '<svg class="pl-edges" aria-hidden="true"></svg>';
    cols.forEach((col, i) => {
      const c = el('div', { class: 'pl-col', role: 'group', 'aria-label': tr(`Nível ${i + 1}`, `Level ${i + 1}`) });
      col.forEach(s => {
        const idx = data.stages.indexOf(s) + 1;
        const b = el('button', { type: 'button', class: `pl-node ${s.status}`, 'data-id': s.id, 'aria-pressed': String(s.id === sel) },
          `<span class="pl-top"><span class="pl-num">${String(idx).padStart(2, '0')}</span><i class="pl-ic">${ICON[s.status] || ICON.pending}</i></span>
           <b>${esc(L(s.name))}</b><span class="pl-st">${esc(S[s.status] || s.status)}${s.durationMs ? ' · ' + dur(s.durationMs) : ''}</span>`);
        b.addEventListener('click', () => { sel = s.id; renderGraph(); renderDetail(); });
        c.append(b);
      });
      graph.append(c);
    });
    requestAnimationFrame(drawEdges);
  }

  function drawEdges() {
    const svg = $('.pl-edges', graph);
    if (!svg) return;
    const box = graph.getBoundingClientRect();
    if (innerWidth < 900) { svg.innerHTML = ''; return; }
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('width', box.width); svg.setAttribute('height', box.height);
    const pos = id => { const n = $(`.pl-node[data-id="${id}"]`, graph); const r = n.getBoundingClientRect(); return { l: r.left - box.left, r: r.right - box.left, y: r.top - box.top + r.height / 2 }; };
    svg.innerHTML = data.stages.flatMap(s => s.needs.map(n => {
      const a = pos(n), b = pos(s.id), mx = (a.r + b.l) / 2;
      const hot = s.id === sel || n === sel;
      return `<path class="${hot ? 'hot' : ''}" d="M${a.r} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.l} ${b.y}"/>`;
    })).join('');
  }

  function renderDetail() {
    const s = data.stages.find(x => x.id === sel), S = ST();
    if (!s) { detail.innerHTML = ''; return; }
    const checks = (s.checks || []).map(c => `<li class="${c.ok ? 'ok' : 'bad'}"><i>${c.ok ? ICON.passed : ICON.failed}</i><span>${esc(LANG === 'en' && c.en ? c.en : c.name)}${c.detail ? ` <em>${esc(c.detail)}</em>` : ''}</span></li>`).join('');
    const metrics = Object.entries(s.metrics || {}).map(([k, v]) => `<span class="pl-metric"><small>${esc(METRIC[k] ? METRIC[k][LANG === 'en' ? 1 : 0] : k)}</small><b>${esc(v)}</b></span>`).join('');
    const nt = L(s.note);
    detail.innerHTML = `<h3>${esc(L(s.name))} <span class="pl-pill ${s.status}"><i>${ICON[s.status] || ICON.pending}</i>${esc(S[s.status] || s.status)}</span></h3>
      <p>${esc(L(s.what))}</p>
      <p class="pl-why"><b>${tr('Por que existe', 'Why it exists')}:</b> ${esc(L(s.why))}</p>
      ${nt ? `<p class="pl-nt">${esc(nt)}</p>` : ''}
      ${metrics ? `<div class="pl-metrics">${metrics}</div>` : ''}
      ${checks ? `<ul class="pl-checks">${checks}</ul>` : ''}
      <p class="pl-foot"><span class="tag">${tr('inspirada em', 'inspired by')} ${esc(L(s.inspired))}</span> <code>${esc(s.command)}</code></p>`;
  }

  function render() {
    if (failed || !data) {
      head.innerHTML = ''; graph.innerHTML = '';
      detail.innerHTML = `<p class="hint">${failed ? tr('Não foi possível ler pipeline.json agora.', 'Could not read pipeline.json right now.') : tr('Carregando o relatório da pipeline…', 'Loading the pipeline report…')}</p>`;
      note.textContent = '';
      return;
    }
    if (!sel) sel = (data.stages.find(s => s.status === 'failed') || data.stages.find(s => s.id === 'testes') || data.stages[0]).id;
    renderHead(); renderGraph(); renderDetail();
    note.textContent = data.source === 'ci'
      ? tr('Relatório gerado pela pipeline no GitHub Actions a cada push na main. Etapas que rodam depois da publicação aparecem como pendentes aqui e têm o resultado no Actions.', 'Report generated by the pipeline on GitHub Actions on every push to main. Stages that run after publishing show as pending here, with their result in Actions.')
      : tr('Relatório de uma execução local da pipeline (npm run pipeline). Em produção, o GitHub Actions gera este arquivo a cada push na main.', 'Report from a local pipeline run (npm run pipeline). In production, GitHub Actions generates this file on every push to main.');
  }

  addEventListener('resize', () => { if (data && !failed) drawEdges(); });
  onLang(render);
  fetch('pipeline.json', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then(j => { data = j; render(); })
    .catch(() => { failed = true; render(); });
})();

applyStatic();
})();
