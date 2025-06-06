"use client";

import type { Farm } from "@/entities/Farm";
import React from "react";
import styled from "styled-components";
import { FarmCard } from "./FarmCard";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface FarmListProps {
  farms: Farm[];
  onDelete: (farm: Farm) => void;
}

export const FarmList: React.FC<FarmListProps> = ({ farms, onDelete }) => {
  if (farms.length === 0) {
    return <p>Nenhuma fazenda cadastrada.</p>;
  }

  return (
    <GridContainer>
      {farms.map((farm) => (
        <FarmCard key={farm.id} farm={farm} onDeleteClick={onDelete} />
      ))}
    </GridContainer>
  );
};
