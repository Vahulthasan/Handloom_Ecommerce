import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ToastNotification from '@/components/ToastNotification';
import MobileBottomNav from '@/components/MobileBottomNav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#173f34',
};

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
    <html lang="en" className="max-w-full overflow-x-hidden">
      <body className="min-h-screen flex flex-col selection:bg-[#c68a24] selection:text-white max-w-full overflow-x-hidden relative">
        <ThemeProvider>
          <CartProvider>
            {/* Top Sample Store Banner */}
            <div className="bg-[#112a23] text-[#e5a439] px-3 py-1 text-center text-[11px] sm:text-xs font-medium border-b border-[#1b4338] tracking-wide w-full overflow-hidden">
              <span className="truncate block">Sample store. Prices, names and policies are placeholders.</span>
            </div>

            {/* Amazon-Style Header */}
            <Header />

            {/* Slide-out Cart Drawer */}
            <CartDrawer />

            {/* Global Toast Notification */}
            <ToastNotification />

            {/* Main Content Viewport - Fluid Centered Container (width: min(100% - 2rem, 1280px); margin-inline: auto;) */}
            <main className="flex-1 w-[min(100%-2rem,1280px)] mx-auto py-4 sm:py-6 pb-20 md:pb-8 min-w-0">
              {children}
            </main>

            {/* Amazon-Style Mobile Bottom Navigation Bar */}
            <MobileBottomNav />

            {/* Global Footer */}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

