"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { Producer } from "@/entities/Producer";
import { createFarm } from "@/features/farms/farmsSlice";
import { loadProducers } from "@/features/producers/producersSlice";
import type { AppDispatch, RootState } from "@/store/store";

import { FarmFormData, farmSchema } from "@/app/farms/[id]/edit/schema";

import { Button } from "../atoms/Button";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { FormField } from "../atoms/FormField";
import { FormTitle } from "../atoms/FormTitle";
import { FormWrapper } from "../atoms/FormWrapper";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { Select } from "../atoms/Select";
import { ButtonGroup } from "../molecules/ButtonGroup";

export const NewFarmForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { list: producers, loading: loadingProducers } = useSelector(
    (state: RootState) => state.producers
  );

  useEffect(() => {
    if (producers.length === 0) {
      dispatch(loadProducers());
    }
  }, [dispatch, producers.length]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      totalArea: 0,
      agriculturalArea: 0,
      vegetationArea: 0,
      producerId: "",
    },
  });

  const onSubmit = async (data: FarmFormData) => {
    try {
      const newFarmPayload = {
        producerId: data.producerId,
        data: {
          name: data.name,
          city: data.city,
          state: data.state,
          totalArea: data.totalArea,
          agriculturalArea: data.agriculturalArea,
          vegetationArea: data.vegetationArea,
          producerId: data.producerId,
        },
      };

      const resultAction = await dispatch(createFarm(newFarmPayload));

      if (createFarm.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg);
        return;
      }

      router.push("/farms");
    } catch (err) {
      console.error("Erro inesperado ao criar fazenda:", err);
      toast.error("Erro inesperado ao criar fazenda.");
    }
  };

  const onCancel = () => {
    router.push("/farms");
  };

  return (
    <FormWrapper>
      <FormTitle>Nova Fazenda</FormTitle>

      {loadingProducers && <p>Carregando produtores...</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField>
          <Label htmlFor="producerId">Produtor</Label>
          <Select
            id="producerId"
            $hasError={!!errors.producerId}
            {...register("producerId")}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione um produtor…
            </option>
            {producers.map((p: Producer) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cpfCnpj})
              </option>
            ))}
          </Select>
          {errors.producerId && (
            <ErrorMessage>{errors.producerId.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="name">Nome da Fazenda</Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite o nome da fazenda"
            $hasError={!!errors.name}
            {...register("name")}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            type="text"
            placeholder="Ex: São Paulo"
            $hasError={!!errors.city}
            {...register("city")}
          />
          {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            type="text"
            placeholder="Ex: SP"
            $hasError={!!errors.state}
            {...register("state")}
          />
          {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="totalArea">Área Total (ha)</Label>
          <Input
            id="totalArea"
            type="number"
            step="0.01"
            placeholder="Ex: 120.50"
            $hasError={!!errors.totalArea}
            {...register("totalArea", { valueAsNumber: true })}
          />
          {errors.totalArea && (
            <ErrorMessage>{errors.totalArea.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="agriculturalArea">Área Agricultável (ha)</Label>
          <Input
            id="agriculturalArea"
            type="number"
            step="0.01"
            placeholder="Ex: 80.00"
            $hasError={!!errors.agriculturalArea}
            {...register("agriculturalArea", { valueAsNumber: true })}
          />
          {errors.agriculturalArea && (
            <ErrorMessage>{errors.agriculturalArea.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="vegetationArea">Área de Vegetação (ha)</Label>
          <Input
            id="vegetationArea"
            type="number"
            step="0.01"
            placeholder="Ex: 40.50"
            $hasError={!!errors.vegetationArea}
            {...register("vegetationArea", { valueAsNumber: true })}
          />
          {errors.vegetationArea && (
            <ErrorMessage>{errors.vegetationArea.message}</ErrorMessage>
          )}
        </FormField>

        <ButtonGroup>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando…" : "Salvar Fazenda"}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};
