import type { Metadata } from "next";
import Providers from "@/store/Providers";
import "../styles/globals.scss";
import LoginModal from "@/components/LoginModal/LoginModal";
import Header from "@/components/Header/Header";
import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import MuiProvider from "@/theme/MuiProvider";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
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
    <html lang="en" className={inter.className} style={{ overflowX: "hidden" }}>
      <body>
        <MuiProvider>
          <Providers>
              <Header />
            
              <Box
                component="main"
                sx={{
                  maxWidth: "1800px",
                  mx: "auto",
                  px: { xs: 2, md: 4 },
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
