"use client";

import { theme } from "../../lib/theme";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
      type="search"
    />
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "13px 15px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    background: "rgba(15, 23, 42, 0.92)",
    color: theme.colors.textPrimary,
    outline: "none",
    fontSize: "14px",
  },
};