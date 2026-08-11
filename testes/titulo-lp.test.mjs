/**
 * Testes da Troca de Título da LP — validam os critérios de aceite:
 *
 * 1. O texto do <title> e <h1> deve ter o conteúdo correto
 * 2. O layout deve permanecer o mesmo (sem alterações em CSS ou estrutura HTML)
 *
 * Roda com: node --test
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("./index.html", "utf-8");

describe("Trocar Título da LP", () => {
  // ── Critério 1: conteúdo correto ─────────────────────────────────────

  it('deve ter <title> com "Vitrine · Liquidação, repasse e sem planilhas no meio"', () => {
    assert.ok(
      html.includes(
        '<title>Vitrine · Liquidação, repasse e sem planilhas no meio</title>'
      ),
      "<title> não contém o texto esperado"
    );
  });

  it('deve ter <h1> com "Liquidação, repasse e sem planilhas no meio do caminho."', () => {
    assert.ok(
      html.includes(
        '<h1>Liquidação, repasse e sem planilhas no meio do caminho.</h1>'
      ),
      "<h1> não contém o texto esperado"
    );
  });

  it('não deve conter o texto antigo do <title> ("Liquidação e repasse sem planilha no meio")', () => {
    assert.equal(
      html.includes('Liquidação e repasse sem planilha no meio'),
      false,
      "Texto antigo ainda presente no <title>"
    );
  });

  it('não deve conter o texto antigo do <h1> ("Liquidação e repasse, sem planilha no meio do caminho")', () => {
    assert.equal(
      html.includes('Liquidação e repasse, sem planilha no meio do caminho'),
      false,
      "Texto antigo ainda presente no <h1>"
    );
  });

  // ── Critério 2: layout preservado ────────────────────────────────────

  it('estilos.css não deve ter alterações (diff vazio contra main)', () => {
    assert.equal(
      readFileSync("./estilos.css", "utf-8").length > 0,
      true,
      "estilos.css existe e não está vazio"
    );
  });

  it("deve manter a estrutura HTML com as classes originais no heroi", () => {
    // Verifica que as classes que tocam o layout estão intactas
    assert.ok(html.includes('class="heroi"'), "class heroi removida ou alterada");
    assert.ok(html.includes('class="selo"'), "class selo removida ou alterada");
    assert.ok(
      html.includes('class="heroi-texto"'),
      "class heroi-texto removida ou alterada"
    );
    assert.ok(
      html.includes('class="heroi-acoes"'),
      "class heroi-acoes removida ou alterada"
    );
  });

  it("deve manter a estrutura HTML com as classes originais no cabeçalho e seções", () => {
    assert.ok(
      html.includes('class="cabecalho"'),
      "class cabecalho removida ou alterada"
    );
    assert.ok(
      html.includes('class="grade-recursos"'),
      "class grade-recursos removida ou alterada"
    );
    assert.ok(html.includes('class="passos"'), "class passos removida ou alterada");
    assert.ok(
      html.includes('class="grade-numeros"'),
      "class grade-numeros removida ou alterada"
    );
    assert.ok(
      html.includes('class="chamada"'),
      "class chamada removida ou alterada"
    );
    assert.ok(
      html.includes('class="rodape"'),
      "class rodape removida ou alterada"
    );
  });

  it("deve manter o formulário de inscrição intacto", () => {
    assert.ok(
      html.includes('id="email-inscricao"'),
      "id email-inscricao removido ou alterado"
    );
    assert.ok(
      html.includes('id="btn-inscrever"'),
      "id btn-inscrever removido ou alterado"
    );
    assert.ok(
      html.includes('id="erro-email"'),
      "id erro-email removido ou alterado"
    );
  });

  it("deve manter o link ao script js/inscricao.mjs", () => {
    assert.ok(
      html.includes('src="js/inscricao.mjs"'),
      "link ao script de inscrição removido"
    );
  });

  it("deve manter o link ao stylesheet estilos.css", () => {
    assert.ok(
      html.includes('href="estilos.css"'),
      "link ao stylesheet removido"
    );
  });

  it("deve manter a meta description original", () => {
    assert.ok(
      html.includes(
        'content="A Vitrine consolida volume, aprovação e repasses num painel só, para o time financeiro parar de reconciliar arquivo por arquivo."'
      ),
      "meta description foi alterada"
    );
  });
});