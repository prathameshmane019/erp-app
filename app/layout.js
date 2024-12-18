import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import RootLayoutContent from '@/components/RootLayoutComponent';
import { metadata } from './metadata';
import { UpdateHandler } from '@/components/UpdateHandler';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export { metadata };
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: 'no',
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7c3aed' },
    { media: '(prefers-color-scheme: dark)', color: '#7c3aed' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
      <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" 
        />
         <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased font-sans">
      <UpdateHandler />
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

