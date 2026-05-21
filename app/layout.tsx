import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API Sandbox — AI-Powered REST Client",
  description: "Test any API endpoint and get instant AI explanations of the response",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
