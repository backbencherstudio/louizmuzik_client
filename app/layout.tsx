import type React from "react";
import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";
import { Providers } from "./providers";
import { ReduxProvider } from "./reduxProvider";

export const metadata: Metadata = {
  title: "MelodyCollab - Collaborate with Top Music Producers",
  description:
    "Browse thousands of free melodies from top producers to collaborate on your next hit!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <ReduxProvider>
          <Providers>{children}</Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
