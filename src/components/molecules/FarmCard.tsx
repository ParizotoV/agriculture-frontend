import React from "react";
import styled from "styled-components";

import { CultureItem } from "@/components/atoms/CultureItem";
import { CulturesList } from "@/components/atoms/CulturesList";
import { FarmDetails } from "@/components/atoms/FarmDetails";
import { FarmHeader } from "@/components/atoms/FarmHeader";
import { FarmLocation } from "@/components/atoms/FarmLocation";
import { FarmName } from "@/components/atoms/FarmName";
import { SectionTitle } from "@/components/atoms/SectionTitle";

import type { Farm } from "@/entities/Farm";
import { formatCurrency } from "@/utils/formatCurrency";

const Card = styled.div`
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

export const FarmCard: React.FC<{ farm: Farm }> = ({ farm }) => {
  const firstTwoCrops = farm.crops ? farm.crops.slice(0, 2) : [];

  const moreCount =
    farm.crops && farm.crops.length > 2 ? farm.crops.length - 2 : 0;

  return (
    <Card>
      <FarmHeader>
        <FarmName>{farm.name}</FarmName>
        <FarmLocation>
          {farm.city}, {farm.state}
        </FarmLocation>
      </FarmHeader>

      <FarmDetails>
        <div>
          <strong>Área Total:</strong> {farm.totalArea} ha
        </div>
        <div>
          <strong>Agricultável:</strong> {farm.agriculturalArea} ha
        </div>
        <div>
          <strong>Vegetação:</strong> {farm.vegetationArea} ha
        </div>
      </FarmDetails>

      <SectionTitle
        style={{
          marginTop: "1rem",
          marginBottom: "0.25rem",
          fontSize: "1rem",
        }}
      >
        Culturas
      </SectionTitle>

      {(!farm.crops || farm.crops.length === 0) && (
        <p style={{ color: "#757575" }}>
          Nenhuma cultura cadastrada nesta fazenda.
        </p>
      )}

      {farm.crops && farm.crops.length > 0 && (
        <CulturesList>
          {firstTwoCrops.map((c) => {
            return (
              <CultureItem key={c.id}>
                <div>
                  • {c.cultureName} (Safra {c.season})
                </div>
                <div style={{ marginLeft: "1rem" }}>
                  <strong>Colheita:</strong>{" "}
                  {c.harvestQuantity ? `${c.harvestQuantity} t` : <em>—</em>}
                </div>
                <div style={{ marginLeft: "1rem" }}>
                  <strong>Preço Recebido:</strong>{" "}
                  {c.priceReceived ? (
                    formatCurrency(c.priceReceived)
                  ) : (
                    <em>—</em>
                  )}
                </div>
              </CultureItem>
            );
          })}

          {moreCount > 0 && (
            <CultureItem>
              <em>+ {moreCount} mais…</em>
            </CultureItem>
          )}
        </CulturesList>
      )}
    </Card>
  );
};
