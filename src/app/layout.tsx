import type { Metadata } from "next";
// @ts-expect-error: CSS module declaration not found
import "./globals.css";

// This object controls your SEO headers. Google reads this to list your site!
export const metadata: Metadata = {
  title: "GW3 FRONTIER | Guild Wars 3 News & Tools Hub",
  description: "The ultimate unofficial companion hub for Guild Wars 3. Track news, deep dive into lore, and build mechanics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}