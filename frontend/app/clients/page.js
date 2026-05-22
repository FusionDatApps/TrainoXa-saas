"use client";

import { useEffect, useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";

export const dynamic = "force-dynamic";

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
      console.error(
        "Error cargando clientes:",
        err.message
      );
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
      setError(
        err.message ||
          "No se pudo crear el cliente"
      );
    } finally {
      setCreating(false);
    }
  }

  const columns = [
    {
      key: "name",

      label: "Cliente",

      render: (client) => (
        <div>
          <p style={styles.clientName}>
            {client.fullName || "Sin nombre"}
          </p>

          <p style={styles.clientEmail}>
            {client.email || "Sin email"}
          </p>
        </div>
      ),
    },

    {
      key: "age",

      label: "Edad",

      render: (client) => (
        <span>
          {client.age || "N/A"}
        </span>
      ),
    },

    {
      key: "weight",

      label: "Peso",

      render: (client) => (
        <span>
          {client.weightKg || "N/A"} kg
        </span>
      ),
    },

    {
      key: "height",

      label: "Altura",

      render: (client) => (
        <span>
          {client.heightCm || "N/A"} cm
        </span>
      ),
    },

    {
      key: "status",

      label: "Estado",

      render: () => (
        <Badge variant="success">
          Activo
        </Badge>
      ),
    },
  ];

  return (
    <TrainerShell
      title="Clientes"
      active="clients"
    >
      <PageContainer>
        <section style={styles.topGrid}>
          <SectionCard>
            <div style={styles.header}>
              <div>
                <p style={styles.eyebrow}>
                  Gestión de clientes
                </p>

                <h2 style={styles.title}>
                  Registrar nuevo cliente
                </h2>

                <p style={styles.description}>
                  Crea nuevos clientes para
                  administrar entrenamientos,
                  rutinas y progreso físico.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <div style={styles.field}>
                <label style={styles.label}>
                  Nombre completo
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Correo electrónico
                </label>

                <input
                  style={styles.input}
                  type="email"
                  placeholder="cliente@correo.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Password inicial
                </label>

                <input
                  style={styles.input}
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <div style={styles.actions}>
                <ActionButton
                  disabled={creating}
                >
                  {creating
                    ? "Creando..."
                    : "Crear cliente"}
                </ActionButton>
              </div>

              {error ? (
                <p style={styles.error}>
                  {error}
                </p>
              ) : null}

              {success ? (
                <p style={styles.success}>
                  {success}
                </p>
              ) : null}
            </form>
          </SectionCard>

          <StatCard
            label="Clientes"
            value={clients.length}
            description="Clientes registrados para este trainer."
          />
        </section>

        <SectionCard style={styles.tableSection}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.eyebrow}>
                Base de clientes
              </p>

              <h2 style={styles.title}>
                Lista de clientes
              </h2>
            </div>

            <Badge variant="default">
              {clients.length} registros
            </Badge>
          </div>

          {loading ? (
            <LoadingCard>
              Cargando clientes...
            </LoadingCard>
          ) : null}

          {!loading &&
          clients.length === 0 ? (
            <EmptyState>
              Todavía no existen clientes
              registrados.
            </EmptyState>
          ) : null}

          {!loading &&
          clients.length > 0 ? (
            <DataTable
              columns={columns}
              data={clients}
              emptyMessage="No hay clientes disponibles"
            />
          ) : null}
        </SectionCard>
      </PageContainer>
    </TrainerShell>
  );
}

const styles = {
  topGrid: {
    display: "grid",

    gridTemplateColumns:
      "2fr minmax(260px, 320px)",

    gap: "18px",

    marginBottom: "24px",
  },

  tableSection: {
    minHeight: "auto",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    marginBottom: "24px",
  },

  sectionHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "24px",
  },

  eyebrow: {
    margin: "0 0 10px 0",

    color: "#4ade80",

    fontSize: "12px",

    fontWeight: "900",

    textTransform: "uppercase",

    letterSpacing: "0.08em",
  },

  title: {
    margin: "0 0 10px 0",

    fontSize: "30px",

    fontWeight: "900",

    color: "#f8fafc",
  },

  description: {
    margin: 0,

    color: "#94a3b8",

    lineHeight: 1.6,

    maxWidth: "680px",
  },

  form: {
    display: "flex",

    flexDirection: "column",

    gap: "18px",
  },

  field: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  label: {
    color: "#e2e8f0",

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

  actions: {
    display: "flex",

    justifyContent: "flex-start",

    marginTop: "8px",
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

  clientName: {
    margin: "0 0 4px 0",

    fontWeight: "800",

    color: "#f8fafc",
  },

  clientEmail: {
    margin: 0,

    color: "#94a3b8",

    fontSize: "13px",
  },
};