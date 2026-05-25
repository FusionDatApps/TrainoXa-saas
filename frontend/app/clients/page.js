"use client";

import { useState } from "react";

import TrainerShell from "../../components/TrainerShell";

import { apiFetch } from "../../lib/api";
import { uiStyles } from "../../lib/ui-styles";
import { layoutStyles } from "../../lib/layout-styles";

import useFetch from "../../hooks/useFetch";
import useMutation from "../../hooks/useMutation";

import PageContainer from "../../components/ui/PageContainer";
import SectionCard from "../../components/ui/SectionCard";
import StatCard from "../../components/ui/StatCard";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";
import ActionButton from "../../components/ui/ActionButton";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  const {
    data: clients = [],
    loading,
    error: fetchError,
    refetch: loadClients,
  } = useFetch("/clients", {
    initialData: [],
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    loading: creating,
    error,
    success,
    mutate,
    setSuccessMessage,
  } = useMutation(async (payload) => {
    return apiFetch("/clients", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await mutate({
        fullName,
        email,
        password,
      });

      setSuccessMessage("Cliente creado correctamente");

      setFullName("");
      setEmail("");
      setPassword("");

      await loadClients();
    } catch (err) {
      console.error(err);
    }
  }

  const columns = [
    {
      key: "name",
      label: "Cliente",
      render: (client) => (
        <div>
          <p style={styles.clientName}>{client.fullName || "Sin nombre"}</p>
          <p style={styles.clientEmail}>{client.email || "Sin email"}</p>
        </div>
      ),
    },
    {
      key: "age",
      label: "Edad",
      render: (client) => <span>{client.age || "N/A"}</span>,
    },
    {
      key: "weight",
      label: "Peso",
      render: (client) => <span>{client.weightKg || "N/A"} kg</span>,
    },
    {
      key: "height",
      label: "Altura",
      render: (client) => <span>{client.heightCm || "N/A"} cm</span>,
    },
    {
      key: "status",
      label: "Estado",
      render: () => <Badge variant="success">Activo</Badge>,
    },
  ];

  return (
    <TrainerShell title="Clientes" active="clients">
      <PageContainer>
        <div style={uiStyles.page}>
          <section style={layoutStyles.topGrid}>
            <SectionCard>
              <PageHeader
                eyebrow="Gestión de clientes"
                title="Registrar nuevo cliente"
                description="Crea nuevos clientes para administrar entrenamientos, rutinas y progreso físico."
              />

              <form onSubmit={handleSubmit} style={uiStyles.stack}>
                <FormField
                  label="Nombre completo"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <FormField
                  label="Correo electrónico"
                  type="email"
                  placeholder="cliente@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FormField
                  label="Password inicial"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div style={layoutStyles.actions}>
                  <ActionButton disabled={creating}>
                    {creating ? "Creando..." : "Crear cliente"}
                  </ActionButton>
                </div>

                {error ? (
                  <FeedbackMessage variant="error">{error}</FeedbackMessage>
                ) : null}

                {success ? (
                  <FeedbackMessage variant="success">{success}</FeedbackMessage>
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
            <div style={uiStyles.sectionHeader}>
              <div>
                <p style={layoutStyles.eyebrow}>Base de clientes</p>
                <h2 style={uiStyles.sectionTitle}>Lista de clientes</h2>
              </div>

              <Badge variant="default">{clients.length} registros</Badge>
            </div>

            {loading ? <LoadingCard>Cargando clientes...</LoadingCard> : null}

            {fetchError ? (
              <FeedbackMessage variant="error">{fetchError}</FeedbackMessage>
            ) : null}

            {!loading && clients.length === 0 ? (
              <EmptyState>Todavía no existen clientes registrados.</EmptyState>
            ) : null}

            {!loading && clients.length > 0 ? (
              <DataTable
                columns={columns}
                data={clients}
                emptyMessage="No hay clientes disponibles"
              />
            ) : null}
          </SectionCard>
        </div>
      </PageContainer>
    </TrainerShell>
  );
}

const styles = {
  
  tableSection: {
    minHeight: "auto",
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