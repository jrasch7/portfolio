// Definição única das etapas da pipeline. É daqui que saem o grafo no GitHub Actions
// (needs), a execução local (npm run pipeline) e a tela "Pipeline" do portfólio (pipeline.json).
// Texto aqui é público: nada de máquina, endereço interno ou credencial.

export const STAGES = [
  {
    id: "pr-gate",
    name: { pt: "Gate do PR", en: "PR gate" },
    needs: [],
    command: "npm run stage -- pr-gate",
    what: {
      pt: "Confere o pull request antes de qualquer outra coisa: título no padrão, corpo com a seção de validação, branch que não é a main e tamanho do diff.",
      en: "Checks the pull request before anything else: title format, a validation section in the body, a branch that is not main, and diff size.",
    },
    why: {
      pt: "PR pequeno e explicado é revisável. A regra existe para ninguém precisar adivinhar o que mudou nem como foi testado.",
      en: "A small, explained PR can be reviewed. The rule exists so nobody has to guess what changed or how it was tested.",
    },
    inspired: { pt: "pr_quality_gate.py do Nivela", en: "Nivela's pr_quality_gate.py" },
  },
  {
    id: "higiene",
    name: { pt: "Higiene do repositório", en: "Repository hygiene" },
    needs: [],
    command: "npm run stage -- higiene",
    what: {
      pt: "Varre os arquivos versionados atrás de segredos, IPs, hosts internos e e-mails fora da lista; confere orçamento de tamanho, arquivos obrigatórios e a regra de não usar emoji na interface.",
      en: "Scans tracked files for secrets, IPs, internal hosts and emails outside the allowlist; checks size budgets, required files and the no-emoji-in-UI rule.",
    },
    why: {
      pt: "O repositório é público. Um segredo ou um endereço interno que escapa não volta atrás, então a barreira fica no começo.",
      en: "The repository is public. A leaked secret or internal address cannot be taken back, so the barrier sits at the start.",
    },
    inspired: { pt: "check_repository_files.py do Nivela e regras de site público do SulCore", en: "Nivela's check_repository_files.py and SulCore's public-site rules" },
  },
  {
    id: "estatico",
    name: { pt: "Análise estática", en: "Static analysis" },
    needs: ["higiene"],
    command: "npm run stage -- estatico",
    what: {
      pt: "Sintaxe do JavaScript, validação do HTML, paridade entre português e inglês (toda chave tem tradução), âncoras internas que existem e arquivos referenciados que existem.",
      en: "JavaScript syntax, HTML validation, Portuguese/English parity (every key has a translation), internal anchors that exist and referenced files that exist.",
    },
    why: {
      pt: "Pega o erro barato antes de gastar tempo com navegador: link quebrado, texto sem tradução, HTML inválido.",
      en: "Catches cheap mistakes before spending time on a browser: broken links, untranslated text, invalid HTML.",
    },
    inspired: { pt: "etapa lint do Nivela e verify do SulCore", en: "Nivela's lint stage and SulCore's verify" },
  },
  {
    id: "build",
    name: { pt: "Build reproduzível", en: "Reproducible build" },
    needs: ["estatico"],
    command: "npm run stage -- build",
    what: {
      pt: "Monta a pasta publicada, versiona os arquivos por hash de conteúdo, gera sitemap, robots e build-info com o hash de cada arquivo, e confere o que saiu.",
      en: "Assembles the published folder, versions files by content hash, generates sitemap, robots and a build-info file with every file's hash, and verifies the output.",
    },
    why: {
      pt: "O mesmo commit sempre gera o mesmo resultado. As etapas seguintes testam exatamente o artefato que vai ao ar, não o código-fonte.",
      en: "The same commit always produces the same result. The following stages test the exact artifact that ships, not the source.",
    },
    inspired: { pt: "verify-build.mjs do SulCore", en: "SulCore's verify-build.mjs" },
  },
  {
    id: "testes",
    name: { pt: "Testes ponta a ponta", en: "End-to-end tests" },
    needs: ["build"],
    command: "npm run stage -- testes",
    what: {
      pt: "Playwright em desktop e celular: troca de idioma, as três demos, galeria, paleta de comandos, esta tela. Mais acessibilidade (axe), console sem erros e nenhuma violação de CSP.",
      en: "Playwright on desktop and phone: language switch, the three demos, gallery, command palette, this screen. Plus accessibility (axe), a clean console and no CSP violations.",
    },
    why: {
      pt: "Teste que abre o site de verdade e usa. Acessibilidade entra como teste, não como boa intenção.",
      en: "A test that opens the real site and uses it. Accessibility is a test, not a good intention.",
    },
    inspired: { pt: "e2e do SulCore e varreduras de tela do Nivela", en: "SulCore's e2e and Nivela's screen sweeps" },
  },
  {
    id: "desempenho",
    name: { pt: "Desempenho", en: "Performance" },
    needs: ["build"],
    command: "npm run stage -- desempenho",
    what: {
      pt: "Lighthouse (3 execuções, mediana) com orçamento: desempenho, acessibilidade, boas práticas e SEO. Falha se a nota cair abaixo do mínimo.",
      en: "Lighthouse (3 runs, median) with a budget: performance, accessibility, best practices and SEO. Fails if a score drops below the minimum.",
    },
    why: {
      pt: "Orçamento é o que impede o site de ficar pesado aos poucos. A nota vira regra, e a regra vira falha de build.",
      en: "A budget is what stops a site from slowly getting heavy. The score becomes a rule, and the rule becomes a build failure.",
    },
    inspired: { pt: "Lighthouse CI do SulCore", en: "SulCore's Lighthouse CI" },
  },
  {
    id: "seguranca",
    name: { pt: "Segurança", en: "Security" },
    needs: ["build"],
    command: "npm run stage -- seguranca",
    what: {
      pt: "npm audit, política CSP estrita no que vai ao ar, nenhum recurso de terceiros, links externos com noopener e nova varredura de segredos no build. CodeQL roda em workflow próprio.",
      en: "npm audit, a strict CSP on what ships, no third-party resources, external links with noopener and another secret scan on the build. CodeQL runs in its own workflow.",
    },
    why: {
      pt: "Defesa em camadas: o código é varrido, as dependências são auditadas e o navegador é instruído a recusar o que não foi previsto.",
      en: "Defense in depth: the code is scanned, dependencies are audited and the browser is told to refuse anything unplanned.",
    },
    inspired: { pt: "security.yml (DevSecOps) do Nivela e CodeQL do SulCore", en: "Nivela's security.yml (DevSecOps) and SulCore's CodeQL" },
  },
  {
    id: "deploy",
    name: { pt: "Deploy", en: "Deploy" },
    needs: ["testes", "desempenho", "seguranca"],
    command: "GitHub Actions: job deploy",
    what: {
      pt: "Publica o artefato aprovado no GitHub Pages, só a partir da main. Esta tela entra no pacote publicado, então ela mesma é a prova: se você a vê, o deploy aconteceu.",
      en: "Publishes the approved artifact to GitHub Pages, from main only. This screen ships inside the package, so it is its own proof: if you can see it, the deploy happened.",
    },
    why: {
      pt: "Deploy só depois de tudo verde, sempre do mesmo artefato testado, sem build novo no meio do caminho.",
      en: "Deploy only after everything is green, always from the same tested artifact, with no new build in between.",
    },
    inspired: { pt: "deploy.yml do SulCore (ambiente protegido)", en: "SulCore's deploy.yml (protected environment)" },
    selfEvident: true,
  },
  {
    id: "smoke",
    name: { pt: "Fumaça pós-deploy", en: "Post-deploy smoke" },
    needs: ["deploy"],
    command: "npm run stage -- smoke",
    what: {
      pt: "Depois da publicação, confere o site no ar: responde 200, os arquivos carregam e a versão publicada é a do commit. Roda depois do deploy, então o resultado fica no Actions.",
      en: "After publishing, checks the live site: it answers 200, files load and the published version is the commit's. It runs after deploy, so its result lives in Actions.",
    },
    why: {
      pt: "Deploy que terminou não é deploy que funciona. Esta etapa confere o que o visitante realmente recebe.",
      en: "A finished deploy is not a working deploy. This stage checks what a visitor actually receives.",
    },
    inspired: { pt: "smoke-pos-deploy.yml do Nivela", en: "Nivela's smoke-pos-deploy.yml" },
    afterPublish: true,
  },
];

export const byId = Object.fromEntries(STAGES.map((s) => [s.id, s]));

/** Ordem topológica (dependências antes dos dependentes). */
export function order() {
  const out = [], seen = new Set();
  const visit = (s) => {
    if (seen.has(s.id)) return;
    seen.add(s.id);
    s.needs.forEach((n) => visit(byId[n]));
    out.push(s);
  };
  STAGES.forEach(visit);
  return out;
}
