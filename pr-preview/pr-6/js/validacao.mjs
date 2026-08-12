/**
 * validacao.mjs — Validação de e-mail para inscrição na Vitrine.
 *
 * A regra: exatamente um "@", ao menos um caractere antes, e um domínio
 * depois com pelo menos um ponto que não esteja na primeira nem na última
 * posição do domínio.
 *
 * Exporta uma função pura para rodar igual no navegador e no node --test.
 */

/**
 * @param {unknown} entrada
 * @returns {boolean}
 */
export function validarEmail(entrada) {
  if (typeof entrada !== "string") return false;

  const partes = entrada.split("@");
  if (partes.length !== 2) return false;

  const [local, dominio] = partes;

  if (local.length < 1) return false;
  if (dominio.length < 1) return false;
  if (!dominio.includes(".")) return false;
  if (dominio.startsWith(".") || dominio.endsWith(".")) return false;

  return true;
}