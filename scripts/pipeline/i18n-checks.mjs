// Tradução (PT -> EN) dos nomes das verificações, para a tela "Pipeline" ser bilíngue.
// Os scripts escrevem em português; aqui ficam as versões em inglês. Nome sem entrada aparece como está.
const EXACT = {
  "arquivos obrigatórios presentes": "required files present",
  "MAPA_CODIGO.md em dia com o código": "MAPA_CODIGO.md up to date with the code",
  "todo documento de módulo está no índice MODULES.md": "every module document is listed in MODULES.md",
  "nenhum segredo nos arquivos versionados": "no secrets in tracked files",
  "nenhum IP nem host interno (repositório público)": "no IPs or internal hosts (public repository)",
  "só o e-mail de contato público aparece": "only the public contact email appears",
  "sem marcador de conflito de merge": "no merge conflict markers",
  "sem emoji na interface (ícone é SVG ou texto)": "no emoji in the UI (icons are SVG or text)",
  "sem console.log no JavaScript entregue": "no console.log in shipped JavaScript",
  "HTML válido (html-validate)": "valid HTML (html-validate)",
  "nenhuma tradução órfã ou vazia": "no orphan or empty translations",
  "lang, viewport, título e descrição presentes": "lang, viewport, title and description present",
  "pasta publicada montada": "published folder assembled",
  "build determinístico (dois builds, mesmos hashes)": "deterministic build (two builds, same hashes)",
  "arquivos de código versionados por hash de conteúdo": "code files versioned by content hash",
  "robots.txt e sitemap.xml gerados": "robots.txt and sitemap.xml generated",
  "build-info.json com hash de cada arquivo": "build-info.json with each file's hash",
  "build presente (_site/)": "build present (_site/)",
  "npm audit sem vulnerabilidade alta ou crítica": "npm audit with no high or critical vulnerability",
  "CSP presente com default-src 'self'": "CSP present with default-src 'self'",
  "script-src sem 'unsafe-inline' nem 'unsafe-eval'": "script-src without 'unsafe-inline' or 'unsafe-eval'",
  "style-src sem 'unsafe-inline'": "style-src without 'unsafe-inline'",
  "sem script inline nem manipulador de evento inline": "no inline script or inline event handler",
  "nenhum recurso carregado de terceiros (sem rastreadores, sem CDN)": "no third-party resources (no trackers, no CDN)",
  "links externos abrem com rel=noopener": "external links open with rel=noopener",
  "varredura de segredos no build": "secret scan on the build",
  "versão publicada é a do commit": "published version is the commit's",
  "página inicial responde 200 com título": "home page answers 200 with a title",
  "pipeline.json publicado e válido": "pipeline.json published and valid",
  "título entre 15 e 100 caracteres, sem ponto final": "title between 15 and 100 characters, no trailing period",
  "título sem WIP": "title without WIP",
  "corpo com seção de validação (## Validação, ## Como validei ou ## Validation)": "body with a validation section (## Validação, ## Como validei or ## Validation)",
  "corpo explica a mudança (80+ caracteres)": "body explains the change (80+ characters)",
  "origem não é a main": "source branch is not main",
  "execução da etapa": "stage execution",
  "Playwright executou": "Playwright ran",
  "Lighthouse executou": "Lighthouse ran",
};

const PATTERNS = [
  [/^cada imagem até (.+)$/, "each image up to $1"],
  [/^links relativos de (\d+) documentos apontam para arquivos que existem$/, "relative links in $1 documents point to existing files"],
  [/^imagens somam até (.+)$/, "images total up to $1"],
  [/^HTML\+JS\+CSS comprimidos até (.+)$/, "HTML+JS+CSS gzipped up to $1"],
  [/^sintaxe válida em (\d+) arquivos JavaScript$/, "valid syntax in $1 JavaScript files"],
  [/^todas as (\d+) chaves de texto têm tradução em inglês$/, "all $1 text keys have an English translation"],
  [/^(\d+) âncoras internas apontam para um id existente$/, "$1 internal anchors point to an existing id"],
  [/^(\d+) arquivos referenciados existem$/, "$1 referenced files exist"],
  [/^(\d+) referências do HTML publicado existem$/, "$1 references in the published HTML exist"],
  [/^(\d+) arquivos publicados respondem 200$/, "$1 published files answer 200"],
  [/^diff com até (\d+) linhas \(sem lockfile e imagens\)$/, "diff up to $1 lines (excluding lockfile and images)"],
];

/** Devolve a versão em inglês do nome, ou undefined se não houver. Nomes "pt // en" já trazem as duas. */
export function toEn(name) {
  if (name.includes(" // ")) return name.split(" // ")[1];
  if (EXACT[name]) return EXACT[name];
  for (const [re, out] of PATTERNS) if (re.test(name)) return name.replace(re, out);
  return undefined;
}

export const toPt = (name) => (name.includes(" // ") ? name.split(" // ")[0] : name);
