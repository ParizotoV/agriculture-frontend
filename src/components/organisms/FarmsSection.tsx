import React from "react";
import styled from "styled-components";
import { SectionTitle } from "../atoms/SectionTitle";
import { Farm, FarmCard } from "../molecules/FarmCard";

const SectionWrapper = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export interface FarmsSectionProps {
  farms: Farm[];
}

export const FarmsSection: React.FC<FarmsSectionProps> = ({ farms }) => (
  <SectionWrapper>
    <SectionTitle>Fazendas</SectionTitle>
    {farms.length === 0 ? (
      <p style={{ color: "#757575" }}>Este produtor não possui fazendas.</p>
    ) : (
      <Grid>
        {farms.map((farm) => (
          <FarmCard key={farm.id} farm={farm} />
        ))}
      </Grid>
    )}
  </SectionWrapper>
);
