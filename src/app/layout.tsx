import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from 'next/headers';
import "./globals.css";
import { AuthProvider } from '@/features/auth/context/AuthContext';
import CookieConsentBanner from "@/components/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BarberSaaS - Crie o site da sua barbearia",
  description: "Plataforma para criação de sites de barbearia em segundos.",
};

import { Toaster } from "@/components/ui/Toaster";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'system';

  return (
    <html lang="pt-BR" className={theme === 'dark' ? 'dark' : ''}>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <CookieConsentBanner />
        <Toaster />
      </body>
    </html>
  );
}
