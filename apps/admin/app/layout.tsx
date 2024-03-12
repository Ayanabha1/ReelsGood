import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

export const metadata: Metadata = {
  title: "ReelsGood Admin",
  description: "Admin panel for ReelsGood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            poppins.className,
            "h-[100vh] w-[100vw] overflow-hidden pb-20"
          )}
        >
          {children}
          <ToastContainer
            limit={5}
            position="bottom-center"
            stacked
            className="text-center"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
