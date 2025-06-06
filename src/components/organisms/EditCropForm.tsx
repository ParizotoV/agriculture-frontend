"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { Crop } from "@/entities/Crop";
import { loadCropById, updateCrop } from "@/features/cultures/culturesSlice";
import { loadFarms } from "@/features/farms/farmsSlice";
import type { AppDispatch, RootState } from "@/store/store";

import { CropFormData, cropSchema } from "@/app/crops/[id]/edit/schema/schema";

import { Button } from "../atoms/Button";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { FormField } from "../atoms/FormField";
import { FormTitle } from "../atoms/FormTitle";
import { FormWrapper } from "../atoms/FormWrapper";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { MoneyInput } from "../atoms/MoneyInput";
import { Select } from "../atoms/Select";
import { ButtonGroup } from "../molecules/ButtonGroup";

export const EditCropForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: crops,
    loading: loadingCrops,
    error: errorCrops,
  } = useSelector((state: RootState) => state.cultures);
  const { list: farms, loading: loadingFarms } = useSelector(
    (state: RootState) => state.farms
  );

  useEffect(() => {
    if (id && !crops.some((c) => c.id === id)) {
      dispatch(loadCropById(id));
    }
  }, [dispatch, id, crops]);

  useEffect(() => {
    if (farms.length === 0) {
      dispatch(loadFarms());
    }
  }, [dispatch, farms.length]);

  const crop: Crop | undefined = crops.find((c) => c.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<CropFormData>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      farmId: crop?.farmId || "",
      cultureName: crop?.cultureName || "",
      season: crop?.season || "",
      harvestQuantity: (crop?.harvestQuantity as string) || "",
      priceReceived: (crop?.priceReceived as string) || "",
    },
  });

  useEffect(() => {
    if (crop) {
      reset({
        farmId: crop.farmId,
        cultureName: crop.cultureName,
        season: crop.season,
        harvestQuantity: (crop.harvestQuantity as string) || "",
        priceReceived: (crop.priceReceived as string) || "",
      });
    }
  }, [crop, reset]);

  const onSubmit = async (data: CropFormData) => {
    if (!crop) return;

    try {
      const updatedData: Partial<Omit<Crop, "id">> = {
        farmId: data.farmId,
        cultureName: data.cultureName,
        season: data.season,
      };

      if (data.harvestQuantity) {
        const val = parseFloat(data.harvestQuantity.replace(",", "."));
        updatedData.harvestQuantity = val;
      }

      if (data.priceReceived) {
        const clean = data.priceReceived
          .replace(/[^0-9,-]/g, "")
          .replace(",", ".");
        const val = parseFloat(clean);
        updatedData.priceReceived = val;
      }

      const resultAction = await dispatch(
        updateCrop({ id: id as string, data: updatedData })
      );

      if (updateCrop.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg);
        return;
      }

      router.push("/crops");
    } catch (err) {
      console.error("Erro inesperado ao atualizar cultura:", err);
      toast.error("Erro inesperado ao atualizar cultura.");
    }
  };

  const onCancel = () => {
    router.push("/crops");
  };

  if (loadingCrops || loadingFarms) {
    return <FormWrapper>Carregando dados para editar…</FormWrapper>;
  }

  if (errorCrops) {
    return (
      <FormWrapper>
        <p style={{ color: "#e53935" }}>{errorCrops}</p>
      </FormWrapper>
    );
  }

  if (!crop) {
    return (
      <FormWrapper>
        <p style={{ color: "#757575" }}>Cultura não encontrada.</p>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <FormTitle>Editar Cultura: {crop.cultureName}</FormTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField>
          <Label htmlFor="farmId">Fazenda</Label>
          <Select
            id="farmId"
            $hasError={!!errors.farmId}
            {...register("farmId")}
            defaultValue={crop.farmId}
          >
            <option value="" disabled>
              Selecione uma fazenda…
            </option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.city}, {f.state})
              </option>
            ))}
          </Select>
          {errors.farmId && (
            <ErrorMessage>{errors.farmId.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="cultureName">Nome da Cultura</Label>
          <Input
            id="cultureName"
            type="text"
            placeholder="Ex: Soja"
            $hasError={!!errors.cultureName}
            {...register("cultureName")}
          />
          {errors.cultureName && (
            <ErrorMessage>{errors.cultureName.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="season">Safra</Label>
          <Input
            id="season"
            type="text"
            placeholder="Ex: 2022"
            $hasError={!!errors.season}
            {...register("season")}
          />
          {errors.season && (
            <ErrorMessage>{errors.season.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="harvestQuantity">Colheita (Toneladas)</Label>
          <Input
            id="harvestQuantity"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 200.5"
            $hasError={!!errors.harvestQuantity}
            {...register("harvestQuantity")}
            onKeyDown={(e) => {
              const allowedKeys = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                ",",
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                "Delete",
              ];
              if (
                !allowedKeys.includes(e.key) &&
                !(e.key === "c" && (e.ctrlKey || e.metaKey)) &&
                !(e.key === "v" && (e.ctrlKey || e.metaKey))
              ) {
                e.preventDefault();
              }
            }}
            onBlur={(e) => {
              const val = Number(e.currentTarget.value).toFixed(2);

              if (val.includes(",")) {
                e.currentTarget.value = val.replace(",", ".");
              }
              e.currentTarget.value = val;
            }}
          />
          {errors.harvestQuantity && (
            <ErrorMessage>{errors.harvestQuantity.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="priceReceived">Preço Recebido (R$)</Label>

          {/** Usamos Controller para integrar o CurrencyInput ao React Hook Form */}
          <Controller
            name="priceReceived"
            control={control}
            render={({ field }) => (
              <MoneyInput
                id="priceReceived"
                placeholder="Ex: R$ 1.234,56"
                prefix="R$ "
                decimalSeparator=","
                groupSeparator="."
                decimalsLimit={2}
                value={field.value}
                $hasError={!!errors.priceReceived}
                onValueChange={(value) => {
                  field.onChange(value === undefined ? "" : value);
                }}
              />
            )}
          />
          {errors.priceReceived && (
            <ErrorMessage>{errors.priceReceived.message}</ErrorMessage>
          )}
        </FormField>

        <ButtonGroup>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Atualizando…" : "Salvar Alterações"}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};
