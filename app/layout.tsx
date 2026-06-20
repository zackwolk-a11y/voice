import type { Metadata } from 'next';
import { Bebas_Neue, Space_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/utils';
import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/lib/store';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Zack's 2nd Brain",
  description: 'A deeply personal knowledge-capture and second brain system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          bebasNeue.variable,
          spaceMono.variable,
          'flex flex-col min-h-screen bg-bg-base text-text-primary'
        )}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <StoreProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                border: '1px solid var(--border-mid)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                borderRadius: '0',
                boxShadow: '3px 3px 0 var(--bg-deep)',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
