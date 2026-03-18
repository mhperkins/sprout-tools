export const metadata = {
  title: 'Sprout Society Grant Manager',
  description: 'AI-powered grant finding, tracking, and application management for Sprout Society',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
