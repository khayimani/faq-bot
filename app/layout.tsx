import "../globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Tap2Connect AI",
  description: "AI assistant",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
