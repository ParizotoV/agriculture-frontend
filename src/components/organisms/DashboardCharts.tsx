"use client";

import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import styled from "styled-components";

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartBox = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  flex: 1 1 350px;
  height: 360px;

  h4 {
    margin: 0 0 0.75rem 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const ChartBoxHalf = styled(ChartBox)`
  flex: 1 1 45%;
  /* podemos manter height: 360px, para ficar igual aos outros */
  height: 360px;
`;

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
  "#d84d88",
  "#d8a848",
];

interface DashboardChartsProps {
  byCulture: Array<{
    cultureName: string;
    count: number;
    totalHarvest: number;
    totalRevenue: number;
  }>;
  byLandUse: {
    agriculturalArea: number;
    vegetationArea: number;
  };
  byState: Array<{
    state: string;
    farmCount: number;
  }>;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  byCulture,
  byLandUse,
  byState,
}) => {
  const dataByState = byState.map(({ state, farmCount }) => ({
    name: state,
    value: farmCount,
  }));

  const dataByCultureCount = byCulture.map(({ cultureName, count }) => ({
    name: cultureName,
    value: count,
  }));

  const dataByCultureRevenue = byCulture.map(
    ({ cultureName, totalRevenue }) => ({
      name: cultureName,
      value: totalRevenue,
    })
  );

  const dataByCultureHarvest = byCulture.map(
    ({ cultureName, totalHarvest }) => ({
      name: cultureName,
      value: totalHarvest,
    })
  );

  const dataByLandUse = [
    { name: "Agricultável", value: byLandUse.agriculturalArea },
    { name: "Vegetação", value: byLandUse.vegetationArea },
  ];

  const renderPie = (data: { name: string; value: number }[]) => (
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={70}
        labelLine={true}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        wrapperStyle={{ zIndex: 1000 }}
        formatter={(value: number) =>
          value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }
      />
      <Legend
        formatter={(value) => (
          <span style={{ fontSize: "0.9rem" }}>{value}</span>
        )}
      />
    </PieChart>
  );

  return (
    <ChartsContainer>
      <ChartBox>
        <h4>Fazendas por Estado</h4>
        <ResponsiveContainer width="100%" height="85%">
          {renderPie(dataByState)}
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox>
        <h4>Culturas (Contagem)</h4>
        <ResponsiveContainer width="100%" height="85%">
          {renderPie(dataByCultureCount)}
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox>
        <h4>Receita por Cultura (R$)</h4>
        <ResponsiveContainer width="100%" height="85%">
          {renderPie(dataByCultureRevenue)}
        </ResponsiveContainer>
      </ChartBox>

      <ChartBoxHalf>
        <h4>Colheita por Cultura (t)</h4>
        <ResponsiveContainer width="100%" height="85%">
          {renderPie(dataByCultureHarvest)}
        </ResponsiveContainer>
      </ChartBoxHalf>

      <ChartBoxHalf>
        <h4>Uso do Solo (ha)</h4>
        <ResponsiveContainer width="100%" height="85%">
          {renderPie(dataByLandUse)}
        </ResponsiveContainer>
      </ChartBoxHalf>
    </ChartsContainer>
  );
};
