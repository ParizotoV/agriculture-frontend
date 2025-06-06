"use client";

import type { Farm } from "@/entities/Farm";
import { loadFarmById } from "@/features/farms/farmsSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { formatCurrency } from "@/utils/formatCurrency";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const DetailContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Location = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Areas = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.4;
`;

const CulturesList = styled.ul`
  list-style: none;
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  padding: 0;
`;

const CultureItem = styled.li`
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  div {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    line-height: 1.4;
  }

  div:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.textDark};
  }

  em {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default function FarmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: farms,
    loading,
    error,
  } = useSelector((state: RootState) => state.farms);

  useEffect(() => {
    const exists = farms.some((f) => f.id === id);
    if (!exists && id) {
      dispatch(loadFarmById(id));
    }
  }, [dispatch, id, farms]);

  const farm: Farm | undefined = farms.find((f) => f.id === id);

  if (loading) {
    return <DetailContainer>Carregando fazenda…</DetailContainer>;
  }

  if (error) {
    return (
      <DetailContainer>
        <p style={{ color: "red" }}>{error}</p>
      </DetailContainer>
    );
  }

  if (!farm) {
    return (
      <DetailContainer>
        <BackButton onClick={() => router.push("/farms")}>← Voltar</BackButton>
        <Title>Fazenda não encontrada</Title>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => router.push("/farms")}>← Voltar</BackButton>
      <Title>{farm.name}</Title>
      <Location>
        Localização: {farm.city}, {farm.state}
      </Location>
      <Areas>
        <div>
          <strong>Área Total:</strong> {farm.totalArea} ha
        </div>
        <div>
          <strong>Agricultável:</strong> {farm.agriculturalArea} ha
        </div>
        <div>
          <strong>Vegetação:</strong> {farm.vegetationArea} ha
        </div>
      </Areas>

      <h3>Culturas / Safras</h3>
      {farm.crops && farm.crops.length === 0 ? (
        <p style={{ color: "#757575" }}>
          Nenhuma cultura cadastrada nesta fazenda.
        </p>
      ) : (
        <CulturesList>
          {farm.crops &&
            farm.crops.map((c) => {
              return (
                <CultureItem key={c.id}>
                  <strong>{c.cultureName}</strong> (Safra {c.season})<br />
                  <span>
                    <strong>Colheita:</strong>{" "}
                    {c.harvestQuantity ? c.harvestQuantity : <em>—</em>} t
                  </span>
                  <br />
                  <span>
                    <strong>Preço Recebido:</strong>{" "}
                    {c.priceReceived ? (
                      formatCurrency(c.priceReceived)
                    ) : (
                      <em>—</em>
                    )}
                  </span>
                </CultureItem>
              );
            })}
        </CulturesList>
      )}
    </DetailContainer>
  );
}
