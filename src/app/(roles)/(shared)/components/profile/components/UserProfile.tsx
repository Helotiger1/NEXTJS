"use client";

import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  telefono: string;
  cedula: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        console.warn("No se pudo parsear el usuario almacenado");
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <p style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
        Cargando usuario...
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "50%",
            width: "128px",
            height: "128px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <svg
            style={{ width: "80px", height: "80px", color: "#000" }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
          {user.name}
        </h1>
        <p style={{ fontSize: "20px", color: "#A0A0A0", marginBottom: "40px" }}>
          {user.email}
        </p>

        <div style={{ textAlign: "center", marginBottom: "40px", width: "100%" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>
            Información
          </h2>
          <div
            style={{
              fontSize: "18px",
              lineHeight: 1.5,
              maxWidth: "448px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#C0C0C0" }}>Teléfono:</span>
              <span style={{ color: "#D0D0D0" }}>{user.telefono}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#C0C0C0" }}>Email:</span>
              <span style={{ color: "#D0D0D0" }}>{user.email}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#C0C0C0" }}>Cedula:</span>
              <span style={{ color: "#D0D0D0" }}>{user.cedula}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
