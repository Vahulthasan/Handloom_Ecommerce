import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ToastNotification from '@/components/ToastNotification';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vintage Collections | Handwoven Bamboo Pendant Lamp Shades | Direct Exporter to Europe',
  description:
    'Authentic Indian handwoven bamboo pendant lamp shades shipped to Europe via eco-conscious pooled sea container freight. Order online like Amazon.',
  keywords: [
    'handwoven bamboo pendant',
    'bamboo lamp shade',
    'Indian handloom lighting',
    'sustainable lighting Europe',
    'pooled sea container shipping',
    'Vintage Collections exporter',
  ],
  authors: [{ name: 'Vintage Collections Exporter' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable}`}>
      <body className="min-h-screen flex flex-col selection:bg-[#c68a24] selection:text-white">
        <ThemeProvider>
          <CartProvider>
            {/* Top Sample Store Banner */}
            <div className="bg-[#112a23] text-[#e5a439] px-4 py-1.5 text-center text-xs font-medium border-b border-[#1b4338] tracking-wide">
              <span>Sample store. Prices, names and policies are placeholders.</span>
            </div>

            {/* Amazon-Style Header */}
            <Header />

            {/* Slide-out Cart Drawer */}
            <CartDrawer />

            {/* Global Toast Notification */}
            <ToastNotification />

            {/* Main Content Viewport */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>

            {/* Global Footer */}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
