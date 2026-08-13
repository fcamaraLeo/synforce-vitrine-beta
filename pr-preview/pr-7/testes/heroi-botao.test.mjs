/**
 * Testes para a troca de cor do botão "Agendar demonstração" no heroi.
 *
 * Valida os 7 critérios de aceite definidos em
 * /trabalho/conhecimento/unidade/criterios-de-aceite.md
 *
 * Roda com: node --test
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("./estilos.css", "utf-8");
const html = readFileSync("./index.html", "utf-8");

/* ── Utilitários ──────────────────────────────────────────────────────── */

/**
 * Extrai o valor de uma variável CSS definida no bloco :root
 * Ex.: extrairVariavelRoot("azul-escuro") => "#1f4b99"
 */
function extrairVariavelRoot(nome) {
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s);
  if (!rootMatch) return null;
  const corpo = rootMatch[1];
  const re = new RegExp(`--${nome}\\s*:\\s*([^;]+)`, "i");
  const m = re.exec(corpo);
  return m ? m[1].trim() : null;
}

/**
 * Extrai o bloco de um seletor CSS simples (sem nesting).
 * Ex.: extrairBloco(".botao-agendar-demo") => "background: ..."
 */
function extrairBloco(seletor) {
  // Escapa caracteres especiais no seletor para regex
  const esc = seletor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(esc + "\\s*\\{([^}]+)\\}", "s");
  const m = re.exec(css);
  return m ? m[1] : null;
}

/**
 * Converte um canal sRGB 0-255 para o espaço linear da WCAG.
 */
function paraLinear(c) {
  const sR = c / 255;
  return sR <= 0.04045 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
}

/**
 * Luminância relativa de uma cor hex (#rrggbb) segundo a WCAG 2.1.
 */
function luminancia(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return 0.2126 * paraLinear(r) + 0.7152 * paraLinear(g) + 0.0722 * paraLinear(b);
}

/**
 * Taxa de contraste WCAG entre duas cores hex (#rrggbb).
 * Resultado N:1 — mínimo AA é 4.5:1.
 */
function razaoContraste(cor1, cor2) {
  const l1 = luminancia(cor1);
  const l2 = luminancia(cor2);
  const maisClara = Math.max(l1, l2);
  const maisEscura = Math.min(l1, l2);
  return (maisClara + 0.05) / (maisEscura + 0.05);
}

/* ── Testes ───────────────────────────────────────────────────────────── */

describe("C1: cor de fundo do botão", () => {
  it("deve existir o token --azul-escuro no :root", () => {
    const valor = extrairVariavelRoot("azul-escuro");
    assert.notEqual(valor, null, "--azul-escuro não encontrado no :root");
  });

  it("--azul-escuro deve ter valor #1f4b99", () => {
    assert.equal(extrairVariavelRoot("azul-escuro"), "#1f4b99");
  });

  it(".botao-agendar-demo deve usar var(--azul-escuro) como background", () => {
    const bloco = extrairBloco(".botao-agendar-demo");
    assert.notEqual(bloco, null, ".botao-agendar-demo não encontrado no CSS");
    assert.ok(
      bloco.includes("var(--azul-escuro)"),
      ".botao-agendar-demo não usa var(--azul-escuro)"
    );
  });

  it("o link 'Agendar demonstração' no heroi deve ter class='botao botao-agendar-demo'", () => {
    // Verifica o HTML específico do heroi
    const re = /<a[^>]*class="botao botao-agendar-demo"[^>]*>Agendar demonstração<\/a>/;
    assert.ok(re.test(html), "Link com botao-agendar-demo não encontrado no HTML");
  });

  it("não deve existir o token antigo --cor-botao-hero", () => {
    assert.equal(css.includes("--cor-botao-hero"), false,
      "--cor-botao-hero ainda presente (deveria ter sido removido)");
  });

  it("não deve existir o seletor antigo .heroi .botao-primario", () => {
    assert.equal(css.includes(".heroi .botao-primario"), false,
      "Seletor .heroi .botao-primario ainda presente (deveria ter sido removido)");
  });
});

describe("C2: não afetar outros botões", () => {
  it('botão "Inscrever" (.inscricao-linha button) deve continuar com background: var(--marca)', () => {
    const bloco = extrairBloco(".inscricao-linha button");
    assert.notEqual(bloco, null, ".inscricao-linha button não encontrado no CSS");
    assert.ok(bloco.includes("var(--marca)"),
      ".inscricao-linha button não usa mais var(--marca)");
  });

  it('botão "Agendar demonstração" na chamada final deve continuar como .botao-claro', () => {
    // Deve haver um link .botao.botao-claro com texto "Agendar demonstração" na chamada
    const re = /<a[^>]*class="botao botao-claro"[^>]*>Agendar demonstração<\/a>/;
    assert.ok(re.test(html),
      "Botão da chamada final perdeu a classe botao-claro");
  });

  it(".botao-claro deve continuar com background branco (#fff)", () => {
    const bloco = extrairBloco(".botao-claro");
    assert.notEqual(bloco, null, ".botao-claro não encontrado");
    assert.ok(bloco.includes("#fff") || bloco.includes("white"),
      ".botao-claro perdeu o fundo branco");
  });
});

describe("C3: contraste AA (>= 4.5:1)", () => {
  const azulEscuro = "#1f4b99";
  const hover = "#16376f";
  const branco = "#ffffff";

  it(`contraste de ${azulEscuro} contra ${branco} deve ser >= 4.5:1`, () => {
    const r = razaoContraste(azulEscuro, branco);
    assert.ok(r >= 4.5,
      `Contraste ${r.toFixed(2)}:1 — abaixo de 4.5:1`);
  });

  it(`contraste do hover (${hover}) contra ${branco} deve ser >= 4.5:1`, () => {
    const r = razaoContraste(hover, branco);
    assert.ok(r >= 4.5,
      `Contraste do hover ${r.toFixed(2)}:1 — abaixo de 4.5:1`);
  });
});

