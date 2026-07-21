import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const prompt = Prompt({
  variable: "--font-sans",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PC Center | ศูนย์รวมอุปกรณ์คอมพิวเตอร์",
  description: "ศูนย์รวมอุปกรณ์คอมพิวเตอร์คุณภาพสูง ราคาดีที่สุด พร้อมบริการจัดส่งทั่วประเทศ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${prompt.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster position="top-center" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
