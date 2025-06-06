"use client";

import type { Crop } from "@/entities/Crop";
import React from "react";
import styled from "styled-components";
import { CropCard } from "./CropCard";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface CropListProps {
  crops: Crop[];
}

export const CropList: React.FC<CropListProps> = ({ crops }) => {
  if (crops.length === 0) {
    return <p>Nenhuma cultura cadastrada.</p>;
  }

  return (
    <GridContainer>
      {crops.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
    </GridContainer>
  );
};
