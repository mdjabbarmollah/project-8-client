import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { AppToaster } from '@/components/app-toaster';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'BookNook | A Small Online Library',
  description:
    'Add a book, borrow a book, return a book. BookNook is a small online library for curious readers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
