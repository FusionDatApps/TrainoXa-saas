"use client";

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
}) {
  return (
    <label style={styles.wrapper}>
      <span style={styles.label}>{label}</span>

      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            ...styles.input,
            minHeight: "120px",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
    </label>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "700",
  },

  input: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "14px",
    padding: "14px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
  },
};