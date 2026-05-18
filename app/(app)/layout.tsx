import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
 
import { Toaster } from "sonner";
import Navbar from "@/components/NewsNav";
 
import ThemeProvider from "@/components/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/Footer";
import { isAdmin as checkAdmin } from "@/lib/auth/admin";
import { isUser as checkAuthor } from "./actions/getSession";
import image from "next/image";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewsHub",
  description: "Keep in touch with the latest news at the tip of your fingers"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await checkAdmin();
  const isAuthor = await checkAuthor();


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar isAdmin={isAdmin} isAuthor={isAuthor} />
            <div className="flex flex-col flex-1 w-full min-h-screen">
              <Navbar />
              <main className="flex-1 w-full relative">
                {children}
              </main>
              <Footer />
            </div>

          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}