import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const Name = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Doc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export interface ProducerHeaderProps {
  name: string;
  cpfCnpj: string;
}

export const ProducerHeader: React.FC<ProducerHeaderProps> = ({
  name,
  cpfCnpj,
}) => (
  <Wrapper>
    <Name>{name}</Name>
    <Doc>
      <strong>CPF/CNPJ:</strong> {cpfCnpj}
    </Doc>
  </Wrapper>
);
