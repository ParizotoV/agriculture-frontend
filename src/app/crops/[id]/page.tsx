"use client";

import type { Crop } from "@/entities/Crop";
import { loadCropById } from "@/features/cultures/culturesSlice";
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

const Info = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  /* Se quiser dar destaque para o label (em negrito), use strong */
  strong {
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export default function CropDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: crops,
    loading: loadingCrops,
    error: errorCrops,
  } = useSelector((state: RootState) => state.cultures);

  useEffect(() => {
    if (id && !crops.some((c) => c.id === id)) {
      dispatch(loadCropById(id));
    }
  }, [dispatch, id, crops]);

  const crop: Crop | undefined = crops.find((c) => c.id === id);

  if (loadingCrops) {
    return <DetailContainer>Carregando…</DetailContainer>;
  }

  if (errorCrops) {
    return (
      <DetailContainer>
        <p style={{ color: "red" }}>{errorCrops}</p>
      </DetailContainer>
    );
  }

  if (!crop) {
    return (
      <DetailContainer>
        <BackButton onClick={() => router.push("/crops")}>← Voltar</BackButton>
        <Title>Cultura não encontrada</Title>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => router.push("/crops")}>← Voltar</BackButton>
      <Title>{crop.cultureName}</Title>

      <Info>
        <strong>Safra:</strong> {crop.season}
      </Info>

      <Info>
        <strong>Fazenda:</strong>{" "}
        {crop.farm?.name ? crop.farm?.name : <em>—</em>}
      </Info>

      <Info>
        <strong>Colheita (Quantidade):</strong>{" "}
        {crop.harvestQuantity != null && crop.harvestQuantity !== "" ? (
          crop.harvestQuantity
        ) : (
          <em>—</em>
        )}
      </Info>

      <Info>
        <strong>Preço Recebido (R$):</strong>{" "}
        {crop.priceReceived != null && crop.priceReceived !== "" ? (
          formatCurrency(crop.priceReceived)
        ) : (
          <em>—</em>
        )}
      </Info>
    </DetailContainer>
  );
}
