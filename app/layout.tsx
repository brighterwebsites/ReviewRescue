import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewRescue - Manage Your Online Reputation",
  description: "Prevent negative reviews by redirecting unhappy customers to a private feedback form while sending satisfied customers to your review platforms.",
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
