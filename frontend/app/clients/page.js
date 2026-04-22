"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { getToken, logout } from "../../lib/auth";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }

    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await apiFetch("/clients");
      setClients(res.data || []);
    } catch (err) {
      console.error("Error cargando clientes:", err.message);
      setError("No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/clients", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      setForm(initialForm);
      setSuccess("Cliente creado correctamente");
      await loadClients();
    } catch (err) {
      setError(err.message || "No se pudo crear el cliente");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Panel del trainer</p>
          <h1 style={styles.title}>Clientes</h1>
        </div>

        <button onClick={logout} style={styles.logoutButton}>
          Cerrar sesión
        </button>
      </header>

      <nav style={styles.nav}>
        <Link href="/dashboard" style={styles.navLink}>
          Dashboard
        </Link>
        <Link href="/clients" style={styles.navLinkActive}>
          Clientes
        </Link>
        <Link href="/exercises" style={styles.navLink}>
          Ejercicios
        </Link>
      </nav>

      <section style={styles.topGrid}>
        <article style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Crear cliente</h2>
          <p style={styles.sectionText}>
            Registra un nuevo cliente para este entrenador.
          </p>

          <form onSubmit={handleCreate} style={styles.form} autoComplete="off">
            <div style={styles.field}>
              <label style={styles.label} htmlFor="client-full-name">
                Nombre completo
              </label>
              <input
                id="client-full-name"
                name="fullName"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={form.fullName}
                onChange={handleChange}
                style={styles.input}
                autoComplete="off"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="client-email">
                Correo del cliente
              </label>
              <input
                id="client-email"
                name="email"
                type="email"
                placeholder="cliente@correo.com"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                autoComplete="new-email"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="client-password">
                Password inicial
              </label>
              <input
                id="client-password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" style={styles.primaryButton} disabled={creating}>
              {creating ? "Creando..." : "Crear cliente"}
            </button>

            {error ? <p style={styles.errorText}>{error}</p> : null}
            {success ? <p style={styles.successText}>{success}</p> : null}
          </form>
        </article>

        <article style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total de clientes</p>
          <h2 style={styles.summaryValue}>{clients.length}</h2>
          <p style={styles.summaryText}>
            Aquí ves y gestionas los clientes asociados al trainer autenticado.
          </p>
        </article>
      </section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Lista de clientes</h2>

        {loading ? (
          <div style={styles.infoCard}>
            <p style={styles.infoText}>Cargando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div style={styles.infoCard}>
            <p style={styles.infoText}>
              Todavía no tienes clientes registrados.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {clients.map((client) => (
              <article key={client.id} style={styles.listCard}>
                <p style={styles.cardLabel}>Cliente</p>
                <h3 style={styles.cardTitle}>{client.fullName || "Sin nombre"}</h3>

                <div style={styles.metaBlock}>
                  <p style={styles.metaText}>
                    <strong>ID:</strong> {client.id}
                  </p>
                  <p style={styles.metaText}>
                    <strong>Email:</strong> {client.email || "Sin email"}
                  </p>
                  <p style={styles.metaText}>
                    <strong>Edad:</strong> {client.age ?? "N/A"}
                  </p>
                  <p style={styles.metaText}>
                    <strong>Peso:</strong> {client.weightKg ?? "N/A"}
                  </p>
                  <p style={styles.metaText}>
                    <strong>Altura:</strong> {client.heightCm ?? "N/A"}
                  </p>
                  <p style={styles.metaText}>
                    <strong>Objetivo:</strong> {client.goal || "N/A"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)",
    color: "#f8fafc",
    padding: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    fontSize: "13px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: "6px 0 0 0",
    fontSize: "40px",
    fontWeight: "800",
  },
  logoutButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: "700",
  },
  nav: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  navLink: {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(15, 23, 42, 0.75)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
  },
  navLinkActive: {
    textDecoration: "none",
    color: "#052e16",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#22c55e",
    fontWeight: "800",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 1.3fr) minmax(240px, 0.7fr)",
    gap: "16px",
    marginBottom: "28px",
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
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  summaryLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  summaryValue: {
    margin: "10px 0",
    fontSize: "42px",
    fontWeight: "800",
  },
  summaryText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: "1.6",
  },
  sectionTitle: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "800",
  },
  sectionText: {
    margin: "0 0 18px 0",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#cbd5e1",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
  },
  primaryButton: {
    marginTop: "6px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#22c55e",
    color: "#052e16",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },
  errorText: {
    margin: 0,
    color: "#f87171",
    fontSize: "14px",
  },
  successText: {
    margin: 0,
    color: "#4ade80",
    fontSize: "14px",
  },
  listSection: {
    marginTop: "8px",
  },
  infoCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
  },
  infoText: {
    margin: 0,
    color: "#cbd5e1",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  listCard: {
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.22)",
  },
  cardLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  cardTitle: {
    margin: "8px 0 18px 0",
    fontSize: "24px",
    fontWeight: "800",
  },
  metaBlock: {
    display: "grid",
    gap: "8px",
  },
  metaText: {
    margin: 0,
    color: "#cbd5e1",
    wordBreak: "break-word",
  },
};