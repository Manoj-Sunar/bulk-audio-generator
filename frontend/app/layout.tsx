import type { Metadata } from "next";
import { Poppins} from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Layout/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bulk Audio Generator",
  description: "Bulk Audio Generator",
  icons: {
    icon: "/wave.svg",
    shortcut: "/wave.svg",
    apple: "/wave.svg", // Optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${poppins.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}