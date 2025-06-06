import styled from "styled-components";

export const ErrorMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: #e53935;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
