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

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- fundo: grade de pontos que reage ao mouse ---------- */
(function bg() {
  const cv = $('#bg'), cx = cv.getContext('2d');
  let w, h, dpr, pts = [], mx = -999, my = -999;
  const gap = 46;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) pts.push([x, y]);
    draw();
  }
  function draw() {
    cx.clearRect(0, 0, w, h);
    for (const [x, y] of pts) {
      const d = Math.hypot(x - mx, y - my);
      const k = Math.max(0, 1 - d / 190);
      cx.fillStyle = k > 0 ? `rgba(167,139,250,${0.12 + k * 0.45})` : 'rgba(255,255,255,0.07)';
      cx.beginPath();
      cx.arc(x, y, 1.1 + k * 2.2, 0, 6.283);
      cx.fill();
    }
  }
  addEventListener('resize', size);
  if (!reduce) {
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; requestAnimationFrame(draw); }, { passive: true });
    addEventListener('pointerleave', () => { mx = my = -999; draw(); });
  }
  size();
})();

/* ---------- terminal do hero ---------- */
(async function terminal() {
  const out = $('#term-out');
  const lines = [
    ['p', '$ whoami'], ['v', 'joao-vargas · full-stack · Novo Hamburgo/RS'],
    ['p', '$ cat foco.txt'], ['k', 'SaaS multi-tenant  ·  financeiro e fiscal  ·  IA com confirmação'],
    ['p', '$ nivela --stack'], ['v', 'Python 3.12 · Flask 3 · SQLAlchemy 2 · PostgreSQL (RLS)'],
    ['v', 'Redis/RQ · Stripe · Asaas · NFS-e Nacional · Anthropic'],
    ['p', '$ nivela --regra-numero-1'], ['d', 'toda query de negócio filtra tenant_id. Sem exceção.'],
    ['p', '$ _']
  ];
  const draw = (done, cur) => {
    out.innerHTML = done.map(l => `<span class="${l[0]}">${esc(l[1])}</span>`).join('\n') +
      (cur ? `\n<span class="${cur[0]}">${esc(cur[1])}</span><span class="caret"></span>` : '');
  };
  if (reduce) { draw(lines, null); return; }
  const done = [];
  for (const l of lines) {
    let s = '';
    for (const ch of l[1]) {
      s += ch;
      draw(done, [l[0], s]);
      await sleep(l[0] === 'p' ? 38 : 14);
    }
    done.push(l);
    await sleep(l[0] === 'p' ? 180 : 320);
  }
  draw(done, null);
  out.insertAdjacentHTML('beforeend', '<span class="caret"></span>');
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
  const N = {
    web:   { x: 24,  y: 40,  w: 170, h: 62, t: 'Navegador', s: 'Jinja2 · Bootstrap · JS', col: 0,
      d: { h: 'Core ERP no navegador', p: 'Interface do operador renderizada no servidor. JavaScript vanilla só onde precisa de interação.', l: ['Sem framework SPA: carrega rápido e funciona bem em celular.', 'Padrão de UI documentado: ícones sempre Font Awesome, alvos de toque de 44 px, nenhuma rolagem lateral.', 'Telas passam por gate visual com captura real em desktop e celular.'] } },
    pay:   { x: 24,  y: 170, w: 170, h: 62, t: 'App Nivela Pay', s: 'Expo · React Native · TS', col: 0,
      d: { h: 'App móvel (iPhone e Android)', p: 'A conta de pagamento do negócio: saldo, extrato, transferências e comprovantes.', l: ['Nenhuma regra de dinheiro no app. Saldo, taxa e limite vêm prontos da API.', 'Dinheiro trafega sempre em centavos inteiros.', 'Login com o mesmo usuário do ERP e 2FA; sessão por token Bearer.'] } },
    ext:   { x: 24,  y: 300, w: 170, h: 62, t: 'Apps parceiros', s: 'API de integração + webhooks', col: 0,
      d: { h: 'Ecossistema por API', p: 'Outros produtos conversam com o ERP por uma API versionada e por webhooks.', l: ['Contrato versionado: o consumidor não quebra quando o ERP evolui.', 'Webhooks para eventos, em vez de polling.'] } },
    bp:    { x: 270, y: 40,  w: 190, h: 62, t: 'Blueprints', s: 'camada HTTP fina', col: 1,
      d: { h: 'Blueprints: só HTTP', p: 'Autenticam, leem parâmetros, chamam um service e respondem. Não guardam regra de negócio.', l: ['70+ blueprints, cada um pequeno e previsível.', 'Ao tocar um blueprint grande, extrai-se só a parte alterada para um service. Nunca reescrever o arquivo inteiro.', 'Permissões por papel (RBAC próprio) checadas na borda.'] } },
    svc:   { x: 270, y: 170, w: 190, h: 62, t: 'Services', s: 'regra de negócio', col: 1,
      d: { h: 'Services: onde mora a regra', p: 'Cálculo, transação, estoque, financeiro, fiscal, comissão, pagamento e integração nascem aqui.', l: ['290+ services, testáveis sem subir HTTP.', 'Financeiro com motor de títulos: posição de caixa separa realizado, projeção e vencidos.', 'Mesma regra serve ao ERP, ao app móvel e à IA.'] } },
    wk:    { x: 270, y: 300, w: 190, h: 62, t: 'Worker', s: 'RQ + Redis · retry', col: 1,
      d: { h: 'Tarefas em segundo plano', p: 'E-mail, lead da landing e rotinas pesadas saem da requisição.', l: ['Cada tarefa roda com app context, sessão de banco e tenant próprios.', 'Até 3 novas tentativas com espera crescente (30 s, 2 min, 10 min).', 'Sem Redis, cai para thread: simples em desenvolvimento, e a operação sabe o limite disso.'] } },
    orm:   { x: 520, y: 105, w: 170, h: 62, t: 'SQLAlchemy 2', s: 'Alembic · 200+ migrations', col: 2,
      d: { h: 'Acesso a dados e migrations', p: 'Todo schema muda por Alembic. Nunca ALTER TABLE manual em produção.', l: ['200+ migrations versionadas, com upgrade e downgrade.', 'Migration que mexe em schema é validada em PostgreSQL descartável (upgrade, downgrade, upgrade).', 'Regra: tabela nova nasce com RLS na própria migration.'] } },
    db:    { x: 520, y: 235, w: 170, h: 62, t: 'PostgreSQL', s: 'tenant_id + RLS', col: 2,
      d: { h: 'Banco multi-tenant', p: 'Isolamento por linha: todas as tabelas de negócio têm tenant_id, e o PostgreSQL reforça com Row Level Security.', l: ['A request fixa o tenant no contexto e o banco filtra por conta própria.', 'Esquecer um WHERE no código não vira vazamento entre clientes.'] } },
    pay2:  { x: 750, y: 20,  w: 150, h: 54, t: 'Stripe · Asaas', s: 'cobrança SaaS', col: 3,
      d: { h: 'Cobrança', p: 'Stripe no cartão (mensal e anual); Asaas para Pix e contingência.', l: ['Webhooks de cobrança.', 'Acesso do cliente muda conforme o status da assinatura.'] } },
    fis:   { x: 750, y: 100, w: 150, h: 54, t: 'NFS-e Nacional', s: 'emissão direta', col: 3,
      d: { h: 'Fiscal', p: 'Emissão direta na NFS-e Nacional e NF-e na SEFAZ, sem intermediário pago.', l: ['Decisão registrada em ADR: menos custo e menos um ponto de falha.', 'Modo simulado para treino.'] } },
    mail:  { x: 750, y: 180, w: 150, h: 54, t: 'Resend', s: 'e-mail transacional', col: 3,
      d: { h: 'E-mail transacional', p: 'Envio por API com domínio próprio. Os envios saem pela fila.', l: ['Recuperação de senha com tempo de resposta que não revela se o e-mail existe.'] } },
    ia:    { x: 750, y: 260, w: 150, h: 54, t: 'Anthropic (Claude)', s: 'Nivela IA', col: 3,
      d: { h: 'IA dentro do produto', p: 'A Nivela IA consulta dados por ferramentas e propõe ações. Quem executa é o service, depois da confirmação.', l: ['Respostas com ferramentas, não "de cabeça".', 'Ver a aba Nivela IA para o fluxo de segurança.'] } },
    obs:   { x: 750, y: 340, w: 150, h: 54, t: 'Sentry · Railway', s: 'erros e deploy', col: 3,
      d: { h: 'Operação', p: 'Deploy em Railway com Gunicorn; erros no Sentry; CI no GitHub Actions.', l: ['Deploy em produção é decisão humana, por PR de staging para main.'] } }
  };
  const E = [['web','bp'],['pay','bp'],['ext','bp'],['bp','svc'],['svc','wk'],['svc','orm'],['orm','db'],['wk','db'],['svc','pay2'],['svc','fis'],['wk','mail'],['svc','ia'],['svc','obs']];
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (n, a = {}) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  ['CLIENTES', 'APLICAÇÃO', 'DADOS', 'INTEGRAÇÕES'].forEach((t, i) => {
    const c = mk('text', { x: [24, 270, 520, 750][i], y: 14, class: 'col' }); c.textContent = t; svg.append(c);
  });
  const edgeEls = E.map(([a, b]) => {
    const A = N[a], B = N[b];
    const x1 = A.x + A.w, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y + B.h / 2;
    const mx = (x1 + x2) / 2;
    const p = mk('path', { class: 'edge', d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}` });
    svg.append(p);
    return { a, b, p };
  });
  const nodeEls = {};
  for (const [id, n] of Object.entries(N)) {
    const g = mk('g', { class: 'node', tabindex: 0, role: 'button', 'aria-label': `${n.t}: ${n.s}` });
    g.append(mk('rect', { x: n.x, y: n.y, width: n.w, height: n.h }));
    const t1 = mk('text', { x: n.x + 14, y: n.y + 26 }); t1.textContent = n.t;
    const t2 = mk('text', { x: n.x + 14, y: n.y + 46, class: 'sm' }); t2.textContent = n.s;
    g.append(t1, t2);
    const pick = () => select(id);
    g.addEventListener('click', pick);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    svg.append(g);
    nodeEls[id] = g;
  }
  function select(id) {
    const n = N[id];
    const linked = new Set([id]);
    edgeEls.forEach(e => {
      const hot = e.a === id || e.b === id;
      e.p.classList.toggle('hot', hot);
      if (hot) { linked.add(e.a); linked.add(e.b); }
    });
    for (const k in nodeEls) {
      nodeEls[k].classList.toggle('sel', k === id);
      nodeEls[k].classList.toggle('dim', !linked.has(k));
    }
    $('#arq-detail').innerHTML = `<h3>${esc(n.d.h)}</h3><p>${esc(n.d.p)}</p><ul>${n.d.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  }
  select('svc');
})();

/* ---------- isolamento de tenant ---------- */
(function tenant() {
  const T = { 1: 'Barbearia Alfa', 2: 'Studio Beta', 3: 'Pet Gama' };
  const rows = [
    [101, 1, 'Cliente A1', 'Corte', '09:00'], [102, 1, 'Cliente A2', 'Barba', '10:30'],
    [201, 2, 'Cliente B1', 'Manicure', '09:30'], [202, 2, 'Cliente B2', 'Escova', '11:00'],
    [301, 3, 'Cliente C1', 'Banho', '14:00'], [302, 3, 'Cliente C2', 'Tosa', '15:30']
  ];
  const sel = $('#ten-sel'), rls = $('#ten-rls'), bug = $('#ten-bug'), tb = $('#ten-table tbody');
  const sql = $('#ten-sql'), v = $('#ten-verdict');
  function render(result, me) {
    tb.innerHTML = result.length ? result.map(r =>
      `<tr class="${r[1] === me ? 'mine' : 'leak'}"><td>${r[0]}</td><td>${esc(T[r[1]])}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')
      : '<tr><td class="empty" colspan="5">nenhuma linha</td></tr>';
  }
  function text() {
    const me = +sel.value;
    const q = bug.checked
      ? `<span class="kw">SELECT</span> * <span class="kw">FROM</span> agendamento;   <span class="c">-- esqueceu o filtro de tenant</span>`
      : `<span class="kw">SELECT</span> * <span class="kw">FROM</span> agendamento <span class="kw">WHERE</span> tenant_id = <span class="st">${me}</span>;`;
    sql.innerHTML = `<span class="c">-- sessão: SET app.tenant_id = ${me};   (${esc(T[me])})\n-- RLS: ${rls.checked ? 'LIGADO' : 'DESLIGADO'}</span>\n${q}`;
  }
  function run() {
    const me = +sel.value;
    text();
    let res = bug.checked ? rows : rows.filter(r => r[1] === me);
    if (rls.checked) res = res.filter(r => r[1] === me);
    render(res, me);
    const leaked = res.some(r => r[1] !== me);
    v.className = 'verdict ' + (leaked ? 'bad' : 'ok');
    v.textContent = leaked
      ? `Vazamento: a sessão de ${T[me]} enxergou ${res.filter(r => r[1] !== me).length} linha(s) de outros negócios. Foi o que aconteceria sem a segunda barreira.`
      : (bug.checked
        ? `Protegido: a query estava errada, mas o banco só devolveu as linhas de ${T[me]}. O erro de código virou inofensivo.`
        : `Correto: ${res.length} linha(s), todas de ${T[me]}.`);
  }
  [sel, rls, bug].forEach(x => x.addEventListener('change', run));
  $('#ten-run').addEventListener('click', run);
  run();
})();

/* ---------- Nivela IA ---------- */
(function nivelaIA() {
  const log = $('#ia-log'), box = $('#ia-scn');
  const S = {
    ok: { label: 'Agendar um corte', q: 'Marca um corte pro Carlos amanhã às 15h com o Rafa.' },
    amb: { label: 'Pedido incompleto', q: 'Marca o Carlos amanhã.' },
    bad: { label: 'Pedido perigoso', q: 'Apaga todos os clientes inativos.' }
  };
  let run = 0;
  Object.entries(S).forEach(([k, s]) => {
    const b = el('button', { class: 'chip', type: 'button', 'aria-pressed': 'false' }, esc(s.label));
    b.addEventListener('click', () => start(k, b));
    box.append(b);
  });
  const add = (cls, html) => { const m = el('div', { class: 'msg ' + cls }, html); log.append(m); m.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); return m; };
  const sys = (name, txt, k = '') => add('sys ' + k, `<b>${esc(name)}</b> ${esc(txt)}`);
  async function start(k, btn) {
    const id = ++run;
    $$('.chip', box).forEach(c => c.setAttribute('aria-pressed', c === btn));
    log.innerHTML = '';
    add('user', esc(S[k].q));
    await sleep(500); if (id !== run) return;
    sys('ferramenta', 'buscar_cliente("Carlos") → 1 resultado');
    if (k === 'bad') {
      await sleep(600); if (id !== run) return;
      sys('política', 'pedido destrutivo em lote: fora do que a IA pode fazer', 'bad');
      await sleep(500); if (id !== run) return;
      add('ai', 'Não consigo fazer isso por aqui. Apagar clientes em lote precisa ser feito pela tela de Clientes, com a sua conferência. Quer que eu mostre o caminho?');
      sys('resultado', 'recusa clara. Nada foi gravado.', 'ok');
      return;
    }
    await sleep(600); if (id !== run) return;
    sys('ferramenta', 'buscar_servico("corte") → Corte masculino · 40 min');
    if (k === 'amb') {
      await sleep(500); if (id !== run) return;
      sys('validação', 'faltam profissional e horário', 'bad');
      await sleep(500); if (id !== run) return;
      const m = add('ai', 'Com qual profissional e em que horário? Vejo estes livres amanhã:<div class="row"></div>');
      ['Rafa · 15:00', 'Rafa · 16:30', 'Duda · 15:00'].forEach(o => {
        const b = el('button', { class: 'btn', type: 'button' }, esc(o));
        b.addEventListener('click', () => { if (id !== run) return; $$('.btn', m).forEach(x => x.disabled = true); proposal(id, o); });
        $('.row', m).append(b);
      });
      sys('resultado', 'pergunta de esclarecimento. Nada foi gravado.', 'ok');
      return;
    }
    await sleep(500); if (id !== run) return;
    sys('ferramenta', 'disponibilidade(Rafa, amanhã 15:00) → livre');
    await proposal(id, 'Rafa · 15:00');
  }
  async function proposal(id, who) {
    await sleep(500); if (id !== run) return;
    const m = add('ai', `Encontrei tudo. Confirma este agendamento?
      <div class="prop" style="margin-top:10px"><span>cliente: <b>Carlos</b></span><span>serviço: <b>Corte masculino</b></span><span>profissional · horário: <b>${esc(who)}</b></span></div>
      <div class="row"></div>`);
    sys('estado', 'ação proposta e validada. Aguardando confirmação humana.');
    const row = $('.row', m);
    const yes = el('button', { class: 'btn primary', type: 'button' }, 'Confirmar'), no = el('button', { class: 'btn', type: 'button' }, 'Cancelar');
    row.append(yes, no);
    let done = false;
    yes.addEventListener('click', async () => {
      if (id !== run) return;
      if (done) { sys('servidor', 'confirmação repetida ignorada: a ação já foi executada (chave de idempotência)', 'bad'); return; }
      done = true;
      sys('servidor', 'revalidando: tenant, usuário, permissão, horário ainda livre…');
      await sleep(700); if (id !== run) return;
      sys('servidor', 'agendamento criado uma única vez.', 'ok');
      add('ai', 'Pronto, agendado. Tente clicar em Confirmar de novo: o servidor não executa duas vezes.');
    });
    no.addEventListener('click', () => { if (id !== run || done) return; done = true; sys('resultado', 'cancelado pela pessoa. Nada foi gravado.', 'ok'); });
  }
  start('ok', $$('.chip', box)[0]);
})();

/* ---------- projetos ---------- */
(function projects() {
  const P = [
    { n: 'Nivela', st: ['live', 'em produção'], d: 'ERP SaaS multi-tenant para negócios de serviço: agenda, fila, financeiro, fiscal, assinaturas e a Nivela IA.',
      tech: ['Python 3.12', 'Flask 3', 'SQLAlchemy 2', 'PostgreSQL + RLS', 'Redis/RQ', 'Stripe', 'Asaas', 'NFS-e'],
      det: ['Monólito modular: blueprints finos, regra em services, 290+ services e 560+ rotas.', 'Multi-tenancy por linha com tenant_id e RLS no PostgreSQL.', 'Financeiro com motor de títulos e conciliação OFX/CSV auditável; correções de dinheiro cobertas por testes de regressão.', 'Fiscal por emissão direta (NFS-e Nacional), sem intermediário pago.', 'Qualidade medida: gate visual com capturas reais, auditoria de celular e testes para telas que piscam ao carregar.'] },
    { n: 'Nivela IA', st: ['live', 'dentro do Nivela'], d: 'Assistente que entende pedidos em linguagem natural e propõe ações. Nunca grava sozinha.',
      tech: ['Claude (Anthropic)', 'tool use', 'idempotência'],
      det: ['Três saídas possíveis: ação proposta validada, pergunta de esclarecimento ou recusa clara.', 'Confirmação explícita, revalidação no servidor, escopo de tenant e usuário, execução única.', 'Responde consultando o menu real, os guias e os dados do negócio por ferramentas, em vez de "de cabeça".', 'Avaliação de mudanças (prompt, modelo, ferramentas) antes de ir para staging.'] },
    { n: 'Nivela Pay', st: ['beta', 'beta fechado'], d: 'App de iPhone e Android com a conta de pagamento do negócio: saldo, extrato, transferências e comprovantes.',
      tech: ['Expo SDK 57', 'React Native', 'TypeScript strict', 'Expo Router'],
      det: ['Zero regra de dinheiro no app: tudo vem da API do ERP e o app só formata.', 'Dinheiro em centavos inteiros, sempre.', 'Renovação de sessão com fila única e tratamento de renovação concorrente.', 'Hoje roda com dados de exemplo; a ligação com a API real é a próxima etapa.'] },
    { n: 'Hall 239', st: ['wip', 'em construção'], d: 'Site, quiz de qualificação de leads, painel (CRM leve) e mensageria para um espaço de eventos.',
      tech: ['Next.js 16', 'React 19', 'Drizzle ORM', 'PostgreSQL', 'Auth.js', 'Tailwind 4'],
      det: ['Um só modelo de dados para site, quiz e painel.', 'Regra em lib/, páginas e rotas só leem parâmetros e respondem.', 'Gate local completo (tipos, lint, audit, build, varredura de segredos) porque o CI ainda não roda.', 'Mobile-first: o tráfego vem do Instagram, no celular.'] },
    { n: 'SulCore', st: ['live', 'site aberto'], d: 'Site da SulCore, feito para mostrar como se trabalha: exportação estática, CI forte e código aberto.',
      tech: ['Next.js 16', 'TypeScript strict', 'Tailwind 4', 'Playwright', 'Vitest', 'GitHub Pages'],
      det: ['Exportação 100% estática, sem servidor, sem banco, sem rastreio.', 'Rotas /pt/ e /en/ com dicionários tipados.', 'CodeQL, OpenSSF Scorecard, Lighthouse CI e testes de acessibilidade no pipeline.', 'ADRs numerados para cada decisão.'],
      link: ['https://github.com/sulcore/sulcore.github.io', 'Ver o código'] }
  ];
  const wrap = $('#cards');
  P.forEach(p => {
    const c = el('article', { class: 'card' });
    c.innerHTML = `<header><h3>${esc(p.n)}</h3><span class="status ${p.st[0]}">${esc(p.st[1])}</span></header>
      <p>${esc(p.d)}</p>
      <div>${p.tech.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="more"><details><summary>Por dentro</summary><ul>${p.det.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
      ${p.link ? `<div class="links"><a href="${p.link[0]}" rel="noopener">${esc(p.link[1])} →</a></div>` : ''}</div>`;
    wrap.append(c);
  });
})();

/* ---------- pipeline de IA no desenvolvimento ---------- */
(function pipeline() {
  const S = [
    { t: 'Contexto versionado', h: false, d: 'O agente começa pelas regras permanentes do repositório (AGENTS.md), pela arquitetura, pela documentação do módulo e por um vault de decisões de produto. Nada de contexto só na minha cabeça.', l: ['Regras invioláveis escritas: isolamento de tenant, permissões, migrations, dinheiro.', 'Decisões em ADRs, não em conversa.'] },
    { t: 'Branch isolada', h: false, d: 'Todo trabalho nasce de staging em branch ou worktree próprios. Agente não mexe na main e não publica produção.', l: ['Hotfix também vai por PR.', 'Antes de abrir PR: conferir PRs e branches abertas para não pisar no trabalho de outro.'] },
    { t: 'Plano e escopo', h: false, d: 'Resultado esperado e critério de pronto em uma frase. Mudança mínima e aditiva; regra nova em service.', l: ['Se falta uma decisão que só o dono toma, pergunta uma vez.'] },
    { t: 'Implementação', h: false, d: 'O agente implementa com substituição exata e direcionada. Regex de escopo aberto para editar código é proibido.', l: ['Ferramentas que apagam código alheio por erro são o principal risco real.'] },
    { t: 'Evidência, não resumo', h: true, d: 'Leio o diff de verdade, confiro adições e remoções e valido a afirmação contra o código. "Está pronto" dito por um agente nunca é o critério de aceite.', l: ['Testes focados no que mudou, suíte maior quando cabe, compileall e git diff --check.', 'Tela: abrir no navegador, desktop e celular, com toque real.'] },
    { t: 'Gate de qualidade', h: false, d: 'PR passa por CI no runner próprio, gate visual e documentação atualizada no mesmo PR. Documento velho é entrega incompleta.', l: ['A própria IA do produto aprende a cada entrega: manual, habilidade e teste que falha se ficar para trás.'] },
    { t: 'Decisão humana', h: true, d: 'Merge, release e validação em produção são decisões deliberadas, seguidas de smoke test e monitoramento.', l: ['Staging para main exige autorização explícita, sempre.'] }
  ];
  const ol = $('#pipe'), dt = $('#pipe-detail');
  S.forEach((s, i) => {
    const li = el('li'), b = el('button', { type: 'button', class: s.h ? 'human' : '', 'aria-pressed': 'false' }, esc(s.t));
    b.addEventListener('click', () => {
      $$('button', ol).forEach(x => x.setAttribute('aria-pressed', x === b));
      dt.innerHTML = `<h3>${esc(s.t)} <span class="tag ${s.h ? 'human' : ''}">${s.h ? 'decisão humana' : 'agente com regras'}</span></h3><p>${esc(s.d)}</p><ul>${s.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    });
    li.append(b); ol.append(li);
    if (i === 4) b.click();
  });
})();

/* ---------- stack ---------- */
(function stack() {
  const G = {
    Backend: [['Python 3.12', 'Núcleo do Nivela'], ['Flask 3', 'Core ERP e API'], ['SQLAlchemy 2', 'ORM e consultas'], ['Alembic', '200+ migrations versionadas'], ['Gunicorn', 'Servidor de produção'], ['Redis + RQ', 'Fila, retry e cache']],
    Dados: [['PostgreSQL', 'Banco único com RLS por tenant'], ['Row Level Security', 'Segunda barreira de isolamento'], ['Drizzle ORM', 'Hall 239'], ['SQLite', 'Banco dos testes do Nivela']],
    Frontend: [['TypeScript', 'Hall 239, SulCore e Nivela Pay'], ['Next.js 16', 'Hall 239 e site da SulCore'], ['React 19', 'Next.js'], ['Tailwind 4', 'Hall 239 e SulCore'], ['Jinja2', 'Telas do Core ERP'], ['JavaScript vanilla', 'Interações do ERP e deste portfólio']],
    Mobile: [['Expo SDK 57', 'Nivela Pay'], ['React Native', 'Nivela Pay'], ['Expo Router', 'Rotas do app']],
    'IA': [['Claude API', 'Nivela IA e assistente de ajuda'], ['Tool use', 'Consulta de dados por ferramentas'], ['Avaliação de prompts', 'Comparar modelo e instrução antes de publicar']],
    'Qualidade e operação': [['pytest', '390+ arquivos de teste no Nivela'], ['Playwright', 'Validação visual e E2E'], ['GitHub Actions', 'CI'], ['CodeQL', 'Análise estática no site da SulCore'], ['Docker', 'Ambiente'], ['Railway', 'Deploy do Nivela'], ['Sentry', 'Erros em produção']],
    Integrações: [['Stripe', 'Assinatura no cartão'], ['Asaas', 'Pix e contingência'], ['NFS-e Nacional', 'Emissão fiscal direta'], ['Resend', 'E-mail transacional']]
  };
  const f = $('#stack-filter'), ul = $('#stack-list'), note = $('#stack-note');
  const cats = ['Tudo', ...Object.keys(G)];
  let cur = 'Tudo';
  cats.forEach(c => {
    const b = el('button', { class: 'chip', type: 'button', 'aria-pressed': c === 'Tudo' }, esc(c));
    b.addEventListener('click', () => {
      cur = c;
      $$('.chip', f).forEach(x => x.setAttribute('aria-pressed', x === b));
      $$('li', ul).forEach(li => li.hidden = !(c === 'Tudo' || li.dataset.cat === c));
    });
    f.append(b);
  });
  for (const [cat, items] of Object.entries(G)) items.forEach(([n, u]) => {
    const li = el('li'); li.dataset.cat = cat;
    const b = el('button', { type: 'button' }, esc(n));
    const show = () => { note.textContent = `${n}: ${u}`; };
    b.addEventListener('mouseenter', show); b.addEventListener('focus', show); b.addEventListener('click', show);
    li.append(b); ul.append(li);
  });
})();

/* ---------- paleta de comandos ---------- */
(function palette() {
  const pal = $('#palette'), inp = $('#pal-input'), list = $('#pal-list');
  const go = id => () => { document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  const tab = (id, sec) => () => { go(sec)(); window.showTab(id); };
  const CMD = [
    ['Ir para: Nivela por dentro', 'seção', go('nivela')], ['Ver a arquitetura do Nivela', 'demo', tab('t-arq', 'nivela')],
    ['Testar o isolamento de tenant', 'demo', tab('t-ten', 'nivela')], ['Conversar com a Nivela IA (simulação)', 'demo', tab('t-ia', 'nivela')],
    ['Ir para: Projetos', 'seção', go('projetos')], ['Ir para: IA no desenvolvimento', 'seção', go('ia-dev')],
    ['Ir para: Stack', 'seção', go('stack')], ['Ir para: Contato', 'seção', go('contato')],
    ['Copiar e-mail', 'ação', copyMail], ['Abrir GitHub', 'link', () => window.open('https://github.com/jrasch7', '_blank', 'noopener')],
    ['Voltar ao topo', 'seção', go('top')]
  ];
  let shown = [], idx = 0;
  function draw() {
    const q = inp.value.trim().toLowerCase();
    shown = CMD.filter(c => c[0].toLowerCase().includes(q) || c[1].includes(q));
    idx = Math.min(idx, Math.max(0, shown.length - 1));
    list.innerHTML = '';
    shown.forEach((c, i) => {
      const li = el('li', { role: 'option', 'aria-selected': i === idx }, `<span>${esc(c[0])}</span><small>${esc(c[1])}</small>`);
      li.addEventListener('click', () => run(c));
      li.addEventListener('mousemove', () => { idx = i; $$('li', list).forEach((x, j) => x.setAttribute('aria-selected', j === i)); });
      list.append(li);
    });
    if (!shown.length) list.append(el('li', {}, '<span>Nenhum comando encontrado</span>'));
  }
  let last;
  function open() { last = document.activeElement; pal.hidden = false; inp.value = ''; idx = 0; draw(); inp.focus(); }
  function close() { pal.hidden = true; if (last && last.focus) last.focus(); }
  function run(c) { close(); c[2](); }
  inp.addEventListener('input', () => { idx = 0; draw(); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, shown.length - 1); draw(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); draw(); }
    else if (e.key === 'Enter' && shown[idx]) run(shown[idx]);
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
    const done = () => toast('E-mail copiado');
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
  ['nivela', 'projetos', 'ia-dev', 'stack', 'contato'].forEach(id => io.observe(document.getElementById(id)));
})();
})();
