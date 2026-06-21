import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "МКТУ — Международная (Ниццкая) классификация 2026",
  description:
    "Полный справочник МКТУ 13-й редакции 2026. Международная классификация товаров и услуг для регистрации товарных знаков. Все 45 классов.",
  keywords: [
    "МКТУ",
    "Ниццкая классификация",
    "товарные знаки",
    "классификация товаров",
    "классификация услуг",
    "регистрация товарных знаков",
    "Роспатент",
  ],
  authors: [{ name: "МКТУ Справочник" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "МКТУ — Международная (Ниццкая) классификация 2026",
    description:
      "Полный справочник МКТУ 13-й редакции 2026. Международная классификация товаров и услуг для регистрации товарных знаков.",
    siteName: "МКТУ",
    type: "website",
  },
};

// Inline script to set initial theme before hydration — prevents flash of wrong theme.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('mktu-theme');
    var theme = stored || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
