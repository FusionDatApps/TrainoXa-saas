"use client";

import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return <p>Cargando...</p>;
}