"use client";

import { useEffect, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import { apiFetch } from "../../lib/api";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadClients() {
    try {
      const res = await apiFetch("/clients");
      setClients(res.data || []);
    } catch (err) {
      console.error("Error cargando clientes:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/clients", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      setSuccess("Cliente creado correctamente");

      setFullName("");
      setEmail("");
      setPassword("");

      await loadClients();
    } catch (err) {
      setError(err.message || "No se pudo crear el cliente");
    } finally {
      setCreating(false);
    }
  }

  return (
    <TrainerShell title="Clientes" active="clients">
      <section style={styles.grid}>
        <article style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Crear cliente</h2>

          <p style={styles.sectionText}>
            Registra un nuevo cliente para este entrenador.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre completo</label>

              <input
                style={styles.input}
                type="text"
                placeholder="Ej: Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Correo del cliente</label>

              <input
                style={styles.input}
                type="email"
                placeholder="cliente@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password inicial</label>

              <input
                style={styles.input}
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={creating}
            >
              {creating ? "Creando..." : "Crear cliente"}
            </button>

            {error ? (
              <p style={styles.error}>{error}</p>
            ) : null}

            {success ? (
              <p style={styles.success}>{success}</p>
            ) : null}
          </form>
        </article>

        <aside style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total de clientes</p>

          <h3 style={styles.summaryValue}>
            {clients.length}
          </h3>

          <p style={styles.summaryText}>
            Aquí ves y gestionas los clientes asociados
            al trainer autenticado.
          </p>
        </aside>
      </section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>
          Lista de clientes
        </h2>

        {loading ? (
          <div style={styles.emptyCard}>
            <p style={styles.sectionText}>
              Cargando clientes...
            </p>
          </div>
        ) : null}

        {!loading && clients.length === 0 ? (
          <div style={styles.emptyCard}>
            <h3 style={styles.emptyTitle}>
              Todavía no tienes clientes
            </h3>

            <p style={styles.sectionText}>
              Cuando registres clientes en el sistema,
              aparecerán aquí.
            </p>
          </div>
        ) : null}

        {!loading && clients.length > 0 ? (
          <div style={styles.clientGrid}>
            {clients.map((client) => (
              <article
                key={client.id}
                style={styles.clientCard}
              >
                <p style={styles.clientTag}>Cliente</p>

                <h3 style={styles.clientName}>
                  {client.fullName || "Sin nombre"}
                </h3>

                <p style={styles.clientInfo}>
                  <strong>ID:</strong> {client.id}
                </p>

                <p style={styles.clientInfo}>
                  <strong>Email:</strong>{" "}
                  {client.email || "Sin email"}
                </p>

                <p style={styles.clientInfo}>
                  <strong>Edad:</strong>{" "}
                  {client.age || "N/A"}
                </p>

                <p style={styles.clientInfo}>
                  <strong>Peso:</strong>{" "}
                  {client.weightKg || "N/A"}
                </p>

                <p style={styles.clientInfo}>
                  <strong>Altura:</strong>{" "}
                  {client.heightCm || "N/A"}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </TrainerShell>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
    marginBottom: "32px",
  },

  formCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },

  summaryCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
  },

  sectionTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
  },

  sectionText: {
    margin: "0 0 18px 0",
    color: "#94a3b8",
    lineHeight: 1.5,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    marginTop: "4px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#22c55e",
    color: "#052e16",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "15px",
  },

  error: {
    margin: 0,
    color: "#f87171",
    fontSize: "14px",
  },

  success: {
    margin: 0,
    color: "#4ade80",
    fontSize: "14px",
  },

  summaryLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  summaryValue: {
    margin: "12px 0",
    fontSize: "56px",
    fontWeight: "800",
  },

  summaryText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },

  listSection: {
    marginTop: "16px",
  },

  emptyCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
  },

  emptyTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: "800",
  },

  clientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  clientCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "22px",
  },

  clientTag: {
    margin: "0 0 10px 0",
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  clientName: {
    margin: "0 0 16px 0",
    fontSize: "30px",
    fontWeight: "800",
  },

  clientInfo: {
    margin: "0 0 10px 0",
    color: "#e2e8f0",
    lineHeight: 1.5,
  },
};