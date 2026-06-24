import type { Metadata } from "next";
import "../styles/globals.scss";
import "@/styles/_variables.scss";
import { Open_Sans } from "next/font/google";

import Footer from "@/components/Footer/Footer";
import GeneralMessage from "@/components/GeneralMessage/GeneralMessage";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import { LayoutContainer } from "@/components/LayoutContainer/LayoutContainer";
import LoginModal from "@/components/LoginModal/LoginModal";
import PickersProvider from "@/providers/PickersProvider";
import Providers from "@/store/Providers";
import MuiProvider from "@/theme/MuiProvider";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
          backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH}/assets/background/pattern.png)`,
          backgroundSize: 1800,
        }}
      >
        <MuiProvider>
          <Providers>
            <PickersProvider>
              <HeaderWrapper />

              <LayoutContainer>{children}</LayoutContainer>
              <GeneralMessage />

              <Footer />
              <LoginModal />
            </PickersProvider>
          </Providers>
        </MuiProvider>
      </body>
    </html>
  );
}
