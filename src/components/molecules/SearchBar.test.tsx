import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { SearchBar, SearchBarProps } from "./SearchBar";
const theme = {
  colors: {
    primary: "#CCCCCC",
    secondary: "#000000",
    accent: "#666666",
    support: "#FDD835",
    background: "#FFFFFF",
    sidebar: "#F5F5F5",
    text: "#333333",
    textSecondary: "#666666",
    border: "#CCCCCC",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
    xl: "20px",
  },
};

describe("SearchBar", () => {
  const defaultProps: SearchBarProps = {
    value: "texto inicial",
    placeholder: "Buscar produtor...",
    onChange: jest.fn(),
  };

  const renderWithTheme = (props: SearchBarProps) => {
    return render(
      <ThemeProvider theme={theme}>
        <SearchBar {...props} />
      </ThemeProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o input com valor e placeholder corretos", () => {
    renderWithTheme(defaultProps);

    const input = screen.getByPlaceholderText("Buscar produtor...");
    expect(input).toBeInTheDocument();

    expect((input as HTMLInputElement).value).toBe("texto inicial");
  });

  it("chama onChange com o valor digitado pelo usuário", async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    renderWithTheme({
      ...defaultProps,
      value: "",
      onChange: onChangeMock,
    });

    const input = screen.getByRole("textbox");
    expect((input as HTMLInputElement).value).toBe("");

    await user.type(input, "abc");

    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(onChangeMock).toHaveBeenNthCalledWith(1, "a");
    expect(onChangeMock).toHaveBeenNthCalledWith(2, "b");
    expect(onChangeMock).toHaveBeenNthCalledWith(3, "c");
  });

  it("se não passar placeholder, o atributo placeholder será vazio", () => {
    renderWithTheme({
      ...defaultProps,
      placeholder: undefined,
    });
    const input = screen.getByRole("textbox");
    expect((input as HTMLInputElement).placeholder).toBe("");
  });
});
