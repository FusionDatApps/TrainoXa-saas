"use client";

import { layoutStyles } from "../../lib/layout-styles";

export default function SelectField({
  label,
  value,
  onChange,
  children,
  disabled = false,
  required = false,
}) {
  return (
    <div style={styles.wrapper}>
      {label ? (
        <label style={layoutStyles.label}>
          {label}
        </label>
      ) : null}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={layoutStyles.select}
      >
        {children}
      </select>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },
};