import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";
// import { Jost } from "next/font/google";

// import Header from "@/components/Header/Header";

// import Footer from "@/components/footer/Footer";
// import Promotion from "@/components/promotion/promotion";
// import ReactQueryProvider from "@/utils/reactQueryProvider";
import SplashScreen from "./SplashScreen";

import NextAuthProvider from "@/utils/nextProvider";
// import PromotionOne from "@/components/promotion/promotionOne";

// const jost = Jost({
//   subsets: ["latin"],
//   display: "swap",
// });

export const metadata = {
  title: "MMM",
  description: "A tool for multi solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {/* <ReactQueryProvider>
            <SplashScreen />
            <Header />
            <Promotion /> */}
          {/* <PromotionOne /> */}
          <main className="mx-auto">{children}</main>
          {/* <Toaster />
            <Footer />
          </ReactQueryProvider> */}
        </NextAuthProvider>
      </body>
    </html>
  );
}
