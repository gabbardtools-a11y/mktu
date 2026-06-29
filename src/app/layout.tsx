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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "МКТУ — Международная (Ниццкая) классификация 2026",
    description:
      "Полный справочник МКТУ 13-й редакции 2026. Международная классификация товаров и услуг для регистрации товарных знаков.",
    siteName: "МКТУ",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "МКТУ.рус — Международная (Ниццкая) классификация 2026" }],
  },
  alternates: {
    canonical: "/",
  },
};

// Inline script to set initial theme before hydration — prevents flash of wrong theme.
// Default theme is 'navy' (set in use-theme.ts as DEFAULT_THEME).
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('mktu-theme');
    var theme = (stored === 'light' || stored === 'dark' || stored === 'navy') ? stored : 'navy';
    var root = document.documentElement;
    root.classList.remove('dark', 'navy');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'navy') {
      root.classList.add('navy');
    }
    root.style.colorScheme = (theme === 'light') ? 'light' : 'dark';
    // Restore font size
    var fs = localStorage.getItem('mktu-fontsize');
    if (fs) {
      root.style.fontSize = fs + 'px';
    }
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
    <html lang="ru" className="navy" suppressHydrationWarning>
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
