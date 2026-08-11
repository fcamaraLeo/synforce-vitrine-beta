/**
 * Testes de validacao.mjs — cobrem cada exemplo do glossário.
 * Roda com: node --test
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validarEmail } from "../js/validacao.mjs";

describe("validarEmail", () => {
  // Válidos
  it('deve aceitar "ana@empresa.com.br"', () => {
    assert.ok(validarEmail("ana@empresa.com.br"));
  });

  it('deve aceitar "ana+cobranca@empresa.com"', () => {
    assert.ok(validarEmail("ana+cobranca@empresa.com"));
  });

  // Inválidos
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

  // Casos de borda
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
});