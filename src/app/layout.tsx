import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import Sidebar from "@/components/sidebar";
import { AuthProviders } from "@/providers/auth-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Singulariti Playground",
  description: "Make the process of finding and comparing information easier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={font.className}
      >
      <AuthProviders>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Sidebar>
          {children}
        </Sidebar>
          <Toaster
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  'bg-[linear-gradient(30deg,_rgba(0,0,0,1)_0%,_rgba(62,6,95,0.4)_40%,_rgba(0,0,0,0.85)_85%,_rgba(0,0,0,1)_100%)] text-white rounded-lg p-4 flex flex-row items-center space-x-2',
              },
            }}
          />
        </ThemeProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