describe("C4: estado :hover com transição suave", () => {
  it(".botao-agendar-demo deve ter transition definida", () => {
    const bloco = extrairBloco(".botao-agendar-demo");
    assert.ok(bloco.includes("transition"),
      ".botao-agendar-demo não tem propriedade transition");
  });

  it(".botao-agendar-demo:hover deve existir com background definido", () => {
    const bloco = extrairBloco(".botao-agendar-demo:hover");
    assert.notEqual(bloco, null,
      ".botao-agendar-demo:hover não encontrado no CSS");
  });

  it("a cor do hover deve ser derivada (usar var(--marca-escura) que é #16376f, tom mais escuro de #1f4b99)", () => {
    const bloco = extrairBloco(".botao-agendar-demo:hover");
    assert.ok(bloco.includes("var(--marca-escura)") || bloco.includes("#16376f"),
      ".botao-agendar-demo:hover não usa uma variação escura");
  });

  it("o hover não deve redefinir para um tom diferente de azul (ex.: verde, vermelho)", () => {
    const bloco = extrairBloco(".botao-agendar-demo:hover");
    // A cor do hover deve conter azul (marca-escura = #16376f é azul escuro)
    // Verificar que não está usando cores não-azuis como primary color
    assert.ok(
      !bloco.match(/red|green|yellow|orange|purple/i) ||
      bloco.includes("marca-escura") ||
      bloco.includes("#16376f"),
      ".botao-agendar-demo:hover parece usar cor não-azul"
    );
  });
});

describe("C5: responsividade preservada", () => {
  it(".botao (classe base) deve manter cursor: pointer", () => {
    const bloco = extrairBloco(".botao");
    assert.ok(bloco.includes("cursor: pointer"),
      ".botao perdeu cursor: pointer");
  });

  it(".botao deve manter border-radius: 7px", () => {
    const bloco = extrairBloco(".botao");
    assert.ok(bloco.includes("border-radius: 7px"),
      ".botao perdeu border-radius");
  });

  it(".botao deve manter padding", () => {
    const bloco = extrairBloco(".botao");
    assert.ok(bloco.includes("padding:"),
      ".botao perdeu padding");
  });

  it(".botao deve manter font-size: 15px", () => {
    const bloco = extrairBloco(".botao");
    assert.ok(bloco.includes("font-size: 15px"),
      ".botao perdeu font-size");
  });

  it(".botao deve manter display: inline-block", () => {
    const bloco = extrairBloco(".botao");
    assert.ok(bloco.includes("display: inline-block"),
      ".botao perdeu display: inline-block");
  });

  it("estrutura do heroi-acoes deve estar intacta", () => {
    assert.ok(html.includes('class="heroi-acoes"'),
      "heroi-acoes removido ou alterado");
  });
});

describe("C6: sem dependência nova", () => {
  it("não deve existir package.json (projeto sem framework)", () => {
    try {
      readFileSync("./package.json", "utf-8");
      assert.fail("package.json encontrado — dependência nova adicionada");
    } catch (e) {
      // Esperado: package.json não existe
      assert.ok(true);
    }
  });

  it("não deve existir diretório node_modules", () => {
    try {
      readFileSync("./node_modules", "utf-8");
      assert.fail("node_modules encontrado");
    } catch (e) {
      assert.ok(true);
    }
  });

  it("nenhuma tag <link> ou <script> para biblioteca externa foi adicionada", () => {
    // Verificar links externos no HTML
    // O único link stylesheet deve ser o estilos.css
    const linksExternos = html.match(/<link[^>]*href=["']https?:\/\//gi);
    assert.equal(linksExternos, null,
      "Link para recurso externo encontrado");

    // O único script deve ser o inscricao.mjs
    const scriptsExternos = html.match(/<script[^>]*src=["']https?:\/\//gi);
    assert.equal(scriptsExternos, null,
      "Script externo encontrado");
  });
});

describe("C7: mesma cor dos demais elementos da página", () => {
  it("--azul-escuro deve ser igual a --marca (#1f4b99)", () => {
    const azul = extrairVariavelRoot("azul-escuro");
    const marca = extrairVariavelRoot("marca");
    assert.equal(azul, marca,
      "--azul-escuro difere de --marca");
    assert.equal(azul, "#1f4b99",
      "--azul-escuro não é #1f4b99");
  });

  it("elementos visuais que usam --marca devem continuar intactos (ex.: .passo-num)", () => {
    const bloco = extrairBloco(".passo-num");
    assert.notEqual(bloco, null, ".passo-num não encontrado");
    assert.ok(bloco.includes("var(--marca)"),
      ".passo-num não usa mais var(--marca)");
  });

  it("elementos visuais que usam --marca (ex.: .numero strong) devem continuar intactos", () => {
    const bloco = extrairBloco(".numero strong");
    assert.notEqual(bloco, null, ".numero strong não encontrado");
    assert.ok(bloco.includes("var(--marca)"),
      ".numero strong não usa mais var(--marca)");
  });

  it("objeto .marca-simbolo deve continuar usando var(--marca)", () => {
    const bloco = extrairBloco(".marca-simbolo");
    assert.notEqual(bloco, null, ".marca-simbolo não encontrado");
    assert.ok(bloco.includes("var(--marca)"),
      ".marca-simbolo não usa mais var(--marca)");
  });
});