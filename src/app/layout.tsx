import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import { AGE_GATE_COOKIE, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `${SITE_NAME} — adult products, discreetly delivered.`,
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const ageConfirmed = cookieStore.get(AGE_GATE_COOKIE)?.value === "1";

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {ageConfirmed ? (
          <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </>
        ) : (
          <AgeGate />
        )}
      </body>
    </html>
  );
}
