import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import RootLayoutContent from '@/components/RootLayoutComponent';
import { metadata } from './metadata';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export { metadata };

export default function RootLayout({ children } ) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <RootLayoutContent>
            {children}
          </RootLayoutContent>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

