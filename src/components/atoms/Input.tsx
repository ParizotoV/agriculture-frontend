import styled from "styled-components";

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ $hasError, theme }) => ($hasError ? "#E53935" : theme.colors.border)};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.md};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px
      ${({ $hasError, theme }) =>
        $hasError ? "rgba(229, 57, 53, 0.2)" : "rgba(46, 125, 50, 0.2)"};
  }
`;
