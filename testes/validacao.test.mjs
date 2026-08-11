/**
 * Testes de validacao.mjs — cobrem cada exemplo do glossário
 * mais bordas recomendadas pela política de teste da casa.
 * Roda com: node --test
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validarEmail } from "../js/validacao.mjs";

describe("validarEmail", () => {
  // Válidos (critério 2)
  it('deve aceitar "ana@empresa.com.br"', () => {
    assert.ok(validarEmail("ana@empresa.com.br"));
  });

  it('deve aceitar "ana+cobranca@empresa.com"', () => {
    assert.ok(validarEmail("ana+cobranca@empresa.com"));
  });

  // Inválidos (critério 2)
  it('deve rejeitar "ana@@empresa.com" (dois arrobas)', () => {
    assert.equal(validarEmail("ana@@empresa.com"), false);
  });

  it('deve rejeitar "ana@empresa" (domínio sem ponto)', () => {
    assert.equal(validarEmail("ana@empresa"), false);
  });

  it('deve rejeitar "ana@.com" (ponto no início do domínio)', () => {
    assert.equal(validarEmail("ana@.com"), false);
  });

  it('deve rejeitar "ana@empresa." (ponto no fim do domínio)', () => {
    assert.equal(validarEmail("ana@empresa."), false);
  });

  // Casos de borda — strings vazias e tipos não-string
  it('deve rejeitar string vazia', () => {
    assert.equal(validarEmail(""), false);
  });

  it('deve rejeitar string sem @', () => {
    assert.equal(validarEmail("invalido"), false);
  });

  it("deve rejeitar null", () => {
    assert.equal(validarEmail(null), false);
  });

  it("deve rejeitar undefined", () => {
    assert.equal(validarEmail(undefined), false);
  });

  // Bordas recomendadas pela política de teste — espaços
  it('deve rejeitar entrada só com espaços em branco', () => {
    assert.equal(validarEmail("   "), false);
  });

  it('deve aceitar entrada com espaço antes e depois (critério não exige trim)', () => {
    // A regra do critério 2 não menciona trimming de espaços.
    // " ana@empresa.com " — o domínio "empresa.com " termina com espaço
    // (não ponto), então passa pela checagem atual.
    // Isso é compatível com o critério escrito.
    assert.equal(validarEmail(" ana@empresa.com "), true);
  });

  it('deve rejeitar "@" isolado (local e domínio vazios)', () => {
    assert.equal(validarEmail("@"), false);
  });

  it('deve rejeitar "@." (local vazio, domínio é só ponto)', () => {
    assert.equal(validarEmail("@."), false);
  });
});