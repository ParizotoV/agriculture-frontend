import type { Producer } from "@/entities/Producer";
import Providers from "@/templates/Providers";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProducerList } from "./ProducerList";

jest.mock("../molecules/ProducerCard", () => {
  return {
    ProducerCard: ({
      producer,
      onDeleteClick,
    }: {
      producer: Producer;
      onDeleteClick: (p: Producer) => void;
    }) => (
      <div data-testid="producer-card">
        <span>{producer.name}</span>
        <button
          aria-label={`Excluir produtor ${producer.name}`}
          onClick={() => onDeleteClick(producer)}
        >
          Excluir
        </button>
      </div>
    ),
  };
});

describe("ProducerList", () => {
  it("exibe mensagem de estado vazio quando não há produtores", () => {
    render(
      <Providers>
        <ProducerList producers={[]} onDelete={() => {}} />
      </Providers>
    );

    expect(screen.getByText("Nenhum produtor cadastrado.")).toBeInTheDocument();
  });

  it("renderiza um ProducerCard para cada produtor e dispara onDelete ao clicar em Excluir", () => {
    const mockProducers: Producer[] = [
      { id: "p1", name: "João Silva", cpfCnpj: "12345678900" },
      { id: "p2", name: "Maria Souza", cpfCnpj: "98765432100" },
    ];
    const mockOnDelete = jest.fn();

    render(
      <Providers>
        <ProducerList producers={mockProducers} onDelete={mockOnDelete} />
      </Providers>
    );

    const cards = screen.getAllByTestId("producer-card");
    expect(cards).toHaveLength(2);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();

    const deleteButtonJoao = screen.getByLabelText(
      "Excluir produtor João Silva"
    );
    fireEvent.click(deleteButtonJoao);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducers[0]);

    const deleteButtonMaria = screen.getByLabelText(
      "Excluir produtor Maria Souza"
    );
    fireEvent.click(deleteButtonMaria);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducers[1]);

    expect(mockOnDelete).toHaveBeenCalledTimes(2);
  });
});
