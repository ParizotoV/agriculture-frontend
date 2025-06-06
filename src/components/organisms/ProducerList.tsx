"use client";

import { Producer } from "@/entities/Producer";
import React from "react";
import styled from "styled-components";
import { ProducerCard } from "../molecules/ProducerCard";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

interface ProducerListProps {
  producers: Producer[];
  onDelete: (producer: Producer) => void;
}

export const ProducerList: React.FC<ProducerListProps> = ({
  producers,
  onDelete,
}) => {
  if (producers.length === 0) {
    return (
      <EmptyStateContainer>Nenhum produtor cadastrado.</EmptyStateContainer>
    );
  }

  return (
    <ListContainer>
      {producers.map((producer) => (
        <ProducerCard
          key={producer.id}
          producer={producer}
          onDeleteClick={onDelete}
        />
      ))}
    </ListContainer>
  );
};
