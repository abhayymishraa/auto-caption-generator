import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Caption-Generator",
  description: "Automatic caption generator for videos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + " text-white min-h-screen bg-gradient-to-b from-bg-gradient-from to-bg-gradient-to"}>
        <main className="p-4 max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-bg-gradient-from to-bg-gradient-to">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
