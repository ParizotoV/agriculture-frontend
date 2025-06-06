import React from "react";
import styled from "styled-components";
import { Input } from "../atoms/Input";

const SearchWrapper = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  placeholder,
  onChange,
}) => (
  <SearchWrapper>
    <Input
      type="text"
      placeholder={placeholder || ""}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </SearchWrapper>
);
