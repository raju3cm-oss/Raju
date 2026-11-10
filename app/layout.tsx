import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avora Zone",
  description: "Learn English. Build confidence."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f5f7fb", color: "#18233d" }}>
        {children}
      </body>
    </html>
  );
}
