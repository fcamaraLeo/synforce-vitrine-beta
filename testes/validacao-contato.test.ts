import { describe, expect, it } from "vitest";
import {
  validarNome,
  validarEmail,
  validarMensagem,
  validarFormulario,
  formularioValido,
} from "@/lib/validacao-contato";

describe("validarNome", () => {
  it("rejeita vazio", () => {
    expect(validarNome("")).not.toBeNull();
  });

  it("rejeita só espaços", () => {
    expect(validarNome("   ")).not.toBeNull();
  });

  it("rejeita menos de 2 caracteres", () => {
    expect(validarNome("A")).not.toBeNull();
    expect(validarNome(" A ")).not.toBeNull();
  });

  it("aceita 2 caracteres ou mais", () => {
    expect(validarNome("An")).toBeNull();
    expect(validarNome("Ana")).toBeNull();
    expect(validarNome("José Maria")).toBeNull();
  });

  it("ignora espaços das pontas", () => {
    expect(validarNome("  Ana  ")).toBeNull();
    expect(validarNome("  A  ")).not.toBeNull();
  });
});

describe("validarEmail", () => {
  it("rejeita vazio", () => {
    expect(validarEmail("")).not.toBeNull();
  });

  it("rejeita só espaços", () => {
    expect(validarEmail("   ")).not.toBeNull();
  });

  it("aceita e-mail válido simples", () => {
    expect(validarEmail("ana@empresa.com.br")).toBeNull();
  });

  it("aceita e-mail com sinal de mais", () => {
    expect(validarEmail("ana+cobranca@empresa.com")).toBeNull();
  });

  it("rejeita dois arrobas", () => {
    expect(validarEmail("ana@@empresa.com")).not.toBeNull();
  });

  it("rejeita domínio sem ponto", () => {
    expect(validarEmail("ana@empresa")).not.toBeNull();
  });

  it("rejeita ponto no início do domínio", () => {
    expect(validarEmail("ana@.com")).not.toBeNull();
  });

  it("rejeita ponto no fim do domínio", () => {
    expect(validarEmail("ana@empresa.")).not.toBeNull();
  });

  it("rejeita sem parte local", () => {
    expect(validarEmail("@empresa.com")).not.toBeNull();
  });

  it("rejeita sem domínio", () => {
    expect(validarEmail("ana@")).not.toBeNull();
  });

  it("ignora espaços das pontas", () => {
    expect(validarEmail("  ana@empresa.com  ")).toBeNull();
  });
});

describe("validarMensagem", () => {
  it("rejeita vazio", () => {
    expect(validarMensagem("")).not.toBeNull();
  });

  it("rejeita só espaços", () => {
    expect(validarMensagem("     ")).not.toBeNull();
  });

  it("rejeita menos de 10 caracteres", () => {
    expect(validarMensagem("123456789")).not.toBeNull();
  });

  it("aceita 10 caracteres ou mais", () => {
    expect(validarMensagem("1234567890")).toBeNull();
    expect(validarMensagem("Preciso de ajuda com o repasse do pedido")).toBeNull();
  });

  it("ignora espaços das pontas", () => {
    expect(validarMensagem("  1234567890  ")).toBeNull();
    expect(validarMensagem("  123456789  ")).not.toBeNull();
  });
});

describe("validarFormulario", () => {
  it("retorna erros para campos vazios", () => {
    const erros = validarFormulario({ nome: "", email: "", mensagem: "" });
    expect(erros.nome).not.toBeNull();
    expect(erros.email).not.toBeNull();
    expect(erros.mensagem).not.toBeNull();
  });

  it("retorna null para todos quando válido", () => {
    const erros = validarFormulario({
      nome: "Ana",
      email: "ana@empresa.com",
      mensagem: "Preciso de ajuda",
    });
    expect(erros.nome).toBeNull();
    expect(erros.email).toBeNull();
    expect(erros.mensagem).toBeNull();
  });

  it("detecta nome inválido com espaços", () => {
    const erros = validarFormulario({
      nome: "   ",
      email: "ana@empresa.com",
      mensagem: "Preciso de ajuda",
    });
    expect(erros.nome).not.toBeNull();
    expect(erros.email).toBeNull();
    expect(erros.mensagem).toBeNull();
  });
});

describe("formularioValido", () => {
  it("retorna true quando todos os erros são null", () => {
    expect(
      formularioValido({ nome: null, email: null, mensagem: null })
    ).toBe(true);
  });

  it("retorna false quando há qualquer erro", () => {
    expect(
      formularioValido({ nome: "erro", email: null, mensagem: null })
    ).toBe(false);
    expect(
      formularioValido({ nome: null, email: "erro", mensagem: null })
    ).toBe(false);
    expect(
      formularioValido({ nome: null, email: null, mensagem: "erro" })
    ).toBe(false);
  });
});