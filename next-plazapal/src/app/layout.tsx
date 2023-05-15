import Navbar from "@/components/Navbar";
// import { Toaster } from '@/components/ui/toast'
import "@/styles/globals.css";
import { Inter } from "next/font/google";

// import MobileMenu from '@/components/MobileMenu'
import Providers from "@/components/ui/Providers";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("bg-white text-slate-900 antialiased", inter.className)}
    >
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased">
        <Providers>
          {children}

          <Toaster position="bottom-right" />

          {/* @ts-expect-error Server Component */}
          <Navbar />
        </Providers>

        <div className="h-40 md:hidden" />
      </body>
    </html>
  );
}
