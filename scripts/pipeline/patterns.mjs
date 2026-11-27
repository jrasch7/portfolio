// Padrões de varredura de conteúdo, usados na higiene (código-fonte) e na segurança (build).

export const SECRET_PATTERNS = [
  ["chave de acesso AWS", /\bAKIA[0-9A-Z]{16}\b/],
  ["token pessoal do GitHub", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ["token fino do GitHub", /\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["chave de API (sk-)", /\bsk-[A-Za-z0-9_-]{24,}\b/],
  ["token do Slack", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["chave privada", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/],
  ["senha em texto", /\b(?:password|passwd|senha|secret|token)\s*[:=]\s*["'][^"'\s]{8,}["']/i],
];

export const PRIVACY_PATTERNS = [
  ["endereço IPv4", /\b(?!127\.0\.0\.1\b|0\.0\.0\.0\b)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/],
  ["host interno", /\b[\w.-]+\.(?:internal|local|lan|corp)\b/i],
];

export const EMAIL_RE = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
export const EMAIL_ALLOW = new Set(["joaovargas1108@gmail.com"]);
export const EMAIL_ALLOW_SUFFIX = ["@users.noreply.github.com"];

// © ® ™ são marcas tipográficas, não emoji.
export const EMOJI_RE = /(?![©®™])\p{Extended_Pictographic}/u;
export const CONFLICT_RE = /^(<{7}|={7}|>{7})( |$)/m;

/** Limites de tamanho (bytes). */
export const BUDGET = {
  imageEach: 150 * 1024,
  imagesTotal: 400 * 1024,
  codeGzipTotal: 60 * 1024,
};

/** Arquivos que a varredura de texto ignora (gerados ou com hashes que lembram segredos). */
export const SCAN_IGNORE = new Set(["package-lock.json", "pipeline.json"]);
