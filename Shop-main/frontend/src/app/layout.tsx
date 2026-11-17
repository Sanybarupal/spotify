import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import { ToastContainer } from '../components/Toast';
import { CartDrawer } from '../components/CartDrawer';

export const metadata: Metadata = {
  title: 'Par & Fairway — Luxury Golf Commerce India',
  description: 'Championship-grade golf equipment, tour apparel, footwear, and white-glove own delivery across India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <CartDrawer />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
