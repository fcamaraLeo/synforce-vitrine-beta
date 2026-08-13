/**
 * inscricao.mjs — Comportamento do formulário de inscrição no rodapé.
 *
 * Valida o e-mail em tempo real e só habilita o botão quando o e-mail é
 * válido. Exibe a mensagem de erro apenas depois que o usuário interage
 * com o campo ("tocado").
 *
 * Módulo ES, carregado como <script type="module"> no index.html.
 */
import { validarEmail } from "./validacao.mjs";

const campo = document.getElementById("email-inscricao");
const botao = document.getElementById("btn-inscrever");
const erro = document.getElementById("erro-email");

/** Indica se o usuário já interagiu com o campo (tocado). */
let tocado = false;

function atualizar() {
  const valor = campo.value;
  const valido = validarEmail(valor);

  botao.disabled = !valido;

  if (tocado && !valido && valor.length > 0) {
    erro.hidden = false;
  } else {
    erro.hidden = true;
  }
}

campo.addEventListener("input", () => {
  atualizar();
});

campo.addEventListener("blur", () => {
  tocado = true;
  atualizar();
});

// Estado inicial: campo vazio, botão desabilitado, erro oculto
botao.disabled = true;
erro.hidden = true;