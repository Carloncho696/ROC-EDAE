import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Registro de Observación Conductual — EDAE",
  description: "Sistema de Seguridad Basada en el Comportamiento — EDAE / Veolia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-100`}>{children}</body>
    </html>
  );
}
