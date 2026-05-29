"use client";

import { useMemo, useState } from "react";

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

import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import FormActions from "../../components/ui/FormActions";

import TableCard from "../../components/ui/TableCard";
import TableToolbar from "../../components/ui/TableToolbar";
import EmptySearchState from "../../components/ui/EmptySearchState";
import FilterPill from "../../components/ui/FilterPill";

import ContentStack from "../../components/ui/ContentStack";
import InlineGroup from "../../components/ui/InlineGroup";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";
import PageSection from "../../components/ui/PageSection";

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

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

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

    await mutate({
      fullName,
      email,
      password,
    });

    setSuccessMessage(
      "Cliente creado correctamente"
    );

    setFullName("");
    setEmail("");
    setPassword("");

    await loadClients();
  }

  const filteredClients =
    useMemo(() => {
      let result = [...clients];

      if (search.trim()) {
        const term =
          search.toLowerCase();

        result = result.filter(
          (client) =>
            client.fullName
              ?.toLowerCase()
              .includes(term) ||
            client.email
              ?.toLowerCase()
              .includes(term)
        );
      }

      if (filter === "withWeight") {
        result = result.filter(
          (client) =>
            client.weightKg
        );
      }

      if (filter === "withAge") {
        result = result.filter(
          (client) => client.age
        );
      }

      return result;
    }, [clients, search, filter]);

  const columns = [
    {
      key: "name",

      label: "Cliente",

      render: (client) => (
        <div>
          <p
            style={
              styles.clientName
            }
          >
            {client.fullName ||
              "Sin nombre"}
          </p>

          <p
            style={
              styles.clientEmail
            }
          >
            {client.email ||
              "Sin email"}
          </p>
        </div>
      ),
    },

    {
      key: "age",

      label: "Edad",

      render: (client) => (
        <span>
          {client.age ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "weight",

      label: "Peso",

      render: (client) => (
        <span>
          {client.weightKg ||
            "N/A"}{" "}
          kg
        </span>
      ),
    },

    {
      key: "height",

      label: "Altura",

      render: (client) => (
        <span>
          {client.heightCm ||
            "N/A"}{" "}
          cm
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
        <ContentStack gap={24}>
          <PageSection>
            <ResponsiveGrid
              min={320}
              gap={20}
            >
              <SectionCard>
                <PageHeader
                  eyebrow="Gestión de clientes"
                  title="Registrar nuevo cliente"
                  description="Crea nuevos clientes para administrar entrenamientos, rutinas y progreso físico."
                />

                <form
                  onSubmit={
                    handleSubmit
                  }
                  style={
                    uiStyles.stack
                  }
                >
                  <FormField
                    label="Nombre completo"
                    placeholder="Ej: Juan Pérez"
                    value={
                      fullName
                    }
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                  />

                  <FormField
                    label="Correo electrónico"
                    type="email"
                    placeholder="cliente@correo.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />

                  <FormField
                    label="Password inicial"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={
                      password
                    }
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <FormActions
                    loading={
                      creating
                    }
                    submitText="Crear cliente"
                  />

                  {error ? (
                    <FeedbackMessage variant="error">
                      {error}
                    </FeedbackMessage>
                  ) : null}

                  {success ? (
                    <FeedbackMessage variant="success">
                      {success}
                    </FeedbackMessage>
                  ) : null}
                </form>
              </SectionCard>

              <StatCard
                label="Clientes"
                value={
                  clients.length
                }
                description="Clientes registrados para este trainer."
              />
            </ResponsiveGrid>
          </PageSection>

          <PageSection>
            <TableCard
              toolbar={
                <TableToolbar
                  title="Lista de clientes"
                  description="Consulta, filtra y administra tu base de clientes fitness."
                  searchValue={
                    search
                  }
                  onSearchChange={(
                    e
                  ) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  searchPlaceholder="Buscar cliente o correo..."
                >
                  <InlineGroup gap={10}>
                    <FilterPill
                      active={
                        filter ===
                        "all"
                      }
                      onClick={() =>
                        setFilter(
                          "all"
                        )
                      }
                    >
                      Todos
                    </FilterPill>

                    <FilterPill
                      active={
                        filter ===
                        "withWeight"
                      }
                      onClick={() =>
                        setFilter(
                          "withWeight"
                        )
                      }
                    >
                      Con peso
                    </FilterPill>

                    <FilterPill
                      active={
                        filter ===
                        "withAge"
                      }
                      onClick={() =>
                        setFilter(
                          "withAge"
                        )
                      }
                    >
                      Con edad
                    </FilterPill>
                  </InlineGroup>
                </TableToolbar>
              }
            >
              <InlineGroup justify="space-between">
                <p
                  style={
                    layoutStyles.eyebrow
                  }
                >
                  Base de
                  clientes
                </p>

                <Badge variant="default">
                  {
                    filteredClients.length
                  }{" "}
                  registros
                </Badge>
              </InlineGroup>

              {loading ? (
                <LoadingCard>
                  Cargando
                  clientes...
                </LoadingCard>
              ) : null}

              {fetchError ? (
                <FeedbackMessage variant="error">
                  {fetchError}
                </FeedbackMessage>
              ) : null}

              {!loading &&
              clients.length ===
                0 ? (
                <EmptyState>
                  Todavía no
                  existen
                  clientes
                  registrados.
                </EmptyState>
              ) : null}

              {!loading &&
              clients.length >
                0 &&
              filteredClients.length ===
                0 ? (
                <EmptySearchState />
              ) : null}

              {!loading &&
              filteredClients.length >
                0 ? (
                <DataTable
                  columns={
                    columns
                  }
                  data={
                    filteredClients
                  }
                  emptyMessage="No hay clientes disponibles"
                />
              ) : null}
            </TableCard>
          </PageSection>
        </ContentStack>
      </PageContainer>
    </TrainerShell>
  );
}

const styles = {
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