"use client";

import { useEffect, useState } from "react";
import { getToken } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setAuthorized(true);
  }, []);

  if (!authorized) {
    return null;
  }

  return children;
}