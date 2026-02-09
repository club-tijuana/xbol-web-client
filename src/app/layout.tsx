import { Box } from "@mui/material";
import type { Metadata } from "next";
import "../styles/globals.scss";
import "@/styles/_variables.scss";
import { Open_Sans } from "next/font/google";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import LoginModal from "@/components/LoginModal/LoginModal";
import Providers from "@/store/Providers";
import MuiProvider from "@/theme/MuiProvider";
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
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
    <html lang="en" className={openSans.className} style={{ overflowX: "hidden" }}>
      <body>
        <MuiProvider>
          <Providers>
            <Header />

            <Box
              component="main"
              sx={{
                maxWidth: "1500px",
                mx: "auto",
                px: { xs: 2, md: 4, lg: 4, xl: 12 },
              }}
            >
              {children}
            </Box>

            <Footer />
            <LoginModal />
          </Providers>
        </MuiProvider>
      </body>
    </html>
  );
}
