import "./globals.css";

export const metadata = {
  title: "TrainoXa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}