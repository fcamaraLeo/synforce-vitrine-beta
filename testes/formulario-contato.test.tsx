import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormularioContato } from "@/components/formulario-contato";

function preencherCamposValidos() {
  const nome = screen.getByLabelText("Nome");
  const email = screen.getByLabelText("E-mail");
  const mensagem = screen.getByLabelText("Mensagem");

  fireEvent.change(nome, { target: { value: "Ana" } });
  fireEvent.change(email, { target: { value: "ana@empresa.com" } });
  fireEvent.change(mensagem, { target: { value: "Preciso de ajuda com o repasse" } });

  return { nome, email, mensagem };
}

function submeterFormulario() {
  const form = screen.getByRole("button", { name: /enviar/i }).closest("form")!;
  fireEvent.submit(form);
}

describe("FormularioContato", () => {
  it("começa com botão desabilitado", () => {
    render(<FormularioContato />);
    expect(screen.getByRole("button", { name: /enviar/i })).toBeDisabled();
  });

  it("não mostra mensagens de erro ao abrir a página", () => {
    render(<FormularioContato />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("mostra erro do nome após blur se vazio", () => {
    render(<FormularioContato />);

    const nome = screen.getByLabelText("Nome");
    fireEvent.focus(nome);
    fireEvent.blur(nome);

    expect(screen.getByRole("alert")).toHaveTextContent("Informe seu nome");
  });

  it("mostra erro do e-mail após blur se vazio", () => {
    render(<FormularioContato />);

    const email = screen.getByLabelText("E-mail");
    fireEvent.focus(email);
    fireEvent.blur(email);

    expect(screen.getByRole("alert")).toHaveTextContent("Informe seu e-mail");
  });

  it("mostra erro da mensagem após blur se vazia", () => {
    render(<FormularioContato />);

    const mensagem = screen.getByLabelText("Mensagem");
    fireEvent.focus(mensagem);
    fireEvent.blur(mensagem);

    expect(screen.getByRole("alert")).toHaveTextContent("Escreva sua mensagem");
  });

  it("habilita botão quando todos os campos estão válidos", () => {
    render(<FormularioContato />);

    preencherCamposValidos();

    expect(screen.getByRole("button", { name: /enviar/i })).toBeEnabled();
  });

  it("mantém botão desabilitado se apenas alguns campos preenchidos", () => {
    render(<FormularioContato />);

    const nome = screen.getByLabelText("Nome");
    const email = screen.getByLabelText("E-mail");

    fireEvent.change(nome, { target: { value: "Ana" } });
    fireEvent.change(email, { target: { value: "ana@empresa.com" } });
    // Mensagem vazia ainda

    expect(screen.getByRole("button", { name: /enviar/i })).toBeDisabled();
  });

  it("mostra erros de todos os campos ao tentar submit inválido", () => {
    render(<FormularioContato />);

    submeterFormulario();

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(3);
  });

  it("submete formulário válido e mostra mensagem de sucesso", () => {
    render(<FormularioContato />);

    preencherCamposValidos();
    submeterFormulario();

    expect(screen.getByText(/recebemos sua mensagem/i)).toBeInTheDocument();
  });

  it("limpa campos após submit válido", () => {
    render(<FormularioContato />);

    const { nome, email, mensagem } = preencherCamposValidos();
    submeterFormulario();

    expect(nome).toHaveValue("");
    expect(email).toHaveValue("");
    expect(mensagem).toHaveValue("");
  });

  it("esconde erros após submit bem-sucedido", () => {
    render(<FormularioContato />);

    // Submeter inválido primeiro para garantir que erros aparecem
    submeterFormulario();
    expect(screen.getAllByRole("alert")).toHaveLength(3);

    // Depois preenche e submete válido
    preencherCamposValidos();
    submeterFormulario();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("mostra erro específico de nome muito curto após blur", () => {
    render(<FormularioContato />);

    const nome = screen.getByLabelText("Nome");
    fireEvent.change(nome, { target: { value: "A" } });
    fireEvent.blur(nome);

    expect(screen.getByRole("alert")).toHaveTextContent("Informe o nome completo");
  });

  it("mostra erro específico de e-mail inválido após blur", () => {
    render(<FormularioContato />);

    const email = screen.getByLabelText("E-mail");
    fireEvent.change(email, { target: { value: "invalido" } });
    fireEvent.blur(email);

    expect(screen.getByRole("alert")).toHaveTextContent("Informe um e-mail válido");
  });

  it("mostra erro de mensagem muito curta após blur", () => {
    render(<FormularioContato />);

    const mensagem = screen.getByLabelText("Mensagem");
    fireEvent.change(mensagem, { target: { value: "123456789" } });
    fireEvent.blur(mensagem);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Escreva uma mensagem com pelo menos 10 caracteres"
    );
  });

  it("não mostra erro se campo válido após blur", () => {
    render(<FormularioContato />);

    const nome = screen.getByLabelText("Nome");
    fireEvent.change(nome, { target: { value: "Ana" } });
    fireEvent.blur(nome);

    expect(screen.queryByText("Informe seu nome")).not.toBeInTheDocument();
    expect(screen.queryByText("Informe o nome completo")).not.toBeInTheDocument();
  });

  it("mostra três erros separados ao submeter tudo vazio", () => {
    render(<FormularioContato />);

    submeterFormulario();

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(3);
    expect(alerts[0]).toHaveTextContent("Informe seu nome");
    expect(alerts[1]).toHaveTextContent("Informe seu e-mail");
    expect(alerts[2]).toHaveTextContent("Escreva sua mensagem");
  });
});