import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Topbar, Bottombar, Leftsidebar, Rightsidebar } from "@/components/shared";

export const metadata: Metadata = {
  title: 'Neoconnect',
  description: 'neoconnect is a web forum powered by nextjs'
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${inter.className}`}>
          <Topbar />

          <main className="flex">
            <Leftsidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>

            <Rightsidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
