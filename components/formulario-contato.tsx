"use client";

import { useState } from "react";
import {
  CamposContato,
  validarFormulario,
  formularioValido,
} from "@/lib/validacao-contato";
import type { ErrosContato } from "@/lib/validacao-contato";

const VAZIO: CamposContato = { nome: "", email: "", mensagem: "" };
const SEM_ERRO: ErrosContato = { nome: null, email: null, mensagem: null };

export function FormularioContato() {
  const [campos, setCampos] = useState<CamposContato>(VAZIO);
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [enviado, setEnviado] = useState(false);

  const erros = validarFormulario(campos);
  const valido = formularioValido(erros);

  function alterar(campo: keyof CamposContato, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
    setEnviado(false);
  }

  function marcarTocado(campo: keyof CamposContato) {
    setTocados((atual) => ({ ...atual, [campo]: true }));
  }

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();

    // Marca todos os campos como tocados para mostrar erros se houver
    setTocados({ nome: true, email: true, mensagem: true });

    if (!valido) return;

    setEnviado(true);
    setCampos(VAZIO);
    setTocados({});
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          name="nome"
          value={campos.nome}
          onChange={(e) => alterar("nome", e.target.value)}
          onBlur={() => marcarTocado("nome")}
          aria-invalid={tocados.nome && erros.nome !== null ? true : undefined}
          aria-describedby={tocados.nome && erros.nome ? "erro-nome" : undefined}
        />
        {tocados.nome && erros.nome && (
          <p id="erro-nome" className="erro" role="alert">
            {erros.nome}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="text"
          value={campos.email}
          onChange={(e) => alterar("email", e.target.value)}
          onBlur={() => marcarTocado("email")}
          aria-invalid={tocados.email && erros.email !== null ? true : undefined}
          aria-describedby={tocados.email && erros.email ? "erro-email" : undefined}
        />
        {tocados.email && erros.email && (
          <p id="erro-email" className="erro" role="alert">
            {erros.email}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="mensagem">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          value={campos.mensagem}
          onChange={(e) => alterar("mensagem", e.target.value)}
          onBlur={() => marcarTocado("mensagem")}
          aria-invalid={tocados.mensagem && erros.mensagem !== null ? true : undefined}
          aria-describedby={tocados.mensagem && erros.mensagem ? "erro-mensagem" : undefined}
        />
        {tocados.mensagem && erros.mensagem && (
          <p id="erro-mensagem" className="erro" role="alert">
            {erros.mensagem}
          </p>
        )}
      </div>

      <button type="submit" className="botao-primario" disabled={!valido}>
        Enviar
      </button>

      {enviado && <p className="positivo">Recebemos sua mensagem. Obrigado!</p>}
    </form>
  );
}