import CurrencyInput from "react-currency-input-field";
import styled from "styled-components";

export const MoneyInput = styled(CurrencyInput).withConfig({
  shouldForwardProp: (prop) => prop !== "$hasError",
})<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ $hasError, theme }) => ($hasError ? "#E53935" : theme.colors.border)};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: #fff; /* Garante fundo branco, caso o default do CurrencyInput seja diferente */

  /* “box-sizing: border-box” assegura que o padding entre no cálculo da largura total */
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px
      ${({ $hasError, theme }) =>
        $hasError ? "rgba(229, 57, 53, 0.2)" : "rgba(46, 125, 50, 0.2)"};
  }
`;
