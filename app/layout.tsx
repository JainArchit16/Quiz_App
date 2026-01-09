import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QuizProvider } from "@/context/QuizContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "Quiz-Master",
  description: "One stop solution for quizes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <QuizProvider>
            <Toaster />
            <Sonner />

            {children}
          </QuizProvider>
        </Providers>
      </body>
    </html>
  );
}
