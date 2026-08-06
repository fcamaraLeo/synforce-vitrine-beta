/**
 * Regras de validação do formulário de contato.
 *
 * Todas são funções puras — não têm efeito colateral e não tocam no DOM.
 * Convenção da casa: regra objetiva em lib/, componente só chama.
 */

export interface CamposContato {
  nome: string;
  email: string;
  mensagem: string;
}

export interface ErrosContato {
  nome: string | null;
  email: string | null;
  mensagem: string | null;
}

/**
 * Valida o campo nome.
 * Obrigatório, mínimo de 2 caracteres depois de remover espaços das pontas.
 */
export function validarNome(nome: string): string | null {
  const trimado = nome.trim();
  if (trimado.length === 0) return "Informe seu nome";
  if (trimado.length < 2) return "Informe o nome completo";
  return null;
}

/**
 * Valida o campo e-mail.
 * Obrigatório, com exatamente um @, algo antes, e um domínio depois
 * contendo pelo menos um ponto que não está na borda do domínio.
 */
export function validarEmail(email: string): string | null {
  const trimado = email.trim();
  if (trimado.length === 0) return "Informe seu e-mail";

  const partes = trimado.split("@");
  if (partes.length !== 2) return "Informe um e-mail válido";

  const [local, dominio] = partes;
  if (local.length === 0) return "Informe um e-mail válido";
  if (dominio.length === 0) return "Informe um e-mail válido";
  if (!dominio.includes(".")) return "Informe um e-mail válido";
  if (dominio.startsWith(".")) return "Informe um e-mail válido";
  if (dominio.endsWith(".")) return "Informe um e-mail válido";

  return null;
}

/**
 * Valida o campo mensagem.
 * Obrigatória, mínimo de 10 caracteres depois de remover espaços das pontas.
 */
export function validarMensagem(mensagem: string): string | null {
  const trimado = mensagem.trim();
  if (trimado.length === 0) return "Escreva sua mensagem";
  if (trimado.length < 10) return "Escreva uma mensagem com pelo menos 10 caracteres";
  return null;
}

/**
 * Valida o formulário inteiro e devolve o mapa de erros.
 */
export function validarFormulario(campos: CamposContato): ErrosContato {
  return {
    nome: validarNome(campos.nome),
    email: validarEmail(campos.email),
    mensagem: validarMensagem(campos.mensagem),
  };
}

/**
 * Verdadeiro quando todos os campos estão válidos (sem erro).
 */
export function formularioValido(erros: ErrosContato): boolean {
  return erros.nome === null && erros.email === null && erros.mensagem === null;
}