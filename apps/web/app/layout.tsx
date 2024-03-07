import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingWrapper from "@/components/Loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReelsGood",
  description: "ReelsGood: Where Every Movie Moment Feels Good!",
};

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClerkProvider>
        <html lang="en">
          <body
            className={cn(
              inter.className,
              "dark bg-main_bg_col",
              poppins.className
            )}
          >
            {children}
            <ToastContainer limit={5} position="bottom-center" stacked />
            <LoadingWrapper />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
