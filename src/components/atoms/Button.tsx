import styled from "styled-components";

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "accent";
}>`
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
        return theme.colors.secondary;
      case "accent":
        return theme.colors.accent;
      default:
        return theme.colors.primary;
    }
  }};
  color: #fff;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  box-shadow: ${({ $variant }) =>
    $variant === "accent" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"};
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: ${({ $variant, theme }) => {
      switch ($variant) {
        case "accent":
          return theme.colors.secondary;
        case "secondary":
          return "#795548";
        default:
          return theme.colors.support;
      }
    }};
    ${({ $variant }) =>
      $variant === "accent" ? "box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);" : ""}
  }

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;
