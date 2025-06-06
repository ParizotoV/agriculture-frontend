"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { Farm } from "@/entities/Farm";
import { loadFarmById, updateFarm } from "@/features/farms/farmsSlice";
import type { AppDispatch, RootState } from "@/store/store";

import { FarmFormData, farmSchema } from "@/app/farms/[id]/edit/schema";

import { Button } from "../atoms/Button";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { FormField } from "../atoms/FormField";
import { FormTitle } from "../atoms/FormTitle";
import { FormWrapper } from "../atoms/FormWrapper";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { ButtonGroup } from "../molecules/ButtonGroup";

export const EditFarmForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: farms,
    loading,
    error,
  } = useSelector((state: RootState) => state.farms);

  useEffect(() => {
    if (id && !farms.some((f) => f.id === id)) {
      dispatch(loadFarmById(id));
    }
  }, [dispatch, id, farms]);

  const farm: Farm | undefined = farms.find((f) => f.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: farm?.name || "",
      city: farm?.city || "",
      state: farm?.state || "",
      totalArea: farm?.totalArea ?? 0,
      agriculturalArea: farm?.agriculturalArea ?? 0,
      vegetationArea: farm?.vegetationArea ?? 0,
      producerId: farm?.producerId || "",
    },
  });

  useEffect(() => {
    if (farm) {
      reset({
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        agriculturalArea: farm.agriculturalArea,
        vegetationArea: farm.vegetationArea,
        producerId: farm.producerId,
      });
    }
  }, [farm, reset]);

  const onSubmit = async (data: FarmFormData) => {
    if (!farm) return;

    try {
      const updatedData: Partial<Farm> = {
        name: data.name,
        city: data.city,
        state: data.state,
        totalArea: data.totalArea,
        agriculturalArea: data.agriculturalArea,
        vegetationArea: data.vegetationArea,
        producerId: data.producerId,
      };

      const resultAction = await dispatch(
        updateFarm({ id: id as string, data: updatedData })
      );

      if (updateFarm.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg);
        return;
      }

      router.push("/farms");
    } catch (err) {
      console.error("Erro inesperado ao atualizar fazenda:", err);
      toast.error("Erro inesperado ao atualizar fazenda.");
    }
  };

  const onCancel = () => {
    router.push("/farms");
  };

  if (loading) {
    return <FormWrapper>Carregando dados da fazenda para editar…</FormWrapper>;
  }

  if (error) {
    return (
      <FormWrapper>
        <p style={{ color: "#e53935" }}>{error}</p>
      </FormWrapper>
    );
  }

  if (!farm) {
    return (
      <FormWrapper>
        <p style={{ color: "#757575" }}>Fazenda não encontrada.</p>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <FormTitle>Editar Fazenda</FormTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

        <FormField>
          <Label htmlFor="producerId">ID do Produtor</Label>
          <Input
            id="producerId"
            type="text"
            $hasError={!!errors.producerId}
            {...register("producerId")}
            readOnly
          />
          {errors.producerId && (
            <ErrorMessage>{errors.producerId.message}</ErrorMessage>
          )}
        </FormField>

        <ButtonGroup>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};
