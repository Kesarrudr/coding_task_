import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorToastContainer } from "@/components/error-toast";
import { SuccessToastContainer } from "@/components/success-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Contest Tracker",
  description: "Track coding contests across multiple platforms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ErrorToastContainer />
          <SuccessToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";

