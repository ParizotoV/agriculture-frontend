"use client";

import { BackButton } from "@/components/atoms/BackButton";
import { DetailContainer } from "@/components/atoms/DetailContainer";
import { Icon } from "@/components/atoms/Icon";
import { ProducerHeader as ProducerHeaderMolecule } from "@/components/molecules/ProducerHeader";
import { FarmsSection as FarmsSectionOrganism } from "@/components/organisms/FarmsSection";
import { loadProducerById } from "@/features/producers/producersSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProducerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { list: producers, loading } = useSelector(
    (state: RootState) => state.producers
  );

  useEffect(() => {
    if (producers.length === 0) dispatch(loadProducerById(id as string));
  }, [dispatch, producers.length, id]);

  const producer = producers.find((p) => p.id === id);

  if (loading)
    return <DetailContainer>Carregando detalhes do produtor…</DetailContainer>;

  if (!producer)
    return (
      <DetailContainer>
        <BackButton onClick={() => router.push("/producers")}>
          <Icon>←</Icon> Voltar
        </BackButton>
        <ProducerHeaderMolecule name="Produtor não encontrado" cpfCnpj="" />
      </DetailContainer>
    );

  return (
    <DetailContainer>
      <BackButton onClick={() => router.push("/producers")}>
        <Icon>←</Icon> Voltar
      </BackButton>

      <ProducerHeaderMolecule
        name={producer.name!}
        cpfCnpj={producer.cpfCnpj!}
      />

      <FarmsSectionOrganism farms={producer.farms!} />
    </DetailContainer>
  );
}
