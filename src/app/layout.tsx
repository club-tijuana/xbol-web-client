import type { Metadata } from "next";
import "../styles/globals.scss";
import "@/styles/_variables.scss";
import { Open_Sans } from "next/font/google";

import Footer from "@/components/Footer/Footer";
import GeneralMessage from "@/components/GeneralMessage/GeneralMessage";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";
import LoginModalHost from "@/components/LoginModal/LoginModalHost";
import Providers from "@/store/Providers";
import MuiProvider from "@/theme/MuiProvider";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={openSans.className}
      style={{ overflowX: "hidden" }}
    >
      <body
        style={{
          backgroundImage: `image-set(url("${basePath}/assets/background/pattern.webp") type("image/webp"), url("${basePath}/assets/background/pattern.png") type("image/png"))`,
          backgroundSize: 1800,
        }}
      >
        <MuiProvider>
          <Providers>
            <HeaderWrapper />

            <LayoutContainer>{children}</LayoutContainer>
            <GeneralMessage />

            <Footer />
            <LoginModalHost />
          </Providers>
        </MuiProvider>
      </body>
    </html>
  );
}
