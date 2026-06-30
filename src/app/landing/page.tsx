import { Box } from "@mui/material";
import type { Metadata } from "next";

import { whiteLabel } from "@/config/whiteLabel";
import { validateSiteAccessGateEnv } from "@/utils/routing/siteAccessGate";

export const metadata: Metadata = {
  title: `Próximamente | ${whiteLabel.brandName}`,
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default function LandingPage() {
  const { landingImageUrl, landingMobileImageUrl } = validateSiteAccessGateEnv();

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
        <picture>
          {landingMobileImageUrl ? (
            <source
              media="(max-width: 767px)"
              srcSet={landingMobileImageUrl}
            />
          ) : null}
          <img
            src={landingImageUrl}
            alt="Xolo Pass próximamente"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </picture>
      ) : null}
    </Box>
  );
}
