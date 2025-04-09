import './globals.css';

export const metadata = {
  title: 'Shopping List App',
  description: 'A simple shopping list',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
