import { ToastProvider } from "../components/ui/ToastProvider";
import "./globals.css";

export const metadata = {
  title: "TrainoXa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
