import styled from "styled-components";

export const FarmDetails = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
`;
