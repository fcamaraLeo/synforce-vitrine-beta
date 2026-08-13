/**
 * Testes de inscricao.mjs — validam o comportamento do formulário no DOM.
 *
 * Como o módulo manipula o DOM diretamente, simulamos document global
 * antes de importá-lo. Roda com: node --test
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

describe("inscricao.mjs — comportamento no DOM", () => {
  /** @type {Record<string, {value: string, addEventListener: Function}>} */
  let elementos;
  /** @type {Record<string, Function[]>} */
  let listeners;
  /** @type {string[]} */
  let logs;
  /** @type {Function} */
  let originalConsoleError;

  before(async () => {
    // Espiar console.error para capturar erros de módulo
    logs = [];
    originalConsoleError = console.error;
    console.error = (...args) => { logs.push(args.join(" ")); };

    listeners = {};

    // Mock do campo de e-mail
    const campoMock = {
      value: "",
      addEventListener: (event, handler) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      },
    };

    // Mock do botão
    const botaoMock = { disabled: false };

    // Mock do elemento de erro
    const erroMock = { hidden: true };

    elementos = {
      "email-inscricao": campoMock,
      "btn-inscrever": botaoMock,
      "erro-email": erroMock,
    };

    // Montar document global com getElementById
    global.document = {
      getElementById: (id) => elementos[id] || null,
    };

    // Importar o módulo — isso executa o código de topo,
    // que chama document.getElementById e registra listeners
    await import("../js/inscricao.mjs");
  });

  after(() => {
    delete global.document;
    console.error = originalConsoleError;
  });

  /** Simula digitar no campo (dispara input) */
  function simularInput(valor) {
    elementos["email-inscricao"].value = valor;
    (listeners["input"] || []).forEach((fn) => fn());
  }

  /** Simula sair do campo (dispara blur) */
  function simularBlur() {
    (listeners["blur"] || []).forEach((fn) => fn());
  }

  it("1. carrega sem erros de console", () => {
    // Nenhum erro deve ter sido logado durante a importação
    assert.equal(
      logs.length,
      0,
      `Esperava 0 erros, mas houve: ${JSON.stringify(logs)}`,
    );
  });

  it("2. estado inicial: botão desabilitado, erro oculto", () => {
    assert.equal(elementos["btn-inscrever"].disabled, true);
    assert.equal(elementos["erro-email"].hidden, true);
  });

  it('3. digitar "ana@empresa.com.br" → botão habilita, erro oculto', () => {
    // Reset
    elementos["btn-inscrever"].disabled = true;
    elementos["erro-email"].hidden = true;

    simularInput("ana@empresa.com.br");

    assert.equal(elementos["btn-inscrever"].disabled, false);
    assert.equal(elementos["erro-email"].hidden, true);
  });

  it('4. digitar "ana" (não tocado) → botão desabilita, erro oculto', () => {
    simularInput("ana");

    assert.equal(elementos["btn-inscrever"].disabled, true);
    assert.equal(elementos["erro-email"].hidden, true);
  });

  it('5. blur com "ana" → botão desabilitado, erro aparece', () => {
    simularBlur();

    assert.equal(elementos["btn-inscrever"].disabled, true);
    assert.equal(elementos["erro-email"].hidden, false);
  });

  it('6. corrigir para "ana@empresa.com" → botão habilita, erro some', () => {
    simularInput("ana@empresa.com");

    assert.equal(elementos["btn-inscrever"].disabled, false);
    assert.equal(elementos["erro-email"].hidden, true);
  });

  it("7. apagar tudo → botão desabilitado, erro some (campo vazio)", () => {
    simularInput("");

    assert.equal(elementos["btn-inscrever"].disabled, true);
    assert.equal(elementos["erro-email"].hidden, true);
  });

  it('8. digitar "ana@@empresa.com" + blur → botão desabilitado, erro aparece', () => {
    simularInput("ana@@empresa.com");
    simularBlur();

    assert.equal(elementos["btn-inscrever"].disabled, true);
    assert.equal(elementos["erro-email"].hidden, false);
  });

  it('9. campo vazio + blur → erro não aparece (vazio não mostra erro)', () => {
    // Reseta o estado: após um blur com valor inválido válido,
    // depois apaga e sai de novo
    simularInput("");
    simularBlur();

    assert.equal(elementos["erro-email"].hidden, true);
  });
});