import { Providers } from "./_components/providers";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import "./globals.css";
//import { ThemeSwitcher } from "./_components/theme-switcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Schola `,
  description: `A modular framework for continous education built on VARA network.`,
  openGraph: {
    images: ["/assets/blog/code-previews/cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "dark:bg-slate-900 dark:text-slate-400")}
      >
        <Providers>
          <Navbar />
          {/*<ThemeSwitcher />*/}
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
