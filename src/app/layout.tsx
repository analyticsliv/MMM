import { UserProvider } from "./context/UserContext";
import "./globals.css";
import SplashScreen from "./SplashScreen";

import NextAuthProvider from "@/utils/nextProvider";

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
            <SplashScreen />
            <UserProvider>
               <main className="mx-auto">{children}</main>
            </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

