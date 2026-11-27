// Testes ponta a ponta do site publicado (_site/). O nome de cada teste é "português // inglês":
// a tela "Pipeline" mostra os dois.
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
});

const goto = async (page) => {
  await page.goto("/");
  await expect(page.locator("#gallery .shot").first()).toBeVisible();
};

test("página carrega com console limpo, sem violação de CSP e sem rolagem lateral // page loads with a clean console, no CSP violation and no sideways scroll", async ({ page }) => {
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await goto(page);
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.__csp)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test("imagens: nenhuma quebrada // images: none broken", async ({ page }) => {
  await goto(page);
  await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
  await page.waitForTimeout(800);
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
});

test("troca de idioma PT/EN muda o texto e fica salva // PT/EN switch changes the text and is remembered", async ({ page }) => {
  await goto(page);
  await page.locator(".lang button[data-lang=pt]").click();
  await expect(page.locator("h1")).toContainText("Software que aguenta");
  await page.locator(".lang button[data-lang=en]").click();
  await expect(page.locator("h1")).toContainText("Software that holds up");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.locator("h1")).toContainText("Software that holds up");
});

test("arquitetura: clicar num bloco mostra o detalhe // architecture: clicking a block shows its detail", async ({ page }) => {
  await goto(page);
  await page.locator("#arq .node").nth(1).scrollIntoViewIfNeeded();
  await page.locator("#arq .node", { hasText: "PostgreSQL" }).click();
  await expect(page.locator("#arq-detail h3")).toContainText(/banco multi-tenant|multi-tenant database/i);
});

test("isolamento de tenant: sem RLS vaza, com RLS protege // tenant isolation: leaks without RLS, protected with it", async ({ page }) => {
  await goto(page);
  await page.locator("#t-ten").click();
  await page.locator("#ten-bug").check();
  await page.locator("#ten-rls").uncheck();
  await page.locator("#ten-run").click();
  await expect(page.locator("#ten-verdict")).toHaveClass(/bad/);
  await page.locator("#ten-rls").check();
  await expect(page.locator("#ten-verdict")).toHaveClass(/ok/);
});

test("Nivela IA: confirmação repetida não executa duas vezes // Nivela AI: a repeated confirmation does not execute twice", async ({ page }) => {
  await goto(page);
  await page.locator("#t-ia").click();
  const confirm = page.locator("#ia-log .btn.primary");
  await expect(confirm).toBeVisible({ timeout: 12_000 });
  await confirm.click();
  await expect(page.locator("#ia-log")).toContainText(/criado uma única vez|created exactly once/, { timeout: 8000 });
  await confirm.click();
  await expect(page.locator("#ia-log")).toContainText(/idempotência|idempotency/);
});

test("galeria: clicar amplia a imagem e Esc fecha // gallery: clicking enlarges the image and Esc closes it", async ({ page }) => {
  await goto(page);
  await page.locator(".shot-btn").first().click();
  await expect(page.locator("#lightbox")).toHaveAttribute("open", "");
  await expect(page.locator("#lb-body img")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#lightbox")).not.toHaveAttribute("open", "");
});

test("paleta de comandos abre, filtra e navega // command palette opens, filters and navigates", async ({ page }) => {
  await goto(page);
  await page.locator("#open-palette").click();
  await expect(page.locator("#palette")).toBeVisible();
  await page.locator("#pal-input").fill("pipeline");
  await page.keyboard.press("Enter");
  await expect(page.locator("#palette")).toBeHidden();
  await expect(page.locator("#pipeline")).toBeInViewport({ ratio: 0.1 });
});

test("tela da pipeline: mostra as nove etapas e o detalhe de cada uma // pipeline screen: shows the nine stages and each one's detail", async ({ page }) => {
  await goto(page);
  await page.locator("#pipeline").scrollIntoViewIfNeeded();
  const nodes = page.locator("#pl-graph .pl-node");
  await expect(nodes).toHaveCount(9);
  for (let i = 0; i < 9; i++) {
    await nodes.nth(i).click();
    await expect(page.locator("#pl-detail h3")).not.toBeEmpty();
    await expect(page.locator("#pl-detail")).toContainText(/inspirada em|inspired by/);
  }
  await expect(page.locator("#pl-head .pl-pill")).toBeVisible();
});

test("artefato: build-info.json lista só arquivos que existem // artifact: build-info.json lists only files that exist", async ({ request }) => {
  const info = await (await request.get("/build-info.json")).json();
  expect(info.files.length).toBeGreaterThan(5);
  for (const f of info.files) expect((await request.get(`/${f.path}`)).status(), f.path).toBe(200);
});

test("acessibilidade (axe): nenhuma violação grave ou crítica, em PT e EN // accessibility (axe): no serious or critical violation, in PT and EN", async ({ page }) => {
  await goto(page);
  for (const lang of ["pt", "en"]) {
    await page.locator(`.lang button[data-lang=${lang}]`).click();
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));
    await page.waitForTimeout(700);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const bad = violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(", ")}`);
    expect(bad, lang).toEqual([]);
  }
});
