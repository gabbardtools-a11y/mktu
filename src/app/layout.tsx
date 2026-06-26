import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FavoritesCartProvider } from "@/components/mktu/favorites-cart-context";
import { AppShell } from "@/components/mktu/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mktu.ru",
  ),
  title: {
    default: "МКТУ — Международная (Ниццкая) классификация 2026",
    template: "%s · МКТУ 2026",
  },
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
    "МКТУ 13 редакция",
    "МКТУ 2026",
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
    locale: "ru_RU",
  },
  alternates: {
    canonical: "/",
  },
};

// Inline script to set initial theme before hydration — prevents flash of wrong theme.
// Default theme is 'light' (set in use-theme.ts as DEFAULT_THEME).
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('mktu-theme');
    var theme = (stored === 'light' || stored === 'dark' || stored === 'grayscale') ? stored : 'light';
    var root = document.documentElement;
    root.classList.remove('dark', 'grayscale');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'grayscale') {
      root.classList.add('grayscale');
    }
    root.style.colorScheme = (theme === 'light') ? 'light' : 'dark';
  } catch (e) {
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
        <FavoritesCartProvider>
          <AppShell>{children}</AppShell>
        </FavoritesCartProvider>
        <Toaster />
      </body>
    </html>
  );
}
