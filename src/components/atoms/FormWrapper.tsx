import styled from "styled-components";

export const FormWrapper = styled.div`
  max-width: 600px;
  margin: ${({ theme }) => theme.spacing.lg} auto;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;
