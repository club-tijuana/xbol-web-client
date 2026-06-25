import { Box } from "@mui/material";
import type { Metadata } from "next";
import Image from "next/image";

import { whiteLabel } from "@/config/whiteLabel";
import { validateSiteAccessGateEnv } from "@/utils/routing/siteAccessGate";

export const metadata: Metadata = {
  title: `Próximamente | ${whiteLabel.brandName}`,
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default function LandingPage() {
  const { landingImageUrl } = validateSiteAccessGateEnv();

  return (
    <Box
      component="main"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        backgroundColor: "#000",
      }}
    >
      {landingImageUrl ? (
        <Image
          src={landingImageUrl}
          alt="Xolo Pass próximamente"
          fill
          priority
          unoptimized
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      ) : null}
    </Box>
  );
}
